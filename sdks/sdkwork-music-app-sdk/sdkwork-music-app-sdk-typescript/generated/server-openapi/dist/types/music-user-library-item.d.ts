export interface MusicUserLibraryItem {
    id: string;
    tenantId: string;
    userId: string;
    itemType: 'track' | 'album' | 'artist' | 'playlist' | 'chart' | 'ai_generation_task';
    itemId: string;
    source: 'favorite' | 'collected' | 'downloaded' | 'created' | 'followed' | 'recent';
    updatedAt?: string;
}
//# sourceMappingURL=music-user-library-item.d.ts.map