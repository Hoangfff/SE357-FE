// export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://music-share-system.onrender.com';
// API configuration - uses /api proxy in development to bypass CORS
export const API_BASE_URL = '/api';

export const ENDPOINTS = {
    // Authentication endpoints
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        refresh: '/auth/refresh-token',
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
        profile: '/user/profile',
        profileById: (id: string) => `/user/${id}`,
        favorites: '/user/favorites',
        history: '/user/history',
        settings: '/user/settings',
        // Playlist endpoints
        playlists: '/user/playlists',
        playlistById: (id: string) => `/user/playlists/${id}`,
        playlistTracks: (playlistId: string) => `/user/playlists/${playlistId}/tracks`,
        playlistTrackById: (playlistId: string, trackId: string) => `/user/playlists/${playlistId}/tracks/${trackId}`,
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

    // Artist endpoints
    artist: {
        // Music management
        music: '/artist/music',
        musicById: (id: number) => `/artist/music/${id}`,
        // Album management
        albums: '/artist/albums',
        albumById: (id: number) => `/artist/albums/${id}`,
        albumTracks: (albumId: number) => `/artist/albums/${albumId}/tracks`,
        removeTrack: (albumId: number, trackId: number) => `/artist/albums/${albumId}/tracks/${trackId}`,
        // Analytics
        analytics: '/artist/analytics',
        // Profile
        profile: '/artist/profile',
    },
} as const;

// Helper function to construct full URL
export const getFullUrl = (endpoint: string): string => `${API_BASE_URL}${endpoint}`;
