import type { MusicMediaResource } from './music-media-resource';
import type { MusicModerationStatus } from './music-moderation-status';

export interface MusicAiGenerationVariant {
  id: string;
  tenantId: string;
  taskId: string;
  audioAssetId?: string;
  title: string;
  audio: MusicMediaResource;
  durationSeconds?: number;
  moderationStatus: MusicModerationStatus;
}
