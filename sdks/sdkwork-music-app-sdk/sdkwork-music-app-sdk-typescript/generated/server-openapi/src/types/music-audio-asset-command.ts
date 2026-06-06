import type { MusicAudioAssetStatus } from './music-audio-asset-status';
import type { MusicMediaChecksum } from './music-media-checksum';
import type { MusicMediaResource } from './music-media-resource';

export interface MusicAudioAssetCommand {
  title?: string;
  driveSpaceId?: string;
  driveNodeId?: string;
  driveUri?: string;
  audio?: MusicMediaResource;
  mimeType?: string;
  durationSeconds?: number;
  checksum?: MusicMediaChecksum;
  status?: MusicAudioAssetStatus;
}
