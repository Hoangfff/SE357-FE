import { ChevronLeft, ChevronRight, MoreHorizontal, Play } from '../lib/icons';
import '../styles/home-page.css';

// Sample data for the sections
const madeForYouItems = [
    { id: 1, title: 'Discover Weekly', subtitle: 'Your weekly mixtape of fresh music.', gradient: 'linear-gradient(135deg, #1e3264 0%, #1e3264 100%)', image: 'https://i.scdn.co/image/ab67706f000000027b2e7ee752dc222ff2fd466f' },
    { id: 2, title: 'Daily Mix 1', subtitle: 'Linkin Park, System Of A Down, Coal Chamber...', gradient: 'linear-gradient(135deg, #e61e32 0%, #dc1e28 100%)', image: 'https://dailymix-images.scdn.co/v2/img/ab6761610000e5eb5a00969a4698c3132a15fbb2/1/en/default' },
    { id: 3, title: 'Daily Mix 2', subtitle: 'Avril Lavigne, Lorde, Charli XCX and more', gradient: 'linear-gradient(135deg, #e8115b 0%, #e8115b 100%)', image: 'https://dailymix-images.scdn.co/v2/img/ab6761610000e5eb0dc29c6e2df5f2e7e0b9a0bc/2/en/default' },
    { id: 4, title: 'Daily Mix 3', subtitle: 'The Strokes, Martin Garrix, MGMT and more', gradient: 'linear-gradient(135deg, #006450 0%, #008a5f 100%)', image: 'https://dailymix-images.scdn.co/v2/img/ab6761610000e5eb8ae7f2aaa9817a704a87ea36/3/en/default' },
    { id: 5, title: 'Daily Mix 4', subtitle: 'Chuck Berry, Elvis Presley, Roy Orbison and more', gradient: 'linear-gradient(135deg, #8d67ab 0%, #af2896 100%)', image: 'https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebce02c3c9b8c8f4a6e6e5e5e5/4/en/default' },
    { id: 6, title: 'Daily Mix 5', subtitle: 'Frank Sinatra, Gerhard Trede, Dean Martin and more', gradient: 'linear-gradient(135deg, #1e90ff 0%, #148eff 100%)', image: 'https://dailymix-images.scdn.co/v2/img/ab6761610000e5eb4a6c2eb3c3f2e7e0b9a0bc12/5/en/default' },
    { id: 7, title: 'Nirvana Radio', subtitle: 'The Strokes, Martin Garrix, MGMT and more', gradient: 'linear-gradient(135deg, #e13300 0%, #f40 100%)', image: 'https://i.scdn.co/image/ab6761610000e5eb022d80b3224ee3a1c3e9d2c9' },
    { id: 8, title: 'Fall Out Boy Ra...', subtitle: 'Fall Out Boy, All Time Low, The All-American Rejects...', gradient: 'linear-gradient(135deg, #d84000 0%, #e61e32 100%)', image: 'https://i.scdn.co/image/ab6761610000e5eb0dc29c6e2df5f2e7e0b9a0bc' },
];

const topMixes = [
    { id: 1, title: 'Rock Mix', gradient: 'linear-gradient(135deg, #e61e32 0%, #8b0000 100%)', image: 'https://seed-mix-image.spotifycdn.com/v6/img/rock/4Z8W4fKeB5YxbusRsdQVPb/en/default' },
    { id: 2, title: 'Chill Mix', gradient: 'linear-gradient(135deg, #4c1e4f 0%, #4c1e4f 100%)', image: 'https://seed-mix-image.spotifycdn.com/v6/img/chill/4Z8W4fKeB5YxbusRsdQVPb/en/default' },
    { id: 3, title: 'Pop Mix', gradient: 'linear-gradient(135deg, #1e90ff 0%, #148eff 100%)', image: 'https://seed-mix-image.spotifycdn.com/v6/img/pop/4Z8W4fKeB5YxbusRsdQVPb/en/default' },
    { id: 4, title: 'Daft Punk Mix', gradient: 'linear-gradient(135deg, #535353 0%, #333 100%)', image: 'https://seed-mix-image.spotifycdn.com/v6/img/artist/4tZwfgrHOc3mvqYlEYSvVi/en/default' },
    { id: 5, title: 'Happy Mix', gradient: 'linear-gradient(135deg, #e13300 0%, #f40 100%)', image: 'https://seed-mix-image.spotifycdn.com/v6/img/happy/4Z8W4fKeB5YxbusRsdQVPb/en/default' },
    { id: 6, title: 'David Bowie Mix', gradient: 'linear-gradient(135deg, #8b4513 0%, #8b4513 100%)', image: 'https://seed-mix-image.spotifycdn.com/v6/img/artist/0oSGxfWSnnOXhD2fKuz2Gy/en/default' },
    { id: 7, title: 'Upbeat Mix', gradient: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)', image: 'https://seed-mix-image.spotifycdn.com/v6/img/upbeat/4Z8W4fKeB5YxbusRsdQVPb/en/default' },
    { id: 8, title: '60s Mix', gradient: 'linear-gradient(135deg, #b8860b 0%, #b8860b 100%)', image: 'https://seed-mix-image.spotifycdn.com/v6/img/decades/2020/1/en/default' },
];

