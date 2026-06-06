import type { MusicMediaResource } from './music-media-resource';
import type { MusicTrackStatus } from './music-track-status';

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
  updatedAt?: string;
}
