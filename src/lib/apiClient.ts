/**
 * API Client - Axios-based HTTP client for making API requests
 * Provides consistent error handling, auth token management, auto-refresh via interceptors
 */

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, ENDPOINTS } from '@/config/api';

// Types for API responses and errors
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ApiError {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
}

// Token management - must match keys used by authService
const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenManager = {
    getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
    setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
    removeToken: (): void => localStorage.removeItem(TOKEN_KEY),

    getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
    setRefreshToken: (token: string): void => localStorage.setItem(REFRESH_TOKEN_KEY, token),
    removeRefreshToken: (): void => localStorage.removeItem(REFRESH_TOKEN_KEY),

    clearAll: (): void => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
    }
};

// Track if a refresh is in progress to prevent multiple simultaneous refreshes
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Create axios instance with base configuration
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Subscribe to token refresh
function subscribeTokenRefresh(callback: (token: string) => void): void {
    refreshSubscribers.push(callback);
}

// Notify all subscribers when token is refreshed
function onTokenRefreshed(token: string): void {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
}

// Refresh the access token
async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
        console.log('[API Client] No refresh token available');
        return null;
    }

    try {
        console.log('[API Client] Attempting to refresh access token...');
        const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.auth.refresh}`, {
            refreshToken
        });

        const newAccessToken = response.data.accessToken;
        if (newAccessToken) {
            tokenManager.setToken(newAccessToken);
            console.log('[API Client] Access token refreshed successfully');
            return newAccessToken;
        }

        return null;
    } catch (error) {
        console.error('[API Client] Refresh token error:', error);
        return null;
    }
}

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Skip auth header if skipAuth flag is set
        if ((config as InternalAxiosRequestConfig & { skipAuth?: boolean }).skipAuth) {
            return config;
        }

        const token = tokenManager.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Remove Content-Type for FormData to let browser set it with boundary
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors and token refresh
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // Return the data directly for successful responses
        return response.data;
    },
    async (error: AxiosError<{ message?: string; error?: string; errors?: Record<string, string[]> }>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; skipAuth?: boolean };

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.skipAuth) {
            if (isRefreshing) {
                // Wait for token refresh to complete
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token: string) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshAccessToken();

                if (newToken) {
                    isRefreshing = false;
                    onTokenRefreshed(newToken);

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    }
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                isRefreshing = false;
                tokenManager.clearAll();
                window.dispatchEvent(new CustomEvent('auth:unauthorized'));
                return Promise.reject(refreshError);
            }

            // Refresh failed
            isRefreshing = false;
            tokenManager.clearAll();
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }

        // Transform axios error to our ApiError format
        const apiError: ApiError = {
            message: error.response?.data?.message || error.response?.data?.error || error.message || 'An error occurred',
            statusCode: error.response?.status || 0,
            errors: error.response?.data?.errors,
        };

        return Promise.reject(apiError);
    }
);

// Export configured axios instance and convenience methods
export const apiClient = {
    // Direct access to axios instance for advanced usage
    instance: axiosInstance,

    // Simplified HTTP methods
    get: <T>(endpoint: string, config?: { params?: Record<string, unknown>; skipAuth?: boolean }) =>
        axiosInstance.get<T, T>(endpoint, config as never),

    post: <T>(endpoint: string, data?: Record<string, unknown> | FormData, config?: { skipAuth?: boolean }) =>
        axiosInstance.post<T, T>(endpoint, data, config as never),

    put: <T>(endpoint: string, data?: Record<string, unknown>, config?: { skipAuth?: boolean }) =>
        axiosInstance.put<T, T>(endpoint, data, config as never),

    patch: <T>(endpoint: string, data?: Record<string, unknown>, config?: { skipAuth?: boolean }) =>
        axiosInstance.patch<T, T>(endpoint, data, config as never),

    delete: <T>(endpoint: string, config?: { data?: Record<string, unknown>; skipAuth?: boolean }) =>
        axiosInstance.delete<T, T>(endpoint, config as never),
};

export default apiClient;
