import type { MusicAlbum } from './music-album';
import type { MusicArtist } from './music-artist';
import type { MusicPlaylist } from './music-playlist';
import type { MusicTrack } from './music-track';

export interface MusicSearchResult {
  resourceType: 'track' | 'album' | 'artist' | 'playlist' | 'chart';
  resourceId: string;
  title: string;
  subtitle?: string;
  track?: MusicTrack;
  artist?: MusicArtist;
  album?: MusicAlbum;
  playlist?: MusicPlaylist;
}
