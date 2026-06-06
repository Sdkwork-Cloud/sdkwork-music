export interface MusicAiStylePreset {
  id: string;
  tenantId: string;
  slug: string;
  title: string;
  styleTags: string[];
  promptHint?: string;
  status: 'draft' | 'active' | 'archived';
}
