import mockService from './mockService.ts';

class AuthService {
    constructor() {
        this.currentUser = null;
        this.loadUserFromStorage();
    }

    // Load user from localStorage
    loadUserFromStorage() {
        try {
            const userData = localStorage.getItem('user');
            const token = localStorage.getItem('authToken');

            if (userData && token) {
                this.currentUser = JSON.parse(userData);
            }
        } catch (error) {
            console.error('Error loading user from storage:',error);
            this.logout();
        }
    }

    // Login user
    async login(username,password) {
        try {
            const response = await mockService.login(username,password);

            // Store token and user data
            localStorage.setItem('authToken',response.token);
            localStorage.setItem('user',JSON.stringify(response.user));

            this.currentUser = response.user;
            return response;
        } catch (error) {
            throw new Error(error.message || 'Login failed');
        }
    }

    // Register user
    async register(userData) {
        try {
            const response = await mockService.register(userData);

            // Store token and user data
            localStorage.setItem('authToken',response.token);
            localStorage.setItem('user',JSON.stringify(response.user));

            this.currentUser = response.user;
            return response;
        } catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser && !!localStorage.getItem('authToken');
    }

    // Logout user
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.currentUser = null;
    }

    // Refresh user data from server
    async refreshUser() {
        try {
            const response = await mockService.getProfile();
            this.currentUser = response.user;
            localStorage.setItem('user',JSON.stringify(response.user));
            return response.user;
        } catch (error) {
            console.error('Error refreshing user data:',error);
            // If refresh fails, user might be logged out
            this.logout();
            throw error;
        }
    }
}

export default new AuthService();
