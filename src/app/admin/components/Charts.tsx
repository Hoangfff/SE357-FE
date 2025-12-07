import React, { useState } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, YAxis, CartesianGrid } from 'recharts';

// Mock Data for Monthly view
const dataMonthlyUsers = [
    { name: 'Week 1', thisMonth: 1200, lastMonth: 1000 },
    { name: 'Week 2', thisMonth: 1500, lastMonth: 1100 },
    { name: 'Week 3', thisMonth: 1800, lastMonth: 1300 },
    { name: 'Week 4', thisMonth: 2000, lastMonth: 1500 },
];

// Mock Data for Yearly view
const dataYearlyUsers = [
    { name: 'JAN', thisYear: 3000, lastYear: 2000 },
    { name: 'FEB', thisYear: 3200, lastYear: 2200 },
    { name: 'MAR', thisYear: 3500, lastYear: 2400 },
    { name: 'APR', thisYear: 3800, lastYear: 2600 },
    { name: 'MAY', thisYear: 4200, lastYear: 2900 },
    { name: 'JUN', thisYear: 4500, lastYear: 3100 },
    { name: 'JUL', thisYear: 4800, lastYear: 3300 },
    { name: 'AUG', thisYear: 5000, lastYear: 3500 },
    { name: 'SEP', thisYear: 5200, lastYear: 3700 },
    { name: 'OCT', thisYear: 5400, lastYear: 3900 },
    { name: 'NOV', thisYear: 5600, lastYear: 4100 },
    { name: 'DEC', thisYear: 5800, lastYear: 4300 },
];

const dataWeeklyUploads = [
    { name: 'Monday', uploads: 0 },
    { name: 'Tuesday', uploads: 25 },
    { name: 'Wednesday', uploads: 50 },
    { name: 'Thursday', uploads: 25 },
    { name: 'Friday', uploads: 100 },
    { name: 'Saturday', uploads: 10 },
    { name: 'Sunday', uploads: 0 },
];

export const TotalUsersChart = () => {
    const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

    const chartData = viewMode === 'month' ? dataMonthlyUsers : dataYearlyUsers;
    const totalUsers = viewMode === 'month' ? '8,500' : '37,000';
    const period = viewMode === 'month' ? 'This month' : 'This year';

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header Section */}
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        <span>📅 {period}</span>
                    </div>
                    <h3 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem', marginBottom: '0' }}>
                        {totalUsers}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0' }}>
                        Total users <span style={{ color: '#10B981' }}>▲ +2.45%</span>
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: '#10B981', fontSize: '0.875rem', fontWeight: 600 }}>
                        <div style={{ width: 16, height: 16, background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                        On track
                    </div>
                </div>

                {/* Toggle Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '0.5rem' }}>
                    <button
                        onClick={() => setViewMode('month')}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: viewMode === 'month' ? 'var(--primary)' : 'transparent',
                            color: viewMode === 'month' ? '#fff' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                        }}
                    >
                        Month
                    </button>
                    <button
                        onClick={() => setViewMode('year')}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: viewMode === 'year' ? 'var(--primary)' : 'transparent',
                            color: viewMode === 'year' ? '#fff' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                        }}
                    >
                        Year
                    </button>
                </div>
            </div>

            {/* Chart Section - flex: 1 to take remaining space */}
            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, bottom: 5, left: 30 }}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#A3AED0', fontSize: 12 }}
                            dy={10}
                            padding={{ left: 20, right: 20 }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Line
                            type="monotone"
                            dataKey={viewMode === 'month' ? 'thisMonth' : 'thisYear'}
                            stroke="#7C3AED"
                            strokeWidth={4}
                            dot={false}
                            activeDot={{ r: 8, fill: '#7C3AED', stroke: '#fff', strokeWidth: 2 }}
                        />
                        <Line
                            type="monotone"
                            dataKey={viewMode === 'month' ? 'lastMonth' : 'lastYear'}
                            stroke="#06B6D4"
                            strokeWidth={4}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


export const WeeklyUploadsChart = () => {
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1.5rem', margin: 0 }}>Weekly Music Uploads</h3>
            <div style={{ flex: 1, minHeight: 0, marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dataWeeklyUploads} margin={{ top: 5, right: 30, bottom: 5, left: 30 }}>
                        <CartesianGrid vertical={true} horizontal={true} stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#A3AED0', fontSize: 12 }}
                            dy={10}
                            padding={{ left: 20, right: 20 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#A3AED0', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Line
                            type="linear"
                            dataKey="uploads"
                            stroke="#4318FF"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#4318FF', strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

