export interface MusicContentReportResolutionCommand {
  status: 'resolved' | 'dismissed';
  resolutionNote?: string;
}
