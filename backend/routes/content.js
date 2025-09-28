import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all content
router.get('/',(req,res) => {
    const { subject,difficulty,type } = req.query;

    let query = 'SELECT * FROM content WHERE 1=1';
    const params = [];

    if (subject) {
        query += ' AND subject = ?';
        params.push(subject);
    }

    if (difficulty) {
        query += ' AND difficulty = ?';
        params.push(difficulty);
    }

    if (type) {
        query += ' AND content_type = ?';
        params.push(type);
    }

    query += ' ORDER BY created_at DESC';

    db.all(query,params,(err,rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ content: rows });
    });
});

// Get content by ID
router.get('/:id',(req,res) => {
    const { id } = req.params;

    db.get('SELECT * FROM content WHERE id = ?',[id],(err,row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Content not found' });
        }

        res.json({ content: row });
    });
});

// Get personalized recommendations for user
router.get('/recommendations/:userId',authenticateToken,(req,res) => {
    const { userId } = req.params;

    // First get user's subjects and grade level
    db.get('SELECT subjects, grade_level FROM users WHERE id = ?',[userId],(err,user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userSubjects = JSON.parse(user.subjects);

        // Get content matching user's subjects
        const placeholders = userSubjects.map(() => '?').join(',');
        const query = `
      SELECT * FROM content 
      WHERE subject IN (${placeholders})
      ORDER BY 
        CASE difficulty 
          WHEN 'beginner' THEN 1 
          WHEN 'intermediate' THEN 2 
          WHEN 'advanced' THEN 3 
        END,
        created_at DESC
      LIMIT 10
    `;

        db.all(query,userSubjects,(err,rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            res.json({ recommendations: rows });
        });
    });
});

// Track content progress
router.post('/:id/progress',authenticateToken,(req,res) => {
    const { id: contentId } = req.params;
    const { userId,progressPercentage,timeSpent,completed } = req.body;

    if (!userId || progressPercentage === undefined) {
        return res.status(400).json({ error: 'User ID and progress percentage are required' });
    }

    // Check if progress record exists
    db.get(
        'SELECT * FROM user_progress WHERE user_id = ? AND content_id = ?',
        [userId,contentId],
        (err,existingProgress) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            const progressId = existingProgress ? existingProgress.id : uuidv4();
            const completedAt = completed ? new Date().toISOString() : null;

            if (existingProgress) {
                // Update existing progress
                db.run(
                    'UPDATE user_progress SET progress_percentage = ?, completed = ?, time_spent_minutes = ?, completed_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                    [progressPercentage,completed,timeSpent || 0,completedAt,progressId],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: 'Failed to update progress' });
                        }

                        // Award points if completed
                        if (completed && !existingProgress.completed) {
                            awardPoints(userId,50); // Award 50 points for completion
                        }

                        res.json({
                            message: 'Progress updated successfully',
                            progressId,
                            progressPercentage,
                            completed
                        });
                    }
                );
            } else {
                // Create new progress record
                db.run(
                    'INSERT INTO user_progress (id, user_id, content_id, progress_percentage, completed, time_spent_minutes, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [progressId,userId,contentId,progressPercentage,completed,timeSpent || 0,completedAt],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: 'Failed to create progress record' });
                        }

                        // Award points if completed
                        if (completed) {
                            awardPoints(userId,50);
                        }

                        res.json({
                            message: 'Progress recorded successfully',
                            progressId,
                            progressPercentage,
                            completed
                        });
                    }
                );
            }
        }
    );
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
