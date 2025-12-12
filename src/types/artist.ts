/**
 * Artist Types
 * Type definitions for artist module API responses
 */

// Track/Music types
export interface Track {
    id: number;
    artistId: number;
    title: string;
    genre?: string;
    description?: string;
    fileUrl: string;
    voteCount: number;
    createdAt: string;
    // Nested data
    musicStats?: {
        listens: number;
        shares: number;
        updatedAt: string;
    };
    votes?: Array<{
        id: number;
        userId: number;
    }>;
    albumTracks?: Array<{
        id: number;
        albumId: number;
        trackOrder: number;
        albums?: Album;
    }>;
}

// Album types
export interface Album {
    id: number;
    artistId: number;
    title: string;
    description?: string;
    coverUrl?: string;
    createdAt: string;
    // Nested tracks
    albumTracks?: AlbumTrack[];
}

export interface AlbumTrack {
    id: number;
    albumId: number;
    trackId: number;
    trackOrder: number;
    music?: Track;
}

// API Request DTOs
export interface CreateAlbumRequest {
    title: string;
    description?: string;
}

export interface UpdateAlbumRequest {
    title?: string;
    description?: string;
    coverUrl?: string;
}

export interface AddTracksToAlbumRequest {
    trackIds: number[];
    trackOrder?: number[];
}

// API Response types
export interface AlbumResponse {
    message: string;
    album: Album;
}

export interface TracksResponse {
    message: string;
    albumTracks: AlbumTrack[];
}

export interface MessageResponse {
    message: string;
}

// Artist Profile
export interface ArtistProfile {
    id: number;
    userId: number;
    stageName: string;
    bio?: string;
    photoUrl?: string;
    socialLinks?: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt?: string;
}

// Analytics types
export interface AnalyticsSummary {
    totalTracks: number;
    totalListens: number;
    totalShares: number;
    averageListensPerTrack: number;
}

export interface AnalyticsResponse {
    summary: AnalyticsSummary;
    topTracks: Array<{
        musicId: number;
        listens: number;
        shares: number;
        music: Track;
    }>;
    detailedStats: Array<{
        musicId: number;
        listens: number;
        shares: number;
        music: Track;
    }>;
}
