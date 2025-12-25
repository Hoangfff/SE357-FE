import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Shuffle, Plus, Trash, Clock, X } from '@/lib/icons';
import { playlistService } from '@/services/playlistService';
import { musicService, type MusicTrack } from '@/services/musicService';
import type { ApiPlaylist, PlaylistTrack } from '@/types';
import '@/styles/playlist-detail-page.css';
import { artistService } from '@/services/artistService';
import type { Track } from '@/types/artist';

// Format date
const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Confirm delete track modal
interface DeleteTrackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    trackTitle: string;
    isLoading?: boolean;
}

const DeleteTrackModal = ({ isOpen, onClose, onConfirm, trackTitle, isLoading }: DeleteTrackModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Remove Track</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X />
                    </button>
                </div>
                <div className="modal-body">
                    <p>Remove "<strong>{trackTitle}</strong>" from this playlist?</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn-cancel" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </button>
                    <button type="button" className="btn-delete" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? 'Removing...' : 'Remove'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Add track modal - select from available tracks
interface AddTrackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (trackId: number) => void;
    availableTracks: Track[];
    playlistTrackIds: number[];
    isLoading?: boolean;
    isLoadingTracks?: boolean;
}

const AddTrackModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    availableTracks, 
    playlistTrackIds,
    isLoading,
    isLoadingTracks 
}: AddTrackModalProps) => {
    const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setSelectedTrackId(null);
            setSearchQuery('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Filter out tracks already in the playlist and apply search
    const filteredTracks = availableTracks
        .filter(t => !playlistTrackIds.includes(t.id))
        .filter(t => 
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.fileUrl || '').toLowerCase().includes(searchQuery.toLowerCase())
        );

    const handleSubmit = () => {
        if (selectedTrackId) {
            onSubmit(selectedTrackId);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add Track to Playlist</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X />
                    </button>
                </div>
                <div className="modal-body">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tracks..."
                        className="search-input"
                    />
                    
                    <div className="tracks-select-list">
                        {isLoadingTracks ? (
                            <div className="tracks-loading">
                                <div className="loading-spinner"></div>
                                <p>Loading tracks...</p>
                            </div>
                        ) : filteredTracks.length === 0 ? (
                            <div className="tracks-empty">
                                <p>🎵</p>
                                <p>{searchQuery ? 'No tracks found' : 'No tracks available to add'}</p>
                            </div>
                        ) : (
                            filteredTracks.map(track => (
                                <div
                                    key={track.id}
                                    className={`track-select-item ${selectedTrackId === track.id ? 'selected' : ''}`}
                                    onClick={() => {
                                        if(selectedTrackId == track.id) setSelectedTrackId(null);
                                        else setSelectedTrackId(track.id)
                                    }}
                                >
                                    <div className="track-select-checkbox">
                                        {selectedTrackId === track.id && <span>✓</span>}
                                    </div>
                                    <div className="track-select-info">
                                        <span className="track-select-title">{track.title}</span>
                                        <span className="track-select-artist">
                                            
                                            {track.genre && ` • ${track.genre}`}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn-cancel" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        className="btn-submit" 
                        onClick={handleSubmit} 
                        disabled={!selectedTrackId || isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Add Track'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const PlaylistDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState<ApiPlaylist | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Delete track modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<PlaylistTrack | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Add track modal state
    const [isAddTrackModalOpen, setIsAddTrackModalOpen] = useState(false);
    const [availableTracks, setAvailableTracks] = useState<Track[]>([]);
    const [isLoadingTracks, setIsLoadingTracks] = useState(false);

    // Fetch playlist details
    const fetchPlaylist = useCallback(async () => {
        if (!id) return;
        try {
            setIsLoading(true);
            setError(null);
            const data = await playlistService.getPlaylistById(id);
            setPlaylist(data);
        } catch (err) {
            console.error('Failed to fetch playlist:', err);
            setError('Failed to load playlist. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    // Fetch available tracks for the add modal
    const fetchAvailableTracks = useCallback(async () => {
        try {
            setIsLoadingTracks(true);
            const tracks = await artistService.getArtistMusic();//musicService.getTracks
            setAvailableTracks(tracks);
        } catch (err) {
            console.error('Failed to fetch tracks:', err);
        } finally {
            setIsLoadingTracks(false);
        }
    }, []);

    useEffect(() => {
        fetchPlaylist();
    }, [fetchPlaylist]);

    // Open add track modal (fetch tracks first, then show modal) - matches album flow
    const openAddTrackModal = async () => {
        await fetchAvailableTracks();
        setIsAddTrackModalOpen(true);
    };

    // Remove track from playlist
    const handleRemoveTrack = async () => {
        if (!selectedTrack || !id) return;
        try {
            setIsSubmitting(true);
            await playlistService.removeTrackFromPlaylist(id, String(selectedTrack.track_id));
            setIsDeleteModalOpen(false);
            setSelectedTrack(null);
            fetchPlaylist();
        } catch (err) {
            console.error('Failed to remove track:', err);
            setError('Failed to remove track. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Open delete track modal
    const openDeleteModal = (track: PlaylistTrack, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedTrack(track);
        setIsDeleteModalOpen(true);
    };

    // Add track to playlist
    const handleAddTrack = async (trackId: number) => {
        if (!id) return;
        try {
            setIsSubmitting(true);
            await playlistService.addTrackToPlaylist(id, trackId);
            setIsAddTrackModalOpen(false);
            fetchPlaylist();
        } catch (err) {
            console.error('Failed to add track:', err);
            setError('Failed to add track. Please check the track ID and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate total duration
    const getTotalDuration = (): string => {
        if (!playlist?.playlistTracks.length) return '0 min';
        // Note: If tracks don't have duration, this won't work accurately
        const totalSeconds = playlist.playlistTracks.reduce((acc, _pt) => {
            // Assuming each track is about 3 minutes if no duration available
            return acc + 180;
        }, 0);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        if (hours > 0) {
            return `${hours} hr ${minutes} min`;
        }
        return `${minutes} min`;
    };

    // Get gradient color based on playlist id
    const getGradientColor = () => {
        const gradients = [
            'linear-gradient(180deg, #5038a0 0%, transparent 100%)',
            'linear-gradient(180deg, #f093fb 0%, transparent 100%)',
            'linear-gradient(180deg, #4facfe 0%, transparent 100%)',
            'linear-gradient(180deg, #43e97b 0%, transparent 100%)',
            'linear-gradient(180deg, #fa709a 0%, transparent 100%)',
            'linear-gradient(180deg, #a8edea 0%, transparent 100%)',
        ];
        const index = id ? parseInt(id) % gradients.length : 0;
        return gradients[index];
    };

    if (isLoading) {
        return (
            <div className="playlist-detail-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading playlist...</p>
                </div>
            </div>
        );
    }

    if (error || !playlist) {
        return (
            <div className="playlist-detail-page">
                <div className="error-container">
                    <h2>Something went wrong</h2>
                    <p>{error || 'Playlist not found'}</p>
                    <button onClick={() => navigate('/home/playlists')}>Back to Playlists</button>
                </div>
            </div>
        );
    }

    return (
        <div className="playlist-detail-page">
            {/* Header with gradient background */}
            <div className="playlist-header" style={{ background: getGradientColor() }}>
                <button className="back-btn" onClick={() => navigate('/home/playlists')}>
                    <ChevronLeft />
                </button>
                
                <div className="playlist-info">
                    <div className="playlist-cover">
                        {playlist.playlistTracks.length > 0 ? (
                            <div className="cover-grid">
                                {playlist.playlistTracks.slice(0, 4).map((pt, idx) => (
                                    <div key={idx} className="cover-cell">
                                        {pt.music?.artist_profiles?.photo_url ? (
                                            <img 
                                                src={pt.music.artist_profiles.photo_url} 
                                                alt="" 
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="cover-placeholder">🎵</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="cover-empty">🎵</div>
                        )}
                    </div>
                    
                    <div className="playlist-meta">
                        <span className="playlist-type">Playlist</span>
                        <h1 className="playlist-name">{playlist.name}</h1>
                        <div className="playlist-stats">
                            <span>{playlist.playlistTracks.length} {playlist.playlistTracks.length === 1 ? 'song' : 'songs'}</span>
                            <span className="dot">•</span>
                            <span>{getTotalDuration()}</span>
                            <span className="dot">•</span>
                            <span>Created {formatDate(playlist.creationDate)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="playlist-detail-actions">
                <button className="play-btn" disabled={playlist.playlistTracks.length === 0}>
                    <Play />
                </button>
                <button className="shuffle-btn" disabled={playlist.playlistTracks.length === 0}>
                    <Shuffle />
                </button>
                <button className="add-tracks-btn" onClick={openAddTrackModal}>
                    <Plus />
                    <span>Add Tracks</span>
                </button>
            </div>

            {/* Tracks list */}
            <div className="tracks-section">
                {playlist.playlistTracks.length === 0 ? (
                    <div className="empty-tracks">
                        <div className="empty-icon">🎵</div>
                        <h3>No tracks yet</h3>
                        <p>Start adding songs to your playlist</p>
                        <button className="add-first-track-btn" onClick={openAddTrackModal}>
                            <Plus />
                            <span>Add Track</span>
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="tracks-header">
                            <span className="col-number">#</span>
                            <span className="col-title">Title</span>
                            <span className="col-artist">Artist</span>
                            <span className="col-added">Added</span>
                            <span className="col-duration"><Clock /></span>
                            <span className="col-actions"></span>
                        </div>
                        
                        <div className="tracks-list">
                            {playlist.playlistTracks.map((pt, index) => (
                                <div key={pt.id} className="track-row">
                                    <span className="col-number">{index + 1}</span>
                                    <div className="col-title">
                                        <div className="track-info">
                                            <span className="track-name">{pt.music?.title || 'Unknown Track'}</span>
                                        </div>
                                    </div>
                                    <span className="col-artist">
                                        {pt.music?.artist_profiles?.stage_name || 'Unknown Artist'}
                                    </span>
                                    <span className="col-added">
                                        {formatDate(pt.added_at)}
                                    </span>
                                    <span className="col-duration">
                                        {/* Duration not available in API, show placeholder */}
                                        --:--
                                    </span>
                                    <div className="col-actions">
                                        <button 
                                            className="remove-btn" 
                                            onClick={(e) => openDeleteModal(pt, e)}
                                            title="Remove from playlist"
                                        >
                                            <Trash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Delete Track Modal */}
            <DeleteTrackModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedTrack(null);
                }}
                onConfirm={handleRemoveTrack}
                trackTitle={selectedTrack?.music?.title || 'this track'}
                isLoading={isSubmitting}
            />

            {/* Add Track Modal */}
            <AddTrackModal
                isOpen={isAddTrackModalOpen}
                onClose={() => setIsAddTrackModalOpen(false)}
                onSubmit={handleAddTrack}
                availableTracks={availableTracks}
                playlistTrackIds={playlist?.playlistTracks.map(pt => pt.track_id) || []}
                isLoading={isSubmitting}
                isLoadingTracks={isLoadingTracks}
            />
        </div>
    );
};

export default PlaylistDetailPage;
