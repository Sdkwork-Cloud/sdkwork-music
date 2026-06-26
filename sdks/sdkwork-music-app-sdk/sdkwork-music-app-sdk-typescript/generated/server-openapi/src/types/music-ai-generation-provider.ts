import type { MusicAiProviderInvocationMode } from './music-ai-provider-invocation-mode';

export interface MusicAiGenerationProvider {
  id: string;
  tenantId: string;
  providerCode: string;
  displayName: string;
  providerFamily: string;
  capability: 'text_to_music' | 'lyrics_to_music' | 'reference_to_music' | 'stem_generation' | 'arrangement' | 'voice_to_song';
  invocationMode: MusicAiProviderInvocationMode;
  clawRouterProviderCode: string;
  clawRouterEndpointKey: 'suno.music.generations.create';
  clawRouterStandardPath: '/suno/v1/music/generations';
  clawRouterSdkFamily: 'clawrouter-open-sdk';
  clawRouterApiAuthority: 'sdkwork-clawrouter.ai';
  clawRouterApiPrefix: '/v1';
  clawRouterCreateOperationId: 'sunoCreateMusicGeneration';
  clawRouterRetrieveOperationId: 'sunoRetrieveMusicGeneration';
  clawRouterRetrieveStandardPath: '/suno/v1/music/generations/{task_id}';
  supportsPolling: boolean;
  supportsWebhook: boolean;
  status: 'draft' | 'active' | 'paused' | 'archived';
  configSnapshot?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}
