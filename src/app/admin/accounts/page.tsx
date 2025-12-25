'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, User } from 'lucide-react';
import ActivitiesTable from '../components/ActivitiesTable';
import AdminFooter from '../components/AdminFooter';
import ConfirmationModal from '../components/ConfirmationModal';
import AssignRoleModal from '../components/AssignRoleModal';
import { adminService } from '@/services/adminService';
import type { AdminUser } from '@/types/admin';

interface Activity {
    id: number;
    timestamp: string;
    action: string;
}

interface UserDetails extends AdminUser {
    activityLogs?: Array<{
        id: number;
        timestamp: string;
        action: string;
        details?: string;
    }>;
}

const AccountsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<AdminUser[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<UserDetails | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [showAssignRoleModal, setShowAssignRoleModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isAssigningRole, setIsAssigningRole] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Ref for click outside detection
    const searchWrapperRef = useRef<HTMLDivElement>(null);

    // Debounced search
    const searchAccounts = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowSearchDropdown(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await adminService.searchAccounts(query);
            setSearchResults(response.data);
            setShowSearchDropdown(true);
        } catch (err) {
            console.error('Search failed:', err);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    // Debounce effect for search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchAccounts(searchQuery);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, searchAccounts]);

    // Click outside handler to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
                setShowSearchDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch user details when selecting an account
    const handleSelectAccount = async (user: AdminUser) => {
        setShowSearchDropdown(false);
        setSearchQuery(''); // Clear search bar after selecting an account
        setIsLoading(true);
        setError(null);

        try {
            const details = await adminService.getUserDetails(user.id);
            setSelectedAccount(details as UserDetails);

            // Transform activity logs to the format expected by ActivitiesTable
            const activityLogs = (details as UserDetails).activityLogs || [];
            setActivities(activityLogs.map((log, index) => ({
                id: log.id || index,
                timestamp: new Date(log.timestamp).toLocaleString(),
                action: log.action
            })));
        } catch (err) {
            console.error('Failed to fetch user details:', err);
            setError('Failed to load account details');
            setSelectedAccount(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle assign role
    const handleAssignRole = async (newRole: 'USER' | 'ARTIST' | 'ADMIN') => {
        if (!selectedAccount) return;

        setIsAssigningRole(true);
        try {
            const response = await adminService.assignRole(selectedAccount.id, newRole);

            // Try to use the updated user from the response if available
            if (response.user) {
                setSelectedAccount(response.user as UserDetails);
            } else {
                // Fallback: Optimistically update the role in local state
                // This avoids needing to call getUserDetails which may not exist
                setSelectedAccount(prev => prev ? { ...prev, role: newRole } : null);
            }

            setShowAssignRoleModal(false);
        } catch (err) {
            console.error('Failed to assign role:', err);
            setError('Failed to assign role');
        } finally {
            setIsAssigningRole(false);
        }
    };

    // Handle delete account
    const handleDeleteAccount = async () => {
        if (!selectedAccount) return;

        setIsDeleting(true);
        try {
            await adminService.deleteAccount(selectedAccount.id);
            setSelectedAccount(null);
            setActivities([]);
            setSearchQuery('');
            setShowDeleteModal(false);
        } catch (err) {
            console.error('Failed to delete account:', err);
            setError('Failed to delete account');
        } finally {
            setIsDeleting(false);
        }
    };

    // Get profile image URL - use artist photo if ARTIST, otherwise default
    const getProfileImage = (): string | null => {
        if (!selectedAccount) return null;
        if (selectedAccount.role === 'ARTIST' && selectedAccount.artistProfiles?.photoUrl) {
            return selectedAccount.artistProfiles.photoUrl;
        }
        return null;
    };

    const profileImageUrl = getProfileImage();

    return (
        <div style={pageContainerStyle}>
            {/* Search Bar */}
            <div style={searchWrapperStyle} ref={searchWrapperRef}>
                <div style={searchContainerStyle}>
                    <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Find Account..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery && setShowSearchDropdown(true)}
                        style={searchInputStyle}
                    />
                    {isSearching && <span style={loadingSpinnerStyle}>...</span>}
                </div>

                {/* Search Results Dropdown */}
                {showSearchDropdown && searchResults.length > 0 && (
                    <div style={dropdownStyle}>
                        {searchResults.map((user) => (
                            <div
                                key={user.id}
                                style={dropdownItemStyle}
                                onClick={() => handleSelectAccount(user)}
                            >
                                <div style={dropdownUserInfoStyle}>
                                    <span style={dropdownNameStyle}>{user.name}</span>
                                    <span style={dropdownEmailStyle}>{user.email}</span>
                                </div>
                                <span style={dropdownRoleStyle}>{user.role}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div style={errorStyle}>
                    {error}
                    <button style={dismissErrorStyle} onClick={() => setError(null)}>×</button>
                </div>
            )}

            {/* Account Information Section */}
            <fieldset style={fieldsetStyle}>
                <legend style={legendStyle}>Account Information</legend>

                {isLoading ? (
                    <div style={loadingContainerStyle}>
                        <p style={loadingTextStyle}>Loading account details...</p>
                    </div>
                ) : selectedAccount ? (
                    <div style={accountInfoContainerStyle}>
                        {/* Left: Profile Image */}
                        <div style={profileImageContainerStyle}>
                            <img
                                src={profileImageUrl || '/placeholders/user-avatar.svg'}
                                alt="Profile"
                                style={profileImageStyle}
                            />
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
                                    value={new Date(selectedAccount.createdAt).toLocaleDateString()}
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

                            {/* Role Badge */}
                            <div style={roleBadgeContainerStyle}>
                                <span style={{
                                    ...roleBadgeStyle,
                                    backgroundColor: selectedAccount.role === 'ADMIN'
                                        ? 'rgba(239, 68, 68, 0.2)'
                                        : selectedAccount.role === 'ARTIST'
                                            ? 'rgba(6, 182, 212, 0.2)'
                                            : 'rgba(156, 163, 175, 0.2)',
                                    color: selectedAccount.role === 'ADMIN'
                                        ? '#EF4444'
                                        : selectedAccount.role === 'ARTIST'
                                            ? '#06B6D4'
                                            : '#9CA3AF'
                                }}>
                                    {selectedAccount.role}
                                </span>
                            </div>

                            {/* Security & Actions */}
                            <div style={securitySectionStyle}>
                                <p style={securityTitleStyle}>Security & Actions</p>
                                <div style={actionButtonsStyle}>
                                    <button
                                        style={actionButtonStyle}
                                        onClick={() => setShowAssignRoleModal(true)}
                                    >
                                        Assign Role
                                    </button>
                                    <button
                                        style={deleteButtonStyle}
                                        onClick={() => setShowDeleteModal(true)}
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={emptyStateStyle}>
                        <User size={48} color="var(--text-secondary)" />
                        <p style={emptyStateTextStyle}>Search for an account to view details</p>
                    </div>
                )}
            </fieldset>

            {/* Activities Table */}
            {selectedAccount && (
                <ActivitiesTable activities={activities} itemsPerPage={4} />
            )}

            {/* Footer */}
            <AdminFooter />

            {/* Assign Role Modal */}
            {selectedAccount && (
                <AssignRoleModal
                    isOpen={showAssignRoleModal}
                    onClose={() => setShowAssignRoleModal(false)}
                    onConfirm={handleAssignRole}
                    currentRole={selectedAccount.role}
                    userName={selectedAccount.name}
                    isLoading={isAssigningRole}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account"
                message={`Are you sure you want to delete the account "${selectedAccount?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                isLoading={isDeleting}
            />
        </div>
    );
};

// Styles
const pageContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
};

const searchWrapperStyle: React.CSSProperties = {
    position: 'relative',
    maxWidth: '400px'
};

const searchContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: '0.75rem 1rem',
    borderRadius: '2rem',
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

const loadingSpinnerStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem'
};

const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '0.5rem',
    backgroundColor: 'var(--admin-card-bg)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    maxHeight: '300px',
    overflowY: 'auto',
    zIndex: 100
};

const dropdownItemStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'background-color 0.2s ease'
};

const dropdownUserInfoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
};

const dropdownNameStyle: React.CSSProperties = {
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    fontWeight: 500
};

const dropdownEmailStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    fontSize: '0.75rem'
};

const dropdownRoleStyle: React.CSSProperties = {
    color: 'var(--primary)',
    fontSize: '0.75rem',
    fontWeight: 500
};

const errorStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '0.5rem',
    color: '#EF4444',
    fontSize: '0.875rem'
};

const dismissErrorStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: '#EF4444',
    fontSize: '1.25rem',
    cursor: 'pointer',
    padding: '0 0.5rem'
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

const loadingContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '150px'
};

const loadingTextStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem'
};

const emptyStateStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '150px',
    gap: '1rem'
};

const emptyStateTextStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem'
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
    objectFit: 'cover'
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

const roleBadgeContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center'
};

const roleBadgeStyle: React.CSSProperties = {
    padding: '0.375rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 600
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
