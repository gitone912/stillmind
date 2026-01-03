const express = require('express');
const db = require('../database');

const router = express.Router();

// POST /v1/surveys - Submit survey responses
router.post('/v1/surveys', (req, res) => {
    try {
        const { userId, question1, question2, question3, question4, question5 } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const insertStmt = db.prepare(`
      INSERT INTO surveys (user_id, question1, question2, question3, question4, question5)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

        insertStmt.run(userId, question1, question2, question3, question4, question5);

        res.status(200).json({ message: 'Survey submitted successfully' });
    } catch (error) {
        console.error('Survey submission error:', error);
        res.status(500).json({ message: 'Failed to submit survey' });
    }
});

module.exports = router;
