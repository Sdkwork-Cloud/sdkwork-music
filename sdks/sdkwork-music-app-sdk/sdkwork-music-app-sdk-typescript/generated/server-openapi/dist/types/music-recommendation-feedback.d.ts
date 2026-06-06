export interface MusicRecommendationFeedback {
    id: string;
    tenantId: string;
    userId: string;
    itemType: 'track' | 'album' | 'artist' | 'playlist' | 'chart' | 'ai_generation_task';
    itemId: string;
    feedbackType: 'like' | 'dislike' | 'not_interested' | 'skip' | 'hide' | 'report';
    reasonCode?: string;
    context?: Record<string, unknown>;
    createdAt?: string;
}
//# sourceMappingURL=music-recommendation-feedback.d.ts.map