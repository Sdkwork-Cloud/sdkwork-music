import type { MusicTrack } from './music-track';

export interface MusicListeningHistoryItem {
  trackId: string;
  trackTitle: string;
  playCount: number;
  lastPlayedAt: string;
  track?: MusicTrack;
}
