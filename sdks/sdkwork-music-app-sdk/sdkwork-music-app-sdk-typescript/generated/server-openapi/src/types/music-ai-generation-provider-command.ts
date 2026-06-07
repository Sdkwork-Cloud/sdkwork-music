import type { MusicAiProviderInvocationMode } from './music-ai-provider-invocation-mode';

export interface MusicAiGenerationProviderCommand {
  providerCode: string;
  displayName: string;
  providerFamily: string;
  capability: 'text_to_music' | 'lyrics_to_music' | 'reference_to_music' | 'stem_generation' | 'arrangement' | 'voice_to_song';
  invocationMode: MusicAiProviderInvocationMode;
  clawRouterProviderCode: string;
  clawRouterEndpointKey: 'suno.music.generations.create';
  clawRouterStandardPath: '/suno/v1/music/generations';
  clawRouterSdkFamily: 'clawrouter-open-sdk';
  clawRouterApiAuthority: 'sdkwork-claw-router.ai';
  clawRouterApiPrefix: '/v1';
  clawRouterCreateOperationId: 'sunoCreateMusicGeneration';
  clawRouterRetrieveOperationId: 'sunoRetrieveMusicGeneration';
  clawRouterRetrieveStandardPath: '/suno/v1/music/generations/{task_id}';
  supportsPolling: boolean;
  supportsWebhook: boolean;
  status: 'draft' | 'active' | 'paused' | 'archived';
  configSnapshot?: Record<string, unknown>;
}
