export interface MusicAiGenerationTaskSyncCommand {
  source: 'poll' | 'manual_sync' | 'webhook_replay';
  providerStatus?: string;
  externalTaskId?: string;
  payloadSnapshot?: Record<string, unknown>;
}