const favoriteArtists = [
    { id: 1, name: "Guns N' Roses", image: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb2' },
    { id: 2, name: 'Daft Punk', image: 'https://i.scdn.co/image/ab6761610000e5eba7bfd7835b5c1eee0c95573b' },
    { id: 3, name: 'Nirvana', image: 'https://i.scdn.co/image/ab6761610000e5eb022d80b3224ee3a1c3e9d2c9' },
    { id: 4, name: 'MGMT', image: 'https://i.scdn.co/image/ab6761610000e5eb0dc29c6e2df5f2e7e0b9a0bc' },
    { id: 5, name: 'The Strokes', image: 'https://i.scdn.co/image/ab6761610000e5eb8ae7f2aaa9817a704a87ea36' },
    { id: 6, name: 'Arctic Monkeys', image: 'https://i.scdn.co/image/ab6761610000e5eb7da39dd5ce6a835b476f3830' },
];

const HomePage = () => {
    return (
        <div className="home-page">
            {/* Made For You Section */}
            <section className="content-section">
                <div className="section-header">
                    <h2>Made For You</h2>
                    <div className="section-controls">
                        <button className="nav-btn" disabled><ChevronLeft /></button>
                        <button className="nav-btn"><ChevronRight /></button>
                        <button className="more-btn"><MoreHorizontal /></button>
                    </div>
                </div>
                <div className="card-scroll">
                    {madeForYouItems.map((item) => (
                        <div key={item.id} className="music-card">
                            <div className="card-image-container">
                                <div
                                    className="card-image"
                                    style={{ background: item.gradient }}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                                <button className="card-play-btn">
                                    <Play />
                                </button>
                            </div>
                            <h3 className="card-title">{item.title}</h3>
                            <p className="card-subtitle">{item.subtitle}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Your Top Mixes Section */}
            <section className="content-section">
                <div className="section-header">
                    <h2>Your top mixes</h2>
                    <div className="section-controls">
                        <button className="nav-btn" disabled><ChevronLeft /></button>
                        <button className="nav-btn"><ChevronRight /></button>
                        <button className="more-btn"><MoreHorizontal /></button>
                    </div>
                </div>
                <div className="card-scroll">
                    {topMixes.map((mix) => (
                        <div key={mix.id} className="music-card mix-card">
                            <div className="card-image-container">
                                <div
                                    className="card-image"
                                    style={{ background: mix.gradient }}
                                >
                                    <img
                                        src={mix.image}
                                        alt={mix.title}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                    <div className="mix-label">{mix.title}</div>
                                </div>
                                <button className="card-play-btn">
                                    <Play />
                                </button>
                            </div>
                            <h3 className="card-title">{mix.title}</h3>
                            <p className="card-subtitle">Based on your recent listening</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Your Favorite Artists Section */}
            <section className="content-section">
                <div className="section-header">
                    <h2>Your favorite artists</h2>
                    <div className="section-controls">
                        <button className="nav-btn" disabled><ChevronLeft /></button>
                        <button className="nav-btn"><ChevronRight /></button>
                        <button className="more-btn"><MoreHorizontal /></button>
                    </div>
                </div>
                <div className="card-scroll">
                    {favoriteArtists.map((artist) => (
                        <div key={artist.id} className="music-card artist-card">
                            <div className="card-image-container">
                                <div className="card-image circular">
                                    <img
                                        src={artist.image}
                                        alt={artist.name}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                                <button className="card-play-btn">
                                    <Play />
                                </button>
                            </div>
                            <h3 className="card-title">{artist.name}</h3>
                            <p className="card-subtitle">Artist</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
