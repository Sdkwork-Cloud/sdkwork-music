export interface MusicAiGenerationProviderModel {
    id: string;
    tenantId: string;
    providerId: string;
    providerCode: string;
    modelName: string;
    displayName: string;
    capability: 'text_to_music' | 'lyrics_to_music' | 'reference_to_music' | 'stem_generation' | 'arrangement' | 'voice_to_song';
    minDurationSeconds: number;
    maxDurationSeconds: number;
    maxVariantCount: number;
    supportedFormats: string[];
    supportedStyleTags?: string[];
    pricingUnit: 'generation' | 'second' | 'credit' | 'token' | 'provider_native';
    status: 'draft' | 'active' | 'paused' | 'archived';
    createdAt?: string;
    updatedAt?: string;
}
//# sourceMappingURL=music-ai-generation-provider-model.d.ts.map