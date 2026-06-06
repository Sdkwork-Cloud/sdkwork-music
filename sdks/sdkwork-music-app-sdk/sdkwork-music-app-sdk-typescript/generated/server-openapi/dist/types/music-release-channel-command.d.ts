export interface MusicReleaseChannelCommand {
    channelCode: string;
    distributionStatus: 'scheduled' | 'publishing' | 'published' | 'failed' | 'revoked';
    scheduledAt?: string;
}
//# sourceMappingURL=music-release-channel-command.d.ts.map