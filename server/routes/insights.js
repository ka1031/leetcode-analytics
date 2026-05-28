const express = require("express");
const axios = require("axios");

const router = express.Router();

const GEMINI_API = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

// ------------------------------
// Retry Helper
// ------------------------------
async function postWithRetry(
    url,
    body,
    config = {},
    maxRetries = 3,
    baseDelay = 500
) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await axios.post(url, body, config);
        } catch (error) {
            const status = error.response?.status;

            const retryable =
                status === 429 ||
                (status >= 500 && status < 600);

            if (!retryable || attempt === maxRetries) {
                throw error;
            }

            const delay =
                baseDelay * Math.pow(2, attempt) +
                Math.floor(Math.random() * 100);

            await new Promise((resolve) =>
                setTimeout(resolve, delay)
            );
        }
    }
}

// ------------------------------
// Simple Memory Cache
// ------------------------------
const cache = new Map();

const CACHE_TTL = 10 * 60 * 1000;

// ------------------------------
// Route
// ------------------------------
router.post("/", async (req, res) => {
    try {
        const { profileData } = req.body;

        if (!profileData) {
            return res.status(400).json({
                error: "Profile data is required",
            });
        }

        // ------------------------------
        // Extract Useful Data
        // ------------------------------

        const solvedStats =
            profileData?.profile?.submitStatsGlobal
                ?.acSubmissionNum || [];

        const getSolvedCount = (difficulty) => {
            return (
                solvedStats.find(
                    (item) =>
                        item.difficulty === difficulty
                )?.count || 0
            );
        };

        const compactData = {
            username:
                profileData?.profile?.username,

            realName:
                profileData?.profile?.profile
                    ?.realName,

            ranking:
                profileData?.profile?.profile
                    ?.ranking,

            reputation:
                profileData?.profile?.profile
                    ?.reputation,

            country:
                profileData?.profile?.profile
                    ?.countryName,

            school:
                profileData?.profile?.profile
                    ?.school,

            contestRating:
                profileData?.contestRanking
                    ?.rating,

            globalContestRank:
                profileData?.contestRanking
                    ?.globalRanking,

            contestsAttended:
                profileData?.contestRanking
                    ?.attendedContestsCount,

            easySolved:
                getSolvedCount("Easy"),

            mediumSolved:
                getSolvedCount("Medium"),

            hardSolved:
                getSolvedCount("Hard"),

            totalSolved:
                getSolvedCount("All"),

            tagProblemCounts:
                profileData?.profile
                    ?.tagProblemCounts,

            recentSubmissions:
                profileData?.recentSubmissions?.slice(
                    0,
                    15
                ),

            contestHistory:
                profileData?.contestHistory?.slice(
                    0,
                    10
                ),
        };

        // ------------------------------
        // Cache Check
        // ------------------------------

        const cacheKey =
            compactData.username ||
            JSON.stringify(compactData);

        const cached = cache.get(cacheKey);

        if (cached) {
            return res.json(cached.data);
        }

        // ------------------------------
        // Prompt
        // ------------------------------

        const prompt = `
You are an expert DSA mentor and competitive programming coach.

Analyze this LeetCode profile deeply.

Rules:
- Be analytical
- Avoid generic advice
- Infer patterns
- Mention strengths and weak areas
- Give practical recommendations
- Focus on:
  - consistency
  - contest performance
  - topic coverage
  - growth trajectory
  - discipline
  - likely weak patterns

Return ONLY valid JSON.

Format:

{
  "strengths": [],
  "weaknesses": [],
  "recommendations": []
}

Profile Data:
${JSON.stringify(compactData)}
`;

        // ------------------------------
        // API Call
        // ------------------------------

        const response = await postWithRetry(
            GEMINI_API,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
            },
            {
                headers: {
                    "Content-Type":
                        "application/json",
                },
            }
        );

        const raw =
            response.data?.candidates?.[0]
                ?.content?.parts?.[0]?.text;

        if (!raw) {
            return res.status(500).json({
                error: "Empty Gemini response",
            });
        }

        // ------------------------------
        // Parse JSON
        // ------------------------------

        const clean = raw
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let insights;

        try {
            insights = JSON.parse(clean);
        } catch (parseError) {
            console.error(
                "JSON Parse Error:",
                parseError.message
            );

            return res.status(500).json({
                error:
                    "Failed to parse Gemini response",
            });
        }

        // ------------------------------
        // Save Cache
        // ------------------------------

        cache.set(cacheKey, {
            data: insights,
            createdAt: Date.now(),
        });

        setTimeout(() => {
            cache.delete(cacheKey);
        }, CACHE_TTL);

        // ------------------------------
        // Final Response
        // ------------------------------

        return res.json(insights);
    } catch (error) {
        console.error(
            "Insights Route Error:",
            error.response?.data || error.message
        );

        return res.status(
            error.response?.status || 500
        ).json({
            error: "Failed to generate insights",
        });
    }
});

module.exports = router;