export interface MusicAiStylePresetCommand {
  slug: string;
  title: string;
  styleTags: string[];
  promptHint?: string;
  status: 'draft' | 'active' | 'archived';
}
