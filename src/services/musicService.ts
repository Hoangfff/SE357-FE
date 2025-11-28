// Music service - handles API calls for music data
import { API_BASE_URL, ENDPOINTS } from '../config/api';
import type { Track, Playlist } from '../types';

export const musicService = {
    /**
     * Fetch all tracks
     */
    async getTracks(): Promise<Track[]> {
        // TODO: Implement API call
        // const response = await fetch(`${API_BASE_URL}${ENDPOINTS.music.tracks}`);
        // return response.json();

        // Mock data for now
        return [
            { id: '1', title: 'Midnight Dreams', artist: 'Luna Sky', duration: 245, album: 'Starlight' },
            { id: '2', title: 'Electric Pulse', artist: 'Neon Waves', duration: 198, album: 'Synthwave Vol. 1' },
        ];
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
