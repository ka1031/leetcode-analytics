// ------------------------------
// Curve helper
// ------------------------------
// Maps a raw value to a 40-99 scale with diminishing returns,
// same idea as gitfut: most people land 40-88, only genuine
// outliers push past that.
function curve(value, k, { min = 40, max = 88 } = {}) {
    if (!value || value <= 0) return min;

    const raw = 99 * (1 - Math.exp(-value / k));

    return Math.round(
        Math.min(max, Math.max(min, raw))
    );
}

// ------------------------------
// Helpers to pull raw numbers
// out of the same shape Dashboard
// already renders
// ------------------------------
function getDifficultyCount(profileData, difficulty) {
    const stats =
        profileData?.profile?.submitStatsGlobal
            ?.acSubmissionNum || [];

    return (
        stats.find((s) => s.difficulty === difficulty)
            ?.count || 0
    );
}

function getActiveDaysLastNDays(profileData, days = 90) {
    const raw =
        profileData?.profile?.submissionCalendar || "{}";

    let calendar;
    try {
        calendar = JSON.parse(raw);
    } catch {
        calendar = {};
    }

    const cutoff =
        Math.floor(Date.now() / 1000) - days * 86400;

    return Object.entries(calendar).filter(
        ([ts, count]) =>
            Number(ts) >= cutoff && count > 0
    ).length;
}

function getDistinctTagCount(profileData) {
    const tags = profileData?.profile?.tagProblemCounts || {};

    const all = [
        ...(tags.fundamental || []),
        ...(tags.intermediate || []),
        ...(tags.advanced || []),
    ];

    return all.filter((t) => t.problemsSolved > 0).length;
}

function getTotalTagCount(profileData) {
    const tags = profileData?.profile?.tagProblemCounts || {};

    return (
        (tags.fundamental?.length || 0) +
        (tags.intermediate?.length || 0) +
        (tags.advanced?.length || 0)
    );
}

// ------------------------------
// Archetype labels
// ------------------------------
const ARCHETYPES = {
    PAC: "the sprinter",
    SHO: "the finisher",
    PAS: "the tactician",
    DRI: "the playmaker",
    DEF: "the wall",
    PHY: "the workhorse",
};

function pickArchetype(stats) {
    const topStat = Object.entries(stats).sort(
        (a, b) => b[1] - a[1]
    )[0][0];

    return ARCHETYPES[topStat] || "the grinder";
}

// ------------------------------
// Main entry point
// ------------------------------
function computeCardStats(profileData) {
    const totalSolved = getDifficultyCount(
        profileData,
        "All"
    );
    const hardSolved = getDifficultyCount(
        profileData,
        "Hard"
    );
    const mediumSolved = getDifficultyCount(
        profileData,
        "Medium"
    );

    const rating =
        profileData?.contestRanking?.rating || 0;

    const activeDays = getActiveDaysLastNDays(
        profileData,
        90
    );

    const distinctTags = getDistinctTagCount(profileData);
    const totalTags = getTotalTagCount(profileData) || 1;

    const stats = {
        PAC: curve(activeDays, 35),
        SHO: curve(hardSolved, 80),
        PAS: rating
            ? Math.round(
                Math.min(
                    88,
                    Math.max(40, 40 + (rating - 1200) / 15)
                )
            )
            : 40,
        DRI: Math.round(
            Math.min(
                88,
                Math.max(
                    40,
                    40 + (distinctTags / totalTags) * 59
                )
            )
        ),
        DEF: curve(mediumSolved, 250),
        PHY: curve(totalSolved, 400),
    };

    // ------------------------------
    // Overall rating
    // ------------------------------
    const weights = {
        PAC: 0.15,
        SHO: 0.2,
        PAS: 0.2,
        DRI: 0.15,
        DEF: 0.15,
        PHY: 0.15,
    };

    let overall = Object.entries(stats).reduce(
        (sum, [key, value]) => sum + value * weights[key],
        0
    );

    // Legacy gate: raw curves cap at 88, only genuine
    // top-tier profiles get pushed into the 90s.
    const isLegacy =
        rating >= 2000 &&
        totalSolved >= 500 &&
        hardSolved >= 100;

    overall = isLegacy
        ? Math.round(Math.min(99, overall * 1.12))
        : Math.round(Math.min(88, overall));

    return {
        username: profileData?.profile?.username,
        avatar: profileData?.profile?.profile?.userAvatar,
        overall,
        archetype: pickArchetype(stats),
        stats,
        headline: {
            totalSolved,
            rating: rating || null,
            activeDaysLast90: activeDays,
            globalRanking:
                profileData?.contestRanking
                    ?.globalRanking || null,
        },
    };
}

module.exports = {
    computeCardStats,
};