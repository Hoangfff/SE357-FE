'use client';

import React from 'react';
import { X, User, Calendar, FileText, AlertCircle, Music, MessageSquare } from 'lucide-react';
import type { Report } from '../../../types/admin';

interface ReportDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: Report | null;
    onMarkResolved: () => void;
}

const ReportDetailsModal = ({
    isOpen,
    onClose,
    report,
    onMarkResolved
}: ReportDetailsModalProps) => {
    if (!isOpen || !report) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'MUSIC': return <Music size={16} />;
            case 'USER': return <User size={16} />;
            case 'COMMENT': return <MessageSquare size={16} />;
            default: return <FileText size={16} />;
        }
    };

    const getTargetInfo = () => {
        if (report.music) {
            return { label: 'Reported Music', value: report.music.title, id: report.musicId };
        }
        if (report.usersReportsReportedUserIdTousers) {
            return {
                label: 'Reported User',
                value: report.usersReportsReportedUserIdTousers.name,
                id: report.reportedUserId
            };
        }
        if (report.artistProfiles) {
            return { label: 'Reported Artist', value: report.artistProfiles.stageName, id: report.artistId };
        }
        return null;
    };

    const targetInfo = getTargetInfo();

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button style={closeButtonStyle} onClick={onClose}>
                    <X size={20} />
                </button>

                {/* Title */}
                <h2 style={titleStyle}>Report Details</h2>

                {/* Status Badge */}
                <div style={statusContainerStyle}>
                    <span style={{
                        ...statusBadgeStyle,
                        backgroundColor: report.status === 'RESOLVED'
                            ? 'rgba(34, 197, 94, 0.2)'
                            : 'rgba(234, 179, 8, 0.2)',
                        color: report.status === 'RESOLVED' ? '#22c55e' : '#eab308'
                    }}>
                        {report.status}
                    </span>
                </div>

                {/* Form Fields */}
                <div style={formContainerStyle}>
                    {/* Row 1: Type & Created At */}
                    <div style={rowStyle}>
                        <div style={fieldGroupStyle}>
                            <div style={fieldIconStyle}>
                                {getTypeIcon(report.reportType)}
                            </div>
                            <div style={fieldContentStyle}>
                                <span style={fieldLabelStyle}>Report Type</span>
                                <span style={fieldValueStyle}>{report.reportType}</span>
                            </div>
                        </div>
                        <div style={fieldGroupStyle}>
                            <div style={fieldIconStyle}>
                                <Calendar size={16} />
                            </div>
                            <div style={fieldContentStyle}>
                                <span style={fieldLabelStyle}>Reported On</span>
                                <span style={fieldValueStyle}>{formatDate(report.reportDate)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Reporter Info */}
                    <div style={fieldGroupStyle}>
                        <div style={fieldIconStyle}>
                            <User size={16} />
                        </div>
                        <div style={fieldContentStyle}>
                            <span style={fieldLabelStyle}>Reporter</span>
                            <span style={fieldValueStyle}>
                                {report.usersReportsReporterUserIdTousers?.name || `User #${report.reporterId}`}
                                {report.usersReportsReporterUserIdTousers?.email && (
                                    <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                                        ({report.usersReportsReporterUserIdTousers.email})
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Target Info */}
                    {targetInfo && (
                        <div style={fieldGroupStyle}>
                            <div style={fieldIconStyle}>
                                <AlertCircle size={16} />
                            </div>
                            <div style={fieldContentStyle}>
                                <span style={fieldLabelStyle}>{targetInfo.label}</span>
                                <span style={fieldValueStyle}>
                                    {targetInfo.value} (ID: {targetInfo.id})
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Reason */}
                    <div style={fieldGroupStyle}>
                        <div style={fieldIconStyle}>
                            <FileText size={16} />
                        </div>
                        <div style={fieldContentStyle}>
                            <span style={fieldLabelStyle}>Reason</span>
                            <span style={fieldValueStyle}>{report.reason}</span>
                        </div>
                    </div>

                    {/* Description */}
                    {report.description && (
                        <div style={descriptionContainerStyle}>
                            <span style={fieldLabelStyle}>Description</span>
                            <p style={descriptionTextStyle}>{report.description}</p>
                        </div>
                    )}

                    {/* Resolution Notes (if resolved) */}
                    {report.status === 'RESOLVED' && report.resolutionNotes && (
                        <div style={resolutionContainerStyle}>
                            <span style={fieldLabelStyle}>Resolution Notes</span>
                            <p style={resolutionTextStyle}>{report.resolutionNotes}</p>
                        </div>
                    )}
                </div>

                {/* Action Button - Only show for pending reports */}
                {report.status === 'PENDING' && (
                    <div style={buttonContainerStyle}>
                        <button style={resolveButtonStyle} onClick={onMarkResolved}>
                            Mark As Resolved
                        </button>
                    </div>
                )}
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
    maxWidth: '600px',
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
    marginBottom: '0.5rem'
};

const statusContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem'
};

const statusBadgeStyle: React.CSSProperties = {
    padding: '0.25rem 1rem',
    borderRadius: '1rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase'
};

const formContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem'
};

const rowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
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

const descriptionContainerStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255, 255, 255, 0.05)'
};

const descriptionTextStyle: React.CSSProperties = {
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
    lineHeight: 1.6
};

const resolutionContainerStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: '0.5rem',
    border: '1px solid rgba(34, 197, 94, 0.2)'
};

const resolutionTextStyle: React.CSSProperties = {
    color: '#22c55e',
    fontSize: '0.9rem',
    marginTop: '0.5rem'
};

const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center'
};

const resolveButtonStyle: React.CSSProperties = {
    padding: '0.75rem 2rem',
    fontSize: '0.875rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--primary)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '180px'
};

export default ReportDetailsModal;
