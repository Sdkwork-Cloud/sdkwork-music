import type { MusicRecommendationItemCommand } from './music-recommendation-item-command';

export interface MusicRecommendationShelfCommand {
  slug: string;
  title: string;
  shelfType: 'personalized' | 'new_release' | 'chart' | 'playlist' | 'ai_generation' | 'editorial';
  algorithmCode?: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  items?: MusicRecommendationItemCommand[];
}
