import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Track, PlayerState } from '@/types';

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

    const play = useCallback((track: Track) => {
        setState((prev) => ({ ...prev, currentTrack: track, isPlaying: true, currentTime: 0 }));
    }, []);

    const pause = useCallback(() => {
        setState((prev) => ({ ...prev, isPlaying: false }));
    }, []);

    const resume = useCallback(() => {
        setState((prev) => ({ ...prev, isPlaying: true }));
    }, []);

    const setVolume = useCallback((volume: number) => {
        setState((prev) => ({ ...prev, volume }));
    }, []);

    const seek = useCallback((time: number) => {
        setState((prev) => ({ ...prev, currentTime: time }));
    }, []);

    const addToQueue = useCallback((track: Track) => {
        setState((prev) => ({ ...prev, queue: [...prev.queue, track] }));
    }, []);

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
