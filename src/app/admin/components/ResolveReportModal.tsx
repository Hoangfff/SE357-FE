'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ResolveReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (notes: string) => void;
    isProcessing?: boolean;
}

const ResolveReportModal = ({
    isOpen,
    onClose,
    onSubmit,
    isProcessing = false
}: ResolveReportModalProps) => {
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(notes.trim() || 'Resolved by admin');
        setNotes('');
    };

    const handleClose = () => {
        setNotes('');
        onClose();
    };

    return (
        <div style={overlayStyle} onClick={handleClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button style={closeButtonStyle} onClick={handleClose} disabled={isProcessing}>
                    <X size={20} />
                </button>

                {/* Title */}
                <h2 style={titleStyle}>Resolve Report</h2>

                {/* Description */}
                <p style={descriptionStyle}>
                    Add optional notes about how this report was resolved.
                </p>

                {/* Textarea */}
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter resolution notes (optional)..."
                    style={textareaStyle}
                    rows={4}
                    disabled={isProcessing}
                />

                {/* Buttons */}
                <div style={buttonContainerStyle}>
                    <button
                        style={cancelButtonStyle}
                        onClick={handleClose}
                        disabled={isProcessing}
                    >
                        Cancel
                    </button>
                    <button
                        style={{
                            ...submitButtonStyle,
                            opacity: isProcessing ? 0.5 : 1,
                            cursor: isProcessing ? 'not-allowed' : 'pointer'
                        }}
                        onClick={handleSubmit}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Mark as Resolved'}
                    </button>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001
};

const modalStyle: React.CSSProperties = {
    backgroundColor: 'var(--admin-card-bg)',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '500px',
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
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '0.25rem'
};

const titleStyle: React.CSSProperties = {
    color: 'var(--text-primary)',
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.5rem'
};

const descriptionStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    marginBottom: '1.5rem'
};

const textareaStyle: React.CSSProperties = {
    width: '100%',
    padding: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    resize: 'vertical',
    outline: 'none',
    marginBottom: '1.5rem'
};

const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end'
};

const cancelButtonStyle: React.CSSProperties = {
    padding: '0.75rem 1.5rem',
    fontSize: '0.875rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.5rem',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer'
};

const submitButtonStyle: React.CSSProperties = {
    padding: '0.75rem 1.5rem',
    fontSize: '0.875rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--primary)',
    color: 'white',
    cursor: 'pointer'
};

export default ResolveReportModal;
