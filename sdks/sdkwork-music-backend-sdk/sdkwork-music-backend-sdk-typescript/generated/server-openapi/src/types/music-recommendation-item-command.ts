export interface MusicRecommendationItemCommand {
  itemType: 'track' | 'album' | 'artist' | 'playlist' | 'chart' | 'ai_generation_task';
  itemId: string;
  position: number;
  reasonCode?: string;
}
