import { NavLink } from 'react-router-dom';
import { Home, Search, Bell, Users, Settings } from '../lib/icons';
import '../styles/header.css';

const Header = () => {
    return (
        <header className="spotify-header">
            <div className="header-left">
                <div className="header-tabs">
                    <NavLink
                        to="/home"
                        end
                        className={({ isActive }) => `header-tab ${isActive ? 'active' : ''}`}
                    >
                        <Home />
                        <span>Home</span>
                    </NavLink>
                </div>

                <div className="search-container">
                    <Search />
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                    />
                </div>
            </div>

            <div className="header-right">
                <button className="header-icon-btn" title="Notifications">
                    <Bell />
                </button>
                <button className="header-icon-btn" title="Friends">
                    <Users />
                </button>
                <button className="header-icon-btn" title="Settings">
                    <Settings />
                </button>
                <div className="user-avatar">
                    <img
                        src="https://i.pravatar.cc/32?img=3"
                        alt="User"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
