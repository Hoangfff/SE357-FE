// Authentication service
import { API_BASE_URL, ENDPOINTS } from '../config/api';

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

// Helper function to make API requests
const apiRequest = async <T>(url: string, options: RequestInit): Promise<T> => {
    try {
        console.log('Making request to:', url, options); // Debug log

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                ...options.headers,
            },
        });

        console.log('Response status:', response.status); // Debug log

        const data = await response.json();
        console.log('Response data:', data); // Debug log

        if (!response.ok) {
            throw new Error(data.message || `Error: ${response.status}`);
        }

        return data as T;
    } catch (error) {
        console.error('API Error:', error); // Debug log
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Đã có lỗi xảy ra');
    }
};

export const authService = {
    /**
     * Register a new user
     */
    async register(email: string, password: string, name: string): Promise<AuthResponse> {
        return apiRequest<AuthResponse>(
            `${API_BASE_URL}${ENDPOINTS.auth.register}`,
            {
                method: 'POST',
                body: JSON.stringify({ email, password, name }),
            }
        );
    },

    /**
     * Verify OTP for account activation
     */
    async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
        return apiRequest<AuthResponse>(
            `${API_BASE_URL}${ENDPOINTS.auth.verifyOtp}`,
            {
                method: 'POST',
                body: JSON.stringify({ email, otp }),
            }
        );
    },

    /**
     * Login user
     */
    async login(email: string, password: string): Promise<LoginResponse> {
        return apiRequest<LoginResponse>(
            `${API_BASE_URL}${ENDPOINTS.auth.login}`,
            {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            }
        );
    },

    /**
     * Request password reset OTP
     */
    async forgotPassword(email: string): Promise<AuthResponse> {
        return apiRequest<AuthResponse>(
            `${API_BASE_URL}${ENDPOINTS.auth.forgotPassword}`,
            {
                method: 'POST',
                body: JSON.stringify({ email }),
            }
        );
    },

    /**
     * Verify password reset OTP
     */
    async verifyResetOtp(email: string, otp: string): Promise<AuthResponse> {
        return apiRequest<AuthResponse>(
            `${API_BASE_URL}${ENDPOINTS.auth.verifyResetOtp}`,
            {
                method: 'POST',
                body: JSON.stringify({ email, otp }),
            }
        );
    },

    /**
     * Reset password with new password
     */
    async resetPassword(email: string, newPassword: string): Promise<AuthResponse> {
        return apiRequest<AuthResponse>(
            `${API_BASE_URL}${ENDPOINTS.auth.resetPassword}`,
            {
                method: 'POST',
                body: JSON.stringify({ email, newPassword }),
            }
        );
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
    },

    /**
     * Store auth token
     */
    storeToken(token: string): void {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('isAuthenticated', 'true');
    },

    /**
     * Store refresh token
     */
    storeRefreshToken(token: string): void {
        localStorage.setItem('refreshToken', token);
    },

    /**
     * Store both tokens at once
     */
    storeTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('isAuthenticated', 'true');
    },

    /**
     * Get stored token
     */
    getToken(): string | null {
        return localStorage.getItem('accessToken');
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('accessToken');
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
