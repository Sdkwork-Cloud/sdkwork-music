import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AiGenerationCreditLedgerListResponse, AiGenerationTasksManagementListResponse, AiPromptTemplatesManagementListResponse, AiStylePresetsManagementListResponse, AlbumsManagementListResponse, ArtistsManagementListResponse, AudioAssetsManagementListResponse, ChartsManagementListResponse, ContentReportsManagementListResponse, ModerationSignalsListResponse, MusicAiGenerationModerationCommand, MusicAiGenerationPublishCommand, MusicAiGenerationTask, MusicAiPromptTemplate, MusicAiPromptTemplateCommand, MusicAiStylePreset, MusicAiStylePresetCommand, MusicAlbum, MusicAlbumCommand, MusicArtist, MusicArtistCommand, MusicAudioAsset, MusicAudioAssetCommand, MusicChart, MusicChartCommand, MusicChartEntry, MusicChartEntryCommand, MusicContentReport, MusicContentReportResolutionCommand, MusicHomeShelf, MusicRecommendationShelfCommand, MusicRelease, MusicReleaseChannel, MusicReleaseChannelCommand, MusicRightsPolicy, MusicRightsPolicyCommand, MusicRightsTerritory, MusicRightsTerritoryCommand, MusicTrack, MusicTrackCommand, PlaylistsManagementListResponse, RecommendationFeedbackManagementListResponse, RecommendationShelvesManagementListResponse, ReleasesListResponse, RightsPoliciesManagementListResponse, TracksManagementListResponse } from '../types';


export class MusicReleasesChannelsApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Music releases.channels.create */
  async create(releaseId: string, body: MusicReleaseChannelCommand): Promise<MusicReleaseChannel> {
    return this.client.post<MusicReleaseChannel>(backendApiPath(`/music/releases/${serializePathParameter(releaseId, { name: 'releaseId', style: 'simple', explode: false })}/channels`), body, undefined, undefined, 'application/json');
  }
}

export interface MusicReleasesListParams {
  status?: string;
  limit?: number;
}

export class MusicReleasesApi {
  private client: HttpClient;
  public readonly channels: MusicReleasesChannelsApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.channels = new MusicReleasesChannelsApi(client); 
  }


/** Music releases.list */
  async list(params?: MusicReleasesListParams): Promise<ReleasesListResponse> {
    const query = buildQueryString([
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ReleasesListResponse>(appendQueryString(backendApiPath(`/music/releases`), query));
  }
}

export interface MusicModerationSignalsListParams {
  resourceType?: string;
  resourceId?: string;
  status?: string;
  limit?: number;
}

export class MusicModerationSignalsApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Music moderation.signals.list */
  async list(params?: MusicModerationSignalsListParams): Promise<ModerationSignalsListResponse> {
    const query = buildQueryString([
      { name: 'resource_type', value: params?.resourceType, style: 'form', explode: true, allowReserved: false },
      { name: 'resource_id', value: params?.resourceId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ModerationSignalsListResponse>(appendQueryString(backendApiPath(`/music/moderation/signals`), query));
  }
}

export class MusicModerationApi {
  private client: HttpClient;
  public readonly signals: MusicModerationSignalsApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.signals = new MusicModerationSignalsApi(client); 
  }

}

export class MusicRightsPoliciesTerritoriesApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Music rights.policies.territories.create */
  async create(policyId: string, body: MusicRightsTerritoryCommand): Promise<MusicRightsTerritory> {
    return this.client.post<MusicRightsTerritory>(backendApiPath(`/music/rights/policies/${serializePathParameter(policyId, { name: 'policyId', style: 'simple', explode: false })}/territories`), body, undefined, undefined, 'application/json');
  }
}

export interface MusicRightsPoliciesManagementListParams {
  status?: string;
  limit?: number;
}

export class MusicRightsPoliciesManagementApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Music rights.policies.management.list */
  async list(params?: MusicRightsPoliciesManagementListParams): Promise<RightsPoliciesManagementListResponse> {
    const query = buildQueryString([
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<RightsPoliciesManagementListResponse>(appendQueryString(backendApiPath(`/music/rights/policies`), query));
  }
}

export class MusicRightsPoliciesApi {
  private client: HttpClient;
  public readonly management: MusicRightsPoliciesManagementApi;
  public readonly territories: MusicRightsPoliciesTerritoriesApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.management = new MusicRightsPoliciesManagementApi(client);
    this.territories = new MusicRightsPoliciesTerritoriesApi(client); 
  }


/** Music rights.policies.create */
  async create(body: MusicRightsPolicyCommand): Promise<MusicRightsPolicy> {
    return this.client.post<MusicRightsPolicy>(backendApiPath(`/music/rights/policies`), body, undefined, undefined, 'application/json');
  }
}

export class MusicRightsApi {
  private client: HttpClient;
  public readonly policies: MusicRightsPoliciesApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.policies = new MusicRightsPoliciesApi(client); 
  }

}

