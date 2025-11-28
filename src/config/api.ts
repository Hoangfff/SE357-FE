// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const ENDPOINTS = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
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
