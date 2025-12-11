'use client';

import React from 'react';
import { X } from 'lucide-react';

interface Report {
    id: string;
    reporterId: string;
    createdAt: string;
    type: string;
    status: string;
    targetId: string;
    reason: string;
    description: string;
}

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

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button style={closeButtonStyle} onClick={onClose}>
                    <X size={20} />
                </button>

                {/* Title */}
                <h2 style={titleStyle}>Report Details</h2>

                {/* Form Fields - 2 Column Layout */}
                <div style={formContainerStyle}>
                    {/* Row 1: Type & Created At */}
                    <div style={rowStyle}>
                        <div style={inputGroupStyle}>
                            <input
                                type="text"
                                value={report.type}
                                readOnly
                                style={inputStyle}
                            />
                            <span style={inputLabelStyle}>Type</span>
                        </div>
                        <div style={inputGroupStyle}>
                            <input
                                type="text"
                                value={report.createdAt}
                                readOnly
                                style={inputStyle}
                            />
                            <span style={inputLabelStyle}>Created At</span>
                        </div>
                    </div>

                    {/* Row 2: Target Id & Reporter Id */}
                    <div style={rowStyle}>
                        <div style={inputGroupStyle}>
                            <input
                                type="text"
                                value={report.targetId}
                                readOnly
                                style={inputStyle}
                            />
                            <span style={inputLabelStyle}>Target Id</span>
                        </div>
                        <div style={inputGroupStyle}>
                            <input
                                type="text"
                                value={report.reporterId}
                                readOnly
                                style={inputStyle}
                            />
                            <span style={inputLabelStyle}>Reporter Id</span>
                        </div>
                    </div>

                    {/* Row 3: Reason */}
                    <div style={inputGroupStyle}>
                        <input
                            type="text"
                            value={report.reason}
                            readOnly
                            style={inputStyle}
                        />
                        <span style={inputLabelStyle}>Reason</span>
                    </div>

                    {/* Row 4: Description (Large) */}
                    <div style={textareaGroupStyle}>
                        <textarea
                            value={report.description}
                            readOnly
                            style={textareaStyle}
                        />
                    </div>
                </div>

                {/* Action Button */}
                <div style={buttonContainerStyle}>
                    <button style={resolveButtonStyle} onClick={onMarkResolved}>
                        Mark As Resolved
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
    maxWidth: '600px',
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

const rowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
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

const textareaGroupStyle: React.CSSProperties = {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    border: '1px solid var(--primary)',
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem'
};

const textareaStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    width: '100%',
    minHeight: '100px',
    resize: 'none'
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
