'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Camera, Plus, X, Loader2 } from 'lucide-react';
import '../../../styles/artist-profile-page.css';
import { artistService } from '../../../services/artistService';
import type { ArtistProfile } from '../../../types/artist';

interface SocialLink {
    id: string;
    url: string;
}

const ArtistProfilePage = () => {
    // Profile data state
    const [profile, setProfile] = useState<ArtistProfile | null>(null);
    const [stageName, setStageName] = useState('');
    const [bio, setBio] = useState('');
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([{ id: '1', url: '' }]);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    // UI state
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch profile
    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await artistService.getProfile();
            setProfile(data);
            setStageName(data.stageName || '');
            setBio(data.bio || '');
            setPhotoUrl(data.photoUrl || null);

            // Parse social links
            if (data.socialLinks) {
                try {
                    const links = JSON.parse(data.socialLinks);
                    if (Array.isArray(links) && links.length > 0) {
                        setSocialLinks(links.map((url: string, index: number) => ({
                            id: String(index + 1),
                            url
                        })));
                    }
                } catch {
                    // If not JSON, treat as single link or comma-separated
                    const links = data.socialLinks.split(',').map(s => s.trim()).filter(Boolean);
                    setSocialLinks(links.length > 0
                        ? links.map((url, index) => ({ id: String(index + 1), url }))
                        : [{ id: '1', url: '' }]
                    );
                }
            }
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            setError('Failed to load profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Track changes
    useEffect(() => {
        if (profile) {
            const socialLinksChanged = JSON.stringify(socialLinks.map(l => l.url).filter(Boolean)) !==
                (profile.socialLinks || '[]');
            const changed = stageName !== (profile.stageName || '') ||
                bio !== (profile.bio || '') ||
                photoFile !== null ||
                socialLinksChanged;
            setHasChanges(changed);
        }
    }, [stageName, bio, socialLinks, photoFile, profile]);

    // Handle photo upload
    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPhotoUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Social links handlers
    const addSocialLink = () => {
        setSocialLinks(prev => [...prev, { id: String(Date.now()), url: '' }]);
    };

    const updateSocialLink = (id: string, url: string) => {
        setSocialLinks(prev => prev.map(link =>
            link.id === id ? { ...link, url } : link
        ));
    };

    const removeSocialLink = (id: string) => {
        if (socialLinks.length > 1) {
            setSocialLinks(prev => prev.filter(link => link.id !== id));
        }
    };

    // Save profile
    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const socialLinksData = JSON.stringify(
                socialLinks.map(l => l.url).filter(Boolean)
            );

            await artistService.updateProfile({
                stageName,
                bio,
                socialLinks: socialLinksData,
            });

            // Handle photo upload if there's a new file
            if (photoFile) {
                await artistService.uploadProfilePhoto(photoFile);
            }

            setSuccessMessage('Profile updated successfully!');
            setHasChanges(false);
            setPhotoFile(null);

            // Refetch to get updated data
            await fetchProfile();

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error('Failed to save profile:', err);
            setError('Failed to save profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Cancel changes
    const handleCancel = () => {
        if (profile) {
            setStageName(profile.stageName || '');
            setBio(profile.bio || '');
            setPhotoUrl(profile.photoUrl || null);
            setPhotoFile(null);

            // Reset social links
            if (profile.socialLinks) {
                try {
                    const links = JSON.parse(profile.socialLinks);
                    if (Array.isArray(links)) {
                        setSocialLinks(links.map((url: string, index: number) => ({
                            id: String(index + 1),
                            url
                        })));
                    }
                } catch {
                    setSocialLinks([{ id: '1', url: '' }]);
                }
            } else {
                setSocialLinks([{ id: '1', url: '' }]);
            }
        }
        setHasChanges(false);
    };

    if (isLoading) {
        return (
            <div className="artist-profile-page">
                <div className="loading-container">
                    <Loader2 size={40} className="spinner" />
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="artist-profile-page">
            <div className="profile-content">
                {/* Profile Avatar */}
                <div className="profile-avatar-section">
                    <div className="avatar-container" onClick={handlePhotoClick}>
                        {photoUrl ? (
                            <img src={photoUrl} alt="Profile" className="avatar-image" />
                        ) : (
                            <div className="avatar-placeholder">
                                <span>?</span>
                            </div>
                        )}
                        <div className="avatar-overlay">
                            <Camera size={20} />
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        style={{ display: 'none' }}
                    />
                </div>

                {/* Profile Form */}
                <div className="profile-form">
                    {/* Messages */}
                    {error && (
                        <div className="message error-message">{error}</div>
                    )}
                    {successMessage && (
                        <div className="message success-message">{successMessage}</div>
                    )}

                    {/* Stage Name */}
                    <div className="form-group">
                        <label htmlFor="stageName">Stage Name</label>
                        <div className="input-with-icon">
                            <input
                                id="stageName"
                                type="text"
                                value={stageName}
                                onChange={(e) => setStageName(e.target.value)}
                                placeholder="Enter your stage name"
                                className="form-input"
                            />
                            <span className="edit-icon">✏️</span>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="form-group">
                        <label>Social Link</label>
                        <div className="social-links-container">
                            {socialLinks.map((link) => (
                                <div key={link.id} className="social-link-row">
                                    <div className="input-with-icon">
                                        <input
                                            type="url"
                                            value={link.url}
                                            onChange={(e) => updateSocialLink(link.id, e.target.value)}
                                            placeholder="https://..."
                                            className="form-input"
                                        />
                                        <span className="edit-icon">✏️</span>
                                    </div>
                                    {socialLinks.length > 1 && (
                                        <button
                                            className="remove-link-btn"
                                            onClick={() => removeSocialLink(link.id)}
                                            title="Remove link"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button className="add-link-btn" onClick={addSocialLink}>
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <div className="textarea-container">
                            <textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell your fans about yourself..."
                                className="form-textarea"
                                rows={6}
                            />
                            <span className="edit-icon textarea-icon">✏️</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={!hasChanges || isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={18} className="spinner" />
                                    Saving...
                                </>
                            ) : (
                                'Save'
                            )}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={handleCancel}
                            disabled={!hasChanges || isSaving}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtistProfilePage;
