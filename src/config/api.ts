// API configuration - uses /api proxy in development to bypass CORS
export const API_BASE_URL = '/api';

export const ENDPOINTS = {
    // Authentication endpoints
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        refresh: '/auth/refresh',
        me: '/auth/me',
        verifyOtp: '/auth/verify-otp',
        forgotPassword: '/auth/forgot-password',
        verifyResetOtp: '/auth/verify-reset-otp',
        resetPassword: '/auth/reset-password',
    },

    // Music/Tracks endpoints
    music: {
        tracks: '/tracks',
        trackById: (id: string) => `/tracks/${id}`,
        upload: '/tracks/upload',
        search: '/tracks/search',
        trending: '/tracks/trending',
        playlists: '/playlists',
        playlistById: (id: string) => `/playlists/${id}`,
        albums: '/albums',
        albumById: (id: string) => `/albums/${id}`,
    },

    // User endpoints
    user: {
        profile: '/users/profile',
        profileById: (id: string) => `/users/${id}`,
        favorites: '/users/favorites',
        history: '/users/history',
        settings: '/users/settings',
    },

    // Admin endpoints
    admin: {
        dashboard: '/admin/dashboard',
        users: '/admin/users',
        userById: (id: string) => `/admin/users/${id}`,
        userDetails: (id: string) => `/admin/users/${id}/details`,
        music: '/admin/music',
        musicById: (id: string) => `/admin/music/${id}`,
        reports: '/admin/reports',
        reportById: (id: string) => `/admin/reports/${id}`,
        reportResolve: (id: string) => `/admin/reports/${id}/resolve`,
        // Artist applications
        artistApplications: '/admin/artist-applications',
        processApplication: (id: string) => `/admin/artist-applications/${id}/process`,
        // Account management
        searchAccounts: '/admin/accounts/search',
        assignRole: '/admin/accounts/assign-role',
        deleteAccount: (id: string) => `/admin/accounts/${id}`,
    },

    // Reports endpoints
    reports: {
        create: '/reports',
        getAll: '/reports',
        byId: (id: string) => `/reports/${id}`,
        resolve: (id: string) => `/reports/${id}/resolve`,
    },
} as const;

// Helper function to construct full URL
export const getFullUrl = (endpoint: string): string => `${API_BASE_URL}${endpoint}`;
