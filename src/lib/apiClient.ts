/**
 * API Client - A lightweight fetch wrapper for making HTTP requests
 * Provides consistent error handling, auth token management, auto-refresh, and request/response processing
 */

import { API_BASE_URL, ENDPOINTS } from '../config/api';

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

// Request configuration type
interface RequestConfig extends Omit<RequestInit, 'body'> {
    body?: Record<string, unknown> | FormData;
    params?: Record<string, string | number | boolean | undefined>;
    skipAuth?: boolean;
    _isRetry?: boolean; // Internal flag to prevent infinite refresh loops
}

// Track if a refresh is in progress to prevent multiple simultaneous refreshes
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

// Build URL with query parameters
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    let url = `${API_BASE_URL}${endpoint}`;

    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.append(key, String(value));
            }
        });
        const queryString = searchParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }

    return url;
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

// Refresh the access token using the refresh token
async function refreshAccessToken(): Promise<boolean> {
    // If already refreshing, wait for that to complete
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
        console.log('[API Client] No refresh token available');
        return false;
    }

    isRefreshing = true;
    console.log('[API Client] Attempting to refresh access token...');

    refreshPromise = (async () => {
        try {
            const response = await fetch(buildUrl(ENDPOINTS.auth.refresh), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                console.log('[API Client] Refresh failed with status:', response.status);
                return false;
            }

            const data = await response.json();

            if (data.accessToken) {
                tokenManager.setToken(data.accessToken);
                console.log('[API Client] Access token refreshed successfully');
                return true;
            }

            return false;
        } catch (error) {
            console.error('[API Client] Refresh token error:', error);
            return false;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

// Handle API errors
async function handleError(response: Response, config: RequestConfig): Promise<never> {
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

    // Handle 401 Unauthorized - try to refresh token first
    if (response.status === 401 && !config._isRetry && !config.skipAuth) {
        console.log('[API Client] Got 401, attempting token refresh...');

        const refreshed = await refreshAccessToken();

        if (refreshed) {
            // Retry the original request with the new token
            console.log('[API Client] Retrying original request after refresh');
            // We throw a special error to signal retry
            const retryError = new Error('RETRY_REQUEST') as Error & { shouldRetry: boolean };
            retryError.shouldRetry = true;
            throw retryError;
        } else {
            // Refresh failed, clear tokens and redirect to login
            console.log('[API Client] Refresh failed, clearing tokens');
            tokenManager.clearAll();
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
    }

    throw errorData;
}

// Main request function with auto-refresh
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
            await handleError(response, config);
        }

        return parseResponse<T>(response);
    } catch (error) {
        // Check if we should retry after token refresh
        if ((error as Error & { shouldRetry?: boolean }).shouldRetry) {
            // Retry the request with the new token
            return request<T>(endpoint, { ...config, _isRetry: true });
        }

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
