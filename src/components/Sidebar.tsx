import { NavLink } from 'react-router-dom';
import { Playlist, Heart, Album, Artist, Music, Performance, UserCircle } from '../lib/icons';
import '../styles/sidebar.css';

const Sidebar = () => {
    // Get user role from localStorage (case-insensitive check)
    const userRole = localStorage.getItem('userRole');
    const isArtist = userRole?.toUpperCase() === 'ARTIST';

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

                {/* For Artist Section - Only visible for artist role */}
                {isArtist && (
                    <>
                        <div className="sidebar-divider">
                            <span className="sidebar-section-label">For Artist</span>
                        </div>

                        <NavLink to="/home/artist/albums" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <Album />
                            <span>My Albums</span>
                        </NavLink>

                        <NavLink to="/home/artist/music" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <Music />
                            <span>My Musics</span>
                        </NavLink>

                        <NavLink to="/home/artist/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <UserCircle />
                            <span>Artist Profile</span>
                        </NavLink>

                        <NavLink to="/home/artist/performance" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <Performance />
                            <span>My Performance</span>
                        </NavLink>
                    </>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;
