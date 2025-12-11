import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart, HeartFilled, Queue, Devices, MoreHorizontal } from '../lib/icons';
import '../styles/music-player.css';

interface Track {
    id: string;
    title: string;
    artist: string;
    album?: string;
    duration: number;
    coverUrl?: string;
}

interface MusicPlayerProps {
    track: Track;
}

const MusicPlayer = ({ track }: MusicPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(143); // 2:23
    const [volume, setVolume] = useState(0.7);
    const [isLiked, setIsLiked] = useState(true);
    const [isShuffleOn, setIsShuffleOn] = useState(false);
    const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTime(parseFloat(e.target.value));
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    };

    const progressPercent = (currentTime / track.duration) * 100;

    return (
        <div className="spotify-player">
            {/* Left: Track Info */}
            <div className="player-left">
                <div className="player-cover">
                    {track.coverUrl ? (
                        <img src={track.coverUrl} alt={track.title} />
                    ) : (
                        <div className="cover-placeholder"></div>
                    )}
                </div>
                <div className="player-track-info">
                    <p className="track-name">{track.title}</p>
                    <p className="track-artist">{track.artist}</p>
                </div>
                <button
                    className={`like-btn ${isLiked ? 'liked' : ''}`}
                    onClick={() => setIsLiked(!isLiked)}
                >
                    {isLiked ? <HeartFilled /> : <Heart />}
                </button>
            </div>

            {/* Center: Controls */}
            <div className="player-center">
                <div className="player-controls">
                    <button
                        className={`control-btn small ${isShuffleOn ? 'active' : ''}`}
                        onClick={() => setIsShuffleOn(!isShuffleOn)}
                    >
                        <Shuffle />
                    </button>
                    <button className="control-btn">
                        <SkipBack />
                    </button>
                    <button
                        className="control-btn play-pause"
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? <Pause /> : <Play />}
                    </button>
                    <button className="control-btn">
                        <SkipForward />
                    </button>
                    <button
                        className={`control-btn small ${repeatMode > 0 ? 'active' : ''}`}
                        onClick={() => setRepeatMode((repeatMode + 1) % 3)}
                    >
                        <Repeat />
                        {repeatMode === 2 && <span className="repeat-one">1</span>}
                    </button>
                </div>
                <div className="player-progress">
                    <span className="time current">{formatTime(currentTime)}</span>
                    <div className="progress-bar-container">
                        <input
                            type="range"
                            min="0"
                            max={track.duration}
                            value={currentTime}
                            onChange={handleSeek}
                            className="progress-bar"
                            style={{ '--progress': `${progressPercent}%` } as React.CSSProperties}
                        />
                    </div>
                    <span className="time total">{formatTime(track.duration)}</span>
                </div>
            </div>

            {/* Right: Volume & Extra Controls */}
            <div className="player-right">
                <button className="control-btn small">
                    <Queue />
                </button>
                <button className="control-btn small">
                    <Devices />
                </button>
                <div className="volume-control">
                    <button className="control-btn small">
                        <Volume2 />
                    </button>
                    <div className="volume-bar-container">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="volume-bar"
                            style={{ '--volume': `${volume * 100}%` } as React.CSSProperties}
                        />
                    </div>
                </div>
                <button className="control-btn small">
                    <MoreHorizontal />
                </button>
            </div>
        </div>
    );
};

export default MusicPlayer;
