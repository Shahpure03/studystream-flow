// Mock service to replace API calls for frontend prototype

import { mockUser,mockContent,mockGoals,mockAchievements,User,Content,Goal,Achievement } from '../data/mockData';

class MockService {
    // Simulate API delay
    private delay(ms: number = 500): Promise<void> {
        return new Promise(resolve => setTimeout(resolve,ms));
    }

    // Auth methods
    async login(username: string,password: string): Promise<{ token: string; user: User }> {
        await this.delay(300);

        if (username === 'demo' && password === 'demo') {
            return {
                token: 'mock-jwt-token',
                user: mockUser
            };
        }
        throw new Error('Invalid credentials');
    }

    async register(userData: any): Promise<{ token: string; user: User }> {
        await this.delay(500);

        return {
            token: 'mock-jwt-token',
            user: {
                ...mockUser,
                username: userData.username,
                gradeLevel: userData.gradeLevel,
                subjects: userData.subjects
            }
        };
    }

    async getProfile(): Promise<{ user: User }> {
        await this.delay(200);
        return { user: mockUser };
    }

    // Content methods
    async getContent(): Promise<{ content: Content[] }> {
        await this.delay(300);
        return { content: mockContent };
    }

    async getRecommendations(userId: string): Promise<{ recommendations: Content[] }> {
        await this.delay(400);
        // Return first 4 items as recommendations
        return { recommendations: mockContent.slice(0,4) };
    }

    async updateProgress(contentId: string,progressData: any): Promise<{ success: boolean }> {
        await this.delay(200);
        console.log('Progress updated for content:',contentId,progressData);
        return { success: true };
    }

    // Goals methods
    async getGoals(userId: string,type?: string): Promise<{ goals: Goal[] }> {
        await this.delay(300);
        let goals = mockGoals;
        if (type) {
            goals = goals.filter(goal => goal.goal_type === type);
        }
        return { goals };
    }

    async updateGoal(goalId: string,updateData: any): Promise<{ success: boolean }> {
        await this.delay(200);
        console.log('Goal updated:',goalId,updateData);
        return { success: true };
    }

    // Achievements methods
    async getAchievements(userId: string): Promise<{ achievements: Achievement[] }> {
        await this.delay(300);
        return { achievements: mockAchievements };
    }
}

export default new MockService();
