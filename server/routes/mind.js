const express = require('express');
const router = express.Router();
const db = require('../database');
const { v4: uuidv4 } = require('uuid');

// GET /v1/mind/all/:userId - Fetch all mind entries for a user
router.get('/v1/mind/all/:userId', (req, res) => {
    try {
        const { userId } = req.params;

        const entries = db.prepare(`
            SELECT mind_id, user_id, title, insight, created_at
            FROM mind_entries
            WHERE user_id = ?
            ORDER BY created_at DESC
        `).all(userId);

        // If no entries exist, return dummy data
        if (entries.length === 0) {
            const dummyData = {
                [uuidv4()]: {
                    mind_id: uuidv4(),
                    user_id: userId,
                    title: "First Journal Entry",
                    insight: "This is a sample journal entry. Start writing your thoughts to see them here!",
                    created_at: new Date().toISOString()
                },
                [uuidv4()]: {
                    mind_id: uuidv4(),
                    user_id: userId,
                    title: "Gratitude Practice",
                    insight: "Today I'm grateful for the small moments of peace and clarity.",
                    created_at: new Date(Date.now() - 86400000).toISOString() // Yesterday
                }
            };
            return res.json(dummyData);
        }

        // Convert array to object with mind_id as key
        const entriesObject = {};
        entries.forEach(entry => {
            entriesObject[entry.mind_id] = entry;
        });

        res.json(entriesObject);
    } catch (error) {
        console.error('Error fetching mind entries:', error);
        res.status(500).json({ message: 'Failed to fetch mind entries' });
    }
});

// POST /v1/mind/create - Create a new mind entry
router.post('/v1/mind/create', (req, res) => {
    try {
        const { userId, title, insight } = req.body;

        if (!userId || !title || !insight) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const mindId = uuidv4();
        const createdAt = new Date().toISOString();

        db.prepare(`
            INSERT INTO mind_entries (mind_id, user_id, title, insight, created_at)
            VALUES (?, ?, ?, ?, ?)
        `).run(mindId, userId, title, insight, createdAt);

        res.status(201).json({
            message: 'Mind entry created successfully',
            entry: {
                mind_id: mindId,
                user_id: userId,
                title,
                insight,
                created_at: createdAt
            }
        });
    } catch (error) {
        console.error('Error creating mind entry:', error);
        res.status(500).json({ message: 'Failed to create mind entry' });
    }
});

module.exports = router;
