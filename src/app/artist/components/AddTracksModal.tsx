'use client';

import React, { useState, useEffect } from 'react';
import { X, Music, Check, Loader2 } from 'lucide-react';
import type { Track } from '../../../types/artist';

interface AddTracksModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (trackIds: number[]) => Promise<void>;
    availableTracks: Track[];
    albumTracks: number[]; // IDs of tracks already in album
    isLoading?: boolean;
    isLoadingTracks?: boolean;
}

const AddTracksModal = ({
    isOpen,
    onClose,
    onSubmit,
    availableTracks,
    albumTracks,
    isLoading = false,
    isLoadingTracks = false
}: AddTracksModalProps) => {
    const [selectedTracks, setSelectedTracks] = useState<number[]>([]);
    const [error, setError] = useState('');

    // Reset selection when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedTracks([]);
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Filter out tracks already in album
    const tracksToAdd = availableTracks.filter(t => !albumTracks.includes(t.id));

    const toggleTrack = (trackId: number) => {
        setSelectedTracks(prev =>
            prev.includes(trackId)
                ? prev.filter(id => id !== trackId)
                : [...prev, trackId]
        );
    };

    const handleSubmit = async () => {
        if (selectedTracks.length === 0) {
            setError('Please select at least one track');
            return;
        }

        try {
            await onSubmit(selectedTracks);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add tracks');
        }
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <button style={closeButtonStyle} onClick={onClose} disabled={isLoading}>
                    <X size={20} />
                </button>

                <h2 style={titleStyle}>Add Tracks to Album</h2>

                {error && <div style={errorStyle}>{error}</div>}

                <div style={trackListContainerStyle}>
                    {isLoadingTracks ? (
                        <div style={loadingStyle}>
                            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
                            <span>Loading tracks...</span>
                        </div>
                    ) : tracksToAdd.length === 0 ? (
                        <div style={emptyStyle}>
                            <Music size={32} />
                            <p>No tracks available to add</p>
                            <p style={{ fontSize: '0.75rem', color: '#666' }}>
                                All your tracks are already in this album
                            </p>
                        </div>
                    ) : (
                        tracksToAdd.map(track => (
                            <div
                                key={track.id}
                                style={{
                                    ...trackItemStyle,
                                    backgroundColor: selectedTracks.includes(track.id)
                                        ? 'rgba(29, 185, 84, 0.15)'
                                        : 'transparent',
                                    borderColor: selectedTracks.includes(track.id)
                                        ? '#1db954'
                                        : 'rgba(255, 255, 255, 0.1)'
                                }}
                                onClick={() => toggleTrack(track.id)}
                            >
                                <div style={checkboxStyle}>
                                    {selectedTracks.includes(track.id) && (
                                        <Check size={14} color="#1db954" />
                                    )}
                                </div>
                                <div style={trackInfoStyle}>
                                    <span style={trackTitleStyle}>{track.title}</span>
                                    <span style={trackMetaStyle}>
                                        {track.genre || 'Unknown genre'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div style={buttonContainerStyle}>
                    <span style={selectedCountStyle}>
                        {selectedTracks.length} track(s) selected
                    </span>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            style={cancelButtonStyle}
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            style={{
                                ...submitButtonStyle,
                                opacity: isLoading || selectedTracks.length === 0 ? 0.5 : 1,
                            }}
                            onClick={handleSubmit}
                            disabled={isLoading || selectedTracks.length === 0}
                        >
                            {isLoading ? 'Adding...' : 'Add Tracks'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
};

const modalStyle: React.CSSProperties = {
    backgroundColor: '#1e1e2e',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    border: '1px solid rgba(255, 255, 255, 0.1)'
};

const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'transparent',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    padding: '0.25rem'
};

const titleStyle: React.CSSProperties = {
    color: '#fff',
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1rem'
};

const errorStyle: React.CSSProperties = {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '0.5rem',
    padding: '0.75rem',
    color: '#ef4444',
    fontSize: '0.875rem',
    marginBottom: '1rem'
};

const trackListContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    marginBottom: '1rem',
    maxHeight: '300px'
};

const loadingStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '2rem',
    color: '#888'
};

const emptyStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '2rem',
    color: '#888'
};

const trackItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

const checkboxStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
};

const trackInfoStyle: React.CSSProperties = {
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

const trackMetaStyle: React.CSSProperties = {
    color: '#888',
    fontSize: '0.75rem'
};

const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '0.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
};

const selectedCountStyle: React.CSSProperties = {
    color: '#888',
    fontSize: '0.875rem'
};

const cancelButtonStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'transparent',
    color: '#888',
    cursor: 'pointer',
    fontSize: '0.875rem'
};

const submitButtonStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: '#1db954',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.875rem'
};

export default AddTracksModal;
