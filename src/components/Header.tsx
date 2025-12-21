import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Bell, Users, Settings } from '@/lib/icons';
import { authService } from '@/services/authService';
import { userSession, tokenManager } from '@/lib/apiClient';
import '@/styles/header.css';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [userInfo, setUserInfo] = useState<{ email: string; role: string } | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get user info from session
    useEffect(() => {
        const user = userSession.getUser();
        if (user) {
            setUserInfo({
                email: user.email,
                role: user.role,
            });
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

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

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await authService.logout();
            setTimeout(() => {
                navigate('/auth/login', { replace: true });
            }, 500);
        } catch (error) {
            console.error('Logout error:', error);
            tokenManager.clearAll();
            userSession.clearUser();
            setTimeout(() => {
                navigate('/auth/login', { replace: true });
            }, 500);
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
                <div className="user-avatar-container" ref={dropdownRef}>
                    <div
                        className="user-avatar"
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img
                            src="/placeholders/user-avatar.svg"
                            alt="User"
                        />
                    </div>

                    {showDropdown && (
                        <div className="user-dropdown">
                            <div className="user-dropdown-header">
                                <div className="user-dropdown-avatar">
                                    <img
                                        src="/placeholders/user-avatar.svg"
                                        alt="User"
                                    />
                                </div>
                                <div className="user-dropdown-info">
                                    <div className="user-dropdown-email">{userInfo?.email || 'User'}</div>
                                    <div className="user-dropdown-role">{userInfo?.role || 'USER'}</div>
                                </div>
                            </div>
                            <div className="user-dropdown-divider"></div>
                            <button
                                className="user-dropdown-logout"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                title={isLoggingOut ? 'Logging out...' : 'Logout'}
                            >
                                {isLoggingOut ? (
                                    <>
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            style={{ animation: 'spin 1s linear infinite' }}
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M12 6v6l4 2" />
                                        </svg>
                                        <span>Logging out...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                            <polyline points="16 17 21 12 16 7" />
                                            <line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                        <span>Logout</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {isLoggingOut && (
                    <div className="logout-loading-modal">
                        <div className="logout-loading-content">
                            <div className="logout-spinner">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <p>Logging out...</p>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
