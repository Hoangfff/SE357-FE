import { NavLink } from 'react-router-dom';
import { Playlist, Heart, Album, Artist, Home, Search } from '../lib/icons';
import '../styles/sidebar.css';

const Sidebar = () => {
    return (
        <aside className="spotify-sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                        <rect x="2" y="6" width="3" height="12" rx="1.5" />
                        <rect x="7" y="3" width="3" height="18" rx="1.5" />
                        <rect x="12" y="8" width="3" height="8" rx="1.5" />
                    </svg>
                </div>
                <span className="logo-text">My Library</span>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/home/playlists" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <Playlist />
                    <span>Playlists</span>
                </NavLink>

                <NavLink to="/home/liked-songs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <Heart />
                    <span>Liked songs</span>
                </NavLink>

                <NavLink to="/home/albums" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <Album />
                    <span>Albums</span>
                </NavLink>

                <NavLink to="/home/artists" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <Artist />
                    <span>Artists</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;
