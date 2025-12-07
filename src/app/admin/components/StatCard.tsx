import React from 'react';
import type { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    subtitle?: string; // e.g. "+23% since last month"
    trend?: 'up' | 'down' | 'neutral';
}

const StatCard = ({ title, value, icon, subtitle, trend }: StatCardProps) => {
    return (
        <div className="stat-card" style={{
            backgroundColor: 'var(--admin-card-bg)',
            padding: '1.5rem',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            minWidth: '240px'
        }}>
            <div className="icon-wrapper" style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(124, 58, 237, 0.1)', // Primary opacity
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </div>

            <div className="content">
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    {title}
                </p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                    {value}
                </h3>
                {subtitle && (
                    <p style={{
                        fontSize: '0.75rem',
                        marginTop: '0.25rem',
                        color: trend === 'up' ? '#10B981' : (trend === 'down' ? '#EF4444' : 'var(--text-secondary)')
                    }}>
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
};

export default StatCard;
