import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/init.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register',async (req,res) => {
    try {
        const { username,password,gradeLevel,subjects } = req.body;

        // Validate input
        if (!username || !password || !gradeLevel || !subjects || subjects.length === 0) {
            return res.status(400).json({
                error: 'All fields are required and at least one subject must be selected'
            });
        }

        // Check if user already exists
        db.get('SELECT id FROM users WHERE username = ?',[username],async (err,row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (row) {
                return res.status(409).json({ error: 'Username already exists' });
            }

            try {
                // Hash password
                const saltRounds = 10;
                const passwordHash = await bcrypt.hash(password,saltRounds);

                // Create user
                const userId = uuidv4();
                const userData = {
                    id: userId,
                    username,
                    password_hash: passwordHash,
                    grade_level: gradeLevel,
                    subjects: JSON.stringify(subjects),
                    joined_date: new Date().toISOString(),
                    current_streak: 0,
                    total_points: 0
                };

                db.run(
                    'INSERT INTO users (id, username, password_hash, grade_level, subjects, joined_date, current_streak, total_points) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [userId,username,passwordHash,gradeLevel,JSON.stringify(subjects),userData.joined_date,0,0],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: 'Failed to create user' });
                        }

                        // Generate JWT token
                        const token = generateToken(userData);

                        res.status(201).json({
                            message: 'User created successfully',
                            token,
                            user: {
                                id: userId,
                                username,
                                gradeLevel,
                                subjects: JSON.parse(userData.subjects),
                                joinedDate: userData.joined_date
                            }
                        });
                    }
                );
            } catch (hashError) {
                res.status(500).json({ error: 'Password hashing failed' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login user
router.post('/login',(req,res) => {
    const { username,password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err,user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            try {
                const isValidPassword = await bcrypt.compare(password,user.password_hash);

                if (!isValidPassword) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                // Generate JWT token
                const token = generateToken(user);

                res.json({
                    message: 'Login successful',
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        gradeLevel: user.grade_level,
                        subjects: JSON.parse(user.subjects),
                        joinedDate: user.joined_date,
                        currentStreak: user.current_streak,
                        totalPoints: user.total_points
                    }
                });
            } catch (error) {
                res.status(500).json({ error: 'Authentication failed' });
            }
        }
    );
});

// Get user profile
router.get('/profile',(req,res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    const jwt = require('jsonwebtoken');
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        db.get('SELECT * FROM users WHERE id = ?',[decoded.id],(err,user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    gradeLevel: user.grade_level,
                    subjects: JSON.parse(user.subjects),
                    joinedDate: user.joined_date,
                    currentStreak: user.current_streak,
                    totalPoints: user.total_points
                }
            });
        });
    });
});

export default router;
