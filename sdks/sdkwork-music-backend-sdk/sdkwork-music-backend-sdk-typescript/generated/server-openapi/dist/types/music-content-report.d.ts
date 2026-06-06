export interface MusicContentReport {
    id: string;
    tenantId: string;
    reporterUserId: string;
    resourceType: string;
    resourceId: string;
    reasonCode: string;
    description?: string;
    status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
    resolvedBy?: string;
    resolutionNote?: string;
    createdAt?: string;
    updatedAt?: string;
    resolvedAt?: string;
}
//# sourceMappingURL=music-content-report.d.ts.map