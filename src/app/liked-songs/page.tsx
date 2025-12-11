import { useState } from 'react';
import { Plus, List, Grid, Search, Clock, HeartFilled } from '../../lib/icons';
import '../../styles/liked-songs-page.css';

interface Track {
    id: number;
    title: string;
    artist: string;
    album: string;
    duration: string;
    image: string;
}

const likedSongsData: Track[] = [
    { id: 1, title: 'Get Lucky', artist: 'Daft Punk', album: 'Random Access Memories', duration: '4:35', image: 'https://i.scdn.co/image/ab67616d0000b273a7c37f72a5d1040c05e30916' },
    { id: 2, title: 'Instant Crush', artist: 'Daft Punk, Julian Casablancas', album: 'Random Access Memories', duration: '5:37', image: 'https://i.scdn.co/image/ab67616d0000b273a7c37f72a5d1040c05e30916' },
    { id: 3, title: 'On Melancholy Hill', artist: 'Gorillaz', album: 'Plastic Beach', duration: '3:53', image: 'https://i.scdn.co/image/ab67616d0000b2730dc3f8e185f92c4a5a4f7f5c' },
    { id: 4, title: 'Tainted Love', artist: 'Soft Cell', album: 'Non-Stop Erotic Cabaret', duration: '2:33', image: 'https://i.scdn.co/image/ab67616d0000b2735a7f8e8e3b5a3b5a3b5a3b5a' },
    { id: 5, title: 'One More Time', artist: 'Daft Punk', album: 'Discovery', duration: '5:20', image: 'https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f0' },
    { id: 6, title: 'Electric Feel', artist: 'MGMT', album: 'Oracular Spectacular', duration: '3:49', image: 'https://i.scdn.co/image/ab67616d0000b2738b32b139981e79f2ebe005eb' },
    { id: 7, title: 'Give Life Back to Music', artist: 'Daft Punk', album: 'Random Access Memories', duration: '4:35', image: 'https://i.scdn.co/image/ab67616d0000b273a7c37f72a5d1040c05e30916' },
    { id: 8, title: 'Reptilia', artist: 'The Strokes', album: 'Room on Fire', duration: '3:47', image: 'https://i.scdn.co/image/ab67616d0000b2738ae2bd00e9dce7d36fe7c3a1' },
];

const LikedSongsPage = () => {
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSongs = likedSongsData.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="liked-songs-page">
            <div className="page-toolbar">
                <button className="add-btn">
                    <Plus />
                </button>

                <div className="toolbar-right">
                    <div className="view-toggle">
                        <button
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List />
                        </button>
                        <button
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid />
                        </button>
                    </div>

                    <button className="sort-btn">
                        <span>↓</span>
                        <span>Recent</span>
                    </button>

                    <button className="filter-btn">
                        Filter: All
                    </button>

                    <div className="search-box">
                        <Search />
                        <input
                            type="text"
                            placeholder="Search in liked songs"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="songs-table">
                <div className="table-header">
                    <span className="col-num">#</span>
                    <span className="col-title">Title</span>
                    <span className="col-album">Album</span>
                    <span className="col-duration"><Clock /></span>
                    <span className="col-like"></span>
                </div>

                <div className="table-body">
                    {filteredSongs.map((song, index) => (
                        <div key={song.id} className="song-row">
                            <span className="col-num">{index + 1}</span>
                            <div className="col-title">
                                <div className="song-image">
                                    <img src={song.image} alt={song.title} />
                                </div>
                                <div className="song-info">
                                    <p className="song-name">{song.title}</p>
                                    <p className="song-artist">{song.artist}</p>
                                </div>
                            </div>
                            <span className="col-album">{song.album}</span>
                            <span className="col-duration">{song.duration}</span>
                            <span className="col-like">
                                <HeartFilled />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LikedSongsPage;
