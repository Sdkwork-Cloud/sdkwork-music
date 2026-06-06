export interface MusicAiPromptTemplate {
    id: string;
    tenantId: string;
    slug: string;
    title: string;
    templateText: string;
    variables?: string[];
    status: 'draft' | 'active' | 'archived';
}
//# sourceMappingURL=music-ai-prompt-template.d.ts.map