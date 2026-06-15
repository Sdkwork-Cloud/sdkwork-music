import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { MusicTrack } from '../types/music';

interface PlayerContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  playTrack: (track: MusicTrack) => void;
  togglePlay: () => void;
  seekTo: (time: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    setDuration(track.durationSeconds);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const seekTo = useCallback((time: number) => {
    setProgress(Math.max(0, Math.min(time, duration)));
  }, [duration]);

  // Simulate playback progress
  useEffect(() => {
    if (!isPlaying || !currentTrack) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= duration) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, duration]);

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      progress,
      duration,
      playTrack,
      togglePlay,
      seekTo,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
