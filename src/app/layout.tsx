import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MusicPlayer from '../components/MusicPlayer';
import '../styles/spotify-theme.css';
import '../styles/app-layout.css';

const Layout = () => {
    // Default track for the player
    const defaultTrack = {
        id: '1',
        title: 'Get Lucky',
        artist: 'Daft Punk',
        album: 'Random Access Memories',
        duration: 275,
        coverUrl: 'https://i.scdn.co/image/ab67616d0000b273a7c37f72a5d1040c05e30916'
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
