export interface MusicChartCommand {
    slug: string;
    title: string;
    chartType: 'daily' | 'weekly' | 'monthly' | 'genre' | 'editorial' | 'ai';
    status: 'draft' | 'active' | 'paused' | 'archived';
    periodStart?: string;
    periodEnd?: string;
}
//# sourceMappingURL=music-chart-command.d.ts.map