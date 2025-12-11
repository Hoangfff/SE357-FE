'use client';

import React, { useState } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';

const HelpCenterPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleSendClick = () => {
        if (title.trim() && content.trim()) {
            setIsConfirmModalOpen(true);
        }
    };

    const handleConfirmSend = () => {
        // Clear all text boxes
        setTitle('');
        setContent('');
        setIsConfirmModalOpen(false);
    };

    return (
        <div style={pageContainerStyle}>
            {/* Title Field */}
            <div style={fieldContainerStyle}>
                <label style={labelStyle}>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={inputStyle}
                    placeholder="Enter title..."
                />
            </div>

            {/* Content Field */}
            <div style={fieldContainerStyle}>
                <label style={labelStyle}>Content</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={textareaStyle}
                    placeholder="Enter content..."
                />
            </div>

            {/* Send Button */}
            <button style={sendButtonStyle} onClick={handleSendClick}>
                Send
            </button>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmSend}
                title="Send Help Message?"
                message="Are you sure you want to send this help message to all users?"
                type="info"
            />
        </div>
    );
};

// Styles
const pageContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    maxWidth: '100%'
};

const fieldContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
};

const labelStyle: React.CSSProperties = {
    color: 'var(--text-primary)',
    fontSize: '1.25rem',
    fontWeight: 600
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '1rem',
    backgroundColor: 'var(--admin-card-bg)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.5rem',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    outline: 'none'
};

const textareaStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '300px',
    padding: '1rem',
    backgroundColor: 'var(--admin-card-bg)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.5rem',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    outline: 'none',
    resize: 'vertical'
};

const sendButtonStyle: React.CSSProperties = {
    padding: '0.75rem 2rem',
    fontSize: '0.875rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--primary)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: 'fit-content'
};

export default HelpCenterPage;
