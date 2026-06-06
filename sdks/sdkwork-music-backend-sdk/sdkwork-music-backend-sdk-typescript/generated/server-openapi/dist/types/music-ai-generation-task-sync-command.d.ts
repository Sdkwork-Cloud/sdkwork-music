export interface MusicAiGenerationTaskSyncCommand {
    source: 'poll' | 'manual_sync' | 'webhook_replay';
    providerStatus?: string;
    externalTaskId?: string;
    payloadSnapshot?: Record<string, unknown>;
}
//# sourceMappingURL=music-ai-generation-task-sync-command.d.ts.map