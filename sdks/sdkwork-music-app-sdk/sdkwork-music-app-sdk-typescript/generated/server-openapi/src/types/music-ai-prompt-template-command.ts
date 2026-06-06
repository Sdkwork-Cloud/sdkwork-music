export interface MusicAiPromptTemplateCommand {
  slug: string;
  title: string;
  templateText: string;
  variables?: string[];
  status: 'draft' | 'active' | 'archived';
}
