const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /v1/journey/streak/:userId
router.get('/v1/journey/streak/:userId', (req, res) => {
    const { userId } = req.params;

    try {
        const stmt = db.prepare('SELECT streak FROM journey_streak WHERE user_id = ?');
        const row = stmt.get(userId);

        if (row) {
            return res.status(200).json({ streak: row.streak });
        } else {
            // Return dummy data (e.g., 5) if no record exists yet
            // This satisfies the "dummy backend" requirement
            return res.status(200).json({ streak: 5 });
        }
    } catch (error) {
        console.error('Error fetching journey streak:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
