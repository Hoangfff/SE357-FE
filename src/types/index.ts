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

// API Playlist types (from backend)
export interface PlaylistArtistProfile {
    id: number;
    bio: string | null;
    photo_url: string | null;
    social_links: string | null;
    stage_name: string;
    status: string;
    updated_at: string;
    user_id: number;
}

export interface PlaylistTrackMusic {
    id: number;
    created_at: string;
    description: string;
    file_url: string;
    genre: string;
    title: string;
    vote_count: number;
    artist_id: number;
    deleted_at: string | null;
    artist_profiles: PlaylistArtistProfile;
}

export interface PlaylistTrack {
    id: number;
    added_at: string;
    track_order: number;
    track_id: number;
    playlist_id: number;
    music: PlaylistTrackMusic;
}

export interface ApiPlaylist {
    id: number;
    creationDate: string;
    name: string;
    userId: number;
    playlistTracks: PlaylistTrack[];
}

export interface AddTrackResponse {
    message: string;
    playlistTrack: PlaylistTrack;
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
