import type { MusicModerationStatus } from './music-moderation-status';

export interface MusicAiGenerationModerationCommand {
  moderationStatus: MusicModerationStatus;
  reason?: string;
}
