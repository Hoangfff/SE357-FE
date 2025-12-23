// Authentication service
import { ENDPOINTS } from '@/config/api';
import { apiClient, userSession, tokenManager } from '@/lib/apiClient';

// Auth API response types
export interface AuthResponse {
    message?: string;
    accessToken?: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export interface RefreshResponse {
    message?: string;
    accessToken?: string;
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
     * Login user - stores tokens and user info
     */
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>(
            ENDPOINTS.auth.login,
            { email, password },
            { skipAuth: true }
        );

        // Store tokens
        if (response.accessToken) {
            tokenManager.setToken(response.accessToken);
        }

        // If the backend returns user info, store it in memory
        if (response.user) {
            userSession.setUser({
                id: response.user.id,
                email: response.user.email,
                role: response.user.role,
            });
        }

        return response;
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
     * Logout user - clears tokens and user data
     */
    async logout(): Promise<void> {
        try {
            await apiClient.post(ENDPOINTS.auth.logout);
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            // Always clear tokens and user session
            tokenManager.clearAll();
            userSession.clearUser();
        }
    },

    /**
     * Refresh the token stored in cookies
     */
    async refreshAuthToken(): Promise<RefreshResponse> {
        const res = await apiClient.get<RefreshResponse>(ENDPOINTS.auth.refresh);
        if (res.accessToken) tokenManager.setToken(res.accessToken);
        return res;
    },

    /**
     * Get current user from session
     */
    getUser(): { id: string; email: string; role: string } | null {
        return userSession.getUser();
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return userSession.isAuthenticated();
    },

    /**
     * Store user info after successful login (when backend doesn't return user in response)
     */
    setUserFromToken(accessToken: string): void {
        const decoded = this.decodeToken(accessToken);
        if (decoded) {
            userSession.setUser(decoded);
        }
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
