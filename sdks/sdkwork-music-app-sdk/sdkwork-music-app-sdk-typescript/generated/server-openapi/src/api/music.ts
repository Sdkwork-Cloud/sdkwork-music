import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AlbumsListResponse, ArtistsListResponse, AudioAssetsListResponse, ChartsEntriesListResponse, ChartsListResponse, CommentsListResponse, DownloadsEntitlementsListResponse, GenerationsEventsListResponse, GenerationsListResponse, GenerationsNotificationsListResponse, GenerationsPromptTemplatesListResponse, GenerationsProviderModelsListResponse, GenerationsProvidersListResponse, GenerationsStylePresetsListResponse, HomeShelvesListResponse, LibraryItemsListResponse, ListeningHistoryListResponse, MusicAiGenerationNotification, MusicAiGenerationNotificationCommand, MusicAiGenerationTask, MusicAiGenerationTaskCommand, MusicComment, MusicCommentCommand, MusicContentReport, MusicContentReportCommand, MusicLibraryItemCommand, MusicListeningHistoryItem, MusicPlaybackSession, MusicPlaybackSessionCommand, MusicPlayEventCommand, MusicPlaylist, MusicPlaylistFollow, MusicPlaylistFollowCommand, MusicPlaylistTrackCommand, MusicRecommendationFeedback, MusicRecommendationFeedbackCommand, MusicUserLibraryItem, PlaybackSessionsListResponse, PlaylistsListResponse, SearchQueryResponse, SearchSuggestionsListResponse, TracksListResponse } from '../types';


export interface MusicGenerationsNotificationsListParams {
  status?: string;
  limit?: number;
}

export class MusicGenerationsNotificationsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music generations.notifications.list */
  async list(params?: MusicGenerationsNotificationsListParams): Promise<GenerationsNotificationsListResponse> {
    const query = buildQueryString([
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<GenerationsNotificationsListResponse>(appendQueryString(appApiPath(`/music/generations/notifications`), query));
  }

/** Music generations.notifications.update */
  async update(notificationId: string, body: MusicAiGenerationNotificationCommand): Promise<MusicAiGenerationNotification> {
    return this.client.patch<MusicAiGenerationNotification>(appApiPath(`/music/generations/notifications/${serializePathParameter(notificationId, { name: 'notificationId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export interface MusicGenerationsEventsListParams {
  limit?: number;
}

export class MusicGenerationsEventsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music generations.events.list */
  async list(generationId: string, params?: MusicGenerationsEventsListParams): Promise<GenerationsEventsListResponse> {
    const query = buildQueryString([
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<GenerationsEventsListResponse>(appendQueryString(appApiPath(`/music/generations/${serializePathParameter(generationId, { name: 'generationId', style: 'simple', explode: false })}/events`), query));
  }
}

export interface MusicGenerationsProviderModelsListParams {
  providerCode?: string;
  status?: string;
  limit?: number;
}

export class MusicGenerationsProviderModelsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music generations.providerModels.list */
  async list(params?: MusicGenerationsProviderModelsListParams): Promise<GenerationsProviderModelsListResponse> {
    const query = buildQueryString([
      { name: 'provider_code', value: params?.providerCode, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<GenerationsProviderModelsListResponse>(appendQueryString(appApiPath(`/music/generations/provider_models`), query));
  }
}

export interface MusicGenerationsProvidersListParams {
  status?: string;
  limit?: number;
}

export class MusicGenerationsProvidersApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music generations.providers.list */
  async list(params?: MusicGenerationsProvidersListParams): Promise<GenerationsProvidersListResponse> {
    const query = buildQueryString([
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<GenerationsProvidersListResponse>(appendQueryString(appApiPath(`/music/generations/providers`), query));
  }
}

export interface MusicGenerationsPromptTemplatesListParams {
  status?: string;
  limit?: number;
}

export class MusicGenerationsPromptTemplatesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music generations.promptTemplates.list */
  async list(params?: MusicGenerationsPromptTemplatesListParams): Promise<GenerationsPromptTemplatesListResponse> {
    const query = buildQueryString([
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<GenerationsPromptTemplatesListResponse>(appendQueryString(appApiPath(`/music/generations/prompt_templates`), query));
  }
}

export interface MusicGenerationsStylePresetsListParams {
  status?: string;
  limit?: number;
}

export class MusicGenerationsStylePresetsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music generations.stylePresets.list */
  async list(params?: MusicGenerationsStylePresetsListParams): Promise<GenerationsStylePresetsListResponse> {
    const query = buildQueryString([
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<GenerationsStylePresetsListResponse>(appendQueryString(appApiPath(`/music/generations/style_presets`), query));
  }
}

export interface MusicGenerationsListParams {
  status?: string;
  limit?: number;
}

export class MusicGenerationsApi {
  private client: HttpClient;
  public readonly stylePresets: MusicGenerationsStylePresetsApi;
  public readonly promptTemplates: MusicGenerationsPromptTemplatesApi;
  public readonly providers: MusicGenerationsProvidersApi;
  public readonly providerModels: MusicGenerationsProviderModelsApi;
  public readonly events: MusicGenerationsEventsApi;
  public readonly notifications: MusicGenerationsNotificationsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.stylePresets = new MusicGenerationsStylePresetsApi(client);
    this.promptTemplates = new MusicGenerationsPromptTemplatesApi(client);
    this.providers = new MusicGenerationsProvidersApi(client);
    this.providerModels = new MusicGenerationsProviderModelsApi(client);
    this.events = new MusicGenerationsEventsApi(client);
    this.notifications = new MusicGenerationsNotificationsApi(client);
  }


/** Music generations.list */
  async list(params?: MusicGenerationsListParams): Promise<GenerationsListResponse> {
    const query = buildQueryString([
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<GenerationsListResponse>(appendQueryString(appApiPath(`/music/generations`), query));
  }

/** Music generations.create */
  async create(body: MusicAiGenerationTaskCommand): Promise<MusicAiGenerationTask> {
    return this.client.post<MusicAiGenerationTask>(appApiPath(`/music/generations`), body, undefined, undefined, 'application/json');
  }

/** Music generations.retrieve */
  async retrieve(generationId: string): Promise<MusicAiGenerationTask> {
    return this.client.get<MusicAiGenerationTask>(appApiPath(`/music/generations/${serializePathParameter(generationId, { name: 'generationId', style: 'simple', explode: false })}`));
  }
}

export class MusicPlayEventsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music playEvents.create */
  async create(body: MusicPlayEventCommand): Promise<MusicListeningHistoryItem> {
    return this.client.post<MusicListeningHistoryItem>(appApiPath(`/music/play_events`), body, undefined, undefined, 'application/json');
  }
}

export interface MusicListeningHistoryListParams {
  limit?: number;
}

export class MusicListeningHistoryApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music listeningHistory.list */
  async list(params?: MusicListeningHistoryListParams): Promise<ListeningHistoryListResponse> {
    const query = buildQueryString([
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ListeningHistoryListResponse>(appendQueryString(appApiPath(`/music/listening_history`), query));
  }
}

export interface MusicPlaybackSessionsListParams {
  deviceId?: string;
  limit?: number;
}

export class MusicPlaybackSessionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music playback.sessions.list */
  async list(params?: MusicPlaybackSessionsListParams): Promise<PlaybackSessionsListResponse> {
    const query = buildQueryString([
      { name: 'device_id', value: params?.deviceId, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PlaybackSessionsListResponse>(appendQueryString(appApiPath(`/music/playback/sessions`), query));
  }

/** Music playback.sessions.create */
  async create(body: MusicPlaybackSessionCommand): Promise<MusicPlaybackSession> {
    return this.client.post<MusicPlaybackSession>(appApiPath(`/music/playback/sessions`), body, undefined, undefined, 'application/json');
  }

/** Music playback.sessions.update */
  async update(sessionId: string, body: MusicPlaybackSessionCommand): Promise<MusicPlaybackSession> {
    return this.client.patch<MusicPlaybackSession>(appApiPath(`/music/playback/sessions/${serializePathParameter(sessionId, { name: 'sessionId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export class MusicPlaybackApi {
  private client: HttpClient;
  public readonly sessions: MusicPlaybackSessionsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.sessions = new MusicPlaybackSessionsApi(client);
  }

}

export interface MusicDownloadsEntitlementsListParams {
  status?: string;
  limit?: number;
}

export class MusicDownloadsEntitlementsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music downloads.entitlements.list */
  async list(params?: MusicDownloadsEntitlementsListParams): Promise<DownloadsEntitlementsListResponse> {
    const query = buildQueryString([
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<DownloadsEntitlementsListResponse>(appendQueryString(appApiPath(`/music/downloads/entitlements`), query));
  }
}

export class MusicDownloadsApi {
  private client: HttpClient;
  public readonly entitlements: MusicDownloadsEntitlementsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.entitlements = new MusicDownloadsEntitlementsApi(client);
  }

}

export class MusicRecommendationFeedbackApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music recommendation.feedback.create */
  async create(body: MusicRecommendationFeedbackCommand): Promise<MusicRecommendationFeedback> {
    return this.client.post<MusicRecommendationFeedback>(appApiPath(`/music/recommendation/feedback`), body, undefined, undefined, 'application/json');
  }
}

export class MusicRecommendationApi {
  private client: HttpClient;
  public readonly feedback: MusicRecommendationFeedbackApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.feedback = new MusicRecommendationFeedbackApi(client);
  }

}

export class MusicContentReportsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music contentReports.create */
  async create(body: MusicContentReportCommand): Promise<MusicContentReport> {
    return this.client.post<MusicContentReport>(appApiPath(`/music/content_reports`), body, undefined, undefined, 'application/json');
  }
}

export interface MusicCommentsListParams {
  resourceType: string;
  resourceId: string;
  limit?: number;
}

export class MusicCommentsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music comments.list */
  async list(params: MusicCommentsListParams): Promise<CommentsListResponse> {
    const query = buildQueryString([
      { name: 'resource_type', value: params.resourceType, style: 'form', explode: true, allowReserved: false },
      { name: 'resource_id', value: params.resourceId, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommentsListResponse>(appendQueryString(appApiPath(`/music/comments`), query));
  }

/** Music comments.create */
  async create(body: MusicCommentCommand): Promise<MusicComment> {
    return this.client.post<MusicComment>(appApiPath(`/music/comments`), body, undefined, undefined, 'application/json');
  }
}

export interface MusicLibraryItemsListParams {
  itemType?: string;
  limit?: number;
}

export class MusicLibraryItemsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music library.items.list */
  async list(params?: MusicLibraryItemsListParams): Promise<LibraryItemsListResponse> {
    const query = buildQueryString([
      { name: 'item_type', value: params?.itemType, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<LibraryItemsListResponse>(appendQueryString(appApiPath(`/music/library/items`), query));
  }

/** Music library.items.create */
  async create(body: MusicLibraryItemCommand): Promise<MusicUserLibraryItem> {
    return this.client.post<MusicUserLibraryItem>(appApiPath(`/music/library/items`), body, undefined, undefined, 'application/json');
  }

/** Music library.items.delete */
  async delete(itemId: string): Promise<MusicUserLibraryItem> {
    return this.client.delete<MusicUserLibraryItem>(appApiPath(`/music/library/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}`));
  }
}

export class MusicLibraryApi {
  private client: HttpClient;
  public readonly items: MusicLibraryItemsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.items = new MusicLibraryItemsApi(client);
  }

}

export interface MusicChartsEntriesListParams {
  limit?: number;
}

export class MusicChartsEntriesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music charts.entries.list */
  async list(chartId: string, params?: MusicChartsEntriesListParams): Promise<ChartsEntriesListResponse> {
    const query = buildQueryString([
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ChartsEntriesListResponse>(appendQueryString(appApiPath(`/music/charts/${serializePathParameter(chartId, { name: 'chartId', style: 'simple', explode: false })}`), query));
  }
}

export interface MusicChartsListParams {
  q?: string;
  status?: string;
}

export class MusicChartsApi {
  private client: HttpClient;
  public readonly entries: MusicChartsEntriesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.entries = new MusicChartsEntriesApi(client);
  }


/** Music charts.list */
  async list(params?: MusicChartsListParams): Promise<ChartsListResponse> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ChartsListResponse>(appendQueryString(appApiPath(`/music/charts`), query));
  }
}

export interface MusicAudioAssetsListParams {
  q?: string;
  status?: string;
}

export class MusicAudioAssetsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music audio.assets.list */
  async list(params?: MusicAudioAssetsListParams): Promise<AudioAssetsListResponse> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AudioAssetsListResponse>(appendQueryString(appApiPath(`/music/audio/assets`), query));
  }
}

export class MusicAudioApi {
  private client: HttpClient;
  public readonly assets: MusicAudioAssetsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.assets = new MusicAudioAssetsApi(client);
  }

}

export class MusicPlaylistsFollowApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music playlists.follow.create */
  async create(playlistId: string, body: MusicPlaylistFollowCommand): Promise<MusicPlaylistFollow> {
    return this.client.post<MusicPlaylistFollow>(appApiPath(`/music/playlists/${serializePathParameter(playlistId, { name: 'playlistId', style: 'simple', explode: false })}/follow`), body, undefined, undefined, 'application/json');
  }

/** Music playlists.follow.delete */
  async delete(playlistId: string): Promise<MusicPlaylistFollow> {
    return this.client.delete<MusicPlaylistFollow>(appApiPath(`/music/playlists/${serializePathParameter(playlistId, { name: 'playlistId', style: 'simple', explode: false })}/follow`));
  }
}

export class MusicPlaylistsTracksApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music playlists.tracks.create */
  async create(playlistId: string, body: MusicPlaylistTrackCommand): Promise<MusicPlaylist> {
    return this.client.post<MusicPlaylist>(appApiPath(`/music/playlists/${serializePathParameter(playlistId, { name: 'playlistId', style: 'simple', explode: false })}/tracks`), body, undefined, undefined, 'application/json');
  }

/** Music playlists.tracks.delete */
  async delete(playlistId: string, trackId: string): Promise<MusicPlaylist> {
    return this.client.delete<MusicPlaylist>(appApiPath(`/music/playlists/${serializePathParameter(playlistId, { name: 'playlistId', style: 'simple', explode: false })}/tracks/${serializePathParameter(trackId, { name: 'trackId', style: 'simple', explode: false })}`));
  }
}

