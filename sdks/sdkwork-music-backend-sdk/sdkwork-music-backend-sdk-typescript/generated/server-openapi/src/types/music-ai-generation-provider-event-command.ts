export interface MusicAiGenerationProviderEventCommand {
  taskId?: string;
  attemptId?: string;
  externalTaskId?: string;
  externalEventId?: string;
  eventType: string;
  source: 'poll' | 'webhook' | 'manual_sync' | 'provider_callback';
  providerStatus: string;
  payloadHash: string;
  payloadSnapshot: Record<string, unknown>;
  hasOutputs?: boolean;
}
