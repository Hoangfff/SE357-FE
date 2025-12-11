'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface DeleteReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (reason: string) => void;
    title?: string;
}

const DeleteReasonModal = ({
    isOpen,
    onClose,
    onDelete,
    title = 'Delete Music'
}: DeleteReasonModalProps) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleDelete = () => {
        if (reason.trim()) {
            onDelete(reason);
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
                <button style={closeButtonStyle} onClick={handleClose}>
                    <X size={20} />
                </button>

                {/* Title */}
                <h2 style={titleStyle}>{title}</h2>

                {/* Reason Input */}
                <div style={formContainerStyle}>
                    <label style={labelStyle}>Provide reason*</label>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Duplicate upload"
                        style={inputStyle}
                    />
                </div>

                {/* Action Buttons */}
                <div style={buttonContainerStyle}>
                    <button style={deleteButtonStyle} onClick={handleDelete}>
                        Delete
                    </button>
                    <button style={cancelButtonStyle} onClick={handleClose}>
                        Cancel
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
    zIndex: 1050 // Between details modal (1000) and confirmation (1100)
};

const modalStyle: React.CSSProperties = {
    backgroundColor: 'var(--admin-card-bg)',
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
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '0.25rem'
};

const titleStyle: React.CSSProperties = {
    color: 'var(--text-primary)',
    fontSize: '1.5rem',
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: '1.5rem'
};

const formContainerStyle: React.CSSProperties = {
    marginBottom: '2rem'
};

const labelStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    display: 'block',
    marginBottom: '0.5rem'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    border: '1px solid var(--primary)',
    borderRadius: '0.5rem',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    outline: 'none'
};

const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
};

const deleteButtonStyle: React.CSSProperties = {
    padding: '0.75rem 2rem',
    fontSize: '0.875rem',
    border: '1px solid var(--primary)',
    borderRadius: '0.5rem',
    backgroundColor: 'transparent',
    color: 'var(--primary)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '100px'
};

const cancelButtonStyle: React.CSSProperties = {
    padding: '0.75rem 2rem',
    fontSize: '0.875rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--warning)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '100px'
};

export default DeleteReasonModal;
