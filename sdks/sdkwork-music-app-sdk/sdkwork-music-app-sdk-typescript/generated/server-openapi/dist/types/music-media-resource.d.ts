import type { MusicMediaAiProvenance } from './music-media-ai-provenance';
import type { MusicMediaChecksum } from './music-media-checksum';
export interface MusicMediaResource {
    id?: string;
    kind: 'image' | 'video' | 'audio' | 'voice' | 'document' | 'archive' | 'other';
    source: 'drive' | 'provider_asset' | 'external_url' | 'generated';
    uri?: string;
    url?: string;
    publicUrl?: string;
    mimeType?: string;
    sizeBytes?: string;
    durationSeconds?: number;
    checksum?: MusicMediaChecksum;
    ai?: MusicMediaAiProvenance;
    metadata?: Record<string, unknown>;
}
//# sourceMappingURL=music-media-resource.d.ts.map