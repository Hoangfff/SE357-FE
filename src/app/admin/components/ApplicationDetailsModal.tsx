'use client';

import React from 'react';
import { X, User, Mail, Calendar, Music, Link } from 'lucide-react';
import type { ArtistApplication } from '../../../types/admin';

interface ApplicationDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    application: ArtistApplication | null;
    onApprove: () => void;
    onDecline: () => void;
    showActions?: boolean;
}

const ApplicationDetailsModal = ({
    isOpen,
    onClose,
    application,
    onApprove,
    onDecline,
    showActions = true
}: ApplicationDetailsModalProps) => {
    if (!isOpen || !application) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Parse social links if it's a JSON string
    const parseSocialLinks = (links?: string) => {
        if (!links) return null;
        try {
            const parsed = JSON.parse(links);
            return parsed;
        } catch {
            return links;
        }
    };

    const socialLinks = parseSocialLinks(application.socialLinks);

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button style={closeButtonStyle} onClick={onClose}>
                    <X size={20} />
                </button>

                {/* Title */}
                <h2 style={titleStyle}>Application Details</h2>

                {/* Application Photo */}
                {application.photoUrl && (
                    <div style={photoContainerStyle}>
                        <img
                            src={application.photoUrl}
                            alt={application.stageName}
                            style={photoStyle}
                        />
                    </div>
                )}

                {/* Form Fields */}
                <div style={formContainerStyle}>
                    {/* Stage Name */}
                    <div style={fieldGroupStyle}>
                        <div style={fieldIconStyle}>
                            <Music size={16} />
                        </div>
                        <div style={fieldContentStyle}>
                            <span style={fieldLabelStyle}>Stage Name</span>
                            <span style={fieldValueStyle}>{application.stageName}</span>
                        </div>
                    </div>

                    {/* User Info */}
                    {application.users && (
                        <>
                            <div style={fieldGroupStyle}>
                                <div style={fieldIconStyle}>
                                    <User size={16} />
                                </div>
                                <div style={fieldContentStyle}>
                                    <span style={fieldLabelStyle}>Applicant Name</span>
                                    <span style={fieldValueStyle}>{application.users.name}</span>
                                </div>
                            </div>

                            <div style={fieldGroupStyle}>
                                <div style={fieldIconStyle}>
                                    <Mail size={16} />
                                </div>
                                <div style={fieldContentStyle}>
                                    <span style={fieldLabelStyle}>Email</span>
                                    <span style={fieldValueStyle}>{application.users.email}</span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Created At */}
                    <div style={fieldGroupStyle}>
                        <div style={fieldIconStyle}>
                            <Calendar size={16} />
                        </div>
                        <div style={fieldContentStyle}>
                            <span style={fieldLabelStyle}>Submitted On</span>
                            <span style={fieldValueStyle}>{formatDate(application.createdAt)}</span>
                        </div>
                    </div>

                    {/* Social Links */}
                    {socialLinks && (
                        <div style={fieldGroupStyle}>
                            <div style={fieldIconStyle}>
                                <Link size={16} />
                            </div>
                            <div style={fieldContentStyle}>
                                <span style={fieldLabelStyle}>Social Links</span>
                                <span style={fieldValueStyle}>
                                    {typeof socialLinks === 'string'
                                        ? socialLinks
                                        : JSON.stringify(socialLinks, null, 2)
                                    }
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Bio */}
                    {application.bio && (
                        <div style={bioContainerStyle}>
                            <span style={fieldLabelStyle}>Bio</span>
                            <p style={bioTextStyle}>{application.bio}</p>
                        </div>
                    )}

                    {/* Status Badge */}
                    <div style={statusContainerStyle}>
                        <span style={fieldLabelStyle}>Status</span>
                        <span style={{
                            ...statusBadgeStyle,
                            backgroundColor: getStatusColor(application.status)
                        }}>
                            {application.status}
                        </span>
                    </div>

                    {/* Rejection Reason (if rejected) */}
                    {application.status === 'REJECTED' && application.rejectionReason && (
                        <div style={rejectionContainerStyle}>
                            <span style={fieldLabelStyle}>Rejection Reason</span>
                            <p style={rejectionTextStyle}>{application.rejectionReason}</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons - Only show for pending applications */}
                {showActions && application.status === 'PENDING' && (
                    <div style={buttonContainerStyle}>
                        <button style={declineButtonStyle} onClick={onDecline}>
                            Decline
                        </button>
                        <button style={approveButtonStyle} onClick={onApprove}>
                            Approve
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'PENDING': return 'rgba(234, 179, 8, 0.2)';
        case 'APPROVED': return 'rgba(34, 197, 94, 0.2)';
        case 'REJECTED': return 'rgba(239, 68, 68, 0.2)';
        default: return 'rgba(100, 116, 139, 0.2)';
    }
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
    maxWidth: '550px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
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

const photoContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem'
};

const photoStyle: React.CSSProperties = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid var(--primary)'
};

const formContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem'
};

const fieldGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255, 255, 255, 0.05)'
};

const fieldIconStyle: React.CSSProperties = {
    color: 'var(--primary)',
    marginTop: '2px'
};

const fieldContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    flex: 1
};

const fieldLabelStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const fieldValueStyle: React.CSSProperties = {
    color: 'var(--text-primary)',
    fontSize: '0.9rem'
};

const bioContainerStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255, 255, 255, 0.05)'
};

const bioTextStyle: React.CSSProperties = {
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
    lineHeight: 1.6
};

const statusContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: '0.5rem'
};

const statusBadgeStyle: React.CSSProperties = {
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: 'var(--text-primary)'
};

const rejectionContainerStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '0.5rem',
    border: '1px solid rgba(239, 68, 68, 0.2)'
};

const rejectionTextStyle: React.CSSProperties = {
    color: '#ef4444',
    fontSize: '0.9rem',
    marginTop: '0.5rem'
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
