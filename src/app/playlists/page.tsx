import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Trash, Edit, X } from '@/lib/icons';
import { playlistService } from '@/services/playlistService';
import type { ApiPlaylist } from '@/types';
import '@/styles/playlists-page.css';

// Modal for creating/editing playlist
interface PlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
    initialName?: string;
    title: string;
    isLoading?: boolean;
}

const PlaylistModal = ({ isOpen, onClose, onSubmit, initialName = '', title, isLoading }: PlaylistModalProps) => {
    const [name, setName] = useState(initialName);

    useEffect(() => {
        setName(initialName);
    }, [initialName]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name.trim());
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <label htmlFor="playlist-name">Playlist Name</label>
                        <input
                            id="playlist-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter playlist name"
                            autoFocus
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={!name.trim() || isLoading}>
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Confirm delete modal
interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    playlistName: string;
    isLoading?: boolean;
}

const DeleteModal = ({ isOpen, onClose, onConfirm, playlistName, isLoading }: DeleteModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Delete Playlist</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X />
                    </button>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to delete "<strong>{playlistName}</strong>"? This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn-cancel" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </button>
                    <button type="button" className="btn-delete" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const PlaylistsPage = () => {
    const navigate = useNavigate();
    const [playlists, setPlaylists] = useState<ApiPlaylist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState<ApiPlaylist | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch playlists
    const fetchPlaylists = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await playlistService.getPlaylists();
            setPlaylists(data);
        } catch (err) {
            console.error('Failed to fetch playlists:', err);
            setError('Failed to load playlists. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlaylists();
    }, [fetchPlaylists]);

    // Create playlist
    const handleCreatePlaylist = async (name: string) => {
        try {
            setIsSubmitting(true);
            await playlistService.createPlaylist({ name });
            setIsCreateModalOpen(false);
            fetchPlaylists();
        } catch (err) {
            console.error('Failed to create playlist:', err);
            setError('Failed to create playlist. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Edit playlist
    const handleEditPlaylist = async (name: string) => {
        if (!selectedPlaylist) return;
        try {
            setIsSubmitting(true);
            await playlistService.updatePlaylist(String(selectedPlaylist.id), { name });
            setIsEditModalOpen(false);
            setSelectedPlaylist(null);
            fetchPlaylists();
        } catch (err) {
            console.error('Failed to update playlist:', err);
            setError('Failed to update playlist. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete playlist
    const handleDeletePlaylist = async () => {
        if (!selectedPlaylist) return;
        try {
            setIsSubmitting(true);
            await playlistService.deletePlaylist(String(selectedPlaylist.id));
            setIsDeleteModalOpen(false);
            setSelectedPlaylist(null);
            fetchPlaylists();
        } catch (err) {
            console.error('Failed to delete playlist:', err);
            setError('Failed to delete playlist. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Open edit modal
    const openEditModal = (playlist: ApiPlaylist, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedPlaylist(playlist);
        setIsEditModalOpen(true);
    };

    // Open delete modal
    const openDeleteModal = (playlist: ApiPlaylist, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedPlaylist(playlist);
        setIsDeleteModalOpen(true);
    };

    // Navigate to playlist detail
    const handlePlaylistClick = (playlistId: number) => {
        navigate(`/home/playlists/${playlistId}`);
    };

    // Generate gradient colors for playlists without images
    const getGradientColor = (index: number) => {
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
            'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
        ];
        return gradients[index % gradients.length];
    };

    return (
        <div className="playlists-page">
            <div className="page-header">
                <h1>Playlists</h1>
                <button className="add-playlist-btn" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus />
                    <span>Create Playlist</span>
                </button>
            </div>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => fetchPlaylists()}>Try again</button>
                </div>
            )}

            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading playlists...</p>
                </div>
            ) : playlists.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🎵</div>
                    <h2>No playlists yet</h2>
                    <p>Create your first playlist to start organizing your music.</p>
                    <button className="add-playlist-btn" onClick={() => setIsCreateModalOpen(true)}>
                        <Plus />
                        <span>Create Playlist</span>
                    </button>
                </div>
            ) : (
                <div className="playlists-grid">
                    {playlists.map((playlist, index) => (
                        <div 
                            key={playlist.id} 
                            className="playlist-card"
                            onClick={() => handlePlaylistClick(playlist.id)}
                        >
                            <div className="playlist-image-container">
                                <div 
                                    className="playlist-image" 
                                    style={{ background: getGradientColor(index) }}
                                >
                                    {playlist.playlistTracks.length > 0 && playlist.playlistTracks[0]?.music?.artist_profiles?.photo_url ? (
                                        <img
                                            src={playlist.playlistTracks[0].music.artist_profiles.photo_url}
                                            alt={playlist.name}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="playlist-icon">🎵</div>
                                    )}
                                </div>
                                <button className="play-btn" onClick={(e) => e.stopPropagation()}>
                                    <Play />
                                </button>
                            </div>
                            <h3 className="playlist-title">{playlist.name}</h3>
                            <p className="playlist-meta">
                                {playlist.playlistTracks.length} {playlist.playlistTracks.length === 1 ? 'song' : 'songs'}
                            </p>
                            <div className="playlist-actions">
                                <button 
                                    className="action-btn edit-btn" 
                                    onClick={(e) => openEditModal(playlist, e)}
                                    title="Edit playlist"
                                >
                                    <Edit />
                                </button>
                                <button 
                                    className="action-btn delete-btn" 
                                    onClick={(e) => openDeleteModal(playlist, e)}
                                    title="Delete playlist"
                                >
                                    <Trash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Playlist Modal */}
            <PlaylistModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreatePlaylist}
                title="Create Playlist"
                isLoading={isSubmitting}
            />

            {/* Edit Playlist Modal */}
            <PlaylistModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedPlaylist(null);
                }}
                onSubmit={handleEditPlaylist}
                initialName={selectedPlaylist?.name || ''}
                title="Edit Playlist"
                isLoading={isSubmitting}
            />

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedPlaylist(null);
                }}
                onConfirm={handleDeletePlaylist}
                playlistName={selectedPlaylist?.name || ''}
                isLoading={isSubmitting}
            />
        </div>
    );
};

export default PlaylistsPage;
