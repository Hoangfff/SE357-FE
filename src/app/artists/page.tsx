import { Play } from '../../lib/icons';
import '../../styles/artists-page.css';

const artistsData = [
    { id: 1, name: 'Daft Punk', image: 'https://i.scdn.co/image/ab6761610000e5eba7bfd7835b5c1eee0c95573b' },
    { id: 2, name: 'Gorillaz', image: 'https://i.scdn.co/image/ab6761610000e5eb0dc29c6e2df5f2e7e0b9a0bc' },
    { id: 3, name: 'MGMT', image: 'https://i.scdn.co/image/ab6761610000e5eb8b32b139981e79f2ebe005eb' },
    { id: 4, name: 'The Strokes', image: 'https://i.scdn.co/image/ab6761610000e5eb8ae7f2aaa9817a704a87ea36' },
    { id: 5, name: 'Arctic Monkeys', image: 'https://i.scdn.co/image/ab6761610000e5eb7da39dd5ce6a835b476f3830' },
    { id: 6, name: 'Nirvana', image: 'https://i.scdn.co/image/ab6761610000e5eb022d80b3224ee3a1c3e9d2c9' },
    { id: 7, name: "Guns N' Roses", image: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb2' },
    { id: 8, name: 'Queen', image: 'https://i.scdn.co/image/ab6761610000e5eb0dc29c6e2df5f2e7e0b9a0bc' },
];

const ArtistsPage = () => {
    return (
        <div className="artists-page">
            <div className="page-header">
                <h1>Artists</h1>
            </div>

            <div className="artists-grid">
                {artistsData.map((artist) => (
                    <div key={artist.id} className="artist-card">
                        <div className="artist-image-container">
                            <div className="artist-image">
                                <img
                                    src={artist.image}
                                    alt={artist.name}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                            <button className="play-btn">
                                <Play />
                            </button>
                        </div>
                        <h3 className="artist-name">{artist.name}</h3>
                        <p className="artist-type">Artist</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArtistsPage;
