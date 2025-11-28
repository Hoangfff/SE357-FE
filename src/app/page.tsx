import { useState } from 'react';
import MusicPlayer from '../components/MusicPlayer';
import TrackList from '../components/TrackList';
import '../styles/page.css';



const HomePage = () => {
    const [currentTrack, setCurrentTrack] = useState<any>(null);

    return (
        <div className="home-page">
            <section className="hero-section">
                <h1 className="hero-title">Discover Your Sound</h1>
                <p className="hero-subtitle">Stream millions of songs, create playlists, and enjoy your music</p>
            </section>

            <section className="featured-section">
                <h2>Featured Playlists</h2>
                <div className="playlist-grid">
                    <div className="playlist-card">
                        <div className="playlist-cover"></div>
                        <h3>Today's Top Hits</h3>
                        <p>The biggest songs right now</p>
                    </div>
                    <div className="playlist-card">
                        <div className="playlist-cover"></div>
                        <h3>Chill Vibes</h3>
                        <p>Relax and unwind with these tracks</p>
                    </div>
                    <div className="playlist-card">
                        <div className="playlist-cover"></div>
                        <h3>Workout Mix</h3>
                        <p>Get pumped with high-energy music</p>
                    </div>
                    <div className="playlist-card">
                        <div className="playlist-cover"></div>
                        <h3>Focus Flow</h3>
                        <p>Stay concentrated with ambient sounds</p>
                    </div>
                </div>
            </section>

            <section className="recent-section">
                <h2>Recently Played</h2>
                <TrackList onTrackSelect={setCurrentTrack} />
            </section>

            {currentTrack && <MusicPlayer track={currentTrack} />}
        </div>
    );
};

export default HomePage;
