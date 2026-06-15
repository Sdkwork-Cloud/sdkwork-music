export interface MusicHomeShelf {
  id: string;
  tenantId: string;
  slug: string;
  title: string;
  shelfType: 'personalized' | 'new_release' | 'chart' | 'playlist' | 'ai_generation' | 'editorial';
  items: MusicRecommendationItem[];
}

export interface MusicRecommendationItem {
  id: string;
  itemType: 'track' | 'album' | 'artist' | 'playlist' | 'chart' | 'ai_generation_task';
  itemId: string;
  position: number;
  reasonCode?: string;
  track?: MusicTrack;
  playlist?: MusicPlaylist;
}

export interface MusicTrack {
  id: string;
  tenantId: string;
  artistId: string;
  artistName?: string;
  albumId?: string;
  albumTitle?: string;
  audioAssetId?: string;
  audio?: MusicMediaResource;
  slug: string;
  title: string;
  durationSeconds: number;
  status: MusicTrackStatus;
  tags?: string[];
  publishedAt?: string;
}

export interface MusicPlaylist {
  id: string;
  tenantId: string;
  slug: string;
  title: string;
  description?: string;
  trackIds?: string[];
}

export interface MusicMediaResource {
  id: string;
  driveUri: string;
  mimeType: string;
  durationSeconds: number;
}

export type MusicTrackStatus = 'draft' | 'published' | 'archived';
