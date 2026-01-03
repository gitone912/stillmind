const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /v1/mood/:userId - Get mood data for a user
router.get('/v1/mood/:userId', (req, res) => {
    try {
        const { userId } = req.params;

        const moodData = db.prepare(`
            SELECT day, value
            FROM mood_data
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 7
        `).all(userId);

        // If no mood data exists, return dummy data
        if (moodData.length === 0) {
            const today = new Date();
            const dummyMood = [];

            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                // Generate varied mood values
                const value = 50 + Math.floor(Math.random() * 40); // 50-90 range

                dummyMood.push({
                    day: dayName,
                    value: value
                });
            }

            return res.json({
                mood: {
                    mood: dummyMood
                }
            });
        }

        res.json({
            mood: {
                mood: moodData
            }
        });
    } catch (error) {
        console.error('Error fetching mood data:', error);
        res.status(500).json({ message: 'Failed to fetch mood data' });
    }
});

// POST /v1/mood/save - Save mood data
router.post('/v1/mood/save', (req, res) => {
    try {
        const { userId, day, value } = req.body;

        if (!userId || !day || value === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        db.prepare(`
            INSERT INTO mood_data (user_id, day, value)
            VALUES (?, ?, ?)
        `).run(userId, day, value);

        res.status(201).json({
            message: 'Mood data saved successfully',
            mood: { day, value }
        });
    } catch (error) {
        console.error('Error saving mood data:', error);
        res.status(500).json({ message: 'Failed to save mood data' });
    }
});

// GET /v1/frequent-words/:userId - Get frequent words from journal entries
router.get('/v1/frequent-words/:userId', (req, res) => {
    try {
        const { userId } = req.params;

        const result = db.prepare(`
            SELECT frequent_words, created_at, updated_at
            FROM frequent_words
            WHERE user_id = ?
        `).get(userId);

        // If no frequent words exist, return dummy data
        if (!result) {
            const dummyWords = [
                ["grateful", "15"],
                ["peace", "12"],
                ["mindful", "10"],
                ["calm", "8"],
                ["happy", "7"],
                ["reflect", "6"],
                ["growth", "5"],
                ["journey", "4"]
            ];

            return res.json({
                frequent_words: dummyWords,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                user_id: userId
            });
        }

        res.json({
            frequent_words: JSON.parse(result.frequent_words),
            created_at: result.created_at,
            updated_at: result.updated_at,
            user_id: userId
        });
    } catch (error) {
        console.error('Error fetching frequent words:', error);
        res.status(500).json({ message: 'Failed to fetch frequent words' });
    }
});

// POST /v1/frequent-words/update - Update frequent words
router.post('/v1/frequent-words/update', (req, res) => {
    try {
        const { userId, frequentWords } = req.body;

        if (!userId || !frequentWords) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const wordsJson = JSON.stringify(frequentWords);
        const updatedAt = new Date().toISOString();

        // Check if entry exists
        const existing = db.prepare(`
            SELECT id FROM frequent_words WHERE user_id = ?
        `).get(userId);

        if (existing) {
            // Update existing
            db.prepare(`
                UPDATE frequent_words
                SET frequent_words = ?, updated_at = ?
                WHERE user_id = ?
            `).run(wordsJson, updatedAt, userId);
        } else {
            // Insert new
            db.prepare(`
                INSERT INTO frequent_words (user_id, frequent_words, updated_at)
                VALUES (?, ?, ?)
            `).run(userId, wordsJson, updatedAt);
        }

        res.json({
            message: 'Frequent words updated successfully',
            frequent_words: frequentWords,
            updated_at: updatedAt
        });
    } catch (error) {
        console.error('Error updating frequent words:', error);
        res.status(500).json({ message: 'Failed to update frequent words' });
    }
});

module.exports = router;
