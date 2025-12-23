// Music service - handles API calls for music data
import { apiClient } from '@/lib/apiClient';
import { ENDPOINTS } from '@/config/api';
import type { Playlist } from '@/types';

// Track type from API
export interface MusicTrack {
    id: number;
    title: string;
    genre?: string;
    description?: string;
    file_url: string;
    vote_count: number;
    created_at: string;
    artist_id: number;
    deleted_at: string | null;
    artist_profiles?: {
        id: number;
        stage_name: string;
        photo_url?: string;
    };
}

export const musicService = {
    /**
     * Fetch all tracks from the API
     */
    async getTracks(): Promise<MusicTrack[]> {
        return apiClient.get<MusicTrack[]>(ENDPOINTS.music.tracks);
    },

    /**
     * Search tracks
     */
    async searchTracks(query: string): Promise<MusicTrack[]> {
        return apiClient.get<MusicTrack[]>(ENDPOINTS.music.search, {
            params: { q: query }
        });
    },

    /**
     * Fetch playlists
     */
    async getPlaylists(): Promise<Playlist[]> {
        // TODO: Implement API call
        return [];
    },

    /**
     * Play a track
     */
    async playTrack(trackId: string): Promise<void> {
        // TODO: Implement playback logic
        console.log('Playing track:', trackId);
    },
};
