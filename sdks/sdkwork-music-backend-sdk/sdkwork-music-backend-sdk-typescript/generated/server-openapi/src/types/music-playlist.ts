import type { MusicMediaResource } from './music-media-resource';

export interface MusicPlaylist {
  id: string;
  tenantId: string;
  slug: string;
  title: string;
  description?: string;
  cover?: MusicMediaResource;
  trackIds: string[];
  updatedAt?: string;
}
