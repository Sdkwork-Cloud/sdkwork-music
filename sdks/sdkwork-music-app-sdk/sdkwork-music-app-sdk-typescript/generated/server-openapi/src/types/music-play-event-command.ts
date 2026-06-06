export interface MusicPlayEventCommand {
  trackId: string;
  durationSeconds?: number;
  playedSeconds?: number;
  completionRate?: number;
  source?: string;
  occurredAt: string;
}
