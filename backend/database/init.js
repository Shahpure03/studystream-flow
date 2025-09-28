import sqlite3 from 'sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname,join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize database
const db = new sqlite3.Database('./database/studystream.db');

// Read and execute schema
const schema = readFileSync(join(__dirname,'schema.sql'),'utf8');
db.exec(schema,(err) => {
    if (err) {
        console.error('Error creating database schema:',err);
    } else {
        console.log('Database schema created successfully');
        seedDatabase();
    }
});

// Seed database with initial data
function seedDatabase() {
    // Insert sample content
    const sampleContent = [
        {
            id: uuidv4(),
            title: "Introduction to Algebra",
            subject: "Mathematics",
            content_type: "video",
            difficulty: "beginner",
            duration_minutes: 15,
            description: "Learn the basics of algebraic expressions and equations",
            thumbnail_url: "📊"
        },
        {
            id: uuidv4(),
            title: "Chemical Reactions Quiz",
            subject: "Science",
            content_type: "quiz",
            difficulty: "intermediate",
            duration_minutes: 10,
            description: "Test your knowledge of chemical reactions",
            thumbnail_url: "🔬"
        },
        {
            id: uuidv4(),
            title: "Essay Writing Techniques",
            subject: "English",
            content_type: "reading",
            difficulty: "intermediate",
            duration_minutes: 20,
            description: "Master the art of persuasive essay writing",
            thumbnail_url: "📝"
        },
        {
            id: uuidv4(),
            title: "World War II Timeline",
            subject: "History",
            content_type: "video",
            difficulty: "beginner",
            duration_minutes: 12,
            description: "Comprehensive overview of WWII events",
            thumbnail_url: "🏛️"
        },
        {
            id: uuidv4(),
            title: "Basic Programming Concepts",
            subject: "Programming",
            content_type: "video",
            difficulty: "beginner",
            duration_minutes: 25,
            description: "Introduction to programming fundamentals",
            thumbnail_url: "💻"
        },
        {
            id: uuidv4(),
            title: "Spanish Vocabulary Quiz",
            subject: "Languages",
            content_type: "quiz",
            difficulty: "beginner",
            duration_minutes: 8,
            description: "Test your Spanish vocabulary knowledge",
            thumbnail_url: "🌍"
        }
    ];

    const insertContent = db.prepare(`
    INSERT OR IGNORE INTO content 
    (id, title, subject, content_type, difficulty, duration_minutes, description, thumbnail_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

    sampleContent.forEach(content => {
        insertContent.run([
            content.id,
            content.title,
            content.subject,
            content.content_type,
            content.difficulty,
            content.duration_minutes,
            content.description,
            content.thumbnail_url
        ]);
    });

    insertContent.finalize();
    console.log('Sample content added to database');
}

export default db;
