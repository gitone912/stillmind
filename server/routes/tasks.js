const express = require('express');
const router = express.Router();
const db = require('../database');
const { v4: uuidv4 } = require('uuid');

// POST /v1/tasks/create - Create a new task
router.post('/v1/tasks/create', (req, res) => {
    try {
        const { userId, taskName, completion_points } = req.body;

        if (!userId || !taskName) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const taskId = uuidv4();
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const createdAt = new Date().toISOString();

        db.prepare(`
            INSERT INTO tasks (task_id, user_id, task_name, completion_points, date, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(taskId, userId, taskName, completion_points || 10, date, createdAt);

        const task = {
            task_id: taskId,
            user_id: userId,
            task_name: taskName,
            is_completed: false,
            completed_at: null,
            completion_points: completion_points || 10,
            date: date
        };

        res.status(201).json({
            message: 'Task created successfully',
            task
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Failed to create task' });
    }
});

// PATCH /v1/tasks/complete/:taskId - Mark task as complete
router.patch('/v1/tasks/complete/:taskId', (req, res) => {
    try {
        const { taskId } = req.params;
        const { isCompleted } = req.body;

        const completedAt = isCompleted ? new Date().toISOString() : null;

        db.prepare(`
            UPDATE tasks
            SET is_completed = ?, completed_at = ?
            WHERE task_id = ?
        `).run(isCompleted ? 1 : 0, completedAt, taskId);

        res.json({
            message: 'Task updated successfully',
            taskId,
            is_completed: isCompleted,
            completed_at: completedAt
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Failed to update task' });
    }
});

// POST /v1/tasks/today-tasks - Get today's tasks
router.post('/v1/tasks/today-tasks', (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'Missing userId' });
        }

        const today = new Date().toISOString().split('T')[0];

        const tasks = db.prepare(`
            SELECT task_id, user_id, task_name, is_completed, completed_at, completion_points, date
            FROM tasks
            WHERE user_id = ? AND date = ?
            ORDER BY created_at DESC
        `).all(userId, today);

        // Convert is_completed from 0/1 to boolean
        const formattedTasks = tasks.map(task => ({
            ...task,
            is_completed: Boolean(task.is_completed)
        }));

        // If no tasks exist, return dummy data
        if (formattedTasks.length === 0) {
            const dummyTasks = [
                {
                    task_id: uuidv4(),
                    user_id: userId,
                    task_name: "Morning meditation",
                    is_completed: false,
                    completed_at: null,
                    completion_points: 10,
                    date: today
                },
                {
                    task_id: uuidv4(),
                    user_id: userId,
                    task_name: "Write in journal",
                    is_completed: false,
                    completed_at: null,
                    completion_points: 15,
                    date: today
                },
                {
                    task_id: uuidv4(),
                    user_id: userId,
                    task_name: "Take a mindful walk",
                    is_completed: false,
                    completed_at: null,
                    completion_points: 20,
                    date: today
                }
            ];
            return res.json({ tasks: dummyTasks });
        }

        res.json({ tasks: formattedTasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
});

// PATCH /v1/tasks/reduce/:taskId - Reduce task completion (unmark)
router.patch('/v1/tasks/reduce/:taskId', (req, res) => {
    try {
        const { taskId } = req.params;

        db.prepare(`
            UPDATE tasks
            SET is_completed = 0, completed_at = NULL
            WHERE task_id = ?
        `).run(taskId);

        res.json({
            message: 'Task completion reduced successfully',
            taskId,
            is_completed: false,
            completed_at: null
        });
    } catch (error) {
        console.error('Error reducing task completion:', error);
        res.status(500).json({ message: 'Failed to reduce task completion' });
    }
});

// DELETE /v1/tasks/delete/:taskId - Delete a task
router.delete('/v1/tasks/delete/:taskId', (req, res) => {
    try {
        const { taskId } = req.params;

        db.prepare(`
            DELETE FROM tasks
            WHERE task_id = ?
        `).run(taskId);

        res.json({
            message: 'Task deleted successfully',
            taskId
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Failed to delete task' });
    }
});

module.exports = router;
