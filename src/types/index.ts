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

// Artist-specific types
export interface ArtistProfile {
    id: string;
    name: string;
    bio: string;
    contactEmail: string;
    website?: string;
    followerCount: number;
    monthlyListeners: number;
    coverImage?: string;
    avatarUrl?: string;
    verified: boolean;
    createdAt: Date;
}

export interface Song {
    id: string;
    title: string;
    artistId: string;
    artistName: string;
    albumId?: string;
    albumName?: string;
    duration: number;
    coverUrl?: string;
    audioUrl?: string;
    plays: number;
    uploadedAt: Date;
}

export interface ArtistAlbum {
    id: string;
    title: string;
    description?: string;
    artistId: string;
    artistName: string;
    coverUrl?: string;
    songs: Song[];
    releaseDate: Date;
    createdAt: Date;
}
