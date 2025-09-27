import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's goals
router.get('/:userId',authenticateToken,(req,res) => {
    const { userId } = req.params;
    const { type } = req.query; // 'daily', 'weekly', 'monthly'

    let query = 'SELECT * FROM goals WHERE user_id = ?';
    const params = [userId];

    if (type) {
        query += ' AND goal_type = ?';
        params.push(type);
    }

    query += ' ORDER BY created_at DESC';

    db.all(query,params,(err,rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ goals: rows });
    });
});

// Create new goal
router.post('/',authenticateToken,(req,res) => {
    const { userId,title,description,targetValue,goalType } = req.body;

    if (!userId || !title || !targetValue || !goalType) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const goalId = uuidv4();
    const goalData = {
        id: goalId,
        user_id: userId,
        title,
        description: description || '',
        target_value: targetValue,
        current_value: 0,
        completed: false,
        goal_type: goalType
    };

    db.run(
        'INSERT INTO goals (id, user_id, title, description, target_value, current_value, completed, goal_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [goalId,userId,title,description || '',targetValue,0,false,goalType],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create goal' });
            }

            res.status(201).json({
                message: 'Goal created successfully',
                goal: goalData
            });
        }
    );
});

// Update goal progress
router.put('/:goalId',authenticateToken,(req,res) => {
    const { goalId } = req.params;
    const { currentValue,completed } = req.body;

    if (currentValue === undefined) {
        return res.status(400).json({ error: 'Current value is required' });
    }

    db.run(
        'UPDATE goals SET current_value = ?, completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [currentValue,completed || false,goalId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update goal' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Goal not found' });
            }

            // Award points if goal is completed
            if (completed) {
                db.get('SELECT user_id FROM goals WHERE id = ?',[goalId],(err,goal) => {
                    if (!err && goal) {
                        awardPoints(goal.user_id,25); // Award 25 points for goal completion
                    }
                });
            }

            res.json({ message: 'Goal updated successfully' });
        }
    );
});

// Delete goal
router.delete('/:goalId',authenticateToken,(req,res) => {
    const { goalId } = req.params;

    db.run('DELETE FROM goals WHERE id = ?',[goalId],function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete goal' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        res.json({ message: 'Goal deleted successfully' });
    });
});

// Get daily goals suggestions
router.get('/suggestions/:userId',authenticateToken,(req,res) => {
    const { userId } = req.params;

    // Get user's subjects and create suggestions based on them
    db.get('SELECT subjects FROM users WHERE id = ?',[userId],(err,user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userSubjects = JSON.parse(user.subjects);
        const suggestions = [];

        // Generate suggestions based on user's subjects
        userSubjects.forEach(subject => {
            suggestions.push({
                title: `Watch 2 ${subject} videos`,
                description: `Complete 2 educational videos in ${subject}`,
                targetValue: 2,
                goalType: 'daily'
            });
        });

        // Add general learning suggestions
        suggestions.push(
            {
                title: "Study for 30 minutes",
                description: "Spend 30 minutes on any learning activity",
                targetValue: 30,
                goalType: 'daily'
            },
            {
                title: "Complete 1 quiz",
                description: "Take and complete one quiz in any subject",
                targetValue: 1,
                goalType: 'daily'
            }
        );

        res.json({ suggestions });
    });
});

// Helper function to award points
function awardPoints(userId,points) {
    db.run(
        'UPDATE users SET total_points = total_points + ? WHERE id = ?',
        [points,userId],
        (err) => {
            if (err) {
                console.error('Failed to award points:',err);
            }
        }
    );
}

export default router;
