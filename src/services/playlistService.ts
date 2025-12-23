/**
 * Playlist Service
 * API methods for user playlist operations
 */

import { apiClient } from '@/lib/apiClient';
import { ENDPOINTS } from '@/config/api';
import type { ApiPlaylist, AddTrackResponse } from '@/types';

export interface CreatePlaylistRequest {
    name: string;
}

export interface UpdatePlaylistRequest {
    name: string;
}

export interface AddTrackRequest {
    trackId: number;
}

export interface DeleteConfirmRequest {
    confirm: boolean;
}

export interface MessageResponse {
    message: string;
}

export const playlistService = {
    // ==================== Playlists ====================

    /**
     * Get all playlists for the logged-in user
     */
    async getPlaylists(): Promise<ApiPlaylist[]> {
        return apiClient.get<ApiPlaylist[]>(ENDPOINTS.user.playlists);
    },

    /**
     * Get playlist details by ID
     */
    async getPlaylistById(playlistId: string): Promise<ApiPlaylist> {
        return apiClient.get<ApiPlaylist>(ENDPOINTS.user.playlistById(playlistId));
    },

    /**
     * Create a new playlist
     */
    async createPlaylist(data: CreatePlaylistRequest): Promise<MessageResponse> {
        return apiClient.post<MessageResponse>(ENDPOINTS.user.playlists, data as unknown as Record<string, unknown>);
    },

    /**
     * Update playlist name
     */
    async updatePlaylist(playlistId: string, data: UpdatePlaylistRequest): Promise<MessageResponse> {
        return apiClient.put<MessageResponse>(ENDPOINTS.user.playlistById(playlistId), data as unknown as Record<string, unknown>);
    },

    /**
     * Delete a playlist
     */
    async deletePlaylist(playlistId: string): Promise<MessageResponse> {
        return apiClient.delete<MessageResponse>(ENDPOINTS.user.playlistById(playlistId), {
            data: { confirm: true }
        });
    },

    // ==================== Playlist Tracks ====================

    /**
     * Add a track to a playlist
     */
    async addTrackToPlaylist(playlistId: string, trackId: number): Promise<AddTrackResponse> {
        return apiClient.post<AddTrackResponse>(
            ENDPOINTS.user.playlistTracks(playlistId),
            { trackId } as Record<string, unknown>
        );
    },

    /**
     * Remove a track from a playlist
     */
    async removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<MessageResponse> {
        return apiClient.delete<MessageResponse>(
            ENDPOINTS.user.playlistTrackById(playlistId, trackId),
            { data: { confirm: true } }
        );
    },
};

export default playlistService;
