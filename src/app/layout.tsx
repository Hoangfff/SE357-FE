import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MusicPlayer from '@/components/MusicPlayer';
import '@/styles/spotify-theme.css';
import '@/styles/app-layout.css';

const Layout = () => {
    const navigate = useNavigate();

    // Listen for unauthorized events (token expired during session)
    useEffect(() => {
        const handleUnauthorized = () => {
            navigate('/auth/login', { replace: true });
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, [navigate]);

    // Default track for the player (demo song)
    const defaultTrack = {
        id: '1',
        title: 'Acoustic Breeze',
        artist: 'Benjamin Tissot',
        album: 'Bensound Collection',
        duration: 145,
        coverUrl: 'https://i.scdn.co/image/ab67616d0000b273a7c37f72a5d1040c05e30916',
        audioUrl: 'https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3'
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="app-main">
                <Header />
                <main className="app-content">
                    <Outlet />
                </main>
            </div>
            <MusicPlayer track={defaultTrack} />
        </div>
    );
};

export default Layout;
