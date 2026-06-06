import type { MusicModerationStatus } from './music-moderation-status';
export interface MusicMediaAiProvenance {
    provenance: 'generated' | 'edited' | 'uploaded' | 'unknown';
    provider?: string;
    model?: string;
    taskId?: string;
    moderationStatus?: MusicModerationStatus;
}
//# sourceMappingURL=music-media-ai-provenance.d.ts.map