export interface MusicPlaylistsListParams {
  q?: string;
  status?: string;
}

export class MusicPlaylistsApi {
  private client: HttpClient;
  public readonly tracks: MusicPlaylistsTracksApi;
  public readonly follow: MusicPlaylistsFollowApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.tracks = new MusicPlaylistsTracksApi(client);
    this.follow = new MusicPlaylistsFollowApi(client);
  }


/** Music playlists.list */
  async list(params?: MusicPlaylistsListParams): Promise<PlaylistsListResponse> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PlaylistsListResponse>(appendQueryString(appApiPath(`/music/playlists`), query));
  }
}

export interface MusicTracksListParams {
  artistId?: string;
  albumId?: string;
  q?: string;
  status?: string;
}

export class MusicTracksApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music tracks.list */
  async list(params?: MusicTracksListParams): Promise<TracksListResponse> {
    const query = buildQueryString([
      { name: 'artist_id', value: params?.artistId, style: 'form', explode: true, allowReserved: false },
      { name: 'album_id', value: params?.albumId, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<TracksListResponse>(appendQueryString(appApiPath(`/music/tracks`), query));
  }
}

export interface MusicAlbumsListParams {
  artistId?: string;
  q?: string;
  status?: string;
}

export class MusicAlbumsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music albums.list */
  async list(params?: MusicAlbumsListParams): Promise<AlbumsListResponse> {
    const query = buildQueryString([
      { name: 'artist_id', value: params?.artistId, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AlbumsListResponse>(appendQueryString(appApiPath(`/music/albums`), query));
  }
}

export interface MusicArtistsListParams {
  q?: string;
  status?: string;
}

export class MusicArtistsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music artists.list */
  async list(params?: MusicArtistsListParams): Promise<ArtistsListResponse> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ArtistsListResponse>(appendQueryString(appApiPath(`/music/artists`), query));
  }
}

export interface MusicSearchSuggestionsListParams {
  type_?: string;
  limit?: number;
}

export class MusicSearchSuggestionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music search.suggestions.list */
  async list(params?: MusicSearchSuggestionsListParams): Promise<SearchSuggestionsListResponse> {
    const query = buildQueryString([
      { name: 'type', value: params?.type_, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SearchSuggestionsListResponse>(appendQueryString(appApiPath(`/music/search/suggestions`), query));
  }
}

export interface MusicSearchQueryParams {
  q: string;
  type_?: string;
  limit?: number;
}

export class MusicSearchApi {
  private client: HttpClient;
  public readonly suggestions: MusicSearchSuggestionsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.suggestions = new MusicSearchSuggestionsApi(client);
  }


/** Music search.query */
  async query(params: MusicSearchQueryParams): Promise<SearchQueryResponse> {
    const query = buildQueryString([
      { name: 'q', value: params.q, style: 'form', explode: true, allowReserved: false },
      { name: 'type', value: params.type_, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<SearchQueryResponse>(appendQueryString(appApiPath(`/music/search`), query));
  }
}

export interface MusicHomeShelvesListParams {
  cursor?: string;
  limit?: number;
}

export class MusicHomeShelvesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Music home.shelves.list */
  async list(params?: MusicHomeShelvesListParams): Promise<HomeShelvesListResponse> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<HomeShelvesListResponse>(appendQueryString(appApiPath(`/music/home/shelves`), query));
  }
}

export class MusicHomeApi {
  private client: HttpClient;
  public readonly shelves: MusicHomeShelvesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.shelves = new MusicHomeShelvesApi(client);
  }

}

export class MusicApi {
  private client: HttpClient;
  public readonly home: MusicHomeApi;
  public readonly search: MusicSearchApi;
  public readonly artists: MusicArtistsApi;
  public readonly albums: MusicAlbumsApi;
  public readonly tracks: MusicTracksApi;
  public readonly playlists: MusicPlaylistsApi;
  public readonly audio: MusicAudioApi;
  public readonly charts: MusicChartsApi;
  public readonly library: MusicLibraryApi;
  public readonly comments: MusicCommentsApi;
  public readonly contentReports: MusicContentReportsApi;
  public readonly recommendation: MusicRecommendationApi;
  public readonly downloads: MusicDownloadsApi;
  public readonly playback: MusicPlaybackApi;
  public readonly listeningHistory: MusicListeningHistoryApi;
  public readonly playEvents: MusicPlayEventsApi;
  public readonly generations: MusicGenerationsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.home = new MusicHomeApi(client);
    this.search = new MusicSearchApi(client);
    this.artists = new MusicArtistsApi(client);
    this.albums = new MusicAlbumsApi(client);
    this.tracks = new MusicTracksApi(client);
    this.playlists = new MusicPlaylistsApi(client);
    this.audio = new MusicAudioApi(client);
    this.charts = new MusicChartsApi(client);
    this.library = new MusicLibraryApi(client);
    this.comments = new MusicCommentsApi(client);
    this.contentReports = new MusicContentReportsApi(client);
    this.recommendation = new MusicRecommendationApi(client);
    this.downloads = new MusicDownloadsApi(client);
    this.playback = new MusicPlaybackApi(client);
    this.listeningHistory = new MusicListeningHistoryApi(client);
    this.playEvents = new MusicPlayEventsApi(client);
    this.generations = new MusicGenerationsApi(client);
  }

}

export function createMusicApi(client: HttpClient): MusicApi {
  return new MusicApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}

interface PathParameterSpec {
  name: string;
  style: string;
  explode: boolean;
}

function serializePathParameter(value: unknown, spec: PathParameterSpec): string {
  if (value === undefined || value === null) {
    return '';
  }

  const style = spec.style || 'simple';
  if (Array.isArray(value)) {
    return serializePathArray(spec.name, value, style, spec.explode);
  }
  if (typeof value === 'object') {
    return serializePathObject(spec.name, value as Record<string, unknown>, style, spec.explode);
  }
  return pathPrefix(spec.name, style, false) + encodePathValue(serializePathPrimitive(value));
}

function serializePathArray(name: string, values: unknown[], style: string, explode: boolean): string {
  const serialized = values
    .filter((item) => item !== undefined && item !== null)
    .map((item) => encodePathValue(serializePathPrimitive(item)));
  if (serialized.length === 0) {
    return pathPrefix(name, style, false);
  }
  if (style === 'matrix') {
    return explode
      ? serialized.map((item) => `;${name}=${item}`).join('')
      : `;${name}=${serialized.join(',')}`;
  }
  return pathPrefix(name, style, false) + serialized.join(explode ? '.' : ',');
}

function serializePathObject(name: string, value: Record<string, unknown>, style: string, explode: boolean): string {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (entries.length === 0) {
    return pathPrefix(name, style, true);
  }
  if (style === 'matrix') {
    return explode
      ? entries.map(([key, entryValue]) => `;${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join('')
      : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',')}`;
  }
  const serialized = explode
    ? entries.map(([key, entryValue]) => `${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join(style === 'label' ? '.' : ',')
    : entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',');
  return pathPrefix(name, style, true) + serialized;
}

function pathPrefix(name: string, style: string, _objectValue: boolean): string {
  if (style === 'label') return '.';
  if (style === 'matrix') return `;${name}`;
  return '';
}

function encodePathValue(value: string): string {
  return encodeURIComponent(value);
}

function serializePathPrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
interface QueryParameterSpec {
  name: string;
  value: unknown;
  style: string;
  explode: boolean;
  allowReserved: boolean;
  contentType?: string;
}

function buildQueryString(parameters: QueryParameterSpec[]): string {
  const pairs: string[] = [];
  for (const parameter of parameters) {
    appendSerializedParameter(pairs, parameter);
  }
  return pairs.join('&');
}

function appendSerializedParameter(pairs: string[], parameter: QueryParameterSpec): void {
  if (parameter.value === undefined || parameter.value === null) {
    return;
  }

  if (parameter.contentType) {
    pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(JSON.stringify(parameter.value), parameter.allowReserved)}`);
    return;
  }

  const style = parameter.style || 'form';
  if (style === 'deepObject') {
    appendDeepObjectParameter(pairs, parameter.name, parameter.value, parameter.allowReserved);
    return;
  }

  if (Array.isArray(parameter.value)) {
    appendArrayParameter(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }

  if (typeof parameter.value === 'object') {
    appendObjectParameter(pairs, parameter.name, parameter.value as Record<string, unknown>, style, parameter.explode, parameter.allowReserved);
    return;
  }

  pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(serializePrimitive(parameter.value), parameter.allowReserved)}`);
}

function appendArrayParameter(
  pairs: string[],
  name: string,
  value: unknown[],
  style: string,
  explode: boolean,
  allowReserved: boolean,
): void {
  const values = value
    .filter((item) => item !== undefined && item !== null)
    .map((item) => serializePrimitive(item));
  if (values.length === 0) {
    return;
  }

  if (style === 'form' && explode) {
    for (const item of values) {
      pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(item, allowReserved)}`);
    }
    return;
  }

  pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(values.join(','), allowReserved)}`);
}

function appendObjectParameter(
  pairs: string[],
  name: string,
  value: Record<string, unknown>,
  style: string,
  explode: boolean,
  allowReserved: boolean,
): void {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (entries.length === 0) {
    return;
  }

  if (style === 'form' && explode) {
    for (const [key, entryValue] of entries) {
      pairs.push(`${encodeQueryComponent(key)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
    }
    return;
  }

  const serialized = entries.flatMap(([key, entryValue]) => [key, serializePrimitive(entryValue)]).join(',');
  pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serialized, allowReserved)}`);
}

function appendDeepObjectParameter(
  pairs: string[],
  name: string,
  value: unknown,
  allowReserved: boolean,
): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serializePrimitive(value), allowReserved)}`);
    return;
  }

  for (const [key, entryValue] of Object.entries(value as Record<string, unknown>)) {
    if (entryValue === undefined || entryValue === null) {
      continue;
    }
    pairs.push(`${encodeQueryComponent(`${name}[${key}]`)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
  }
}

function serializePrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

function encodeQueryComponent(value: string): string {
  return encodeURIComponent(value);
}

function encodeQueryValue(value: string, allowReserved: boolean): string {
  const encoded = encodeURIComponent(value);
  if (!allowReserved) {
    return encoded;
  }
  return encoded.replace(/%3A/gi, ':')
    .replace(/%2F/gi, '/')
    .replace(/%3F/gi, '?')
    .replace(/%23/gi, '#')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
    .replace(/%40/gi, '@')
    .replace(/%21/gi, '!')
    .replace(/%24/gi, '$')
    .replace(/%26/gi, '&')
    .replace(/%27/gi, "'")
    .replace(/%28/gi, '(')
    .replace(/%29/gi, ')')
    .replace(/%2A/gi, '*')
    .replace(/%2B/gi, '+')
    .replace(/%2C/gi, ',')
    .replace(/%3B/gi, ';')
    .replace(/%3D/gi, '=');
}
