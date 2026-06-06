import type { HttpClient } from '../http/client';
import type { AiGenerationCreditLedgerListResponse, AiGenerationTasksManagementListResponse, AiPromptTemplatesManagementListResponse, AiStylePresetsManagementListResponse, AlbumsManagementListResponse, ArtistsManagementListResponse, AudioAssetsManagementListResponse, ChartsManagementListResponse, ContentReportsManagementListResponse, ModerationSignalsListResponse, MusicAiGenerationModerationCommand, MusicAiGenerationPublishCommand, MusicAiGenerationTask, MusicAiPromptTemplate, MusicAiPromptTemplateCommand, MusicAiStylePreset, MusicAiStylePresetCommand, MusicAlbum, MusicAlbumCommand, MusicArtist, MusicArtistCommand, MusicAudioAsset, MusicAudioAssetCommand, MusicChart, MusicChartCommand, MusicChartEntry, MusicChartEntryCommand, MusicContentReport, MusicContentReportResolutionCommand, MusicHomeShelf, MusicRecommendationShelfCommand, MusicRelease, MusicReleaseChannel, MusicReleaseChannelCommand, MusicRightsPolicy, MusicRightsPolicyCommand, MusicRightsTerritory, MusicRightsTerritoryCommand, MusicTrack, MusicTrackCommand, PlaylistsManagementListResponse, RecommendationFeedbackManagementListResponse, RecommendationShelvesManagementListResponse, ReleasesListResponse, RightsPoliciesManagementListResponse, TracksManagementListResponse } from '../types';
export declare class MusicReleasesChannelsApi {
    private client;
    constructor(client: HttpClient);
    /** Music releases.channels.create */
    create(releaseId: string, body: MusicReleaseChannelCommand): Promise<MusicReleaseChannel>;
}
export interface MusicReleasesListParams {
    status?: string;
    limit?: number;
}
export declare class MusicReleasesApi {
    private client;
    readonly channels: MusicReleasesChannelsApi;
    constructor(client: HttpClient);
    /** Music releases.list */
    list(params?: MusicReleasesListParams): Promise<ReleasesListResponse>;
}
export interface MusicModerationSignalsListParams {
    resourceType?: string;
    resourceId?: string;
    status?: string;
    limit?: number;
}
export declare class MusicModerationSignalsApi {
    private client;
    constructor(client: HttpClient);
    /** Music moderation.signals.list */
    list(params?: MusicModerationSignalsListParams): Promise<ModerationSignalsListResponse>;
}
export declare class MusicModerationApi {
    private client;
    readonly signals: MusicModerationSignalsApi;
    constructor(client: HttpClient);
}
export declare class MusicRightsPoliciesTerritoriesApi {
    private client;
    constructor(client: HttpClient);
    /** Music rights.policies.territories.create */
    create(policyId: string, body: MusicRightsTerritoryCommand): Promise<MusicRightsTerritory>;
}
export interface MusicRightsPoliciesManagementListParams {
    status?: string;
    limit?: number;
}
export declare class MusicRightsPoliciesManagementApi {
    private client;
    constructor(client: HttpClient);
    /** Music rights.policies.management.list */
    list(params?: MusicRightsPoliciesManagementListParams): Promise<RightsPoliciesManagementListResponse>;
}
export declare class MusicRightsPoliciesApi {
    private client;
    readonly management: MusicRightsPoliciesManagementApi;
    readonly territories: MusicRightsPoliciesTerritoriesApi;
    constructor(client: HttpClient);
    /** Music rights.policies.create */
    create(body: MusicRightsPolicyCommand): Promise<MusicRightsPolicy>;
}
export declare class MusicRightsApi {
    private client;
    readonly policies: MusicRightsPoliciesApi;
    constructor(client: HttpClient);
}
export interface MusicAiGenerationTasksManagementListParams {
    status?: string;
    userId?: string;
    limit?: number;
}
export declare class MusicAiGenerationTasksManagementApi {
    private client;
    constructor(client: HttpClient);
    /** Music ai.generation.tasks.management.list */
    list(params?: MusicAiGenerationTasksManagementListParams): Promise<AiGenerationTasksManagementListResponse>;
}
export declare class MusicAiGenerationTasksApi {
    private client;
    readonly management: MusicAiGenerationTasksManagementApi;
    constructor(client: HttpClient);
    /** Music ai.generation.tasks.moderate */
    moderate(taskId: string, body: MusicAiGenerationModerationCommand): Promise<MusicAiGenerationTask>;
    /** Music ai.generation.tasks.publish */
    publish(taskId: string, body: MusicAiGenerationPublishCommand): Promise<MusicRelease>;
}
export interface MusicAiGenerationCreditLedgerListParams {
    userId?: string;
    taskId?: string;
    limit?: number;
}
export declare class MusicAiGenerationCreditLedgerApi {
    private client;
    constructor(client: HttpClient);
    /** Music ai.generation.creditLedger.list */
    list(params?: MusicAiGenerationCreditLedgerListParams): Promise<AiGenerationCreditLedgerListResponse>;
}
export declare class MusicAiGenerationApi {
    private client;
    readonly creditLedger: MusicAiGenerationCreditLedgerApi;
    readonly tasks: MusicAiGenerationTasksApi;
    constructor(client: HttpClient);
}
export interface MusicAiPromptTemplatesManagementListParams {
    status?: string;
    limit?: number;
}
export declare class MusicAiPromptTemplatesManagementApi {
    private client;
    constructor(client: HttpClient);
    /** Music ai.promptTemplates.management.list */
    list(params?: MusicAiPromptTemplatesManagementListParams): Promise<AiPromptTemplatesManagementListResponse>;
}
export declare class MusicAiPromptTemplatesApi {
    private client;
    readonly management: MusicAiPromptTemplatesManagementApi;
    constructor(client: HttpClient);
    /** Music ai.promptTemplates.create */
    create(body: MusicAiPromptTemplateCommand): Promise<MusicAiPromptTemplate>;
    /** Music ai.promptTemplates.update */
    update(templateId: string, body: MusicAiPromptTemplateCommand): Promise<MusicAiPromptTemplate>;
}
export interface MusicAiStylePresetsManagementListParams {
    status?: string;
    limit?: number;
}
export declare class MusicAiStylePresetsManagementApi {
    private client;
    constructor(client: HttpClient);
    /** Music ai.stylePresets.management.list */
    list(params?: MusicAiStylePresetsManagementListParams): Promise<AiStylePresetsManagementListResponse>;
}
export declare class MusicAiStylePresetsApi {
    private client;
    readonly management: MusicAiStylePresetsManagementApi;
    constructor(client: HttpClient);
    /** Music ai.stylePresets.create */
    create(body: MusicAiStylePresetCommand): Promise<MusicAiStylePreset>;
    /** Music ai.stylePresets.update */
    update(presetId: string, body: MusicAiStylePresetCommand): Promise<MusicAiStylePreset>;
}
export declare class MusicAiApi {
    private client;
    readonly stylePresets: MusicAiStylePresetsApi;
    readonly promptTemplates: MusicAiPromptTemplatesApi;
    readonly generation: MusicAiGenerationApi;
    constructor(client: HttpClient);
}
export interface MusicContentReportsManagementListParams {
    status?: string;
    resourceType?: string;
    resourceId?: string;
    limit?: number;
}
export declare class MusicContentReportsManagementApi {
    private client;
    constructor(client: HttpClient);
    /** Music contentReports.management.list */
    list(params?: MusicContentReportsManagementListParams): Promise<ContentReportsManagementListResponse>;
}
export declare class MusicContentReportsApi {
    private client;
    readonly management: MusicContentReportsManagementApi;
    constructor(client: HttpClient);
    /** Music contentReports.resolve */
    resolve(reportId: string, body: MusicContentReportResolutionCommand): Promise<MusicContentReport>;
}
export interface MusicRecommendationFeedbackManagementListParams {
    itemType?: string;
    itemId?: string;
    feedbackType?: string;
    limit?: number;
}
export declare class MusicRecommendationFeedbackManagementApi {
    private client;
    constructor(client: HttpClient);
    /** Music recommendation.feedback.management.list */
    list(params?: MusicRecommendationFeedbackManagementListParams): Promise<RecommendationFeedbackManagementListResponse>;
}
export declare class MusicRecommendationFeedbackApi {
    private client;
    readonly management: MusicRecommendationFeedbackManagementApi;
    constructor(client: HttpClient);
}
export interface MusicRecommendationShelvesManagementListParams {
    q?: string;
    status?: string;
}
export declare class MusicRecommendationShelvesManagementApi {
    private client;
    constructor(client: HttpClient);
    /** Music recommendation.shelves.management.list */
    list(params?: MusicRecommendationShelvesManagementListParams): Promise<RecommendationShelvesManagementListResponse>;
}
export declare class MusicRecommendationShelvesApi {
    private client;
    readonly management: MusicRecommendationShelvesManagementApi;
    constructor(client: HttpClient);
    /** Music recommendation.shelves.create */
    create(body: MusicRecommendationShelfCommand): Promise<MusicHomeShelf>;
}
export declare class MusicRecommendationApi {
    private client;
    readonly shelves: MusicRecommendationShelvesApi;
    readonly feedback: MusicRecommendationFeedbackApi;
    constructor(client: HttpClient);
}
export declare class MusicChartsEntriesApi {
    private client;
    constructor(client: HttpClient);
    /** Music charts.entries.create */
    create(chartId: string, body: MusicChartEntryCommand): Promise<MusicChartEntry>;
}
export interface MusicChartsManagementListParams {
    q?: string;
    status?: string;
}
export declare class MusicChartsManagementApi {
    private client;
    constructor(client: HttpClient);
    /** Music charts.management.list */
    list(params?: MusicChartsManagementListParams): Promise<ChartsManagementListResponse>;
}
export declare class MusicChartsApi {
    private client;
    readonly management: MusicChartsManagementApi;
    readonly entries: MusicChartsEntriesApi;
    constructor(client: HttpClient);
    /** Music charts.create */
    create(body: MusicChartCommand): Promise<MusicChart>;
    /** Music charts.update */
    update(chartId: string, body: MusicChartCommand): Promise<MusicChart>;
}
export interface MusicAudioAssetsManagementListParams {
    q?: string;
    status?: string;
}
export declare class MusicAudioAssetsManagementApi {
    private client;
    constructor(client: HttpClient);
    /** Music audio.assets.management.list */
    list(params?: MusicAudioAssetsManagementListParams): Promise<AudioAssetsManagementListResponse>;
}
export declare class MusicAudioAssetsApi {
    private client;
    readonly management: MusicAudioAssetsManagementApi;
    constructor(client: HttpClient);
    /** Music audio.assets.create */
    create(body: MusicAudioAssetCommand): Promise<MusicAudioAsset>;
}
export declare class MusicAudioApi {
    private client;
    readonly assets: MusicAudioAssetsApi;
    constructor(client: HttpClient);
}
export interface MusicPlaylistsManagementListParams {
    q?: string;
    status?: string;
}
export declare class MusicPlaylistsManagementApi {
    private client;
    constructor(client: HttpClient);
    /** Music playlists.management.list */
    list(params?: MusicPlaylistsManagementListParams): Promise<PlaylistsManagementListResponse>;
}
export declare class MusicPlaylistsApi {
    private client;
    readonly management: MusicPlaylistsManagementApi;
    constructor(client: HttpClient);
}
export interface MusicTracksManagementListParams {
    artistId?: string;
    albumId?: string;
    q?: string;
    status?: string;
}
export declare class MusicTracksManagementApi {
    private client;
    constructor(client: HttpClient);
    /** Music tracks.management.list */
    list(params?: MusicTracksManagementListParams): Promise<TracksManagementListResponse>;
}
export declare class MusicTracksApi {
    private client;
    readonly management: MusicTracksManagementApi;
    constructor(client: HttpClient);
    /** Music tracks.create */
    create(body: MusicTrackCommand): Promise<MusicTrack>;
    /** Music tracks.publish */
    publish(trackId: string): Promise<MusicTrack>;
    /** Music tracks.archive */
    archive(trackId: string): Promise<MusicTrack>;
}
export interface MusicAlbumsManagementListParams {
    artistId?: string;
    q?: string;
    status?: string;
}
export declare class MusicAlbumsManagementApi {
    private client;
    constructor(client: HttpClient);
    /** Music albums.management.list */
    list(params?: MusicAlbumsManagementListParams): Promise<AlbumsManagementListResponse>;
}
export declare class MusicAlbumsApi {
    private client;
    readonly management: MusicAlbumsManagementApi;
    constructor(client: HttpClient);
    /** Music albums.create */
    create(body: MusicAlbumCommand): Promise<MusicAlbum>;
}
export interface MusicArtistsManagementListParams {
    q?: string;
    status?: string;
}
export declare class MusicArtistsManagementApi {
    private client;
    constructor(client: HttpClient);
    /** Music artists.management.list */
    list(params?: MusicArtistsManagementListParams): Promise<ArtistsManagementListResponse>;
}
export declare class MusicArtistsApi {
    private client;
    readonly management: MusicArtistsManagementApi;
    constructor(client: HttpClient);
    /** Music artists.create */
    create(body: MusicArtistCommand): Promise<MusicArtist>;
}
export declare class MusicApi {
    private client;
    readonly artists: MusicArtistsApi;
    readonly albums: MusicAlbumsApi;
    readonly tracks: MusicTracksApi;
    readonly playlists: MusicPlaylistsApi;
    readonly audio: MusicAudioApi;
    readonly charts: MusicChartsApi;
    readonly recommendation: MusicRecommendationApi;
    readonly contentReports: MusicContentReportsApi;
    readonly ai: MusicAiApi;
    readonly rights: MusicRightsApi;
    readonly moderation: MusicModerationApi;
    readonly releases: MusicReleasesApi;
    constructor(client: HttpClient);
}
export declare function createMusicApi(client: HttpClient): MusicApi;
//# sourceMappingURL=music.d.ts.map