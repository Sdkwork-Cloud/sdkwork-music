import type { MusicAiProviderInvocationMode } from './music-ai-provider-invocation-mode';

export interface MusicAiGenerationProviderCommand {
  providerCode: string;
  displayName: string;
  providerFamily: string;
  capability: 'text_to_music' | 'lyrics_to_music' | 'reference_to_music' | 'stem_generation' | 'arrangement' | 'voice_to_song';
  invocationMode: MusicAiProviderInvocationMode;
  clawRouterProviderCode: string;
  clawRouterEndpointKey: string;
  clawRouterStandardPath: string;
  supportsPolling: boolean;
  supportsWebhook: boolean;
  status: 'draft' | 'active' | 'paused' | 'archived';
  configSnapshot?: Record<string, unknown>;
}
