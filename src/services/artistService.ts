/**
 * Artist Service
 * API methods for artist module operations
 */

import { apiClient } from '../lib/apiClient';
import { ENDPOINTS } from '../config/api';
import type {
    Album,
    Track,
    ArtistProfile,
    CreateAlbumRequest,
    UpdateAlbumRequest,
    UpdateProfileRequest,
    AddTracksToAlbumRequest,
    AlbumResponse,
    TracksResponse,
    MessageResponse,
} from '../types/artist';

export const artistService = {
    // ==================== Albums ====================

    /**
     * Get all albums for the logged-in artist
     */
    async getAlbums(): Promise<Album[]> {
        return apiClient.get<Album[]>(ENDPOINTS.artist.albums);
    },

    /**
     * Get album details by ID
     */
    async getAlbumById(albumId: number): Promise<Album> {
        return apiClient.get<Album>(ENDPOINTS.artist.albumById(albumId));
    },

    /**
     * Create a new album
     */
    async createAlbum(data: CreateAlbumRequest): Promise<AlbumResponse> {
        return apiClient.post<AlbumResponse>(ENDPOINTS.artist.albums, data);
    },

    /**
     * Update an existing album
     */
    async updateAlbum(albumId: number, data: UpdateAlbumRequest): Promise<AlbumResponse> {
        return apiClient.put<AlbumResponse>(ENDPOINTS.artist.albumById(albumId), data);
    },

    /**
     * Delete an album
     */
    async deleteAlbum(albumId: number): Promise<MessageResponse> {
        return apiClient.delete<MessageResponse>(ENDPOINTS.artist.albumById(albumId));
    },

    // ==================== Album Tracks ====================

    /**
     * Add tracks to an album
     */
    async addTracksToAlbum(albumId: number, trackIds: number[], trackOrder?: number[]): Promise<TracksResponse> {
        const data: AddTracksToAlbumRequest = { trackIds };
        if (trackOrder) {
            data.trackOrder = trackOrder;
        }
        return apiClient.post<TracksResponse>(ENDPOINTS.artist.albumTracks(albumId), data);
    },

    /**
     * Remove a track from an album
     */
    async removeTrackFromAlbum(albumId: number, trackId: number): Promise<MessageResponse> {
        return apiClient.delete<MessageResponse>(ENDPOINTS.artist.removeTrack(albumId, trackId));
    },

    // ==================== Music/Tracks ====================

    /**
     * Get all music/tracks for the logged-in artist
     */
    async getArtistMusic(): Promise<Track[]> {
        return apiClient.get<Track[]>(ENDPOINTS.artist.music);
    },

    /**
     * Delete a track
     */
    async deleteTrack(trackId: number): Promise<MessageResponse> {
        return apiClient.delete<MessageResponse>(ENDPOINTS.artist.musicById(trackId));
    },

    // ==================== Music Player Events ====================
    // TODO: Implement music player integration when ready

    /**
     * Dispatch event to play album tracks
     * @param albumTracks - Tracks to play in order
     */
    playAlbum(albumTracks: Track[]): void {
        // Template for music player integration
        console.log('[Artist Service] Play album - tracks:', albumTracks.length);
        window.dispatchEvent(new CustomEvent('music:play', {
            detail: { tracks: albumTracks, shuffle: false }
        }));
    },

    /**
     * Dispatch event to play album in shuffle mode
     * @param albumTracks - Tracks to shuffle and play
     */
    shuffleAlbum(albumTracks: Track[]): void {
        // Template for music player integration
        console.log('[Artist Service] Shuffle album - tracks:', albumTracks.length);
        window.dispatchEvent(new CustomEvent('music:play', {
            detail: { tracks: albumTracks, shuffle: true }
        }));
    },

    /**
     * Dispatch event to add tracks to queue
     * @param tracks - Tracks to add to queue
     */
    addToQueue(tracks: Track[]): void {
        // Template for music player integration
        console.log('[Artist Service] Add to queue - tracks:', tracks.length);
        window.dispatchEvent(new CustomEvent('music:queue', {
            detail: { tracks }
        }));
    },

    // ==================== Profile ====================

    /**
     * Get the logged-in artist's profile
     */
    async getProfile(): Promise<ArtistProfile> {
        return apiClient.get<ArtistProfile>(ENDPOINTS.artist.profile);
    },

    /**
     * Update the artist's profile
     */
    async updateProfile(data: UpdateProfileRequest): Promise<MessageResponse> {
        return apiClient.put<MessageResponse>(ENDPOINTS.artist.profile, data as Record<string, unknown>);
    },

    /**
     * Upload profile photo
     */
    async uploadProfilePhoto(file: File): Promise<{ photoUrl: string }> {
        const formData = new FormData();
        formData.append('photo', file);
        return apiClient.post<{ photoUrl: string }>(`${ENDPOINTS.artist.profile}/photo`, formData);
    },
};

export default artistService;
