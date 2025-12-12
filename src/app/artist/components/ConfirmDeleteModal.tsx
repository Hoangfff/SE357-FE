'use client';

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isLoading?: boolean;
}

const ConfirmDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    isLoading = false
}: ConfirmDeleteModalProps) => {
    if (!isOpen) return null;

    return (
        <div style={overlayStyle} onClick={isLoading ? undefined : onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <button style={closeButtonStyle} onClick={onClose} disabled={isLoading}>
                    <X size={20} />
                </button>

                <div style={contentStyle}>
                    <AlertTriangle size={40} color="#f59e0b" />
                    <h2 style={titleStyle}>{title}</h2>
                    <p style={messageStyle}>{message}</p>
                </div>

                <div style={buttonContainerStyle}>
                    <button
                        style={cancelButtonStyle}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        style={{
                            ...deleteButtonStyle,
                            opacity: isLoading ? 0.5 : 1
                        }}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001
};

const modalStyle: React.CSSProperties = {
    backgroundColor: '#1e1e2e',
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
    color: '#888',
    cursor: 'pointer',
    padding: '0.25rem'
};

const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem'
};

const titleStyle: React.CSSProperties = {
    color: '#fff',
    fontSize: '1.25rem',
    fontWeight: 600,
    margin: 0
};

const messageStyle: React.CSSProperties = {
    color: '#888',
    fontSize: '0.9rem',
    margin: 0
};

const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
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

const deleteButtonStyle: React.CSSProperties = {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: '#ef4444',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.875rem'
};

export default ConfirmDeleteModal;
