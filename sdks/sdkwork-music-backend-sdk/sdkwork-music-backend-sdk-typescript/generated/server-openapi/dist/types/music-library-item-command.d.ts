export interface MusicLibraryItemCommand {
    itemType: 'track' | 'album' | 'artist' | 'playlist' | 'chart' | 'ai_generation_task';
    itemId: string;
    source: 'favorite' | 'collected' | 'downloaded' | 'created' | 'followed' | 'recent';
}
//# sourceMappingURL=music-library-item-command.d.ts.map