export interface MusicReleaseChannel {
    id: string;
    tenantId: string;
    releaseId: string;
    channelCode: string;
    distributionStatus: 'scheduled' | 'publishing' | 'published' | 'failed' | 'revoked';
    scheduledAt?: string;
    publishedAt?: string;
}
//# sourceMappingURL=music-release-channel.d.ts.map