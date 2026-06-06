import type { MusicMediaResource } from './music-media-resource';

export interface MusicAlbumCommand {
  artistId?: string;
  slug?: string;
  title?: string;
  cover?: MusicMediaResource;
  coverMediaResourceId?: string;
  releaseDate?: string;
}
