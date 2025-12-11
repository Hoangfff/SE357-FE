import { Plus, Play } from '../../lib/icons';
import '../../styles/playlists-page.css';

const playlistsData = [
    { id: 1, title: 'Chill Vibes', songCount: 48, image: 'https://i.scdn.co/image/ab67616d0000b273e8e28219724c2423afa4d320' },
    { id: 2, title: 'Workout Hits', songCount: 65, image: 'https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f542d937' },
    { id: 3, title: 'Road Trip', songCount: 34, image: 'https://i.scdn.co/image/ab67616d0000b273d9194aa18fa4c9362b47464f' },
    { id: 4, title: 'Party Mix', songCount: 78, image: 'https://i.scdn.co/image/ab67616d0000b2731dc7483a9e6d7e85ee26bf70' },
    { id: 5, title: 'Study Session', songCount: 52, image: 'https://i.scdn.co/image/ab67616d0000b273e3e3b64cea45265469db3f8f' },
    { id: 6, title: 'Throwback 2010s', songCount: 89, image: 'https://i.scdn.co/image/ab67616d0000b273447b6f18e9541b78a428f5c8' },
    { id: 7, title: 'Indie Discoveries', songCount: 41, image: 'https://i.scdn.co/image/ab67616d0000b273b6d4566db0d12894a1a3b7a2' },
    { id: 8, title: 'Late Night Jazz', songCount: 27, image: 'https://i.scdn.co/image/ab67616d0000b2730e8a7f7e5d58a0c7d4f8e112' },
];

const PlaylistsPage = () => {
    return (
        <div className="playlists-page">
            <div className="page-header">
                <h1>Playlists</h1>
                <button className="add-playlist-btn">
                    <Plus />
                    <span>Create Playlist</span>
                </button>
            </div>

            <div className="playlists-grid">
                {playlistsData.map((playlist) => (
                    <div key={playlist.id} className="playlist-card">
                        <div className="playlist-image-container">
                            <div className="playlist-image" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                <img
                                    src={playlist.image}
                                    alt={playlist.title}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                            <button className="play-btn">
                                <Play />
                            </button>
                        </div>
                        <h3 className="playlist-title">{playlist.title}</h3>
                        <p className="playlist-meta">{playlist.songCount} songs</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlaylistsPage;
