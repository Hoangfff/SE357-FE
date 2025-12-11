import { NavLink } from 'react-router-dom';
import { Home, Music, Library, Settings, User } from '../lib/icons';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2 className="logo">🎵 MusicHub</h2>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
                    <Home />
                    <span>Home</span>
                </NavLink>

                <NavLink to="/home/search" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <Music />
                    <span>Search</span>
                </NavLink>

                <NavLink to="/home/library" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <Library />
                    <span>Your Library</span>
                </NavLink>

                <NavLink to="/home/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <Settings />
                    <span>Settings</span>
                </NavLink>

            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar"></div>
                    <div className="user-info">
                        <p className="user-name">Music Lover</p>
                        <p className="user-email">user@example.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
