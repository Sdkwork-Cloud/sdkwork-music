import type { HttpClient } from '../http/client';
import type { AlbumsListResponse, ArtistsListResponse, AudioAssetsListResponse, ChartsEntriesListResponse, ChartsListResponse, CommentsListResponse, DownloadsEntitlementsListResponse, GenerationsEventsListResponse, GenerationsListResponse, GenerationsNotificationsListResponse, GenerationsPromptTemplatesListResponse, GenerationsProviderModelsListResponse, GenerationsProvidersListResponse, GenerationsStylePresetsListResponse, HomeShelvesListResponse, LibraryItemsListResponse, ListeningHistoryListResponse, MusicAiGenerationNotification, MusicAiGenerationNotificationCommand, MusicAiGenerationTask, MusicAiGenerationTaskCommand, MusicComment, MusicCommentCommand, MusicContentReport, MusicContentReportCommand, MusicLibraryItemCommand, MusicListeningHistoryItem, MusicPlaybackSession, MusicPlaybackSessionCommand, MusicPlayEventCommand, MusicPlaylist, MusicPlaylistFollow, MusicPlaylistFollowCommand, MusicPlaylistTrackCommand, MusicRecommendationFeedback, MusicRecommendationFeedbackCommand, MusicUserLibraryItem, PlaybackSessionsListResponse, PlaylistsListResponse, SearchQueryResponse, SearchSuggestionsListResponse, TracksListResponse } from '../types';
export interface MusicGenerationsNotificationsListParams {
    status?: string;
    limit?: number;
}
export declare class MusicGenerationsNotificationsApi {
    private client;
    constructor(client: HttpClient);
    /** Music generations.notifications.list */
    list(params?: MusicGenerationsNotificationsListParams): Promise<GenerationsNotificationsListResponse>;
    /** Music generations.notifications.update */
    update(notificationId: string, body: MusicAiGenerationNotificationCommand): Promise<MusicAiGenerationNotification>;
}
export interface MusicGenerationsEventsListParams {
    limit?: number;
}
export declare class MusicGenerationsEventsApi {
    private client;
    constructor(client: HttpClient);
    /** Music generations.events.list */
    list(generationId: string, params?: MusicGenerationsEventsListParams): Promise<GenerationsEventsListResponse>;
}
export interface MusicGenerationsProviderModelsListParams {
    providerCode?: string;
    status?: string;
    limit?: number;
}
export declare class MusicGenerationsProviderModelsApi {
    private client;
    constructor(client: HttpClient);
    /** Music generations.providerModels.list */
    list(params?: MusicGenerationsProviderModelsListParams): Promise<GenerationsProviderModelsListResponse>;
}
export interface MusicGenerationsProvidersListParams {
    status?: string;
    limit?: number;
}
export declare class MusicGenerationsProvidersApi {
    private client;
    constructor(client: HttpClient);
    /** Music generations.providers.list */
    list(params?: MusicGenerationsProvidersListParams): Promise<GenerationsProvidersListResponse>;
}
export interface MusicGenerationsPromptTemplatesListParams {
    status?: string;
    limit?: number;
}
export declare class MusicGenerationsPromptTemplatesApi {
    private client;
    constructor(client: HttpClient);
    /** Music generations.promptTemplates.list */
    list(params?: MusicGenerationsPromptTemplatesListParams): Promise<GenerationsPromptTemplatesListResponse>;
}
export interface MusicGenerationsStylePresetsListParams {
    status?: string;
    limit?: number;
}
export declare class MusicGenerationsStylePresetsApi {
    private client;
    constructor(client: HttpClient);
    /** Music generations.stylePresets.list */
    list(params?: MusicGenerationsStylePresetsListParams): Promise<GenerationsStylePresetsListResponse>;
}
export interface MusicGenerationsListParams {
    status?: string;
    limit?: number;
}
export declare class MusicGenerationsApi {
    private client;
    readonly stylePresets: MusicGenerationsStylePresetsApi;
    readonly promptTemplates: MusicGenerationsPromptTemplatesApi;
    readonly providers: MusicGenerationsProvidersApi;
    readonly providerModels: MusicGenerationsProviderModelsApi;
    readonly events: MusicGenerationsEventsApi;
    readonly notifications: MusicGenerationsNotificationsApi;
    constructor(client: HttpClient);
    /** Music generations.list */
    list(params?: MusicGenerationsListParams): Promise<GenerationsListResponse>;
    /** Music generations.create */
    create(body: MusicAiGenerationTaskCommand): Promise<MusicAiGenerationTask>;
    /** Music generations.retrieve */
    retrieve(generationId: string): Promise<MusicAiGenerationTask>;
}
export declare class MusicPlayEventsApi {
    private client;
    constructor(client: HttpClient);
    /** Music playEvents.create */
    create(body: MusicPlayEventCommand): Promise<MusicListeningHistoryItem>;
}
export interface MusicListeningHistoryListParams {
    limit?: number;
}
export declare class MusicListeningHistoryApi {
    private client;
    constructor(client: HttpClient);
    /** Music listeningHistory.list */
    list(params?: MusicListeningHistoryListParams): Promise<ListeningHistoryListResponse>;
}
export interface MusicPlaybackSessionsListParams {
    deviceId?: string;
    limit?: number;
}
export declare class MusicPlaybackSessionsApi {
    private client;
    constructor(client: HttpClient);
    /** Music playback.sessions.list */
    list(params?: MusicPlaybackSessionsListParams): Promise<PlaybackSessionsListResponse>;
    /** Music playback.sessions.create */
    create(body: MusicPlaybackSessionCommand): Promise<MusicPlaybackSession>;
    /** Music playback.sessions.update */
    update(sessionId: string, body: MusicPlaybackSessionCommand): Promise<MusicPlaybackSession>;
}
export declare class MusicPlaybackApi {
    private client;
    readonly sessions: MusicPlaybackSessionsApi;
    constructor(client: HttpClient);
}
export interface MusicDownloadsEntitlementsListParams {
    status?: string;
    limit?: number;
}
export declare class MusicDownloadsEntitlementsApi {
    private client;
    constructor(client: HttpClient);
    /** Music downloads.entitlements.list */
    list(params?: MusicDownloadsEntitlementsListParams): Promise<DownloadsEntitlementsListResponse>;
}
export declare class MusicDownloadsApi {
    private client;
    readonly entitlements: MusicDownloadsEntitlementsApi;
    constructor(client: HttpClient);
}
export declare class MusicRecommendationFeedbackApi {
    private client;
    constructor(client: HttpClient);
    /** Music recommendation.feedback.create */
    create(body: MusicRecommendationFeedbackCommand): Promise<MusicRecommendationFeedback>;
}
export declare class MusicRecommendationApi {
    private client;
    readonly feedback: MusicRecommendationFeedbackApi;
    constructor(client: HttpClient);
}
export declare class MusicContentReportsApi {
    private client;
    constructor(client: HttpClient);
    /** Music contentReports.create */
    create(body: MusicContentReportCommand): Promise<MusicContentReport>;
}
export interface MusicCommentsListParams {
    resourceType: string;
    resourceId: string;
    limit?: number;
}
export declare class MusicCommentsApi {
    private client;
    constructor(client: HttpClient);
    /** Music comments.list */
    list(params: MusicCommentsListParams): Promise<CommentsListResponse>;
    /** Music comments.create */
    create(body: MusicCommentCommand): Promise<MusicComment>;
}
export interface MusicLibraryItemsListParams {
    itemType?: string;
    limit?: number;
}
export declare class MusicLibraryItemsApi {
    private client;
    constructor(client: HttpClient);
    /** Music library.items.list */
    list(params?: MusicLibraryItemsListParams): Promise<LibraryItemsListResponse>;
    /** Music library.items.create */
    create(body: MusicLibraryItemCommand): Promise<MusicUserLibraryItem>;
    /** Music library.items.delete */
    delete(itemId: string): Promise<MusicUserLibraryItem>;
}
export declare class MusicLibraryApi {
    private client;
    readonly items: MusicLibraryItemsApi;
    constructor(client: HttpClient);
}
export interface MusicChartsEntriesListParams {
    limit?: number;
}
export declare class MusicChartsEntriesApi {
    private client;
    constructor(client: HttpClient);
    /** Music charts.entries.list */
    list(chartId: string, params?: MusicChartsEntriesListParams): Promise<ChartsEntriesListResponse>;
}
export interface MusicChartsListParams {
    q?: string;
    status?: string;
}
export declare class MusicChartsApi {
    private client;
    readonly entries: MusicChartsEntriesApi;
    constructor(client: HttpClient);
    /** Music charts.list */
    list(params?: MusicChartsListParams): Promise<ChartsListResponse>;
}
export interface MusicAudioAssetsListParams {
    q?: string;
    status?: string;
}
export declare class MusicAudioAssetsApi {
    private client;
    constructor(client: HttpClient);
    /** Music audio.assets.list */
    list(params?: MusicAudioAssetsListParams): Promise<AudioAssetsListResponse>;
}
export declare class MusicAudioApi {
    private client;
    readonly assets: MusicAudioAssetsApi;
    constructor(client: HttpClient);
}
export declare class MusicPlaylistsFollowApi {
    private client;
    constructor(client: HttpClient);
    /** Music playlists.follow.create */
    create(playlistId: string, body: MusicPlaylistFollowCommand): Promise<MusicPlaylistFollow>;
    /** Music playlists.follow.delete */
    delete(playlistId: string): Promise<MusicPlaylistFollow>;
}
export declare class MusicPlaylistsTracksApi {
    private client;
    constructor(client: HttpClient);
    /** Music playlists.tracks.create */
    create(playlistId: string, body: MusicPlaylistTrackCommand): Promise<MusicPlaylist>;
    /** Music playlists.tracks.delete */
    delete(playlistId: string, trackId: string): Promise<MusicPlaylist>;
}
export interface MusicPlaylistsListParams {
    q?: string;
    status?: string;
}
export declare class MusicPlaylistsApi {
    private client;
    readonly tracks: MusicPlaylistsTracksApi;
    readonly follow: MusicPlaylistsFollowApi;
    constructor(client: HttpClient);
    /** Music playlists.list */
    list(params?: MusicPlaylistsListParams): Promise<PlaylistsListResponse>;
}
export interface MusicTracksListParams {
    artistId?: string;
    albumId?: string;
    q?: string;
    status?: string;
}
export declare class MusicTracksApi {
    private client;
    constructor(client: HttpClient);
    /** Music tracks.list */
    list(params?: MusicTracksListParams): Promise<TracksListResponse>;
}
export interface MusicAlbumsListParams {
    artistId?: string;
    q?: string;
    status?: string;
}
export declare class MusicAlbumsApi {
    private client;
    constructor(client: HttpClient);
    /** Music albums.list */
    list(params?: MusicAlbumsListParams): Promise<AlbumsListResponse>;
}
export interface MusicArtistsListParams {
    q?: string;
    status?: string;
}
export declare class MusicArtistsApi {
    private client;
    constructor(client: HttpClient);
    /** Music artists.list */
    list(params?: MusicArtistsListParams): Promise<ArtistsListResponse>;
}
export interface MusicSearchSuggestionsListParams {
    type_?: string;
    limit?: number;
}
export declare class MusicSearchSuggestionsApi {
    private client;
    constructor(client: HttpClient);
    /** Music search.suggestions.list */
    list(params?: MusicSearchSuggestionsListParams): Promise<SearchSuggestionsListResponse>;
}
export interface MusicSearchQueryParams {
    q: string;
    type_?: string;
    limit?: number;
}
export declare class MusicSearchApi {
    private client;
    readonly suggestions: MusicSearchSuggestionsApi;
    constructor(client: HttpClient);
    /** Music search.query */
    query(params: MusicSearchQueryParams): Promise<SearchQueryResponse>;
}
export interface MusicHomeShelvesListParams {
    cursor?: string;
    limit?: number;
}
export declare class MusicHomeShelvesApi {
    private client;
    constructor(client: HttpClient);
    /** Music home.shelves.list */
    list(params?: MusicHomeShelvesListParams): Promise<HomeShelvesListResponse>;
}
export declare class MusicHomeApi {
    private client;
    readonly shelves: MusicHomeShelvesApi;
    constructor(client: HttpClient);
}
export declare class MusicApi {
    private client;
    readonly home: MusicHomeApi;
    readonly search: MusicSearchApi;
    readonly artists: MusicArtistsApi;
    readonly albums: MusicAlbumsApi;
    readonly tracks: MusicTracksApi;
    readonly playlists: MusicPlaylistsApi;
    readonly audio: MusicAudioApi;
    readonly charts: MusicChartsApi;
    readonly library: MusicLibraryApi;
    readonly comments: MusicCommentsApi;
    readonly contentReports: MusicContentReportsApi;
    readonly recommendation: MusicRecommendationApi;
    readonly downloads: MusicDownloadsApi;
    readonly playback: MusicPlaybackApi;
    readonly listeningHistory: MusicListeningHistoryApi;
    readonly playEvents: MusicPlayEventsApi;
    readonly generations: MusicGenerationsApi;
    constructor(client: HttpClient);
}
export declare function createMusicApi(client: HttpClient): MusicApi;
//# sourceMappingURL=music.d.ts.map