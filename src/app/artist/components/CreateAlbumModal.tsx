'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateAlbumModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string, description?: string) => Promise<void>;
    isLoading?: boolean;
}

const CreateAlbumModal = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false
}: CreateAlbumModalProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Please enter an album title');
            return;
        }

        try {
            await onSubmit(title.trim(), description.trim() || undefined);
            setTitle('');
            setDescription('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create album');
        }
    };

    const handleClose = () => {
        setTitle('');
        setDescription('');
        setError('');
        onClose();
    };

    return (
        <div style={overlayStyle} onClick={handleClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <button style={closeButtonStyle} onClick={handleClose} disabled={isLoading}>
                    <X size={20} />
                </button>

                <h2 style={titleStyle}>Create New Album</h2>

                <form onSubmit={handleSubmit} style={formStyle}>
                    {error && <div style={errorStyle}>{error}</div>}

                    <div style={fieldStyle}>
                        <label style={labelStyle}>Album Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter album title"
                            style={inputStyle}
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>

                    <div style={fieldStyle}>
                        <label style={labelStyle}>Description (optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter album description"
                            style={textareaStyle}
                            disabled={isLoading}
                            rows={3}
                        />
                    </div>

                    <div style={buttonContainerStyle}>
                        <button
                            type="button"
                            style={cancelButtonStyle}
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                ...submitButtonStyle,
                                opacity: isLoading || !title.trim() ? 0.5 : 1,
                            }}
                            disabled={isLoading || !title.trim()}
                        >
                            {isLoading ? 'Creating...' : 'Create Album'}
                        </button>
                    </div>
                </form>
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
    maxWidth: '450px',
    width: '90%',
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
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
    textAlign: 'center'
};

const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
};

const errorStyle: React.CSSProperties = {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '0.5rem',
    padding: '0.75rem',
    color: '#ef4444',
    fontSize: '0.875rem'
};

const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
};

const labelStyle: React.CSSProperties = {
    color: '#aaa',
    fontSize: '0.875rem'
};

const inputStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none'
};

const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '80px'
};

const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '0.5rem'
};

const cancelButtonStyle: React.CSSProperties = {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'transparent',
    color: '#888',
    cursor: 'pointer',
    fontSize: '0.875rem'
};

const submitButtonStyle: React.CSSProperties = {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: '#1db954',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500
};

export default CreateAlbumModal;
