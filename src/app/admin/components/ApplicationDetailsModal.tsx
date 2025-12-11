'use client';

import React from 'react';
import { X } from 'lucide-react';

interface Application {
    id: string;
    userId: string;
    createdAt: string;
    stageName: string;
    socialLink: string;
    name?: string;
}

interface ApplicationDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    application: Application | null;
    onApprove: () => void;
    onDecline: () => void;
}

const ApplicationDetailsModal = ({
    isOpen,
    onClose,
    application,
    onApprove,
    onDecline
}: ApplicationDetailsModalProps) => {
    if (!isOpen || !application) return null;

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button style={closeButtonStyle} onClick={onClose}>
                    <X size={20} />
                </button>

                {/* Title */}
                <h2 style={titleStyle}>Application Details</h2>

                {/* Form Fields */}
                <div style={formContainerStyle}>
                    <div style={inputGroupStyle}>
                        <input
                            type="text"
                            value={application.name || application.stageName}
                            readOnly
                            style={inputStyle}
                        />
                        <span style={inputLabelStyle}>Name</span>
                    </div>

                    <div style={inputGroupStyle}>
                        <input
                            type="text"
                            value={application.createdAt}
                            readOnly
                            style={inputStyle}
                        />
                        <span style={inputLabelStyle}>Created At</span>
                    </div>

                    <div style={inputGroupStyle}>
                        <input
                            type="text"
                            value={application.stageName}
                            readOnly
                            style={inputStyle}
                        />
                        <span style={inputLabelStyle}>Stage Name</span>
                    </div>

                    <div style={inputGroupStyle}>
                        <input
                            type="text"
                            value={application.socialLink}
                            readOnly
                            style={inputStyle}
                        />
                        <span style={inputLabelStyle}>Socials</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={buttonContainerStyle}>
                    <button style={declineButtonStyle} onClick={onDecline}>
                        Decline
                    </button>
                    <button style={approveButtonStyle} onClick={onApprove}>
                        Approve
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
    zIndex: 1000
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
    fontSize: '1.5rem',
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: '2rem',
    fontStyle: 'italic'
};

const formContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem'
};

const inputGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    border: '1px solid var(--primary)',
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem'
};

const inputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    width: '100%'
};

const inputLabelStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap'
};

const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
};

const declineButtonStyle: React.CSSProperties = {
    padding: '0.75rem 2rem',
    fontSize: '0.875rem',
    border: '1px solid var(--warning)',
    borderRadius: '0.5rem',
    backgroundColor: 'transparent',
    color: 'var(--warning)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '120px'
};

const approveButtonStyle: React.CSSProperties = {
    padding: '0.75rem 2rem',
    fontSize: '0.875rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--primary)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '120px'
};

export default ApplicationDetailsModal;
