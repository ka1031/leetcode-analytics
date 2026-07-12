const axios = require("axios");

const LEETCODE_API = "https://leetcode.com/graphql";

// ------------------------------
// Profile Cache
// ------------------------------
// LeetCode profile data doesn't change second-to-second, so caching
// avoids re-hitting the upstream GraphQL API (and its latency) on
// every repeat search for the same username.
const profileCache = new Map();
const PROFILE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchUserProfile(username) {
  const cacheKey = username.toLowerCase();
  const cached = profileCache.get(cacheKey);

  if (cached && Date.now() - cached.cachedAt < PROFILE_CACHE_TTL) {
    return cached.data;
  }

  const query = `
    query getFullUserData($username: String!) {

      matchedUser(username: $username) {
        username

        profile {
          realName
          userAvatar
          ranking
          reputation
          starRating
          aboutMe
          countryName
          company
          school
          skillTags
        }

        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }

        languageProblemCount {
          languageName
          problemsSolved
        }

        tagProblemCounts {
          advanced {
            tagName
            problemsSolved
          }

          intermediate {
            tagName
            problemsSolved
          }

          fundamental {
            tagName
            problemsSolved
          }
        }

        submissionCalendar
      }

      recentSubmissionList(username: $username, limit: 20) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
      }

      userContestRanking(username: $username) {
        rating
        globalRanking
        attendedContestsCount
        topPercentage

        badge {
          name
        }
      }

      userContestRankingHistory(username: $username) {
        attended
        trendDirection
        problemsSolved
        totalProblems
        rating
        ranking

        contest {
          title
          startTime
        }
      }
    }
  `;

  const variables = { username };

  try {
    const response = await axios.post(
      LEETCODE_API,
      {
        query,
        variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
          Referer: "https://leetcode.com",
        },
        timeout: 8000, // fail fast instead of hanging
      }
    );

    const data = response.data.data;

    const result = {
      profile: data.matchedUser,
      recentSubmissions: data.recentSubmissionList,
      contestRanking: data.userContestRanking,
      contestHistory: data.userContestRankingHistory,
    };

    profileCache.set(cacheKey, {
      data: result,
      cachedAt: Date.now(),
    });

    return result;
  } catch (error) {
    console.error(
      "LeetCode API Error:",
      error.response?.data || error.message
    );

    throw error;
  }
}

module.exports = {
  fetchUserProfile,
};