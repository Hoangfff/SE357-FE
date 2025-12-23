import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart, HeartFilled, Queue, Devices, MoreHorizontal } from '@/lib/icons';
import { usePlayer } from '@/providers/PlayerProvider';
import '@/styles/music-player.css';

const MusicPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const { currentTrack, isPlaying, volume, currentTime, pause, resume, setVolume: setPlayerVolume, seek } = usePlayer();

    const [isLiked, setIsLiked] = useState(false);
    const [isShuffleOn, setIsShuffleOn] = useState(false);
    const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one
    const [duration, setDuration] = useState(0);

    // Load new audio source whenever the track changes
    useEffect(() => {
        if (!audioRef.current) return;

        if (currentTrack?.audioUrl) {
            audioRef.current.src = currentTrack.audioUrl;
            audioRef.current.load();
            seek(0);
        }
    }, [currentTrack?.audioUrl, seek]);

    // Sync play/pause with global state
    useEffect(() => {
        if (!audioRef.current) return;
        if (!currentTrack?.audioUrl) return;

        if (isPlaying) {
            void audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, currentTrack?.audioUrl]);

    // Sync volume with global state
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlay = () => {
        if (!audioRef.current || !currentTrack?.audioUrl) return;

        if (isPlaying) {
            audioRef.current.pause();
            pause();
        } else {
            void audioRef.current.play();
            resume();
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            seek(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration || currentTrack?.duration || 0);
        }
    };

    const handleEnded = () => {
        if (repeatMode === 2) {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                void audioRef.current.play();
            }
        } else if (repeatMode === 1) {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                void audioRef.current.play();
            }
        } else {
            pause();
        }
    };

    const formatTime = (seconds: number) => {
        if (!Number.isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
        seek(newTime);
    };

    const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setPlayerVolume(newVolume);
    };

    const effectiveDuration = duration || currentTrack?.duration || 0;
    const progressPercent = effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0;

    return (
        <div className="spotify-player">
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />

            {/* Left: Track Info */}
            <div className="player-left">
                <div className="player-cover">
                    {currentTrack?.coverUrl ? (
                        <img src={currentTrack.coverUrl} alt={currentTrack.title} />
                    ) : (
                        <img src="/placeholders/music-track.svg" alt="No cover" className="cover-placeholder" />
                    )}
                </div>
                <div className="player-track-info">
                    <p className="track-name">{currentTrack?.title ?? 'No track selected'}</p>
                    <p className="track-artist">{currentTrack?.artist ?? 'Choose a song to start listening'}</p>
                </div>
                <button
                    className={`like-btn ${isLiked ? 'liked' : ''}`}
                    onClick={() => setIsLiked(!isLiked)}
                    disabled={!currentTrack}
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
                        disabled={!currentTrack}
                    >
                        <Shuffle />
                    </button>
                    <button className="control-btn" disabled>
                        <SkipBack />
                    </button>
                    <button
                        className="control-btn play-pause"
                        onClick={togglePlay}
                        disabled={!currentTrack?.audioUrl}
                    >
                        {isPlaying ? <Pause /> : <Play />}
                    </button>
                    <button className="control-btn" disabled>
                        <SkipForward />
                    </button>
                    <button
                        className={`control-btn small ${repeatMode > 0 ? 'active' : ''}`}
                        onClick={() => setRepeatMode((repeatMode + 1) % 3)}
                        disabled={!currentTrack}
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
                            max={effectiveDuration}
                            value={currentTime}
                            onChange={handleSeek}
                            className="progress-bar"
                            disabled={!currentTrack}
                            style={{ '--progress': `${progressPercent}%` } as React.CSSProperties}
                        />
                    </div>
                    <span className="time total">{formatTime(effectiveDuration)}</span>
                </div>
            </div>

            {/* Right: Volume & Extra Controls */}
            <div className="player-right">
                <button className="control-btn small" disabled>
                    <Queue />
                </button>
                <button className="control-btn small" disabled>
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
