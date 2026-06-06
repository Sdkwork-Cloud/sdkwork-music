export interface MusicReleaseChannelCommand {
  channelCode: string;
  distributionStatus: 'scheduled' | 'publishing' | 'published' | 'failed' | 'revoked';
  scheduledAt?: string;
}
