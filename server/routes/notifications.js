const express = require('express');
const router = express.Router();
const db = require('../database');

// POST /v1/notifications/save-token - Save FCM token
router.post('/v1/notifications/save-token', (req, res) => {
    try {
        const { fcmToken, userId, name } = req.body;

        if (!fcmToken || !userId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const updatedAt = new Date().toISOString();

        // Check if token already exists for this user
        const existing = db.prepare(`
            SELECT id FROM fcm_tokens
            WHERE user_id = ? AND fcm_token = ?
        `).get(userId, fcmToken);

        if (existing) {
            // Update existing token
            db.prepare(`
                UPDATE fcm_tokens
                SET name = ?, updated_at = ?
                WHERE id = ?
            `).run(name || '', updatedAt, existing.id);
        } else {
            // Insert new token
            db.prepare(`
                INSERT INTO fcm_tokens (user_id, fcm_token, name, updated_at)
                VALUES (?, ?, ?, ?)
            `).run(userId, fcmToken, name || '', updatedAt);
        }

        res.status(201).json({
            message: 'Notification token saved successfully',
            token: {
                fcmToken,
                userId,
                name,
                updated_at: updatedAt
            }
        });
    } catch (error) {
        console.error('Error saving notification token:', error);
        res.status(500).json({ message: 'Failed to save notification token' });
    }
});

// GET /v1/notifications/tokens/:userId - Get all FCM tokens for a user
router.get('/v1/notifications/tokens/:userId', (req, res) => {
    try {
        const { userId } = req.params;

        const tokens = db.prepare(`
            SELECT fcm_token, name, created_at, updated_at
            FROM fcm_tokens
            WHERE user_id = ?
            ORDER BY updated_at DESC
        `).all(userId);

        res.json({
            tokens
        });
    } catch (error) {
        console.error('Error fetching notification tokens:', error);
        res.status(500).json({ message: 'Failed to fetch notification tokens' });
    }
});

module.exports = router;
