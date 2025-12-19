import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart, HeartFilled, Queue, Devices, MoreHorizontal } from '../lib/icons';
import '../styles/music-player.css';

interface Track {
    id: string;
    title: string;
    artist: string;
    album?: string;
    duration: number;
    coverUrl?: string;
    audioUrl?: string;
}

interface MusicPlayerProps {
    track: Track;
}

const MusicPlayer = ({ track }: MusicPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(track.duration);
    const [volume, setVolume] = useState(0.7);
    const [isLiked, setIsLiked] = useState(true);
    const [isShuffleOn, setIsShuffleOn] = useState(false);
    const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one

    // Update audio element when track changes
    useEffect(() => {
        if (audioRef.current && track.audioUrl) {
            audioRef.current.src = track.audioUrl;
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current.play();
            }
        }
    }, [track.audioUrl]);

    // Update volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Handle play/pause
    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Handle time update
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    // Handle loaded metadata
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    // Handle song end
    const handleEnded = () => {
        if (repeatMode === 2) {
            // Repeat one
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }
        } else if (repeatMode === 1) {
            // Repeat all - for demo, just replay the same song
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }
        } else {
            setIsPlaying(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="spotify-player">
            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />

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
                        onClick={togglePlay}
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
                            max={duration}
                            value={currentTime}
                            onChange={handleSeek}
                            className="progress-bar"
                            style={{ '--progress': `${progressPercent}%` } as React.CSSProperties}
                        />
                    </div>
                    <span className="time total">{formatTime(duration)}</span>
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
