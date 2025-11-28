// App constants
export const APP_NAME = 'MusicHub';
export const APP_VERSION = '1.0.0';

// Theme colors
export const COLORS = {
    primary: '#667eea',
    secondary: '#764ba2',
    background: {
        dark: '#0f0c29',
        medium: '#302b63',
        light: '#24243e',
    },
    glass: {
        bg: 'rgba(255, 255, 255, 0.05)',
        border: 'rgba(255, 255, 255, 0.1)',
    },
} as const;

// Player settings
export const PLAYER_SETTINGS = {
    defaultVolume: 1,
    seekStep: 5, // seconds
    volumeStep: 0.1,
} as const;
