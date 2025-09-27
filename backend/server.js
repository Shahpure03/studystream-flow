import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import db from './database/init.js';

// Import routes
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import goalsRoutes from './routes/goals.js';
import achievementsRoutes from './routes/achievements.js';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173','http://localhost:3000'], // Frontend URLs
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health',(req,res) => {
    res.json({
        status: 'OK',
        message: 'StudyStream API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth',authRoutes);
app.use('/api/content',contentRoutes);
app.use('/api/goals',goalsRoutes);
app.use('/api/achievements',achievementsRoutes);

// Error handling middleware
app.use((err,req,res,next) => {
    console.error('Error:',err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*',(req,res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Start server
app.listen(PORT,() => {
    console.log(`🚀 StudyStream API server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT',() => {
    console.log('\n🛑 Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:',err);
        } else {
            console.log('📦 Database connection closed');
        }
        process.exit(0);
    });
});

export default app;
