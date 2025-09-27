import mockService from './mockService.ts';

class ApiService {
    constructor() {
        // Using mock service instead of real API
    }

    // Auth endpoints
    async login(username,password) {
        return mockService.login(username,password);
    }

    async register(userData) {
        return mockService.register(userData);
    }

    async getProfile() {
        return mockService.getProfile();
    }

    // Content endpoints
    async getContent(filters = {}) {
        return mockService.getContent();
    }

    async getContentById(id) {
        // For now, return first content item
        const result = await mockService.getContent();
        return { content: result.content[0] };
    }

    async getRecommendations(userId) {
        return mockService.getRecommendations(userId);
    }

    async updateProgress(contentId,progressData) {
        return mockService.updateProgress(contentId,progressData);
    }

    // Goals endpoints
    async getGoals(userId,type = null) {
        return mockService.getGoals(userId,type);
    }

    async createGoal(goalData) {
        // Mock implementation
        return { success: true,goal: { id: 'new-goal',...goalData } };
    }

    async updateGoal(goalId,updateData) {
        return mockService.updateGoal(goalId,updateData);
    }

    async deleteGoal(goalId) {
        return { success: true };
    }

    async getGoalSuggestions(userId) {
        return { suggestions: [] };
    }

    // Achievements endpoints
    async getAchievements(userId) {
        return mockService.getAchievements(userId);
    }

    async checkAchievements(userId) {
        return { achievements: [] };
    }

    async getLeaderboard(type = 'points',limit = 10) {
        return { leaderboard: [] };
    }
}

export default new ApiService();
