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

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="app-main">
                <Header />
                <main className="app-content">
                    <Outlet />
                </main>
            </div>
            <MusicPlayer />
        </div>
    );
};

export default Layout;
