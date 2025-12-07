import React from 'react';
import { BarChart2, CircleDollarSign, Users, Music } from 'lucide-react';
import StatCard from './components/StatCard';
import { TotalUsersChart, WeeklyUploadsChart } from './components/Charts';

const AdminPage = () => {
    return (
        <div className="admin-dashboard">
            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <StatCard
                    title="Earnings"
                    value="$350.4"
                    icon={<BarChart2 size={24} />}
                />
                <StatCard
                    title="Spend this month"
                    value="$642.39"
                    icon={<CircleDollarSign size={24} />}
                />
                <StatCard
                    title="Total Users"
                    value="70000"
                    subtitle="+23% since last month"
                    trend="up"
                    icon={<Users size={24} />}
                />
                <StatCard
                    title="Total Uploads"
                    value="1600"
                    icon={<Music size={24} />}
                />
            </div>

            {/* Main Content Grid (Charts) */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                gap: '1.5rem'
            }}>
                {/* Total Users Chart Section */}
                <div style={{
                    backgroundColor: 'var(--admin-card-bg)',
                    padding: '1.5rem',
                    borderRadius: '1rem',
                    height: '450px'
                }}>
                    <TotalUsersChart />
                </div>

                {/* Weekly Music Uploads Chart Section (or generic placeholder if layout requires 2 cols) 
                    The design shows Weekly as a full width or separate section below. 
                    Let's put it below for now based on the image structure 
                */}
            </div>

            <div style={{
                marginTop: '1.5rem',
                backgroundColor: 'var(--admin-card-bg)',
                padding: '1.5rem',
                borderRadius: '1rem',
                height: '400px'
            }}>
                <WeeklyUploadsChart />
            </div>
        </div>
    );
};

export default AdminPage;
