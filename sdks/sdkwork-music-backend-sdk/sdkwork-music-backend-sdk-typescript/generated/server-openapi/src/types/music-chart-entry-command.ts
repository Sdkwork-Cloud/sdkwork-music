export interface MusicChartEntryCommand {
  trackId: string;
  rank: number;
  previousRank?: number;
  score?: number;
}
