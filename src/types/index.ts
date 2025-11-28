// Type definitions for the music app

export interface Track {
    id: string;
    title: string;
    artist: string;
    album?: string;
    duration: number;
    coverUrl?: string;
    audioUrl?: string;
}

export interface Playlist {
    id: string;
    name: string;
    description?: string;
    coverUrl?: string;
    tracks: Track[];
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    createdAt: Date;
}

export interface PlayerState {
    currentTrack: Track | null;
    isPlaying: boolean;
    volume: number;
    currentTime: number;
    queue: Track[];
}
