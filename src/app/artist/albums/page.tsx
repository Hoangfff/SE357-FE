'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Shuffle, Plus, Trash2, ChevronRight, ChevronDown, Loader2, Music } from 'lucide-react';
import '../../../styles/my-albums-page.css';
import { artistService } from '../../../services/artistService';
import type { Album, Track } from '../../../types/artist';
import CreateAlbumModal from '../components/CreateAlbumModal';
import AddTracksModal from '../components/AddTracksModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const MyAlbumsPage = () => {
    // Data state
    const [albums, setAlbums] = useState<Album[]>([]);
    const [artistTracks, setArtistTracks] = useState<Track[]>([]);

    // Loading states
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingTracks, setIsLoadingTracks] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Expanded album state
    const [expandedAlbumId, setExpandedAlbumId] = useState<number | null>(null);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddTracksModalOpen, setIsAddTracksModalOpen] = useState(false);
    const [selectedAlbumForTracks, setSelectedAlbumForTracks] = useState<Album | null>(null);
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        type: 'album' | 'track';
        albumId: number | null;
        trackId: number | null;
        title: string;
    }>({ isOpen: false, type: 'album', albumId: null, trackId: null, title: '' });

    // Fetch albums
    const fetchAlbums = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await artistService.getAlbums();
            setAlbums(data);
        } catch (err) {
            console.error('Failed to fetch albums:', err);
            setError('Failed to load albums. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch artist tracks (for add to album modal)
    const fetchArtistTracks = useCallback(async () => {
        setIsLoadingTracks(true);
        try {
            const data = await artistService.getArtistMusic();
            setArtistTracks(data);
        } catch (err) {
            console.error('Failed to fetch tracks:', err);
        } finally {
            setIsLoadingTracks(false);
        }
    }, []);

    useEffect(() => {
        fetchAlbums();
    }, [fetchAlbums]);

    // Handlers
    const handleCreateAlbum = async (title: string, description?: string) => {
        setIsProcessing(true);
        try {
            await artistService.createAlbum({ title, description });
            await fetchAlbums();
            setIsCreateModalOpen(false);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteAlbum = async () => {
        if (!deleteModal.albumId) return;
        setIsProcessing(true);
        try {
            await artistService.deleteAlbum(deleteModal.albumId);
            await fetchAlbums();
            setDeleteModal({ isOpen: false, type: 'album', albumId: null, trackId: null, title: '' });
        } catch (err) {
            console.error('Failed to delete album:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleOpenAddTracks = async (album: Album) => {
        setSelectedAlbumForTracks(album);
        await fetchArtistTracks();
        setIsAddTracksModalOpen(true);
    };

    const handleAddTracks = async (trackIds: number[]) => {
        if (!selectedAlbumForTracks) return;
        setIsProcessing(true);
        try {
            await artistService.addTracksToAlbum(selectedAlbumForTracks.id, trackIds);
            await fetchAlbums();
            setIsAddTracksModalOpen(false);
            setSelectedAlbumForTracks(null);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRemoveTrack = async () => {
        if (!deleteModal.albumId || !deleteModal.trackId) return;
        setIsProcessing(true);
        try {
            await artistService.removeTrackFromAlbum(deleteModal.albumId, deleteModal.trackId);
            await fetchAlbums();
            setDeleteModal({ isOpen: false, type: 'album', albumId: null, trackId: null, title: '' });
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePlayAlbum = (album: Album) => {
        const tracks = album.albumTracks?.map(at => at.music).filter(Boolean) as Track[];
        if (tracks.length > 0) {
            artistService.playAlbum(tracks);
        }
    };

    const handleShufflePlay = (album: Album) => {
        const tracks = album.albumTracks?.map(at => at.music).filter(Boolean) as Track[];
        if (tracks.length > 0) {
            artistService.shuffleAlbum(tracks);
        }
    };

    const toggleExpand = (albumId: number) => {
        setExpandedAlbumId(prev => prev === albumId ? null : albumId);
    };

    const formatDuration = (tracks: number) => {
        // Placeholder - would calculate from actual track durations
        return `${tracks} song${tracks !== 1 ? 's' : ''}`;
    };

    if (isLoading) {
        return (
            <div className="my-albums-page">
                <div style={loadingContainerStyle}>
                    <Loader2 size={40} style={{ animation: 'spin 1s linear infinite' }} />
                    <p>Loading albums...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-albums-page">
            {/* Header with Create Button */}
            <div className="my-albums-header">
                <h1>My Albums</h1>
                <button className="create-album-btn" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={20} />
                    <span>Create New Album</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div style={errorStyle}>
                    {error}
                    <button onClick={fetchAlbums} style={retryButtonStyle}>Retry</button>
                </div>
            )}

            {/* Albums List */}
            <div className="my-albums-list">
                {albums.length === 0 ? (
                    <div style={emptyStateStyle}>
                        <Music size={48} color="#888" />
                        <h3>No Albums Yet</h3>
                        <p>Create your first album to organize your music</p>
                        <button
                            className="create-album-btn"
                            onClick={() => setIsCreateModalOpen(true)}
                            style={{ marginTop: '1rem' }}
                        >
                            <Plus size={20} />
                            <span>Create Album</span>
                        </button>
                    </div>
                ) : (
                    albums.map((album) => {
                        const isExpanded = expandedAlbumId === album.id;
                        const trackCount = album.albumTracks?.length || 0;
                        const trackIds = album.albumTracks?.map(at => at.trackId) || [];

                        return (
                            <div key={album.id} className="album-section">
                                <div className="album-row" onClick={() => toggleExpand(album.id)}>
                                    {/* Album Cover */}
                                    <div className="album-cover">
                                        {album.coverUrl ? (
                                            <img src={album.coverUrl} alt={album.title} />
                                        ) : (
                                            <div style={placeholderCoverStyle}>
                                                <Music size={24} color="#888" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Album Info */}
                                    <div className="album-info">
                                        <h3 className="album-row-title">{album.title}</h3>
                                        <p className="album-meta">
                                            <span>{new Date(album.createdAt).getFullYear()}</span>
                                            <span>{formatDuration(trackCount)}</span>
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="album-actions" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="action-btn play-btn"
                                            title="Play"
                                            onClick={() => handlePlayAlbum(album)}
                                            disabled={trackCount === 0}
                                        >
                                            <Play size={18} />
                                        </button>

                                        <button
                                            className="action-btn shuffle-btn"
                                            title="Shuffle"
                                            onClick={() => handleShufflePlay(album)}
                                            disabled={trackCount === 0}
                                        >
                                            <Shuffle size={18} />
                                        </button>

                                        <button
                                            className="action-btn"
                                            title="Add tracks"
                                            onClick={() => handleOpenAddTracks(album)}
                                        >
                                            <Plus size={18} />
                                        </button>

                                        <button
                                            className="action-btn delete-btn"
                                            title="Delete album"
                                            onClick={() => setDeleteModal({
                                                isOpen: true,
                                                type: 'album',
                                                albumId: album.id,
                                                trackId: null,
                                                title: album.title
                                            })}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Expand Arrow */}
                                    <div className="album-expand">
                                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    </div>
                                </div>

                                {/* Expanded Track List */}
                                {isExpanded && (
                                    <div style={trackListStyle}>
                                        {trackCount === 0 ? (
                                            <div style={noTracksStyle}>
                                                <p>No tracks in this album</p>
                                                <button
                                                    style={addTracksButtonStyle}
                                                    onClick={() => handleOpenAddTracks(album)}
                                                >
                                                    <Plus size={16} /> Add Tracks
                                                </button>
                                            </div>
                                        ) : (
                                            album.albumTracks?.sort((a, b) => a.trackOrder - b.trackOrder).map((at, index) => (
                                                <div key={at.id} style={trackRowStyle}>
                                                    <span style={trackNumberStyle}>{index + 1}</span>
                                                    <div style={trackDetailsStyle}>
                                                        <span style={trackTitleStyle}>{at.music?.title || 'Unknown'}</span>
                                                        <span style={trackGenreStyle}>{at.music?.genre || ''}</span>
                                                    </div>
                                                    <button
                                                        style={removeTrackButtonStyle}
                                                        onClick={() => setDeleteModal({
                                                            isOpen: true,
                                                            type: 'track',
                                                            albumId: album.id,
                                                            trackId: at.trackId,
                                                            title: at.music?.title || 'this track'
                                                        })}
                                                        title="Remove from album"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Create Album Modal */}
            <CreateAlbumModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateAlbum}
                isLoading={isProcessing}
            />

            {/* Add Tracks Modal */}
            <AddTracksModal
                isOpen={isAddTracksModalOpen}
                onClose={() => {
                    setIsAddTracksModalOpen(false);
                    setSelectedAlbumForTracks(null);
                }}
                onSubmit={handleAddTracks}
                availableTracks={artistTracks}
                albumTracks={selectedAlbumForTracks?.albumTracks?.map(at => at.trackId) || []}
                isLoading={isProcessing}
                isLoadingTracks={isLoadingTracks}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, type: 'album', albumId: null, trackId: null, title: '' })}
                onConfirm={deleteModal.type === 'album' ? handleDeleteAlbum : handleRemoveTrack}
                title={deleteModal.type === 'album' ? 'Delete Album?' : 'Remove Track?'}
                message={
                    deleteModal.type === 'album'
                        ? `Are you sure you want to delete "${deleteModal.title}"? This will not delete the tracks themselves.`
                        : `Remove "${deleteModal.title}" from this album?`
                }
                isLoading={isProcessing}
            />
        </div>
    );
};

// Additional styles
const loadingContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    gap: '1rem',
    color: '#888'
};

const errorStyle: React.CSSProperties = {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '0.5rem',
    padding: '1rem',
    color: '#ef4444',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
};

const retryButtonStyle: React.CSSProperties = {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer'
};

const emptyStateStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    textAlign: 'center',
    color: '#888'
};

const placeholderCoverStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
};

const trackListStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '0.5rem 1rem 0.5rem 4rem',
    borderRadius: '0 0 0.5rem 0.5rem'
};

const noTracksStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1.5rem',
    color: '#888',
    gap: '0.75rem'
};

const addTracksButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#1db954',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem'
};

const trackRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 0.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    gap: '1rem'
};

const trackNumberStyle: React.CSSProperties = {
    color: '#888',
    fontSize: '0.875rem',
    width: '24px',
    textAlign: 'center'
};

const trackDetailsStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    overflow: 'hidden'
};

const trackTitleStyle: React.CSSProperties = {
    color: '#fff',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
};

const trackGenreStyle: React.CSSProperties = {
    color: '#888',
    fontSize: '0.75rem'
};

const removeTrackButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    padding: '0.25rem',
    opacity: 0.6,
    transition: 'opacity 0.2s'
};

export default MyAlbumsPage;
