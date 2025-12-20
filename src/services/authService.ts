// Authentication service
import { ENDPOINTS } from '@/config/api';
import { apiClient, tokenManager } from '@/lib/apiClient';

// Auth API response types
export interface AuthResponse {
    message?: string;
    accessToken?: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface ApiError {
    message: string;
    statusCode?: number;
}

export const authService = {
    /**
     * Register a new user
     */
    async register(email: string, password: string, name: string): Promise<AuthResponse> {
        return apiClient.post<AuthResponse>(
            ENDPOINTS.auth.register,
            { email, password, name },
            { skipAuth: true }
        );
    },

    /**
     * Verify OTP for account activation
     */
    async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
        return apiClient.post<AuthResponse>(
            ENDPOINTS.auth.verifyOtp,
            { email, otp },
            { skipAuth: true }
        );
    },

    /**
     * Login user
     */
    async login(email: string, password: string): Promise<LoginResponse> {
        return apiClient.post<LoginResponse>(
            ENDPOINTS.auth.login,
            { email, password },
            { skipAuth: true }
        );
    },

    /**
     * Request password reset OTP
     */
    async forgotPassword(email: string): Promise<AuthResponse> {
        return apiClient.post<AuthResponse>(
            ENDPOINTS.auth.forgotPassword,
            { email },
            { skipAuth: true }
        );
    },

    /**
     * Verify password reset OTP
     */
    async verifyResetOtp(email: string, otp: string): Promise<AuthResponse> {
        return apiClient.post<AuthResponse>(
            ENDPOINTS.auth.verifyResetOtp,
            { email, otp },
            { skipAuth: true }
        );
    },

    /**
     * Reset password with new password
     */
    async resetPassword(email: string, newPassword: string): Promise<AuthResponse> {
        return apiClient.post<AuthResponse>(
            ENDPOINTS.auth.resetPassword,
            { email, newPassword },
            { skipAuth: true }
        );
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            // Call logout API endpoint
            await apiClient.post(ENDPOINTS.auth.logout);
        } catch (error) {
            // Continue with logout even if API call fails
            console.error('Logout API error:', error);
        } finally {
            // Always clear tokens locally
            tokenManager.clearAll();
        }
    },

    /**
     * Store auth token
     */
    storeToken(token: string): void {
        tokenManager.setToken(token);
        localStorage.setItem('isAuthenticated', 'true');
    },

    /**
     * Store refresh token
     */
    storeRefreshToken(token: string): void {
        tokenManager.setRefreshToken(token);
    },

    /**
     * Store both tokens at once
     */
    storeTokens(accessToken: string, refreshToken: string): void {
        tokenManager.setToken(accessToken);
        tokenManager.setRefreshToken(refreshToken);
        localStorage.setItem('isAuthenticated', 'true');
    },

    /**
     * Get stored token
     */
    getToken(): string | null {
        return tokenManager.getToken();
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!tokenManager.getToken();
    },

    /**
     * Decode JWT token to get user info (basic decode without verification)
     */
    decodeToken(token: string): { id: string; email: string; role: string } | null {
        try {
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            return {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
            };
        } catch {
            return null;
        }
    },
};
