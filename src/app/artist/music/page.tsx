"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowUpDown, Filter, Grid, List, Loader2, MoreHorizontal, Music, Play, Search, Trash2, Upload as UploadIcon, X } from 'lucide-react';
import '@/styles/my-music-page.css';
import { artistService } from '@/services/artistService';
import { ENDPOINTS } from '@/config/api';
import { apiClient, type ApiError } from '@/lib/apiClient';
import type { Track } from '@/types/artist';
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

    // Upload modal state
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFormData, setUploadFormData] = useState({
        title: '',
        genre: '',
        description: '',
    });
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const audioInputRef = useRef<HTMLInputElement>(null);

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

    // Upload form handlers
    const handleUploadInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUploadFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setAudioFile(file);
    };

    const resetUploadForm = () => {
        setUploadFormData({ title: '', genre: '', description: '' });
        setAudioFile(null);
        if (audioInputRef.current) {
            audioInputRef.current.value = '';
        }
    };

    const handleUploadSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!audioFile) {
            alert('Please select an audio file.');
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', audioFile);
        formData.append('title', uploadFormData.title.trim());
        if (uploadFormData.genre.trim()) formData.append('genre', uploadFormData.genre.trim());
        if (uploadFormData.description.trim()) formData.append('description', uploadFormData.description.trim());

        try {
            const directUrl = 'https://music-share-system.onrender.com/artist/music';
            await apiClient.instance.post(directUrl, formData, { withCredentials: true });
            await fetchTracks();
            setIsUploadModalOpen(false);
            resetUploadForm();
        } catch (err) {
            const apiErr = err as ApiError;
            console.error('Direct upload failed, falling back to proxy...', apiErr);

            try {
                await apiClient.post(ENDPOINTS.artist.music, formData);
                await fetchTracks();
                setIsUploadModalOpen(false);
                resetUploadForm();
            } catch (proxyErr) {
                console.error('Failed to upload track via proxy:', proxyErr);
                alert('Failed to upload track. Please try again.');
            }
        } finally {
            setIsUploading(false);
        }
    };

    const isUploadFormValid = uploadFormData.title.trim() !== '' && audioFile !== null;

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

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

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
                <button
                    className="add-music-btn"
                    onClick={() => setIsUploadModalOpen(true)}
                    title="Upload new track"
                >
                    <span>+</span>
                </button>

                <div className="toolbar-right">
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

                    <button
                        className="toolbar-btn"
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        title="Sort"
                    >
                        <ArrowUpDown size={18} />
                        <span>Recent</span>
                    </button>

                    <button className="toolbar-btn" title="Filter">
                        <Filter size={18} />
                        <span>Filter: All</span>
                    </button>

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
                                            <img src="/placeholders/music-track.svg" alt="No cover" className="cover-placeholder" />
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
                                        <img src="/placeholders/music-track.svg" alt="No cover" className="cover-placeholder" />
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

            {/* Upload Track Modal */}
            {isUploadModalOpen && (
                <div className="modal-overlay" onClick={() => !isUploading && setIsUploadModalOpen(false)}>
                    <div className="modal-content upload-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Upload New Track</h2>
                            <button
                                className="modal-close-btn"
                                onClick={() => setIsUploadModalOpen(false)}
                                disabled={isUploading}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUploadSubmit} className="upload-form-modal">
                            {/* Track Details */}
                            <div className="form-section">
                                <label htmlFor="title" className="form-label">Track Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={uploadFormData.title}
                                    onChange={handleUploadInputChange}
                                    placeholder="Enter track title"
                                    className="form-input"
                                    required
                                    disabled={isUploading}
                                />
                            </div>

                            <div className="form-section">
                                <label htmlFor="genre" className="form-label">Genre</label>
                                <input
                                    type="text"
                                    id="genre"
                                    name="genre"
                                    value={uploadFormData.genre}
                                    onChange={handleUploadInputChange}
                                    placeholder="e.g., Pop, Rock, Jazz"
                                    className="form-input"
                                    disabled={isUploading}
                                />
                            </div>

                            <div className="form-section">
                                <label className="form-label" htmlFor="description">Description (Optional)</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={uploadFormData.description}
                                    onChange={handleUploadInputChange}
                                    className="form-textarea"
                                    placeholder="Add a short description"
                                    disabled={isUploading}
                                    rows={3}
                                />
                            </div>

                            {/* Audio File Upload */}
                            <div className="form-section">
                                <label className="form-label">Audio File *</label>
                                <input
                                    type="file"
                                    ref={audioInputRef}
                                    onChange={handleAudioChange}
                                    accept="audio/*"
                                    style={{ display: 'none' }}
                                    disabled={isUploading}
                                />
                                <div
                                    className={`file-upload-box ${audioFile ? 'has-file' : ''}`}
                                    onClick={() => !isUploading && audioInputRef.current?.click()}
                                >
                                    <UploadIcon size={24} />
                                    <p className="file-upload-text">
                                        {audioFile ? audioFile.name : 'Click to upload audio file'}
                                    </p>
                                    <p className="file-upload-hint">MP3, WAV, FLAC up to 50MB</p>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setIsUploadModalOpen(false)}
                                    disabled={isUploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={!isUploadFormValid || isUploading}
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 size={16} className="spinner" />
                                            Uploading...
                                        </>
                                    ) : (
                                        'Upload Track'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyMusicPage;
