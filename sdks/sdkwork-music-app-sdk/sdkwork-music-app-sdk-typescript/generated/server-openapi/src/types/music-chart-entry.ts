import type { MusicTrack } from './music-track';

export interface MusicChartEntry {
  id: string;
  tenantId: string;
  chartId: string;
  trackId: string;
  track?: MusicTrack;
  rank: number;
  previousRank?: number;
  score: number;
}
