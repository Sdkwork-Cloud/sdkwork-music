import type { MusicAiGenerationTaskStatus } from './music-ai-generation-task-status';

export interface MusicAiGenerationProviderEvent {
  id: string;
  tenantId: string;
  taskId: string;
  attemptId?: string;
  providerCode: string;
  externalTaskId?: string;
  externalEventId?: string;
  eventType: string;
  source: 'start' | 'poll' | 'webhook' | 'manual_sync' | 'provider_callback';
  providerStatus: string;
  statusBefore: MusicAiGenerationTaskStatus;
  statusAfter: MusicAiGenerationTaskStatus;
  payloadHash?: string;
  payloadSnapshot?: Record<string, unknown>;
  hasOutputs?: boolean;
  createdAt: string;
}
