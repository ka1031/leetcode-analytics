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
    maxRetries = 2,
    baseDelay = 300
) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await axios.post(url, body, {
                timeout: 25000, // generous enough to not cut off real responses
                ...config,
            });
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
// Submission Calendar Analysis
// ------------------------------
// submissionCalendar is a JSON string mapping unix-day-timestamp -> submission count,
// covering the user's ENTIRE LeetCode history (not just recent activity).
function analyzeSubmissionCalendar(submissionCalendarRaw) {
    let calendar = {};

    try {
        calendar = JSON.parse(submissionCalendarRaw || "{}");
    } catch {
        calendar = {};
    }

    const entries = Object.entries(calendar)
        .map(([ts, count]) => [Number(ts), Number(count)])
        .sort((a, b) => a[0] - b[0]);

    if (entries.length === 0) {
        return {
            totalActiveDays: 0,
            totalSubmissionsAllTime: 0,
            avgSubmissionsPerActiveDay: 0,
            mostActiveDay: null,
            mostActiveDayCount: 0,
            currentStreakDays: 0,
            longestStreakDays: 0,
            firstActiveDate: null,
            lastActiveDate: null,
        };
    }

    const totalSubmissionsAllTime = entries.reduce(
        (sum, [, count]) => sum + count,
        0
    );

    const totalActiveDays = entries.length;

    let mostActiveDay = entries[0];
    for (const entry of entries) {
        if (entry[1] > mostActiveDay[1]) mostActiveDay = entry;
    }

    // Streak calculation (consecutive calendar days with >0 submissions)
    const DAY_SECONDS = 86400;
    let longestStreak = 1;
    let currentRunStart = entries[0][0];
    let prevTs = entries[0][0];

    for (let i = 1; i < entries.length; i++) {
        const ts = entries[i][0];
        if (ts - prevTs === DAY_SECONDS) {
            // still consecutive
        } else {
            const runLength =
                Math.round((prevTs - currentRunStart) / DAY_SECONDS) + 1;
            longestStreak = Math.max(longestStreak, runLength);
            currentRunStart = ts;
        }
        prevTs = ts;
    }
    const lastRunLength =
        Math.round((prevTs - currentRunStart) / DAY_SECONDS) + 1;
    longestStreak = Math.max(longestStreak, lastRunLength);

    // Current streak: consecutive active days ending at the most recent entry,
    // only meaningful if the last active day is today or yesterday.
    const today = Math.floor(Date.now() / 1000 / DAY_SECONDS) * DAY_SECONDS;
    const lastActiveTs = entries[entries.length - 1][0];
    let currentStreakDays = 0;

    if (today - lastActiveTs <= DAY_SECONDS) {
        currentStreakDays = 1;
        let cursor = lastActiveTs;
        for (let i = entries.length - 2; i >= 0; i--) {
            if (cursor - entries[i][0] === DAY_SECONDS) {
                currentStreakDays++;
                cursor = entries[i][0];
            } else {
                break;
            }
        }
    }

    return {
        totalActiveDays,
        totalSubmissionsAllTime,
        avgSubmissionsPerActiveDay: Number(
            (totalSubmissionsAllTime / totalActiveDays).toFixed(2)
        ),
        mostActiveDay: new Date(mostActiveDay[0] * 1000)
            .toISOString()
            .slice(0, 10),
        mostActiveDayCount: mostActiveDay[1],
        currentStreakDays,
        longestStreakDays: longestStreak,
        firstActiveDate: new Date(entries[0][0] * 1000)
            .toISOString()
            .slice(0, 10),
        lastActiveDate: new Date(lastActiveTs * 1000)
            .toISOString()
            .slice(0, 10),
    };
}

// ------------------------------
// Route
// ------------------------------
router.post("/", async (req, res) => {
    const startedAt = Date.now();

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

        const calendarStats = analyzeSubmissionCalendar(
            profileData?.profile?.submissionCalendar
        );

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

            // Derived from submissionCalendar, which covers the user's
            // ENTIRE LeetCode history (not just recent submissions).
            submissionHistorySummary: calendarStats,
        };

        // ------------------------------
        // Cache Check
        // ------------------------------

        const cacheKey =
            compactData.username ||
            JSON.stringify(compactData);

        const cached = cache.get(cacheKey);

        if (cached) {
            console.log(
                `[insights] cache hit for ${cacheKey} in ${Date.now() - startedAt}ms`
            );
            return res.json(cached.data);
        }

        // ------------------------------
        // Prompt
        // ------------------------------

        const prompt = `
You are an expert DSA mentor and competitive programming coach.

Analyze this LeetCode profile deeply.

You are given "submissionHistorySummary", which is derived from the user's
COMPLETE submission calendar (their entire LeetCode activity history). Use it to reason about consistency, discipline, and
long-term trends — e.g. active days vs total days since firstActiveDate,
currentStreakDays vs longestStreakDays, and how avgSubmissionsPerActiveDay
compares to mostActiveDayCount.

Rules:
- Be analytical
- Avoid generic advice
- Infer patterns
- Mention strengths and weak areas
- Explicitly reason about the full submission history data, not just recent activity
- Give practical recommendations
- Focus on:
  - consistency (using the full history, not just the last 15 submissions)
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

        console.log(
            `[insights] generated for ${cacheKey} in ${Date.now() - startedAt}ms`
        );

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