import type { MusicMediaResource } from './music-media-resource';
export interface MusicAiGenerationTaskCommand {
    projectId?: string;
    prompt: string;
    lyricsPrompt?: string;
    styleTags: string[];
    modelProvider: string;
    modelName: string;
    reference?: MusicMediaResource;
    referenceDriveUri?: string;
}
//# sourceMappingURL=music-ai-generation-task-command.d.ts.map