import type { MusicPlaylist } from './music-playlist';
import type { MusicTrack } from './music-track';

export interface MusicRecommendationItem {
  id: string;
  itemType: 'track' | 'album' | 'artist' | 'playlist' | 'chart' | 'ai_generation_task';
  itemId: string;
  position: number;
  reasonCode?: string;
  track?: MusicTrack;
  playlist?: MusicPlaylist;
}
