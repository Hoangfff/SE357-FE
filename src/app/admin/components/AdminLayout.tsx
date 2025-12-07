import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Bell, Moon, Info, User } from 'lucide-react'; // Top bar icons

const AdminLayout = () => {
    return (
        <div className="admin-layout" style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: 'var(--admin-bg)'
        }}>
            <AdminSidebar />

            <main style={{
                flex: 1,
                marginLeft: 'var(--sidebar-width)',
                padding: '2rem',
                color: 'var(--text-primary)'
            }}>
                {/* Top Header/Toolbar could go here */}
                <div className="admin-header" style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: '2rem',
                    gap: '1rem'
                }}>
                    <div style={iconButtonStyle}>
                        <Bell size={20} />
                    </div>
                    <div style={iconButtonStyle}>
                        <Moon size={20} />
                    </div>
                    <div style={iconButtonStyle}>
                        <Info size={20} />
                    </div>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#333',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* Placeholder Avatar */}
                        <User size={24} />
                        {/* <img src="..." alt="Profile" /> */}
                    </div>
                </div>

                <Outlet />
            </main>
        </div>
    );
};

const iconButtonStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--admin-card-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-secondary)'
};

export default AdminLayout;
