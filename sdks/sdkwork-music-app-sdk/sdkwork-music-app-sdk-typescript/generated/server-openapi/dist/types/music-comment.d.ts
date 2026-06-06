import type { MusicModerationStatus } from './music-moderation-status';
export interface MusicComment {
    id: string;
    tenantId: string;
    userId: string;
    resourceType: string;
    resourceId: string;
    parentCommentId?: string;
    body: string;
    moderationStatus: MusicModerationStatus;
    likeCount?: number;
    replyCount?: number;
    createdAt?: string;
    updatedAt?: string;
}
//# sourceMappingURL=music-comment.d.ts.map