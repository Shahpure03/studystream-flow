import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's achievements
router.get('/:userId',authenticateToken,(req,res) => {
    const { userId } = req.params;

    db.all(
        'SELECT * FROM achievements WHERE user_id = ? ORDER BY earned_at DESC',
        [userId],
        (err,rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ achievements: rows });
        }
    );
});

// Check and award achievements
router.post('/check/:userId',authenticateToken,(req,res) => {
    const { userId } = req.params;

    // Get user's current stats
    db.get('SELECT * FROM users WHERE id = ?',[userId],(err,user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check for various achievements
        const newAchievements = [];

        // Streak achievements
        if (user.current_streak >= 7 && user.current_streak < 30) {
            checkAchievement(userId,'streak_7','Week Warrior','Maintained a 7-day learning streak!',100);
        } else if (user.current_streak >= 30) {
            checkAchievement(userId,'streak_30','Month Master','Maintained a 30-day learning streak!',500);
        }

        // Points achievements
        if (user.total_points >= 1000 && user.total_points < 5000) {
            checkAchievement(userId,'points_1000','Point Collector','Earned 1,000 points!',0);
        } else if (user.total_points >= 5000) {
            checkAchievement(userId,'points_5000','Point Master','Earned 5,000 points!',0);
        }

        // Get completed content count
        db.get(
            'SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND completed = 1',
            [userId],
            (err,result) => {
                if (!err && result) {
                    const completedCount = result.count;

                    // Completion achievements
                    if (completedCount >= 10 && completedCount < 50) {
                        checkAchievement(userId,'complete_10','Learning Explorer','Completed 10 learning activities!',50);
                    } else if (completedCount >= 50) {
                        checkAchievement(userId,'complete_50','Learning Champion','Completed 50 learning activities!',200);
                    }
                }

                res.json({ message: 'Achievement check completed' });
            }
        );
    });
});

// Helper function to check and create achievements
function checkAchievement(userId,achievementType,title,description,points) {
    // Check if achievement already exists
    db.get(
        'SELECT id FROM achievements WHERE user_id = ? AND achievement_type = ?',
        [userId,achievementType],
        (err,existing) => {
            if (err) {
                console.error('Error checking achievement:',err);
                return;
            }

            if (!existing) {
                // Create new achievement
                const achievementId = uuidv4();
                db.run(
                    'INSERT INTO achievements (id, user_id, achievement_type, title, description, points_awarded) VALUES (?, ?, ?, ?, ?, ?)',
                    [achievementId,userId,achievementType,title,description,points],
                    (err) => {
                        if (err) {
                            console.error('Error creating achievement:',err);
                        } else {
                            console.log(`Achievement awarded: ${title} to user ${userId}`);

                            // Award points if specified
                            if (points > 0) {
                                db.run(
                                    'UPDATE users SET total_points = total_points + ? WHERE id = ?',
                                    [points,userId],
                                    (err) => {
                                        if (err) {
                                            console.error('Error awarding points:',err);
                                        }
                                    }
                                );
                            }
                        }
                    }
                );
            }
        }
    );
}

// Get leaderboard
router.get('/leaderboard/points',(req,res) => {
    const { limit = 10 } = req.query;

    db.all(
        'SELECT username, total_points, current_streak FROM users ORDER BY total_points DESC LIMIT ?',
        [parseInt(limit)],
        (err,rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ leaderboard: rows });
        }
    );
});

// Get leaderboard by streak
router.get('/leaderboard/streak',(req,res) => {
    const { limit = 10 } = req.query;

    db.all(
        'SELECT username, current_streak, total_points FROM users ORDER BY current_streak DESC LIMIT ?',
        [parseInt(limit)],
        (err,rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ leaderboard: rows });
        }
    );
});

export default router;
