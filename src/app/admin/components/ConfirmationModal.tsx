'use client';

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'warning' | 'danger' | 'info';
}

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Yes',
    cancelText = 'No',
    type = 'warning'
}: ConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button style={closeButtonStyle} onClick={onClose}>
                    <X size={20} />
                </button>

                {/* Title */}
                <h2 style={titleStyle}>{title}</h2>

                {/* Warning Icon and Message */}
                <div style={contentStyle}>
                    <AlertTriangle
                        size={32}
                        color={type === 'danger' ? '#EF4444' : '#F59E0B'}
                    />
                    <p style={messageStyle}>{message}</p>
                </div>

                {/* Action Buttons */}
                <div style={buttonContainerStyle}>
                    <button style={cancelButtonStyle} onClick={onClose}>
                        {cancelText}
                    </button>
                    <button
                        style={{
                            ...confirmButtonStyle,
                            backgroundColor: type === 'danger' ? '#F59E0B' : 'var(--primary)'
                        }}
                        onClick={onConfirm}
                    >
                        {confirmText}
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
    zIndex: 1100 // Higher than ApplicationDetailsModal (1000)
};

const modalStyle: React.CSSProperties = {
    backgroundColor: 'var(--admin-card-bg)',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '400px',
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

const contentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '2rem'
};

const messageStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    lineHeight: 1.5,
    margin: 0
};

const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
};

const cancelButtonStyle: React.CSSProperties = {
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

const confirmButtonStyle: React.CSSProperties = {
    padding: '0.75rem 2rem',
    fontSize: '0.875rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--primary)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '100px'
};

export default ConfirmationModal;
