const express = require("express");
const router = express.Router();

const { fetchUserProfile } = require("../services/leetcode");

router.get("/:username", async (req, res) => {
    try {
        const data = await fetchUserProfile(req.params.username);

        res.json({
            success: true,
            data,
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