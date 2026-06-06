export interface MusicTrackCommand {
  artistId?: string;
  albumId?: string;
  audioAssetId?: string;
  slug?: string;
  title?: string;
  durationSeconds?: number;
  tags?: string[];
}
