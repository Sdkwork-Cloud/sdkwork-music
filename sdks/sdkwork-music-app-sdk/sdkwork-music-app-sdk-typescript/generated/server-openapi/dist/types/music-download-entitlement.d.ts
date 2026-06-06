import type { MusicTrack } from './music-track';
export interface MusicDownloadEntitlement {
    id: string;
    tenantId: string;
    userId: string;
    trackId: string;
    audioAssetId: string;
    quality: 'standard' | 'high' | 'lossless' | 'hi_res';
    status: 'active' | 'expired' | 'revoked';
    expiresAt?: string;
    track?: MusicTrack;
}
//# sourceMappingURL=music-download-entitlement.d.ts.map