export interface MusicAiGenerationTasksManagementListParams {
  status?: string;
  userId?: string;
  limit?: number;
}

export class MusicAiGenerationTasksManagementApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Music ai.generation.tasks.management.list */
  async list(params?: MusicAiGenerationTasksManagementListParams): Promise<AiGenerationTasksManagementListResponse> {
    const query = buildQueryString([
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AiGenerationTasksManagementListResponse>(appendQueryString(backendApiPath(`/music/ai/generation/tasks`), query));
  }
}

export class MusicAiGenerationTasksApi {
  private client: HttpClient;
  public readonly management: MusicAiGenerationTasksManagementApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.management = new MusicAiGenerationTasksManagementApi(client); 
  }


/** Music ai.generation.tasks.moderate */
  async moderate(taskId: string, body: MusicAiGenerationModerationCommand): Promise<MusicAiGenerationTask> {
    return this.client.post<MusicAiGenerationTask>(backendApiPath(`/music/ai/generation/tasks/${serializePathParameter(taskId, { name: 'taskId', style: 'simple', explode: false })}/moderate`), body, undefined, undefined, 'application/json');
  }

/** Music ai.generation.tasks.publish */
  async publish(taskId: string, body: MusicAiGenerationPublishCommand): Promise<MusicRelease> {
    return this.client.post<MusicRelease>(backendApiPath(`/music/ai/generation/tasks/${serializePathParameter(taskId, { name: 'taskId', style: 'simple', explode: false })}/publish`), body, undefined, undefined, 'application/json');
  }
}

export interface MusicAiGenerationCreditLedgerListParams {
  userId?: string;
  taskId?: string;
  limit?: number;
}

export class MusicAiGenerationCreditLedgerApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Music ai.generation.creditLedger.list */
  async list(params?: MusicAiGenerationCreditLedgerListParams): Promise<AiGenerationCreditLedgerListResponse> {
    const query = buildQueryString([
      { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
      { name: 'task_id', value: params?.taskId, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AiGenerationCreditLedgerListResponse>(appendQueryString(backendApiPath(`/music/ai/generation/credit_ledger`), query));
  }
}

export class MusicAiGenerationApi {
  private client: HttpClient;
  public readonly creditLedger: MusicAiGenerationCreditLedgerApi;
  public readonly tasks: MusicAiGenerationTasksApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.creditLedger = new MusicAiGenerationCreditLedgerApi(client);
    this.tasks = new MusicAiGenerationTasksApi(client); 
  }

}

export interface MusicAiPromptTemplatesManagementListParams {
  status?: string;
  limit?: number;
}

export class MusicAiPromptTemplatesManagementApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Music ai.promptTemplates.management.list */
  async list(params?: MusicAiPromptTemplatesManagementListParams): Promise<AiPromptTemplatesManagementListResponse> {
    const query = buildQueryString([
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AiPromptTemplatesManagementListResponse>(appendQueryString(backendApiPath(`/music/ai/prompt_templates`), query));
  }
}

export class MusicAiPromptTemplatesApi {
  private client: HttpClient;
  public readonly management: MusicAiPromptTemplatesManagementApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.management = new MusicAiPromptTemplatesManagementApi(client); 
  }


/** Music ai.promptTemplates.create */
  async create(body: MusicAiPromptTemplateCommand): Promise<MusicAiPromptTemplate> {
    return this.client.post<MusicAiPromptTemplate>(backendApiPath(`/music/ai/prompt_templates`), body, undefined, undefined, 'application/json');
  }

/** Music ai.promptTemplates.update */
  async update(templateId: string, body: MusicAiPromptTemplateCommand): Promise<MusicAiPromptTemplate> {
    return this.client.patch<MusicAiPromptTemplate>(backendApiPath(`/music/ai/prompt_templates/${serializePathParameter(templateId, { name: 'templateId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export interface MusicAiStylePresetsManagementListParams {
  status?: string;
  limit?: number;
}

export class MusicAiStylePresetsManagementApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Music ai.stylePresets.management.list */
  async list(params?: MusicAiStylePresetsManagementListParams): Promise<AiStylePresetsManagementListResponse> {
    const query = buildQueryString([
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AiStylePresetsManagementListResponse>(appendQueryString(backendApiPath(`/music/ai/style_presets`), query));
  }
}

export class MusicAiStylePresetsApi {
  private client: HttpClient;
  public readonly management: MusicAiStylePresetsManagementApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.management = new MusicAiStylePresetsManagementApi(client); 
  }


/** Music ai.stylePresets.create */
  async create(body: MusicAiStylePresetCommand): Promise<MusicAiStylePreset> {
    return this.client.post<MusicAiStylePreset>(backendApiPath(`/music/ai/style_presets`), body, undefined, undefined, 'application/json');
  }

/** Music ai.stylePresets.update */
  async update(presetId: string, body: MusicAiStylePresetCommand): Promise<MusicAiStylePreset> {
    return this.client.patch<MusicAiStylePreset>(backendApiPath(`/music/ai/style_presets/${serializePathParameter(presetId, { name: 'presetId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export class MusicAiApi {
  private client: HttpClient;
  public readonly stylePresets: MusicAiStylePresetsApi;
  public readonly promptTemplates: MusicAiPromptTemplatesApi;
  public readonly generation: MusicAiGenerationApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.stylePresets = new MusicAiStylePresetsApi(client);
    this.promptTemplates = new MusicAiPromptTemplatesApi(client);
    this.generation = new MusicAiGenerationApi(client); 
  }

}

export interface MusicContentReportsManagementListParams {
  status?: string;
  resourceType?: string;
  resourceId?: string;
  limit?: number;
}

export class MusicContentReportsManagementApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Music contentReports.management.list */
  async list(params?: MusicContentReportsManagementListParams): Promise<ContentReportsManagementListResponse> {
    const query = buildQueryString([
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'resource_type', value: params?.resourceType, style: 'form', explode: true, allowReserved: false },
      { name: 'resource_id', value: params?.resourceId, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ContentReportsManagementListResponse>(appendQueryString(backendApiPath(`/music/content_reports`), query));
  }
}

export class MusicContentReportsApi {
  private client: HttpClient;
  public readonly management: MusicContentReportsManagementApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.management = new MusicContentReportsManagementApi(client); 
  }


/** Music contentReports.resolve */
  async resolve(reportId: string, body: MusicContentReportResolutionCommand): Promise<MusicContentReport> {
    return this.client.post<MusicContentReport>(backendApiPath(`/music/content_reports/${serializePathParameter(reportId, { name: 'reportId', style: 'simple', explode: false })}/resolve`), body, undefined, undefined, 'application/json');
  }
}

export interface MusicRecommendationFeedbackManagementListParams {
  itemType?: string;
  itemId?: string;
  feedbackType?: string;
  limit?: number;
}

export class MusicRecommendationFeedbackManagementApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Music recommendation.feedback.management.list */
  async list(params?: MusicRecommendationFeedbackManagementListParams): Promise<RecommendationFeedbackManagementListResponse> {
    const query = buildQueryString([
      { name: 'item_type', value: params?.itemType, style: 'form', explode: true, allowReserved: false },
      { name: 'item_id', value: params?.itemId, style: 'form', explode: true, allowReserved: false },
      { name: 'feedback_type', value: params?.feedbackType, style: 'form', explode: true, allowReserved: false },
      { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<RecommendationFeedbackManagementListResponse>(appendQueryString(backendApiPath(`/music/recommendation/feedback`), query));
  }
}

export class MusicRecommendationFeedbackApi {
  private client: HttpClient;
  public readonly management: MusicRecommendationFeedbackManagementApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.management = new MusicRecommendationFeedbackManagementApi(client); 
  }

}

export interface MusicRecommendationShelvesManagementListParams {
  q?: string;
  status?: string;
}

export class MusicRecommendationShelvesManagementApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Music recommendation.shelves.management.list */
  async list(params?: MusicRecommendationShelvesManagementListParams): Promise<RecommendationShelvesManagementListResponse> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<RecommendationShelvesManagementListResponse>(appendQueryString(backendApiPath(`/music/recommendation/shelves`), query));
  }
}

export class MusicRecommendationShelvesApi {
  private client: HttpClient;
  public readonly management: MusicRecommendationShelvesManagementApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.management = new MusicRecommendationShelvesManagementApi(client); 
  }


/** Music recommendation.shelves.create */
  async create(body: MusicRecommendationShelfCommand): Promise<MusicHomeShelf> {
    return this.client.post<MusicHomeShelf>(backendApiPath(`/music/recommendation/shelves`), body, undefined, undefined, 'application/json');
  }
}

export class MusicRecommendationApi {
  private client: HttpClient;
  public readonly shelves: MusicRecommendationShelvesApi;
  public readonly feedback: MusicRecommendationFeedbackApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.shelves = new MusicRecommendationShelvesApi(client);
    this.feedback = new MusicRecommendationFeedbackApi(client); 
  }

}

export class MusicChartsEntriesApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Music charts.entries.create */
  async create(chartId: string, body: MusicChartEntryCommand): Promise<MusicChartEntry> {
    return this.client.post<MusicChartEntry>(backendApiPath(`/music/charts/${serializePathParameter(chartId, { name: 'chartId', style: 'simple', explode: false })}/entries`), body, undefined, undefined, 'application/json');
  }
}

export interface MusicChartsManagementListParams {
  q?: string;
  status?: string;
}

export class MusicChartsManagementApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Music charts.management.list */
  async list(params?: MusicChartsManagementListParams): Promise<ChartsManagementListResponse> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ChartsManagementListResponse>(appendQueryString(backendApiPath(`/music/charts`), query));
  }
}

export class MusicChartsApi {
  private client: HttpClient;
  public readonly management: MusicChartsManagementApi;
  public readonly entries: MusicChartsEntriesApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.management = new MusicChartsManagementApi(client);
    this.entries = new MusicChartsEntriesApi(client); 
  }


/** Music charts.create */
  async create(body: MusicChartCommand): Promise<MusicChart> {
    return this.client.post<MusicChart>(backendApiPath(`/music/charts`), body, undefined, undefined, 'application/json');
  }

/** Music charts.update */
  async update(chartId: string, body: MusicChartCommand): Promise<MusicChart> {
    return this.client.patch<MusicChart>(backendApiPath(`/music/charts/${serializePathParameter(chartId, { name: 'chartId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export interface MusicAudioAssetsManagementListParams {
  q?: string;
  status?: string;
}

export class MusicAudioAssetsManagementApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Music audio.assets.management.list */
  async list(params?: MusicAudioAssetsManagementListParams): Promise<AudioAssetsManagementListResponse> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AudioAssetsManagementListResponse>(appendQueryString(backendApiPath(`/music/audio/assets`), query));
  }
}

export class MusicAudioAssetsApi {
  private client: HttpClient;
  public readonly management: MusicAudioAssetsManagementApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.management = new MusicAudioAssetsManagementApi(client); 
  }


/** Music audio.assets.create */
  async create(body: MusicAudioAssetCommand): Promise<MusicAudioAsset> {
    return this.client.post<MusicAudioAsset>(backendApiPath(`/music/audio/assets`), body, undefined, undefined, 'application/json');
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

export interface MusicPlaylistsManagementListParams {
  q?: string;
  status?: string;
}

export class MusicPlaylistsManagementApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Music playlists.management.list */
  async list(params?: MusicPlaylistsManagementListParams): Promise<PlaylistsManagementListResponse> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<PlaylistsManagementListResponse>(appendQueryString(backendApiPath(`/music/playlists`), query));
  }
}

export class MusicPlaylistsApi {
  private client: HttpClient;
  public readonly management: MusicPlaylistsManagementApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.management = new MusicPlaylistsManagementApi(client); 
  }

}

export interface MusicTracksManagementListParams {
  artistId?: string;
  albumId?: string;
  q?: string;
  status?: string;
}

export class MusicTracksManagementApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Music tracks.management.list */
  async list(params?: MusicTracksManagementListParams): Promise<TracksManagementListResponse> {
    const query = buildQueryString([
      { name: 'artist_id', value: params?.artistId, style: 'form', explode: true, allowReserved: false },
      { name: 'album_id', value: params?.albumId, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<TracksManagementListResponse>(appendQueryString(backendApiPath(`/music/tracks`), query));
  }
}

export class MusicTracksApi {
  private client: HttpClient;
  public readonly management: MusicTracksManagementApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.management = new MusicTracksManagementApi(client); 
  }


/** Music tracks.create */
  async create(body: MusicTrackCommand): Promise<MusicTrack> {
    return this.client.post<MusicTrack>(backendApiPath(`/music/tracks`), body, undefined, undefined, 'application/json');
  }

/** Music tracks.publish */
  async publish(trackId: string): Promise<MusicTrack> {
    return this.client.post<MusicTrack>(backendApiPath(`/music/tracks/${serializePathParameter(trackId, { name: 'trackId', style: 'simple', explode: false })}/publish`));
  }

/** Music tracks.archive */
  async archive(trackId: string): Promise<MusicTrack> {
    return this.client.post<MusicTrack>(backendApiPath(`/music/tracks/${serializePathParameter(trackId, { name: 'trackId', style: 'simple', explode: false })}/archive`));
  }
}

export interface MusicAlbumsManagementListParams {
  artistId?: string;
  q?: string;
  status?: string;
}

export class MusicAlbumsManagementApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Music albums.management.list */
  async list(params?: MusicAlbumsManagementListParams): Promise<AlbumsManagementListResponse> {
    const query = buildQueryString([
      { name: 'artist_id', value: params?.artistId, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<AlbumsManagementListResponse>(appendQueryString(backendApiPath(`/music/albums`), query));
  }
}

export class MusicAlbumsApi {
  private client: HttpClient;
  public readonly management: MusicAlbumsManagementApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.management = new MusicAlbumsManagementApi(client); 
  }


/** Music albums.create */
  async create(body: MusicAlbumCommand): Promise<MusicAlbum> {
    return this.client.post<MusicAlbum>(backendApiPath(`/music/albums`), body, undefined, undefined, 'application/json');
  }
}

export interface MusicArtistsManagementListParams {
  q?: string;
  status?: string;
}

export class MusicArtistsManagementApi {
  private client: HttpClient;
  
  constructor(client: HttpClient) { 
    this.client = client; 
  }


/** Music artists.management.list */
  async list(params?: MusicArtistsManagementListParams): Promise<ArtistsManagementListResponse> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<ArtistsManagementListResponse>(appendQueryString(backendApiPath(`/music/artists`), query));
  }
}

export class MusicArtistsApi {
  private client: HttpClient;
  public readonly management: MusicArtistsManagementApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.management = new MusicArtistsManagementApi(client); 
  }


/** Music artists.create */
  async create(body: MusicArtistCommand): Promise<MusicArtist> {
    return this.client.post<MusicArtist>(backendApiPath(`/music/artists`), body, undefined, undefined, 'application/json');
  }
}

export class MusicApi {
  private client: HttpClient;
  public readonly artists: MusicArtistsApi;
  public readonly albums: MusicAlbumsApi;
  public readonly tracks: MusicTracksApi;
  public readonly playlists: MusicPlaylistsApi;
  public readonly audio: MusicAudioApi;
  public readonly charts: MusicChartsApi;
  public readonly recommendation: MusicRecommendationApi;
  public readonly contentReports: MusicContentReportsApi;
  public readonly ai: MusicAiApi;
  public readonly rights: MusicRightsApi;
  public readonly moderation: MusicModerationApi;
  public readonly releases: MusicReleasesApi;
  
  constructor(client: HttpClient) { 
    this.client = client;
    this.artists = new MusicArtistsApi(client);
    this.albums = new MusicAlbumsApi(client);
    this.tracks = new MusicTracksApi(client);
    this.playlists = new MusicPlaylistsApi(client);
    this.audio = new MusicAudioApi(client);
    this.charts = new MusicChartsApi(client);
    this.recommendation = new MusicRecommendationApi(client);
    this.contentReports = new MusicContentReportsApi(client);
    this.ai = new MusicAiApi(client);
    this.rights = new MusicRightsApi(client);
    this.moderation = new MusicModerationApi(client);
    this.releases = new MusicReleasesApi(client); 
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
