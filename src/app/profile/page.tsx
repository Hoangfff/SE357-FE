import { Link } from 'react-router-dom';
import '../../styles/profile-page.css';

// Mock artist profile data
const artistProfile = {
    id: 'artist-1',
    name: 'Your Artist Name',
    bio: 'Welcome to my artist profile! I am a passionate musician creating unique sounds that blend electronic and acoustic elements. My journey in music started over a decade ago, and I continue to explore new territories in sound and composition.',
    contactEmail: 'artist@example.com',
    website: 'https://myartist.com',
    followerCount: 12453,
    monthlyListeners: 45892,
    avatarUrl: 'https://i.scdn.co/image/ab6761610000e5eba7bfd7835b5c1eee0c95573b',
    verified: true,
};

// Mock songs data
const artistSongs = [
    { id: '1', title: 'Midnight Dreams', albumName: 'First Light', plays: 125420, duration: 234, coverUrl: 'https://i.scdn.co/image/ab67616d0000b273a7c37f72a5d1040c05e30916' },
    { id: '2', title: 'Electric Sunset', albumName: 'First Light', plays: 98340, duration: 198, coverUrl: 'https://i.scdn.co/image/ab67616d0000b273a7c37f72a5d1040c05e30916' },
    { id: '3', title: 'Ocean Waves', albumName: 'Chill Vibes', plays: 76210, duration: 267, coverUrl: 'https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f0' },
    { id: '4', title: 'City Lights', albumName: 'Chill Vibes', plays: 54890, duration: 212, coverUrl: 'https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f0' },
    { id: '5', title: 'Morning Coffee', albumName: 'Single', plays: 43210, duration: 185, coverUrl: 'https://i.scdn.co/image/ab67616d0000b2730dc3f8e185f92c4a5a4f7f5c' },
];

const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const VerifiedBadge = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
    </svg>
);

const EmailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const WebIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const ArtistProfilePage = () => {
    return (
        <div className="profile-page">
            {/* Hero Section */}
            <section className="profile-hero">
                <div className="profile-hero-content">
                    <div className="profile-avatar">
                        {artistProfile.avatarUrl ? (
                            <img src={artistProfile.avatarUrl} alt={artistProfile.name} />
                        ) : (
                            <div className="profile-avatar-placeholder">
                                {artistProfile.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="profile-info">
                        {artistProfile.verified && (
                            <span className="profile-badge">
                                <VerifiedBadge />
                                Verified Artist
                            </span>
                        )}
                        <h1 className="profile-name">{artistProfile.name}</h1>
                        <div className="profile-stats">
                            <div className="profile-stat">
                                <div className="profile-stat-value">{formatNumber(artistProfile.followerCount)}</div>
                                <div className="profile-stat-label">Followers</div>
                            </div>
                            <div className="profile-stat">
                                <div className="profile-stat-value">{formatNumber(artistProfile.monthlyListeners)}</div>
                                <div className="profile-stat-label">Monthly Listeners</div>
                            </div>
                            <div className="profile-stat">
                                <div className="profile-stat-value">{artistSongs.length}</div>
                                <div className="profile-stat-label">Songs</div>
                            </div>
                        </div>
                        <div className="profile-actions">
                            <Link to="/home/my-songs/upload" className="profile-btn profile-btn-primary">
                                Upload Song
                            </Link>
                            <Link to="/home/my-songs" className="profile-btn profile-btn-secondary">
                                Manage Songs
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="profile-section">
                <div className="profile-section-header">
                    <h2>About</h2>
                </div>
                <div className="bio-card">
                    <p className="bio-text">{artistProfile.bio}</p>
                    <div className="contact-info">
                        <a href={`mailto:${artistProfile.contactEmail}`} className="contact-item">
                            <EmailIcon />
                            {artistProfile.contactEmail}
                        </a>
                        {artistProfile.website && (
                            <a href={artistProfile.website} target="_blank" rel="noopener noreferrer" className="contact-item">
                                <WebIcon />
                                {artistProfile.website}
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* Popular Songs Section */}
            <section className="profile-section">
                <div className="profile-section-header">
                    <h2>Your Songs</h2>
                    <Link to="/home/my-songs" className="profile-section-link">See All</Link>
                </div>
                <div className="profile-songs-list">
                    {artistSongs.map((song, index) => (
                        <div key={song.id} className="profile-song-item">
                            <span className="song-number">{index + 1}</span>
                            <div className="song-cover">
                                {song.coverUrl && <img src={song.coverUrl} alt={song.title} />}
                            </div>
                            <div className="song-info">
                                <h4>{song.title}</h4>
                                <p>{song.albumName}</p>
                            </div>
                            <span className="song-plays">{formatNumber(song.plays)} plays</span>
                            <span className="song-duration">{formatDuration(song.duration)}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ArtistProfilePage;
