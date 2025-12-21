import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Play, Music } from '@/lib/icons';
import '@/styles/my-songs-page.css';

// Mock data for artist's songs
const mockSongs = [
    { id: '1', title: 'Midnight Dreams', albumName: 'First Light', plays: 125420, duration: 234, coverUrl: 'https://i.scdn.co/image/ab67616d0000b273a7c37f72a5d1040c05e30916', uploadedAt: '2024-01-15' },
    { id: '2', title: 'Electric Sunset', albumName: 'First Light', plays: 98340, duration: 198, coverUrl: 'https://i.scdn.co/image/ab67616d0000b273a7c37f72a5d1040c05e30916', uploadedAt: '2024-01-10' },
    { id: '3', title: 'Ocean Waves', albumName: 'Chill Vibes', plays: 76210, duration: 267, coverUrl: 'https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f0', uploadedAt: '2023-12-20' },
    { id: '4', title: 'City Lights', albumName: 'Chill Vibes', plays: 54890, duration: 212, coverUrl: 'https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f0', uploadedAt: '2023-12-15' },
    { id: '5', title: 'Morning Coffee', albumName: 'Single', plays: 43210, duration: 185, coverUrl: 'https://i.scdn.co/image/ab67616d0000b2730dc3f8e185f92c4a5a4f7f5c', uploadedAt: '2023-11-30' },
    { id: '6', title: 'Night Drive', albumName: 'Single', plays: 38900, duration: 245, coverUrl: 'https://i.scdn.co/image/ab67616d0000b2738b32b139981e79f2ebe005eb', uploadedAt: '2023-11-25' },
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

const EditIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const PlayIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="2">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const MySongsPage = () => {
    const [songs] = useState(mockSongs);

    const totalPlays = songs.reduce((sum, song) => sum + song.plays, 0);

    return (
        <div className="my-songs-page">
            <div className="my-songs-header">
                <h1>My Songs</h1>
                <Link to="/home/my-songs/upload" className="upload-btn">
                    <Plus />
                    Upload Song
                </Link>
            </div>

            {/* Stats Row */}
            <div className="songs-stats">
                <div className="songs-stat-card">
                    <div className="songs-stat-icon">
                        <Music />
                    </div>
                    <div className="songs-stat-info">
                        <h3>{songs.length}</h3>
                        <p>Total Songs</p>
                    </div>
                </div>
                <div className="songs-stat-card">
                    <div className="songs-stat-icon">
                        <PlayIcon />
                    </div>
                    <div className="songs-stat-info">
                        <h3>{formatNumber(totalPlays)}</h3>
                        <p>Total Plays</p>
                    </div>
                </div>
            </div>

            {/* Songs Grid */}
            {songs.length > 0 ? (
                <div className="songs-grid">
                    {songs.map((song) => (
                        <div key={song.id} className="song-card">
                            <div className="song-card-actions">
                                <button className="action-btn" title="Edit">
                                    <EditIcon />
                                </button>
                                <button className="action-btn" title="Delete">
                                    <TrashIcon />
                                </button>
                            </div>
                            <div className="song-card-image">
                                <div className="song-card-cover">
                                    {song.coverUrl ? (
                                        <img src={song.coverUrl} alt={song.title} />
                                    ) : (
                                        <img src="/placeholders/music-track.svg" alt="No cover" className="song-card-cover-placeholder" />
                                    )}
                                </div>
                                <button className="play-btn">
                                    <Play />
                                </button>
                            </div>
                            <h3 className="song-card-title">{song.title}</h3>
                            <p className="song-card-meta">{song.albumName}</p>
                            <div className="song-card-stats">
                                <span>{formatNumber(song.plays)} plays</span>
                                <span>{formatDuration(song.duration)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <Music />
                    </div>
                    <h2>No songs yet</h2>
                    <p>Upload your first song and start sharing your music with the world.</p>
                    <Link to="/home/my-songs/upload" className="upload-btn">
                        <Plus />
                        Upload Song
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MySongsPage;
