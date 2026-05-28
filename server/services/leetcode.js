const axios = require("axios");

const LEETCODE_API = "https://leetcode.com/graphql";

async function fetchUserProfile(username) {
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
      }
    );

    const data = response.data.data;

    return {
      profile: data.matchedUser,
      recentSubmissions: data.recentSubmissionList,
      contestRanking: data.userContestRanking,
      contestHistory: data.userContestRankingHistory,
    };
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