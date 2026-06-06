import type { MusicMediaResource } from './music-media-resource';
export interface MusicArtist {
    id: string;
    tenantId: string;
    slug: string;
    name: string;
    bio?: string;
    avatar?: MusicMediaResource;
    avatarMediaResourceId?: string;
}
//# sourceMappingURL=music-artist.d.ts.map