'use client';

import React, { useState } from 'react';
import { X, Shield } from 'lucide-react';

interface AssignRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (newRole: 'USER' | 'ARTIST' | 'ADMIN') => void;
    currentRole: 'USER' | 'ARTIST' | 'ADMIN';
    userName: string;
    isLoading?: boolean;
}

const AssignRoleModal = ({
    isOpen,
    onClose,
    onConfirm,
    currentRole,
    userName,
    isLoading = false
}: AssignRoleModalProps) => {
    const [selectedRole, setSelectedRole] = useState<'USER' | 'ARTIST' | 'ADMIN'>(currentRole);

    if (!isOpen) return null;

    const roles: Array<{ value: 'USER' | 'ARTIST' | 'ADMIN'; label: string; description: string }> = [
        { value: 'USER', label: 'User', description: 'Standard user with basic access' },
        { value: 'ARTIST', label: 'Artist', description: 'Can upload and manage music' },
        { value: 'ADMIN', label: 'Admin', description: 'Full administrative access' },
    ];

    return (
        <div style={overlayStyle} onClick={isLoading ? undefined : onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button style={closeButtonStyle} onClick={onClose} disabled={isLoading}>
                    <X size={20} />
                </button>

                {/* Title */}
                <h2 style={titleStyle}>Assign Role</h2>

                {/* User Info */}
                <div style={userInfoStyle}>
                    <Shield size={24} color="var(--primary)" />
                    <span style={userNameStyle}>{userName}</span>
                </div>

                {/* Current Role */}
                <p style={currentRoleStyle}>
                    Current Role: <strong>{currentRole}</strong>
                </p>

                {/* Role Options */}
                <div style={roleOptionsStyle}>
                    {roles.map((role) => (
                        <label
                            key={role.value}
                            style={{
                                ...roleOptionStyle,
                                borderColor: selectedRole === role.value ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
                                backgroundColor: selectedRole === role.value ? 'rgba(6, 182, 212, 0.1)' : 'transparent'
                            }}
                        >
                            <input
                                type="radio"
                                name="role"
                                value={role.value}
                                checked={selectedRole === role.value}
                                onChange={() => setSelectedRole(role.value)}
                                style={radioStyle}
                                disabled={isLoading}
                            />
                            <div style={roleLabelContainerStyle}>
                                <span style={roleLabelStyle}>{role.label}</span>
                                <span style={roleDescriptionStyle}>{role.description}</span>
                            </div>
                        </label>
                    ))}
                </div>

                {/* Action Buttons */}
                <div style={buttonContainerStyle}>
                    <button
                        style={{
                            ...cancelButtonStyle,
                            opacity: isLoading ? 0.5 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        style={{
                            ...confirmButtonStyle,
                            opacity: isLoading || selectedRole === currentRole ? 0.5 : 1,
                            cursor: isLoading || selectedRole === currentRole ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => onConfirm(selectedRole)}
                        disabled={isLoading || selectedRole === currentRole}
                    >
                        {isLoading ? 'Updating...' : 'Assign Role'}
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
    zIndex: 1100
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

const userInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem'
};

const userNameStyle: React.CSSProperties = {
    color: 'var(--text-primary)',
    fontSize: '1.125rem',
    fontWeight: 500
};

const currentRoleStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    textAlign: 'center',
    marginBottom: '1.5rem'
};

const roleOptionsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '2rem'
};

const roleOptionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

const radioStyle: React.CSSProperties = {
    accentColor: 'var(--primary)',
    width: '18px',
    height: '18px',
    marginTop: '2px'
};

const roleLabelContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
};

const roleLabelStyle: React.CSSProperties = {
    color: 'var(--text-primary)',
    fontSize: '0.9375rem',
    fontWeight: 500
};

const roleDescriptionStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    fontSize: '0.75rem'
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

export default AssignRoleModal;
