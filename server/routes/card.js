const express = require("express");
const router = express.Router();

const { computeCardStats } = require("../services/cardStats");

router.post("/", (req, res) => {
    try {
        const { profileData } = req.body;

        if (!profileData) {
            return res.status(400).json({
                error: "Profile data is required",
            });
        }

        const card = computeCardStats(profileData);

        return res.json(card);
    } catch (err) {
        console.error("Card Route Error:", err.message);

        return res.status(500).json({
            error: "Failed to generate player card",
        });
    }
});

module.exports = router;