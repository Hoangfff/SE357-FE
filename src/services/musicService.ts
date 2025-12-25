// Music service - handles API calls for music data
import { apiClient } from '@/lib/apiClient';
import { ENDPOINTS } from '@/config/api';
import type { Playlist } from '@/types';

export interface MusicStats {
    id: number;
    listens: number;
    shares: number;
    updatedAt: string;
    musicId: number;
}

export interface MusicArtistProfile {
    id: number;
    bio: string | null;
    photoUrl: string | null;
    socialLinks: string | null;
    stageName: string;
    status: string;
    updatedAt: string;
    userId: number;
    users?: {
        id: number;
        name: string;
        email: string;
    };
}

export interface MusicAlbumTrack {
    id: number;
    trackOrder: number;
    albumId: number;
    trackId: number;
    albums?: {
        id: number;
        coverUrl: string | null;
        createdAt: string;
        description: string | null;
        title: string;
        artistId: number;
    };
}

// Track type from /music/all API
export interface MusicTrack {
    id: number;
    createdAt: string;
    description?: string;
    fileUrl: string;
    genre?: string;
    title: string;
    voteCount: number;
    artistId: number;
    deletedAt: string | null;
    artistProfiles?: MusicArtistProfile;
    musicStats?: MusicStats[];
    albumTracks?: MusicAlbumTrack[];
}

export const musicService = {
    /**
     * Fetch all tracks from the /music/all endpoint
     */
    async getTracks(): Promise<MusicTrack[]> {
        return apiClient.get<MusicTrack[]>(ENDPOINTS.music.all);
    },

    /**
     * Search tracks (fallback to legacy search endpoint if available)
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
     * Resolve a streaming URL with a 5s fallback to the provided fileUrl
     */
    async getStreamUrl(trackId: string, fallbackUrl?: string, timeoutMs: number = 5000): Promise<string> {
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        const streamRequest = apiClient.get<{ url?: string; streamUrl?: string; data?: string } | string>(
            ENDPOINTS.music.stream(trackId)
        );

        const timeoutPromise = new Promise<string>((resolve, reject) => {
            timeoutId = setTimeout(() => {
                if (fallbackUrl) {
                    resolve(fallbackUrl);
                } else {
                    reject(new Error('Stream request timed out'));
                }
            }, timeoutMs);
        });

        try {
            const result = await Promise.race([streamRequest, timeoutPromise]);

            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            if (typeof result === 'string') {
                return result;
            }

            if (result?.url) return result.url;
            if (result?.streamUrl) return result.streamUrl;
            if (result?.data) return result.data;

            if (fallbackUrl) return fallbackUrl;
            throw new Error('Stream URL not found');
        } catch (error) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            if (fallbackUrl) return fallbackUrl;
            throw error;
        }
    },
};
