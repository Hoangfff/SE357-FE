'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Search, List, Grid, ArrowUpDown, Filter, Trash2, MoreHorizontal, Loader2, Music } from 'lucide-react';
import '../../../styles/my-music-page.css';
import { artistService } from '../../../services/artistService';
import type { Track } from '../../../types/artist';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

type ViewMode = 'list' | 'grid';
type SortField = 'title' | 'createdAt' | 'voteCount';
type SortOrder = 'asc' | 'desc';

const MyMusicPage = () => {
    // Data state
    const [tracks, setTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // UI state
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField] = useState<SortField>('createdAt');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    // Delete modal state
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        trackId: number | null;
        title: string;
    }>({ isOpen: false, trackId: null, title: '' });

    // Fetch tracks
    const fetchTracks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await artistService.getArtistMusic();
            setTracks(data);
        } catch (err) {
            console.error('Failed to fetch tracks:', err);
            setError('Failed to load tracks. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTracks();
    }, [fetchTracks]);

    // Delete track handler
    const handleDeleteTrack = async () => {
        if (!deleteModal.trackId) return;
        setIsDeleting(true);
        try {
            await artistService.deleteTrack(deleteModal.trackId);
            await fetchTracks();
            setDeleteModal({ isOpen: false, trackId: null, title: '' });
        } catch (err) {
            console.error('Failed to delete track:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    // Play track handler
    const handlePlayTrack = (track: Track) => {
        artistService.playAlbum([track]);
    };

    // Filter and sort tracks
    const filteredTracks = tracks
        .filter(track =>
            track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            track.genre?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'createdAt':
                    comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    break;
                case 'voteCount':
                    comparison = a.voteCount - b.voteCount;
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

    // Format duration (placeholder - would need actual duration from track)
    const formatDuration = (seconds?: number) => {
        if (!seconds) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Get album name from track
    const getAlbumName = (track: Track) => {
        if (track.albumTracks && track.albumTracks.length > 0 && track.albumTracks[0].albums) {
            return track.albumTracks[0].albums.title;
        }
        return 'Single';
    };

    if (isLoading) {
        return (
            <div className="my-music-page">
                <div className="loading-container">
                    <Loader2 size={40} className="spinner" />
                    <p>Loading tracks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-music-page">
            {/* Toolbar */}
            <div className="music-toolbar">
                <button className="add-music-btn">
                    <span>+</span>
                </button>

                <div className="toolbar-right">
                    {/* View Toggle */}
                    <div className="view-toggle">
                        <button
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            title="List view"
                        >
                            <List size={18} />
                        </button>
                        <button
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Grid view"
                        >
                            <Grid size={18} />
                        </button>
                    </div>

                    {/* Sort */}
                    <button
                        className="toolbar-btn"
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        title="Sort"
                    >
                        <ArrowUpDown size={18} />
                        <span>Recent</span>
                    </button>

                    {/* Filter */}
                    <button className="toolbar-btn" title="Filter">
                        <Filter size={18} />
                        <span>Filter: All</span>
                    </button>

                    {/* Search */}
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={fetchTracks}>Retry</button>
                </div>
            )}

            {/* Track List */}
            {viewMode === 'list' ? (
                <div className="tracks-table">
                    {/* Table Header */}
                    <div className="table-header">
                        <div className="col-number">#</div>
                        <div className="col-title">Title</div>
                        <div className="col-album">Album</div>
                        <div className="col-duration">Duration</div>
                        <div className="col-actions"></div>
                    </div>

                    {/* Track Rows */}
                    {filteredTracks.length === 0 ? (
                        <div className="empty-state">
                            <Music size={48} />
                            <h3>No tracks found</h3>
                            <p>{searchQuery ? 'Try a different search term' : 'Upload your first track to get started'}</p>
                        </div>
                    ) : (
                        filteredTracks.map((track, index) => (
                            <div key={track.id} className="track-row">
                                <div className="col-number">
                                    <span className="track-number">{index + 1}</span>
                                    <button
                                        className="play-btn-small"
                                        onClick={() => handlePlayTrack(track)}
                                    >
                                        <Play size={14} />
                                    </button>
                                </div>

                                <div className="col-title">
                                    <div className="track-cover">
                                        {track.albumTracks?.[0]?.albums?.coverUrl ? (
                                            <img src={track.albumTracks[0].albums.coverUrl} alt={track.title} />
                                        ) : (
                                            <div className="cover-placeholder">
                                                <Music size={16} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="track-info">
                                        <span className="track-title">{track.title}</span>
                                        <span className="track-artist">{track.genre || 'Unknown Genre'}</span>
                                    </div>
                                </div>

                                <div className="col-album">
                                    <span>{getAlbumName(track)}</span>
                                </div>

                                <div className="col-duration">
                                    <span>{formatDuration()}</span>
                                </div>

                                <div className="col-actions">
                                    <button
                                        className="action-btn delete"
                                        onClick={() => setDeleteModal({
                                            isOpen: true,
                                            trackId: track.id,
                                            title: track.title
                                        })}
                                        title="Delete track"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <button className="action-btn" title="More options">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                /* Grid View */
                <div className="tracks-grid">
                    {filteredTracks.length === 0 ? (
                        <div className="empty-state">
                            <Music size={48} />
                            <h3>No tracks found</h3>
                            <p>{searchQuery ? 'Try a different search term' : 'Upload your first track to get started'}</p>
                        </div>
                    ) : (
                        filteredTracks.map((track) => (
                            <div key={track.id} className="track-card">
                                <div className="track-card-cover">
                                    {track.albumTracks?.[0]?.albums?.coverUrl ? (
                                        <img src={track.albumTracks[0].albums.coverUrl} alt={track.title} />
                                    ) : (
                                        <div className="cover-placeholder">
                                            <Music size={32} />
                                        </div>
                                    )}
                                    <button
                                        className="play-btn-overlay"
                                        onClick={() => handlePlayTrack(track)}
                                    >
                                        <Play size={24} />
                                    </button>
                                </div>
                                <div className="track-card-info">
                                    <h4>{track.title}</h4>
                                    <p>{track.genre || 'Unknown Genre'}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, trackId: null, title: '' })}
                onConfirm={handleDeleteTrack}
                title="Delete Track?"
                message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default MyMusicPage;
