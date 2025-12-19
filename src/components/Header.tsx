import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Bell, Users, Settings } from '../lib/icons';
import '../styles/header.css';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/home/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/home/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

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

                <form onSubmit={handleSearch} className="search-container">
                    <Search />
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </form>
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
