export interface MusicRelease {
    id: string;
    tenantId: string;
    trackId?: string;
    sourceType: 'track' | 'ai_generation_task' | 'ai_generation_variant';
    sourceId: string;
    rightsPolicyId?: string;
    status: 'draft' | 'published' | 'rejected' | 'archived';
    publishedAt?: string;
}
//# sourceMappingURL=music-release.d.ts.map