'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface RejectReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
    isProcessing?: boolean;
}

const RejectReasonModal = ({
    isOpen,
    onClose,
    onSubmit,
    isProcessing = false
}: RejectReasonModalProps) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (reason.trim()) {
            onSubmit(reason.trim());
            setReason('');
        }
    };

    const handleClose = () => {
        setReason('');
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
                <h2 style={titleStyle}>Reject Application</h2>

                {/* Description */}
                <p style={descriptionStyle}>
                    Please provide a reason for rejecting this application. This will be sent to the applicant.
                </p>

                {/* Textarea */}
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter rejection reason..."
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
                            opacity: !reason.trim() || isProcessing ? 0.5 : 1,
                            cursor: !reason.trim() || isProcessing ? 'not-allowed' : 'pointer'
                        }}
                        onClick={handleSubmit}
                        disabled={!reason.trim() || isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Reject Application'}
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
    backgroundColor: 'var(--warning)',
    color: 'white',
    cursor: 'pointer'
};

export default RejectReasonModal;
