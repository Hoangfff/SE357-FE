// Authentication service
import { API_BASE_URL, ENDPOINTS } from '../config/api';
import type { User } from '../types';

export const authService = {
    /**
     * Login user
     */
    async login(email: string, password: string): Promise<User> {
        // TODO: Implement API call
        // const response = await fetch(`${API_BASE_URL}${ENDPOINTS.auth.login}`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email, password }),
        // });
        // return response.json();

        // Mock for now
        return {
            id: '1',
            email,
            name: 'Music Lover',
            createdAt: new Date(),
        };
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        // TODO: Implement logout
        console.log('User logged out');
    },

    /**
     * Get current user
     */
    async getCurrentUser(): Promise<User | null> {
        // TODO: Implement
        return null;
    },
};
