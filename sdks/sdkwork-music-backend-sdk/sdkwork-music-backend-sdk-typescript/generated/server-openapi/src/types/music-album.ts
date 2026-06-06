import type { MusicMediaResource } from './music-media-resource';

export interface MusicAlbum {
  id: string;
  tenantId: string;
  artistId: string;
  slug: string;
  title: string;
  cover?: MusicMediaResource;
  coverMediaResourceId?: string;
  releaseDate?: string;
}
