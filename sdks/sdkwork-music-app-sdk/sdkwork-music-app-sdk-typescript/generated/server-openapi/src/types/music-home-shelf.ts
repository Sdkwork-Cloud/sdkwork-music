import type { MusicRecommendationItem } from './music-recommendation-item';

export interface MusicHomeShelf {
  id: string;
  tenantId: string;
  slug: string;
  title: string;
  shelfType: 'personalized' | 'new_release' | 'chart' | 'playlist' | 'ai_generation' | 'editorial';
  items: MusicRecommendationItem[];
}
