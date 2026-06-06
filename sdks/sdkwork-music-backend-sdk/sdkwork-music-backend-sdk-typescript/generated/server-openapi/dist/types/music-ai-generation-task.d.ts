import type { MusicAiGenerationTaskStatus } from './music-ai-generation-task-status';
import type { MusicAiGenerationVariant } from './music-ai-generation-variant';
import type { MusicMediaResource } from './music-media-resource';
import type { MusicModerationStatus } from './music-moderation-status';
export interface MusicAiGenerationTask {
    id: string;
    tenantId: string;
    projectId?: string;
    userId: string;
    prompt: string;
    lyricsPrompt?: string;
    styleTags: string[];
    modelProvider: string;
    modelName: string;
    reference?: MusicMediaResource;
    referenceDriveUri?: string;
    status: MusicAiGenerationTaskStatus;
    moderationStatus: MusicModerationStatus;
    rightsPolicyId?: string;
    variants?: MusicAiGenerationVariant[];
    createdAt?: string;
    updatedAt?: string;
    completedAt?: string;
}
//# sourceMappingURL=music-ai-generation-task.d.ts.map