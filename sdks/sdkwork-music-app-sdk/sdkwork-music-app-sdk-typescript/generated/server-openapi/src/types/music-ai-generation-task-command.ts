import type { MusicMediaResource } from './music-media-resource';

export interface MusicAiGenerationTaskCommand {
  projectId?: string;
  prompt: string;
  lyricsPrompt?: string;
  styleTags: string[];
  generationMode?: 'text_to_music' | 'lyrics_to_music' | 'reference_to_music' | 'stem_generation' | 'arrangement' | 'voice_to_song';
  providerCode: string;
  providerModel: string;
  modelProvider?: string;
  modelName?: string;
  reference?: MusicMediaResource;
  referenceDriveUri?: string;
  requestedDurationSeconds?: number;
  variantCount?: number;
  seed?: number;
  negativePrompt?: string;
  providerOptions?: Record<string, unknown>;
}
