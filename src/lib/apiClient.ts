/**
 * API Client - A lightweight fetch wrapper for making HTTP requests
 * Provides consistent error handling, auth token management, and request/response processing
 */

import { API_BASE_URL } from '../config/api';

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

// Token management
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

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
    }
};

// Request configuration type
interface RequestConfig extends Omit<RequestInit, 'body'> {
    body?: Record<string, unknown> | FormData;
    params?: Record<string, string | number | boolean | undefined>;
    skipAuth?: boolean;
}

// Build URL with query parameters
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    return url.toString();
}

// Create headers with auth token
function createHeaders(config: RequestConfig): Headers {
    const headers = new Headers(config.headers as HeadersInit);

    // Add auth token if available and not skipped
    if (!config.skipAuth) {
        const token = tokenManager.getToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
    }

    // Set content type for JSON if body is an object (not FormData)
    if (config.body && !(config.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    return headers;
}

// Parse response based on content type
async function parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
        return response.json();
    }

    // For non-JSON responses, return text as unknown
    return response.text() as unknown as T;
}

// Handle API errors
async function handleError(response: Response): Promise<never> {
    let errorData: ApiError;

    try {
        const data = await response.json();
        errorData = {
            message: data.message || data.error || 'An error occurred',
            statusCode: response.status,
            errors: data.errors,
        };
    } catch {
        errorData = {
            message: response.statusText || 'An error occurred',
            statusCode: response.status,
        };
    }

    // Handle 401 Unauthorized - clear tokens and redirect to login
    if (response.status === 401) {
        tokenManager.clearAll();
        // Optionally dispatch an event for the app to handle
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    throw errorData;
}

// Main request function
async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const url = buildUrl(endpoint, config.params);
    const headers = createHeaders(config);

    const fetchConfig: RequestInit = {
        ...config,
        headers,
        body: config.body instanceof FormData
            ? config.body
            : config.body
                ? JSON.stringify(config.body)
                : undefined,
    };

    try {
        const response = await fetch(url, fetchConfig);

        if (!response.ok) {
            await handleError(response);
        }

        return parseResponse<T>(response);
    } catch (error) {
        // Re-throw ApiError as is
        if ((error as ApiError).statusCode) {
            throw error;
        }

        // Handle network errors
        throw {
            message: error instanceof Error ? error.message : 'Network error',
            statusCode: 0,
        } as ApiError;
    }
}

// HTTP method shortcuts
export const apiClient = {
    get: <T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>) =>
        request<T>(endpoint, { ...config, method: 'GET' }),

    post: <T>(endpoint: string, body?: Record<string, unknown> | FormData, config?: Omit<RequestConfig, 'method' | 'body'>) =>
        request<T>(endpoint, { ...config, method: 'POST', body }),

    put: <T>(endpoint: string, body?: Record<string, unknown>, config?: Omit<RequestConfig, 'method' | 'body'>) =>
        request<T>(endpoint, { ...config, method: 'PUT', body }),

    patch: <T>(endpoint: string, body?: Record<string, unknown>, config?: Omit<RequestConfig, 'method' | 'body'>) =>
        request<T>(endpoint, { ...config, method: 'PATCH', body }),

    delete: <T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>) =>
        request<T>(endpoint, { ...config, method: 'DELETE' }),
};

export default apiClient;
