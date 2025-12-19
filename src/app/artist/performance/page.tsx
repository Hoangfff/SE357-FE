'use client';

import { useState, useEffect, useCallback } from 'react';
import { XAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ChevronDown, Loader2, Music, Play } from 'lucide-react';
import '../../../styles/my-performance-page.css';
import { artistService } from '../../../services/artistService';
import type { Track } from '../../../types/artist';

// Mock data for charts - will be replaced with actual API data
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const generateMockData = () => {
    return Array.from({ length: 10 }, (_, i) => ({
        day: String(i + 1).padStart(2, '0'),
        value: Math.floor(Math.random() * 80) + 20,
    }));
};

const MyPerformancePage = () => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Chart period selectors
    const [likesMonth, setLikesMonth] = useState('April');
    const [sharesMonth, setSharesMonth] = useState('April');
    const [showLikesDropdown, setShowLikesDropdown] = useState(false);
    const [showSharesDropdown, setShowSharesDropdown] = useState(false);

    // Mock chart data
    const [likesData] = useState(generateMockData());
    const [sharesData] = useState(generateMockData());

    // Fetch tracks
    const fetchTracks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await artistService.getArtistMusic();
            // Sort by vote count (likes) descending
            const sortedTracks = data.sort((a, b) => b.voteCount - a.voteCount);
            setTracks(sortedTracks);
        } catch (err) {
            console.error('Failed to fetch tracks:', err);
            setError('Failed to load performance data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTracks();
    }, [fetchTracks]);

    // Play track handler
    const handlePlayTrack = (track: Track) => {
        artistService.playAlbum([track]);
    };

    // Format duration
    const formatDuration = (seconds?: number) => {
        if (!seconds) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Format large numbers
    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + ',000';
        }
        return num.toLocaleString();
    };

    // Get artist name from track
    const getArtistName = (track: Track) => {
        // Return genre as secondary info since artist info isn't in the Track type
        return track.genre || 'Artist';
    };

    if (isLoading) {
        return (
            <div className="my-performance-page">
                <div className="loading-container">
                    <Loader2 size={40} className="spinner" />
                    <p>Loading performance data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-performance-page">
            {/* Error Message */}
            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={fetchTracks}>Retry</button>
                </div>
            )}

            <div className="performance-content">
                {/* Left Section - Charts */}
                <div className="charts-section">
                    {/* Total Likes Chart */}
                    <div className="chart-container">
                        <div className="chart-header">
                            <h3 className="chart-title">Total Likes</h3>
                            <div className="month-selector">
                                <button
                                    className="month-dropdown-btn"
                                    onClick={() => setShowLikesDropdown(!showLikesDropdown)}
                                >
                                    {likesMonth}
                                    <ChevronDown size={16} />
                                </button>
                                {showLikesDropdown && (
                                    <div className="month-dropdown">
                                        {months.map((month) => (
                                            <button
                                                key={month}
                                                className={`month-option ${month === likesMonth ? 'active' : ''}`}
                                                onClick={() => {
                                                    setLikesMonth(month);
                                                    setShowLikesDropdown(false);
                                                }}
                                            >
                                                {month}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height={120}>
                                <AreaChart data={likesData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1db954" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#1db954" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#888', fontSize: 11 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#282828',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                        labelStyle={{ color: '#888' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#fff"
                                        strokeWidth={2}
                                        fill="url(#likesGradient)"
                                        dot={false}
                                        activeDot={{ r: 6, fill: '#fff', stroke: '#1db954', strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Total Shares Chart */}
                    <div className="chart-container">
                        <div className="chart-header">
                            <h3 className="chart-title">Total Shares</h3>
                            <div className="month-selector">
                                <button
                                    className="month-dropdown-btn"
                                    onClick={() => setShowSharesDropdown(!showSharesDropdown)}
                                >
                                    {sharesMonth}
                                    <ChevronDown size={16} />
                                </button>
                                {showSharesDropdown && (
                                    <div className="month-dropdown">
                                        {months.map((month) => (
                                            <button
                                                key={month}
                                                className={`month-option ${month === sharesMonth ? 'active' : ''}`}
                                                onClick={() => {
                                                    setSharesMonth(month);
                                                    setShowSharesDropdown(false);
                                                }}
                                            >
                                                {month}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height={120}>
                                <AreaChart data={sharesData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="sharesGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1db954" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#1db954" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#888', fontSize: 11 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#282828',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                        labelStyle={{ color: '#888' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#fff"
                                        strokeWidth={2}
                                        fill="url(#sharesGradient)"
                                        dot={false}
                                        activeDot={{ r: 6, fill: '#fff', stroke: '#1db954', strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Section - Most Liked Songs */}
                <div className="ranking-section">
                    <h2 className="ranking-title">Most Liked Songs</h2>

                    <div className="ranking-table">
                        {/* Table Header */}
                        <div className="ranking-header">
                            <div className="col-rank">#</div>
                            <div className="col-title">Title</div>
                            <div className="col-likes">Total likes</div>
                            <div className="col-duration">Duration</div>
                        </div>

                        {/* Track Rows */}
                        {tracks.length === 0 ? (
                            <div className="empty-state">
                                <Music size={48} />
                                <h3>No tracks found</h3>
                                <p>Upload some tracks to see your performance stats</p>
                            </div>
                        ) : (
                            tracks.slice(0, 10).map((track, index) => (
                                <div key={track.id} className="ranking-row">
                                    <div className="col-rank">
                                        <span className="rank-number">{index + 1}</span>
                                        <button
                                            className="play-btn-small"
                                            onClick={() => handlePlayTrack(track)}
                                        >
                                            <Play size={14} />
                                        </button>
                                    </div>

                                    <div className="col-title">
                                        <div className="track-cover">
                                            {track.albumTracks?.[0]?.albums?.coverUrl ? (
                                                <img src={track.albumTracks[0].albums.coverUrl} alt={track.title} />
                                            ) : (
                                                <div className="cover-placeholder">
                                                    <Music size={16} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="track-info">
                                            <span className="track-name">{track.title}</span>
                                            <span className="track-artist">{getArtistName(track)}</span>
                                        </div>
                                    </div>

                                    <div className="col-likes">
                                        <span>{formatNumber(track.voteCount * 1000)}</span>
                                    </div>

                                    <div className="col-duration">
                                        <span>{formatDuration()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPerformancePage;
