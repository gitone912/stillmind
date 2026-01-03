const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const surveyRoutes = require('./routes/survey');
const settingsRoutes = require('./routes/settings');
const mindRoutes = require('./routes/mind');
const tasksRoutes = require('./routes/tasks');
const moodRoutes = require('./routes/mood');
const notificationsRoutes = require('./routes/notifications');
const journeyRoutes = require('./routes/journey');

// Initialize database (creates tables if they don't exist)
require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/', authRoutes);
app.use('/', surveyRoutes);
app.use('/', settingsRoutes);
app.use('/', mindRoutes);
app.use('/', tasksRoutes);
app.use('/', moodRoutes);
app.use('/', notificationsRoutes);
app.use('/', journeyRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'StillMind Backend API',
        version: '1.0.0',
        endpoints: {
            auth: [
                'POST /v1/users/sign-up',
                'POST /v1/users/sign-in',
                'POST /v1/users/verify-otp',
                'GET /v1/users/:userId',
                'POST /v1/users/update',
                'POST /v1/users/update-name'
            ],
            survey: ['POST /v1/surveys'],
            settings: ['POST /v1/settings/update'],
            mind: [
                'GET /v1/mind/all/:userId',
                'POST /v1/mind/create'
            ],
            tasks: [
                'POST /v1/tasks/create',
                'PATCH /v1/tasks/complete/:taskId',
                'POST /v1/tasks/today-tasks',
                'PATCH /v1/tasks/reduce/:taskId',
                'DELETE /v1/tasks/delete/:taskId'
            ],
            mood: [
                'GET /v1/mood/:userId',
                'POST /v1/mood/save',
                'GET /v1/frequent-words/:userId',
                'POST /v1/frequent-words/update'
            ],
            notifications: [
                'POST /v1/notifications/save-token',
                'GET /v1/notifications/tokens/:userId'
            ],
            journey: [
                'GET /v1/journey/streak/:userId'
            ]
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`StillMind Backend Server`);
    console.log(`========================================`);
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API docs: http://localhost:${PORT}/`);
    console.log(`========================================\n`);
});
