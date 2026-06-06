export interface MusicPlaybackSessionCommand {
  deviceId: string;
  currentTrackId?: string;
  queue?: string[];
  positionMs?: number;
  playbackState: 'idle' | 'playing' | 'paused' | 'buffering' | 'ended';
}
