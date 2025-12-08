import React from 'react';
import { Github, Facebook, Instagram } from 'lucide-react';

const AdminFooter = () => {
    return (
        <footer style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem 2rem',
            backgroundColor: 'var(--admin-card-bg)',
            borderRadius: '1rem',
            marginTop: '2rem'
        }}>
            {/* Left: Links */}
            <div style={{ display: 'flex', gap: '2rem' }}>
                <a href="#" style={linkStyle}>Terms and privacy</a>
                <a href="#" style={linkStyle}>About</a>
            </div>

            {/* Right: Social Icons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" style={iconStyle}><Github size={20} /></a>
                <a href="#" style={iconStyle}><Facebook size={20} /></a>
                <a href="#" style={iconStyle}><Instagram size={20} /></a>
            </div>
        </footer>
    );
};

const linkStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '0.875rem',
    transition: 'color 0.2s ease'
};

const iconStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease'
};

export default AdminFooter;
