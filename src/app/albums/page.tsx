import { useState } from 'react';
import { Play, Plus } from '../../lib/icons';
import '../../styles/albums-page.css';

// Sample album data
const albumsData = [
    { id: 1, title: 'Random Access Memories', artist: 'Daft Punk', image: 'https://i.scdn.co/image/ab67616d0000b273a7c37f72a5d1040c05e30916' },
    { id: 2, title: 'Discovery', artist: 'Daft Punk', image: 'https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f0' },
    { id: 3, title: 'Plastic Beach', artist: 'Gorillaz', image: 'https://i.scdn.co/image/ab67616d0000b2730dc3f8e185f92c4a5a4f7f5c' },
    { id: 4, title: 'Oracular Spectacular', artist: 'MGMT', image: 'https://i.scdn.co/image/ab67616d0000b2738b32b139981e79f2ebe005eb' },
    { id: 5, title: 'Room on Fire', artist: 'The Strokes', image: 'https://i.scdn.co/image/ab67616d0000b2738ae2bd00e9dce7d36fe7c3a1' },
    { id: 6, title: 'Nevermind', artist: 'Nirvana', image: 'https://i.scdn.co/image/ab67616d0000b27328933b808bfb4cbad298f3b5' },
    { id: 7, title: 'AM', artist: 'Arctic Monkeys', image: 'https://i.scdn.co/image/ab67616d0000b2737c4acdf09cedb3fbd5a0d4f9' },
    { id: 8, title: 'Homework', artist: 'Daft Punk', image: 'https://i.scdn.co/image/ab67616d0000b2730e9c2f46b5e7ff48fce5d8e1' },
];

// Mock artist's own albums
const myAlbumsData = [
    { id: 101, title: 'First Light', artist: 'You', songCount: 8, image: 'https://i.scdn.co/image/ab67616d0000b273a7c37f72a5d1040c05e30916' },
    { id: 102, title: 'Chill Vibes', artist: 'You', songCount: 6, image: 'https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f0' },
];

// Mock artist's songs for album creation
const mySongsData = [
    { id: '1', title: 'Midnight Dreams', duration: 234 },
    { id: '2', title: 'Electric Sunset', duration: 198 },
    { id: '3', title: 'Ocean Waves', duration: 267 },
    { id: '4', title: 'City Lights', duration: 212 },
    { id: '5', title: 'Morning Coffee', duration: 185 },
    { id: '6', title: 'Night Drive', duration: 245 },
];

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const AlbumsPage = () => {
    // Check user role from decoded JWT token stored in localStorage
    const userRole = localStorage.getItem('userRole');
    const isArtist = userRole === 'ARTIST';
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newAlbumTitle, setNewAlbumTitle] = useState('');
    const [newAlbumDescription, setNewAlbumDescription] = useState('');
    const [selectedSongs, setSelectedSongs] = useState<string[]>([]);

    const handleSongToggle = (songId: string) => {
        setSelectedSongs(prev =>
            prev.includes(songId)
                ? prev.filter(id => id !== songId)
                : [...prev, songId]
        );
    };

    const handleCreateAlbum = () => {
        // In a real app, you would submit to your backend here
        console.log('Creating album:', { title: newAlbumTitle, description: newAlbumDescription, songs: selectedSongs });
        setShowCreateModal(false);
        setNewAlbumTitle('');
        setNewAlbumDescription('');
        setSelectedSongs([]);
    };

    return (
        <div className="albums-page">
            {/* Your Albums Section (Artist Only) */}
            {isArtist && (
                <section className="your-albums-section">
                    <div className="section-header">
                        <h2>Your Albums</h2>
                        <button className="create-album-btn" onClick={() => setShowCreateModal(true)}>
                            <Plus />
                            Create Album
                        </button>
                    </div>
                    <div className="albums-grid your-albums-grid">
                        {myAlbumsData.map((album) => (
                            <div key={album.id} className="album-card your-album-card">
                                <div className="album-image-container">
                                    <div className="album-image">
                                        <img
                                            src={album.image}
                                            alt={album.title}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    <button className="play-btn">
                                        <Play />
                                    </button>
                                </div>
                                <h3 className="album-title">{album.title}</h3>
                                <p className="album-artist">{album.songCount} songs</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* All Albums Section */}
            <div className="page-header">
                <h1>Albums</h1>
            </div>

            <div className="albums-grid">
                {albumsData.map((album) => (
                    <div key={album.id} className="album-card">
                        <div className="album-image-container">
                            <div className="album-image">
                                <img
                                    src={album.image}
                                    alt={album.title}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                            <button className="play-btn">
                                <Play />
                            </button>
                        </div>
                        <h3 className="album-title">{album.title}</h3>
                        <p className="album-artist">{album.artist}</p>
                    </div>
                ))}
            </div>

            {/* Create Album Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create New Album</h2>
                            <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Album Title *</label>
                                <input
                                    type="text"
                                    value={newAlbumTitle}
                                    onChange={(e) => setNewAlbumTitle(e.target.value)}
                                    placeholder="Enter album title"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description (Optional)</label>
                                <textarea
                                    value={newAlbumDescription}
                                    onChange={(e) => setNewAlbumDescription(e.target.value)}
                                    placeholder="Enter album description"
                                    rows={3}
                                />
                            </div>
                            <div className="form-group">
                                <label>Select Songs *</label>
                                <div className="song-selection-list">
                                    {mySongsData.map((song) => (
                                        <label key={song.id} className="song-selection-item">
                                            <input
                                                type="checkbox"
                                                checked={selectedSongs.includes(song.id)}
                                                onChange={() => handleSongToggle(song.id)}
                                            />
                                            <span className="song-selection-title">{song.title}</span>
                                            <span className="song-selection-duration">
                                                {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn-create"
                                onClick={handleCreateAlbum}
                                disabled={!newAlbumTitle.trim() || selectedSongs.length === 0}
                            >
                                Create Album
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlbumsPage;
