/**
 * API Client - Axios-based HTTP client for making API requests
 * Provides consistent error handling, auth token management via cookies, auto-refresh via interceptors
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

// Token storage (in memory + localStorage for persistence)
let accessToken: string | null = null;
let refreshToken: string | null = null;

export const tokenManager = {
    getToken: (): string | null => {
        if (!accessToken) {
            accessToken = localStorage.getItem('accessToken');
        }
        return accessToken;
    },
    setToken: (token: string): void => {
        accessToken = token;
        localStorage.setItem('accessToken', token);
    },
    getRefreshToken: (): string | null => {
        if (!refreshToken) {
            refreshToken = localStorage.getItem('refreshToken');
        }
        return refreshToken;
    },
    setRefreshToken: (token: string): void => {
        refreshToken = token;
        localStorage.setItem('refreshToken', token);
    },
    clearAll: (): void => {
        accessToken = null;
        refreshToken = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
    },
};

// User info stored in memory (populated from login response)
interface UserInfo {
    id: string;
    email: string;
    role: string;
}

let currentUser: UserInfo | null = null;

export const userSession = {
    getUser: (): UserInfo | null => currentUser,
    setUser: (user: UserInfo | null): void => {
        currentUser = user;
        if (user) {
            localStorage.setItem('userRole', user.role);
            localStorage.setItem('userEmail', user.email);
        }
    },
    clearUser: (): void => {
        currentUser = null;
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
    },
    isAuthenticated: (): boolean => currentUser !== null || !!tokenManager.getToken(),
};

// Track if a refresh is in progress to prevent multiple simultaneous refreshes
let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important: This sends cookies with every request
});

// Subscribe to token refresh
function subscribeTokenRefresh(callback: (success: boolean) => void): void {
    refreshSubscribers.push(callback);
}

// Notify all subscribers when token is refreshed
function onTokenRefreshed(success: boolean): void {
    refreshSubscribers.forEach(callback => callback(success));
    refreshSubscribers = [];
}

export async function refreshAccessToken(): Promise<boolean> {
    try {
        console.log('[API Client] Attempting to refresh access token using refreshToken cookie...');
        const response = await axios.get(
            `${API_BASE_URL}${ENDPOINTS.auth.refresh}`,
            { withCredentials: true }
        );

        if (response.data.accessToken) {
            console.log('[API Client] Access token refreshed successfully');
            tokenManager.setToken(response.data.accessToken);
        }

        return true;
    } catch (error) {
        console.error('[API Client] Refresh token error:', error);
        return false;
    }
}

// Request interceptor - add Authorization header
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenManager.getToken();
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Let the browser set proper multipart boundaries when sending FormData
        if (config.data instanceof FormData) {
            if (config.headers && 'Content-Type' in config.headers) {
                delete (config.headers as Record<string, unknown>)['Content-Type'];
            }
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
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh((success: boolean) => {
                        if (success) {
                            resolve(axiosInstance(originalRequest));
                        } else {
                            reject(error);
                        }
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const success = await refreshAccessToken();

                if (success) {
                    isRefreshing = false;
                    onTokenRefreshed(true);
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                isRefreshing = false;
                onTokenRefreshed(false);
                userSession.clearUser();
                window.dispatchEvent(new CustomEvent('auth:unauthorized'));
                return Promise.reject(refreshError);
            }

            // Refresh failed
            isRefreshing = false;
            onTokenRefreshed(false);
            tokenManager.clearAll();
            userSession.clearUser();
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

    // Simplified HTTP methods - all include withCredentials automatically
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
