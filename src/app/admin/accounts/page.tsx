'use client';

import React, { useState } from 'react';
import { Search, User } from 'lucide-react';
import ActivitiesTable from '../components/ActivitiesTable';
import AdminFooter from '../components/AdminFooter';

// Mock data for demonstration
const mockActivities = [
    { id: 1, timestamp: '01/01/2000 01:01:01', action: 'Login' },
    { id: 2, timestamp: '01/01/2000 01:01:01', action: 'Upload Music' },
    { id: 3, timestamp: '01/01/2000 01:01:01', action: 'Upload Music' },
    { id: 4, timestamp: '01/01/2000 01:01:01', action: 'Login' },
    { id: 5, timestamp: '01/02/2000 02:02:02', action: 'Logout' },
    { id: 6, timestamp: '01/02/2000 03:03:03', action: 'Upload Music' },
];

// Mock account data
const mockAccount = {
    name: 'My Name',
    email: 'email@gmail.com',
    joinDate: '01/01/2000',
    profileImage: ''
};

const AccountsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAccount] = useState(mockAccount);

    return (
        <div style={pageContainerStyle}>
            {/* Search Bar */}
            <div style={searchContainerStyle}>
                <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                <input
                    type="text"
                    placeholder="Find Account..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={searchInputStyle}
                />
            </div>

            {/* Account Information Section */}
            <fieldset style={fieldsetStyle}>
                <legend style={legendStyle}>Account Information</legend>

                <div style={accountInfoContainerStyle}>
                    {/* Left: Profile Image */}
                    <div style={profileImageContainerStyle}>
                        {selectedAccount.profileImage ? (
                            <img
                                src={selectedAccount.profileImage}
                                alt="Profile"
                                style={profileImageStyle}
                            />
                        ) : (
                            <div style={profilePlaceholderStyle}>
                                <User size={48} color="var(--text-secondary)" />
                            </div>
                        )}
                    </div>

                    {/* Middle: Name & Join Date */}
                    <div style={infoColumnStyle}>
                        <div style={inputGroupStyle}>
                            <input
                                type="text"
                                value={selectedAccount.name}
                                readOnly
                                style={inputStyle}
                            />
                            <span style={inputLabelStyle}>Name</span>
                        </div>
                        <div style={inputGroupStyle}>
                            <input
                                type="text"
                                value={selectedAccount.joinDate}
                                readOnly
                                style={inputStyle}
                            />
                            <span style={inputLabelStyle}>Join Date</span>
                        </div>
                    </div>

                    {/* Right: Email & Security Actions */}
                    <div style={rightColumnStyle}>
                        <div style={inputGroupStyle}>
                            <input
                                type="email"
                                value={selectedAccount.email}
                                readOnly
                                style={inputStyle}
                            />
                            <span style={inputLabelStyle}>Email</span>
                        </div>

                        {/* Security & Actions */}
                        <div style={securitySectionStyle}>
                            <p style={securityTitleStyle}>Security & Actions</p>
                            <div style={actionButtonsStyle}>
                                <button style={actionButtonStyle}>Reset Password</button>
                                <button style={actionButtonStyle}>Assign Role</button>
                                <button style={deleteButtonStyle}>Delete Account</button>
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>

            {/* Activities Table */}
            <ActivitiesTable activities={mockActivities} itemsPerPage={4} />

            {/* Footer */}
            <AdminFooter />
        </div>
    );
};

// Styles
const pageContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
};

const searchContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: '0.75rem 1rem',
    borderRadius: '2rem',
    maxWidth: '300px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
};

const searchInputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    width: '100%'
};

const fieldsetStyle: React.CSSProperties = {
    border: '1px solid var(--secondary)',
    borderRadius: '1rem',
    padding: '1.5rem 2rem',
    margin: 0
};

const legendStyle: React.CSSProperties = {
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    fontWeight: 500,
    padding: '0 0.75rem'
};

const accountInfoContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '100px 1fr 1fr',
    gap: '2rem',
    alignItems: 'flex-start'
};

const profileImageContainerStyle: React.CSSProperties = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    overflow: 'hidden'
};

const profileImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
};

const profilePlaceholderStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--admin-card-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--primary)'
};

const infoColumnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
};

const rightColumnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
};

const inputGroupStyle: React.CSSProperties = {
    position: 'relative',
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

const securitySectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
};

const securityTitleStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    margin: 0
};

const actionButtonsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
};

const actionButtonStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    fontSize: '0.75rem',
    border: '1px solid var(--text-secondary)',
    borderRadius: '0.375rem',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

const deleteButtonStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    fontSize: '0.75rem',
    border: '1px solid var(--warning)',
    borderRadius: '0.375rem',
    backgroundColor: 'transparent',
    color: 'var(--warning)',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

export default AccountsPage;
