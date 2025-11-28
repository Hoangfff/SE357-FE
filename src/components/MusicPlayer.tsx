import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from '../lib/icons';

interface Track {
    id: string;
    title: string;
    artist: string;
    duration: number;
    coverUrl?: string;
}

interface MusicPlayerProps {
    track: Track;
}

const MusicPlayer = ({ track }: MusicPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    return (
        <div className="music-player">
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
            />

            <div className="player-track-info">
                <div className="player-cover"></div>
                <div className="player-details">
                    <h4>{track.title}</h4>
                    <p>{track.artist}</p>
                </div>
            </div>

            <div className="player-controls">
                <div className="control-buttons">
                    <button className="control-btn"><SkipBack /></button>
                    <button className="control-btn play-btn" onClick={togglePlay}>
                        {isPlaying ? <Pause /> : <Play />}
                    </button>
                    <button className="control-btn"><SkipForward /></button>
                </div>

                <div className="progress-bar">
                    <span className="time">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max={track.duration}
                        value={currentTime}
                        onChange={handleSeek}
                        className="seek-bar"
                    />
                    <span className="time">{formatTime(track.duration)}</span>
                </div>
            </div>

            <div className="player-volume">
                <Volume2 />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-bar"
                />
            </div>
        </div>
    );
};

export default MusicPlayer;
