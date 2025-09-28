// Mock data for frontend prototype

export interface User {
    id: string;
    username: string;
    gradeLevel: string;
    subjects: string[];
    joinedDate: string;
    currentStreak: number;
    totalPoints: number;
}

export interface Content {
    id: string;
    title: string;
    subject: string;
    content_type: string;
    difficulty: string;
    duration_minutes: number;
    description: string;
    thumbnail_url: string;
}

export interface Goal {
    id: string;
    title: string;
    target_value: number;
    current_value: number;
    completed: boolean;
    goal_type: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    points_awarded: number;
    earned_at: string;
}

// Mock user data
export const mockUser: User = {
    id: "user-1",
    username: "student123",
    gradeLevel: "10th Grade",
    subjects: ["Mathematics","Science","English"],
    joinedDate: "2024-01-15",
    currentStreak: 7,
    totalPoints: 1250
};

// Mock content data
export const mockContent: Content[] = [
    {
        id: "content-1",
        title: "Introduction to Algebra",
        subject: "Mathematics",
        content_type: "video",
        difficulty: "beginner",
        duration_minutes: 15,
        description: "Learn the basics of algebraic expressions and equations",
        thumbnail_url: "📊"
    },
    {
        id: "content-2",
        title: "Chemical Reactions Quiz",
        subject: "Science",
        content_type: "quiz",
        difficulty: "intermediate",
        duration_minutes: 10,
        description: "Test your knowledge of chemical reactions",
        thumbnail_url: "🔬"
    },
    {
        id: "content-3",
        title: "Essay Writing Techniques",
        subject: "English",
        content_type: "reading",
        difficulty: "intermediate",
        duration_minutes: 20,
        description: "Master the art of persuasive essay writing",
        thumbnail_url: "📝"
    },
    {
        id: "content-4",
        title: "World War II Timeline",
        subject: "History",
        content_type: "video",
        difficulty: "beginner",
        duration_minutes: 12,
        description: "Comprehensive overview of WWII events",
        thumbnail_url: "🏛️"
    },
    {
        id: "content-5",
        title: "Basic Programming Concepts",
        subject: "Programming",
        content_type: "video",
        difficulty: "beginner",
        duration_minutes: 25,
        description: "Introduction to programming fundamentals",
        thumbnail_url: "💻"
    },
    {
        id: "content-6",
        title: "Spanish Vocabulary Quiz",
        subject: "Languages",
        content_type: "quiz",
        difficulty: "beginner",
        duration_minutes: 8,
        description: "Test your Spanish vocabulary knowledge",
        thumbnail_url: "🌍"
    }
];

// Mock goals data
export const mockGoals: Goal[] = [
    {
        id: "goal-1",
        title: "Complete 3 lessons today",
        target_value: 3,
        current_value: 1,
        completed: false,
        goal_type: "daily"
    },
    {
        id: "goal-2",
        title: "Study for 2 hours",
        target_value: 120,
        current_value: 45,
        completed: false,
        goal_type: "daily"
    },
    {
        id: "goal-3",
        title: "Take 5 quizzes this week",
        target_value: 5,
        current_value: 5,
        completed: true,
        goal_type: "weekly"
    }
];

// Mock achievements data
export const mockAchievements: Achievement[] = [
    {
        id: "achievement-1",
        title: "Quiz Master",
        description: "Completed 5 quizzes",
        points_awarded: 100,
        earned_at: "2024-01-20"
    },
    {
        id: "achievement-2",
        title: "Streak Hero",
        description: "7 day learning streak",
        points_awarded: 200,
        earned_at: "2024-01-22"
    },
    {
        id: "achievement-3",
        title: "Point Collector",
        description: "1,000+ points earned",
        points_awarded: 50,
        earned_at: "2024-01-18"
    }
];
