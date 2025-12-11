// export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://music-share-system.onrender.com';
// API configuration - uses /api proxy in development to bypass CORS
export const API_BASE_URL = '/api';

export const ENDPOINTS = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        verifyOtp: '/auth/verify-otp',
        forgotPassword: '/auth/forgot-password',
        verifyResetOtp: '/auth/verify-reset-otp',
        resetPassword: '/auth/reset-password',
    },
    music: {
        tracks: '/tracks',
        playlists: '/playlists',
        albums: '/albums',
    },
    user: {
        profile: '/user/profile',
        favorites: '/user/favorites',
    },
} as const;
