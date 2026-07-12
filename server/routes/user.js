const express = require("express");
const router = express.Router();

const { fetchUserProfile } = require("../services/leetcode");

router.get("/:username", async (req, res) => {
    const startedAt = Date.now();

    try {
        const data = await fetchUserProfile(req.params.username);

        const durationMs = Date.now() - startedAt;
        console.log(`[user] ${req.params.username} fetched in ${durationMs}ms`);

        res.json({
            success: true,
            data,
            meta: { durationMs },
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
        });
    }
});

module.exports = router;