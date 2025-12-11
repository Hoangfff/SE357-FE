import { Play } from '../../lib/icons';
import '../../styles/albums-page.css';

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

const AlbumsPage = () => {
    return (
        <div className="albums-page">
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
        </div>
    );
};

export default AlbumsPage;
