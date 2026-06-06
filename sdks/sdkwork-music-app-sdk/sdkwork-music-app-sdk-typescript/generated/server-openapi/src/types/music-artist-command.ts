import type { MusicMediaResource } from './music-media-resource';

export interface MusicArtistCommand {
  slug?: string;
  name?: string;
  bio?: string;
  avatar?: MusicMediaResource;
  avatarMediaResourceId?: string;
}
