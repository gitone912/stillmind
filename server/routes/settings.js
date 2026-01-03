const express = require('express');
const db = require('../database');

const router = express.Router();

// POST /v1/settings/update - Update user settings
router.post('/v1/settings/update', (req, res) => {
    try {
        const { userId, voiceType, language, therapyType } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Check if settings exist for this user
        const checkStmt = db.prepare('SELECT * FROM settings WHERE user_id = ?');
        const existingSettings = checkStmt.get(userId);

        if (existingSettings) {
            // Update existing settings
            const updateStmt = db.prepare(`
        UPDATE settings 
        SET voice_type = COALESCE(?, voice_type),
            language = COALESCE(?, language),
            therapy_type = COALESCE(?, therapy_type),
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `);

            updateStmt.run(
                voiceType || null,
                language || null,
                therapyType || null,
                userId
            );
        } else {
            // Insert new settings
            const insertStmt = db.prepare(`
        INSERT INTO settings (user_id, voice_type, language, therapy_type)
        VALUES (?, ?, ?, ?)
      `);

            insertStmt.run(
                userId,
                voiceType || 'William',
                language || 'English',
                therapyType || 'Cognitive-Behavioral'
            );
        }

        // Get updated settings
        const stmt = db.prepare('SELECT * FROM settings WHERE user_id = ?');
        const settings = stmt.get(userId);

        res.status(200).json({
            message: 'Settings updated successfully',
            settings: {
                voice_type: settings.voice_type,
                language: settings.language,
                therapy_type: settings.therapy_type,
                updated_at: settings.updated_at
            }
        });
    } catch (error) {
        console.error('Settings update error:', error);
        res.status(500).json({ message: 'Failed to update settings' });
    }
});

module.exports = router;
