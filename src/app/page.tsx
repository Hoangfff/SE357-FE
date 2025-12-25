import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, Play } from '@/lib/icons';
import { musicService, type MusicTrack } from '@/services/musicService';
import { usePlayer } from '@/providers/PlayerProvider';
import '@/styles/home-page.css';

const gradients = [
    'linear-gradient(135deg, #1e3264 0%, #1e3264 100%)',
    'linear-gradient(135deg, #e61e32 0%, #dc1e28 100%)',
    'linear-gradient(135deg, #e8115b 0%, #e8115b 100%)',
    'linear-gradient(135deg, #006450 0%, #008a5f 100%)',
    'linear-gradient(135deg, #8d67ab 0%, #af2896 100%)',
    'linear-gradient(135deg, #1e90ff 0%, #148eff 100%)',
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
    const [madeForYou, setMadeForYou] = useState<MusicTrack[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
    const { play } = usePlayer();

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const tracks = await musicService.getTracks();
                setMadeForYou(tracks);
            } catch (err) {
                console.error('Failed to load music:', err);
                setError('Unable to load your recommendations right now.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTracks();
    }, []);

    const handlePlayTrack = async (track: MusicTrack) => {
        const fallbackUrl = track.fileUrl;
        setPlayingTrackId(track.id);

        try {
            const streamUrl = await musicService.getStreamUrl(String(track.id), fallbackUrl);
            const audioUrl = streamUrl || fallbackUrl;

            if (!audioUrl) {
                setError('No audio source available for this track.');
                return;
            }

            play({
                id: String(track.id),
                title: track.title,
                artist: track.artistProfiles?.stageName || track.artistProfiles?.users?.name || 'Unknown Artist',
                album: track.albumTracks?.[0]?.albums?.title,
                duration: 0,
                coverUrl: track.albumTracks?.[0]?.albums?.coverUrl || track.artistProfiles?.photoUrl || undefined,
                audioUrl,
            });
        } catch (err) {
            console.error('Failed to start playback:', err);
            if (fallbackUrl) {
                play({
                    id: String(track.id),
                    title: track.title,
                    artist: track.artistProfiles?.stageName || track.artistProfiles?.users?.name || 'Unknown Artist',
                    album: track.albumTracks?.[0]?.albums?.title,
                    duration: 0,
                    coverUrl: track.albumTracks?.[0]?.albums?.coverUrl || track.artistProfiles?.photoUrl || undefined,
                    audioUrl: fallbackUrl,
                });
            } else {
                setError('Could not play this track.');
            }
        } finally {
            setPlayingTrackId(null);
        }
    };

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
                    {isLoading && (
                        <div className="music-card" style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <p>Loading your picks...</p>
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="music-card" style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <p>{error}</p>
                        </div>
                    )}

                    {!isLoading && !error && madeForYou.length === 0 && (
                        <div className="music-card" style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <p>No tracks available yet.</p>
                        </div>
                    )}

                    {!isLoading && !error && madeForYou.map((track, index) => {
                        const image = track.albumTracks?.[0]?.albums?.coverUrl || track.artistProfiles?.photoUrl || '/placeholders/music-track.svg';
                        const artistName = track.artistProfiles?.stageName || track.artistProfiles?.users?.name || 'Unknown Artist';
                        const subtitle = track.genre ? `${artistName} • ${track.genre}` : artistName;

                        return (
                            <div key={track.id} className="music-card">
                                <div className="card-image-container">
                                    <div
                                        className="card-image"
                                        style={{ background: gradients[index % gradients.length] }}
                                    >
                                        <img
                                            src={image}
                                            alt={track.title}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/placeholders/music-track.svg';
                                            }}
                                        />
                                    </div>
                                    <button
                                        className="card-play-btn"
                                        onClick={() => handlePlayTrack(track)}
                                        disabled={playingTrackId === track.id}
                                        aria-label={`Play ${track.title}`}
                                    >
                                        {playingTrackId === track.id ? '...' : <Play />}
                                    </button>
                                </div>
                                <h3 className="card-title">{track.title}</h3>
                                <p className="card-subtitle">{subtitle}</p>
                            </div>
                        );
                    })}
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
                                            (e.target as HTMLImageElement).src = '/placeholders/music-track.svg';
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
                                            (e.target as HTMLImageElement).src = '/placeholders/user-avatar.svg';
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
