import { createContext, useContext, useState, ReactNode } from 'react';
import type { Track, PlayerState } from '../types';

interface PlayerContextType extends PlayerState {
    play: (track: Track) => void;
    pause: () => void;
    resume: () => void;
    setVolume: (volume: number) => void;
    seek: (time: number) => void;
    addToQueue: (track: Track) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<PlayerState>({
        currentTrack: null,
        isPlaying: false,
        volume: 1,
        currentTime: 0,
        queue: [],
    });

    const play = (track: Track) => {
        setState((prev) => ({ ...prev, currentTrack: track, isPlaying: true, currentTime: 0 }));
    };

    const pause = () => {
        setState((prev) => ({ ...prev, isPlaying: false }));
    };

    const resume = () => {
        setState((prev) => ({ ...prev, isPlaying: true }));
    };

    const setVolume = (volume: number) => {
        setState((prev) => ({ ...prev, volume }));
    };

    const seek = (time: number) => {
        setState((prev) => ({ ...prev, currentTime: time }));
    };

    const addToQueue = (track: Track) => {
        setState((prev) => ({ ...prev, queue: [...prev.queue, track] }));
    };

    return (
        <PlayerContext.Provider value={{ ...state, play, pause, resume, setVolume, seek, addToQueue }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within PlayerProvider');
    }
    return context;
};
