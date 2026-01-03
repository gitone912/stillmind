const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { generateOTP, storeOTP, verifyOTP } = require('../utils/otp');

const router = express.Router();

// POST /v1/users/sign-up - Initiate signup by sending OTP
router.post('/v1/users/sign-up', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Generate and store OTP
        const otp = generateOTP();
        storeOTP(email, otp);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});

// POST /v1/users/sign-in - Sign in existing user or trigger signup
router.post('/v1/users/sign-in', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user exists
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = stmt.get(email);

        if (!user) {
            return res.status(200).json({ message: 'User not found' });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Return user data
        const userData = {
            user_id: user.user_id,
            email: user.email,
            name: user.name,
            is_onboarded: Boolean(user.is_onboarded),
            notification_time: user.notification_time,
            notification_days: JSON.parse(user.notification_days || '[]'),
            cover_choice: user.cover_choice,
            points: user.points,
            subscription: user.subscription,
            created_at: user.created_at,
            updated_at: user.updated_at
        };

        res.status(200).json({
            message: 'Sign in successful',
            user: userData
        });
    } catch (error) {
        console.error('Sign in error:', error);
        res.status(500).json({ message: 'Sign in failed' });
    }
});

// POST /v1/users/verify-otp - Verify OTP and complete signup
router.post('/v1/users/verify-otp', async (req, res) => {
    try {
        const { email, password, otp } = req.body;

        if (!email || !password || !otp) {
            return res.status(400).json({ message: 'Email, password, and OTP are required' });
        }

        // Verify OTP
        const isValidOTP = verifyOTP(email, otp);

        if (!isValidOTP) {
            return res.status(401).json({ message: 'Invalid or expired OTP' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const userId = uuidv4();
        const insertStmt = db.prepare(`
      INSERT INTO users (user_id, email, password, points, subscription)
      VALUES (?, ?, ?, ?, ?)
    `);

        insertStmt.run(userId, email, hashedPassword, 15, 'freeTier');

        // Get the created user
        const stmt = db.prepare('SELECT * FROM users WHERE user_id = ?');
        const user = stmt.get(userId);

        const userData = {
            user_id: user.user_id,
            email: user.email,
            name: user.name,
            is_onboarded: Boolean(user.is_onboarded),
            notification_time: user.notification_time,
            notification_days: JSON.parse(user.notification_days || '[]'),
            cover_choice: user.cover_choice,
            points: user.points,
            subscription: user.subscription,
            created_at: user.created_at,
            updated_at: user.updated_at
        };

        res.status(200).json({
            message: 'User created successfully',
            user: userData
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        if (error.code === 'SQLITE_CONSTRAINT') {
            res.status(400).json({ message: 'User already exists' });
        } else {
            res.status(500).json({ message: 'OTP verification failed' });
        }
    }
});

// GET /v1/users/:userId - Get user by ID
router.get('/v1/users/:userId', (req, res) => {
    try {
        const { userId } = req.params;

        const stmt = db.prepare('SELECT * FROM users WHERE user_id = ?');
        const user = stmt.get(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = {
            user_id: user.user_id,
            email: user.email,
            name: user.name,
            is_onboarded: Boolean(user.is_onboarded),
            notification_time: user.notification_time,
            notification_days: JSON.parse(user.notification_days || '[]'),
            cover_choice: user.cover_choice,
            points: user.points,
            subscription: user.subscription,
            created_at: user.created_at,
            updated_at: user.updated_at
        };

        res.status(200).json(userData);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Failed to get user' });
    }
});

// POST /v1/users/update - Update user profile
router.post('/v1/users/update', (req, res) => {
    try {
        const { userId, name, isOnboarded, notificationTime, notificationDays, coverChoice } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const updateStmt = db.prepare(`
      UPDATE users 
      SET name = COALESCE(?, name),
          is_onboarded = COALESCE(?, is_onboarded),
          notification_time = COALESCE(?, notification_time),
          notification_days = COALESCE(?, notification_days),
          cover_choice = COALESCE(?, cover_choice),
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `);

        updateStmt.run(
            name || null,
            isOnboarded !== undefined ? (isOnboarded ? 1 : 0) : null,
            notificationTime || null,
            notificationDays ? JSON.stringify(notificationDays) : null,
            coverChoice || null,
            userId
        );

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Failed to update user' });
    }
});

// POST /v1/users/update-name - Update user name
router.post('/v1/users/update-name', (req, res) => {
    try {
        const { userId, name } = req.body;

        if (!userId || !name) {
            return res.status(400).json({ message: 'User ID and name are required' });
        }

        const updateStmt = db.prepare(`
      UPDATE users 
      SET name = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `);

        updateStmt.run(name, userId);

        // Get updated timestamp
        const stmt = db.prepare('SELECT name, updated_at FROM users WHERE user_id = ?');
        const result = stmt.get(userId);

        res.status(200).json({
            message: 'Name updated successfully',
            updates: {
                name: result.name,
                updated_at: result.updated_at
            }
        });
    } catch (error) {
        console.error('Update name error:', error);
        res.status(500).json({ message: 'Failed to update name' });
    }
});

module.exports = router;
