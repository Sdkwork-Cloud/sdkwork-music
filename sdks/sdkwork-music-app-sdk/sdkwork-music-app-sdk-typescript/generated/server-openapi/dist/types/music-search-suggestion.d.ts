export interface MusicSearchSuggestion {
    id: string;
    tenantId: string;
    suggestionType: 'hot' | 'personalized' | 'history' | 'scene' | 'ai_style';
    displayText: string;
    queryText: string;
    weight: number;
}
//# sourceMappingURL=music-search-suggestion.d.ts.map