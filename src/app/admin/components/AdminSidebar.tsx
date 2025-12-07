import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    AppWindow,
    Music,
    FileText,
    Settings,
    HelpCircle,
    LogOut
} from 'lucide-react';
import '../../../styles/admin-theme.css'; // Ensure variables are available

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        // Clear mock auth
        localStorage.removeItem('userRole');
        navigate('/auth/login');
    };

    return (
        <aside className="admin-sidebar" style={{
            width: 'var(--sidebar-width, 280px)',
            backgroundColor: 'var(--sidebar-bg, #0F172A)',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid rgba(255,255,255,0.1)',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0
        }}>

            <nav className="sidebar-nav" style={{ flex: 1, padding: '0 1rem' }}>
                <NavLink to="/admin" end className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                } style={navItemStyle}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/admin/accounts" className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                } style={navItemStyle}>
                    <Users size={20} />
                    <span>Accounts</span>
                </NavLink>

                <NavLink to="/admin/applications" className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                } style={navItemStyle}>
                    <AppWindow size={20} />
                    <span>Applications</span>
                </NavLink>

                <NavLink to="/admin/music" className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                } style={navItemStyle}>
                    <Music size={20} />
                    <span>Music</span>
                </NavLink>

                <NavLink to="/admin/reports" className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                } style={navItemStyle}>
                    <FileText size={20} />
                    <span>Reports</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer" style={{
                padding: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <NavLink to="/admin/settings" className="nav-item">
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>
                <NavLink to="/admin/help" className="nav-item">
                    <HelpCircle size={20} />
                    <span>Help center</span>
                </NavLink>
                <button onClick={handleSignOut} className="nav-item" style={{
                    color: 'var(--warning)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 'inherit',
                    fontFamily: 'inherit'
                }}>
                    <LogOut size={20} />
                    <span>Sign out</span>
                </button>
            </div>

            <style>{`
                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.75rem 1rem;
                    color: var(--text-secondary);
                    text-decoration: none;
                    border-radius: 0.5rem;
                    margin-bottom: 0.5rem;
                    transition: all 0.2s;
                    position: relative;
                }
                .nav-item:hover {
                    color: var(--text-primary);
                    background: rgba(255,255,255,0.05);
                }
                .nav-item.active {
                    color: var(--text-primary);
                    background: transparent; /* Design doesn't show full bg, just icon color highlight maybe? Or text? */
                }
                .nav-item.active svg {
                    color: var(--primary);
                }
                /* The active bar at the end */
                .nav-item.active::after {
                    content: '';
                    position: absolute;
                    right: -1rem; /* Adjust based on padding */
                    top: 50%;
                    transform: translateY(-50%);
                    width: 4px;
                    height: 20px;
                    background-color: var(--primary);
                    border-radius: 4px 0 0 4px;
                }
            `}</style>
        </aside>
    );
};

// Helper for inline styles if needed, but using style tag for pseudo-elements
const navItemStyle = (props?: { isActive?: boolean }) => ({
    // calculated in className/style tag
});

export default AdminSidebar;
