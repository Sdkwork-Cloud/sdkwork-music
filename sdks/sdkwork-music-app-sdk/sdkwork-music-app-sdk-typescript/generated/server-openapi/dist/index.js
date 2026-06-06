import { BaseHttpClient, withRetry } from '@sdkwork/sdk-common';
export { DEFAULT_TIMEOUT, DefaultAuthTokenManager, SUCCESS_CODES, createTokenManager } from '@sdkwork/sdk-common';

class HttpClient extends BaseHttpClient {
    constructor(config) {
        super(config);
    }
    getInternalAuthConfig() {
        const self = this;
        self.authConfig = self.authConfig || {};
        return self.authConfig;
    }
    getInternalHeaders() {
        const self = this;
        self.config = self.config || {};
        self.config.headers = self.config.headers || {};
        return self.config.headers;
    }
    buildRequestHeaders(headers, contentType) {
        const mergedHeaders = {
            ...(headers ?? {}),
        };
        if (contentType && contentType.toLowerCase() !== 'multipart/form-data') {
            mergedHeaders['Content-Type'] = contentType;
        }
        return Object.keys(mergedHeaders).length > 0 ? mergedHeaders : undefined;
    }
    buildRequestBody(body, contentType) {
        if (body == null) {
            return body;
        }
        const normalizedContentType = (contentType ?? '').toLowerCase();
        if (normalizedContentType === 'application/x-www-form-urlencoded') {
            return this.encodeFormBody(body);
        }
        if (normalizedContentType === 'multipart/form-data') {
            return this.encodeMultipartBody(body);
        }
        return body;
    }
    encodeMultipartBody(body) {
        if (body instanceof FormData) {
            return body;
        }
        const formData = new FormData();
        if (body instanceof Map) {
            for (const [key, value] of body.entries()) {
                this.appendMultipartValue(formData, String(key), value);
            }
            return formData;
        }
        if (typeof body === 'object') {
            const record = body;
            for (const [key, value] of Object.entries(record)) {
                if (this.isMultipartMetadataField(key)) {
                    continue;
                }
                this.appendMultipartValue(formData, key, value, this.resolveMultipartFileName(record, key));
            }
            return formData;
        }
        this.appendMultipartValue(formData, 'value', body);
        return formData;
    }
    appendMultipartValue(formData, key, value, fileName) {
        if (value == null) {
            return;
        }
        if (Array.isArray(value)) {
            value.forEach((item) => this.appendMultipartValue(formData, key, item, fileName));
            return;
        }
        if (value instanceof Blob) {
            if (fileName) {
                formData.append(key, value, fileName);
                return;
            }
            formData.append(key, value);
            return;
        }
        if (value instanceof Date) {
            formData.append(key, value.toISOString());
            return;
        }
        if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
            return;
        }
        formData.append(key, String(value));
    }
    resolveMultipartFileName(record, key) {
        const fieldSpecificName = record[`${key}FileName`];
        if (typeof fieldSpecificName === 'string' && fieldSpecificName.trim()) {
            return fieldSpecificName.trim();
        }
        const genericName = record.fileName;
        if (key === 'file' && typeof genericName === 'string' && genericName.trim()) {
            return genericName.trim();
        }
        return undefined;
    }
    isMultipartMetadataField(key) {
        return key === 'fileName' || key.endsWith('FileName');
    }
    encodeFormBody(body) {
        if (body instanceof URLSearchParams) {
            return body.toString();
        }
        if (typeof body === 'string') {
            return body;
        }
        const params = new URLSearchParams();
        if (body instanceof Map) {
            for (const [key, value] of body.entries()) {
                this.appendFormValue(params, String(key), value);
            }
            return params.toString();
        }
        if (typeof body === 'object') {
            for (const [key, value] of Object.entries(body)) {
                this.appendFormValue(params, key, value);
            }
            return params.toString();
        }
        params.append('value', String(body));
        return params.toString();
    }
    appendFormValue(params, key, value) {
        if (value == null) {
            return;
        }
        if (Array.isArray(value)) {
            value.forEach((item) => this.appendFormValue(params, key, item));
            return;
        }
        if (value instanceof Date) {
            params.append(key, value.toISOString());
            return;
        }
        if (typeof value === 'object') {
            params.append(key, JSON.stringify(value));
            return;
        }
        params.append(key, String(value));
    }
    setApiKey(apiKey) {
        const authConfig = this.getInternalAuthConfig();
        const headers = this.getInternalHeaders();
        authConfig.apiKey = apiKey;
        authConfig.tokenManager?.clearTokens?.();
        if (HttpClient.API_KEY_HEADER === 'Authorization' && HttpClient.API_KEY_USE_BEARER) {
            authConfig.authMode = 'apikey';
            return;
        }
        authConfig.authMode = 'dual-token';
        headers[HttpClient.API_KEY_HEADER] = HttpClient.API_KEY_USE_BEARER
            ? `Bearer ${apiKey}`
            : apiKey;
        if (HttpClient.API_KEY_HEADER.toLowerCase() !== 'authorization') {
            delete headers['Authorization'];
        }
    }
    setAuthToken(token) {
        const headers = this.getInternalHeaders();
        if (HttpClient.API_KEY_HEADER.toLowerCase() !== 'authorization') {
            delete headers[HttpClient.API_KEY_HEADER];
        }
        super.setAuthToken(token);
    }
    setAccessToken(token) {
        const headers = this.getInternalHeaders();
        headers[HttpClient.ACCESS_TOKEN_HEADER] = token;
        super.setAccessToken(token);
    }
    setTokenManager(manager) {
        const baseProto = Object.getPrototypeOf(HttpClient.prototype);
        if (typeof baseProto.setTokenManager === 'function') {
            baseProto.setTokenManager.call(this, manager);
            return;
        }
        this.getInternalAuthConfig().tokenManager = manager;
    }
    applySdkworkAuthHeaders(headers) {
        const authConfig = this.getInternalAuthConfig();
        const tokenManager = authConfig.tokenManager;
        const accessToken = tokenManager?.getAccessToken?.();
        if (!accessToken) {
            return headers;
        }
        return {
            ...(headers ?? {}),
            [HttpClient.ACCESS_TOKEN_HEADER]: accessToken,
        };
    }
    async request(path, options = {}) {
        const execute = this.execute;
        if (typeof execute !== 'function') {
            throw new Error('BaseHttpClient execute method is not available');
        }
        const { body, headers, contentType, method = 'GET', ...rest } = options;
        const requestHeaders = this.applySdkworkAuthHeaders(headers);
        return withRetry(() => execute.call(this, {
            url: path,
            method,
            ...rest,
            body: this.buildRequestBody(body, contentType),
            headers: this.buildRequestHeaders(requestHeaders, body == null ? undefined : contentType),
        }), { maxRetries: 3 });
    }
    async *streamJson(path, options = {}) {
        const stream = BaseHttpClient.prototype.stream;
        if (typeof stream !== 'function') {
            throw new Error('BaseHttpClient stream method is not available');
        }
        const { body, headers, contentType, method = 'GET', ...rest } = options;
        const authHeaders = this.applySdkworkAuthHeaders(headers);
        const requestHeaders = this.buildRequestHeaders({ Accept: 'text/event-stream', ...(authHeaders ?? {}) }, body == null ? undefined : contentType);
        for await (const data of stream.call(this, path, {
            method,
            ...rest,
            body: this.buildRequestBody(body, contentType),
            headers: requestHeaders,
        })) {
            if (data === '[DONE]') {
                return;
            }
            if (typeof data !== 'string' || data.trim().length === 0) {
                continue;
            }
            yield JSON.parse(data);
        }
    }
    async get(path, params, headers) {
        return this.request(path, { method: 'GET', params, headers });
    }
    async post(path, body, params, headers, contentType) {
        return this.request(path, { method: 'POST', body, params, headers, contentType });
    }
    async put(path, body, params, headers, contentType) {
        return this.request(path, { method: 'PUT', body, params, headers, contentType });
    }
    async delete(path, params, headers) {
        return this.request(path, { method: 'DELETE', params, headers });
    }
    async patch(path, body, params, headers, contentType) {
        return this.request(path, { method: 'PATCH', body, params, headers, contentType });
    }
}
HttpClient.API_KEY_HEADER = 'Access-Token';
HttpClient.ACCESS_TOKEN_HEADER = 'Access-Token';
HttpClient.API_KEY_USE_BEARER = false;
function createHttpClient(config) {
    return new HttpClient(config);
}

const APP_API_PREFIX = '/app/v3/api';
function appApiPath(path) {
    if (!path) {
        return APP_API_PREFIX;
    }
    if (/^https?:\/\//i.test(path)) {
        return path;
    }
    const normalizedPrefixRaw = (APP_API_PREFIX).trim();
    const normalizedPrefix = normalizedPrefixRaw
        ? `/${normalizedPrefixRaw.replace(/^\/+|\/+$/g, '')}`
        : '';
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    if (!normalizedPrefix || normalizedPrefix === '/') {
        return normalizedPath;
    }
    if (normalizedPath === normalizedPrefix || normalizedPath.startsWith(`${normalizedPrefix}/`)) {
        return normalizedPath;
    }
    return `${normalizedPrefix}${normalizedPath}`;
}

class MusicGenerationsNotificationsApi {
    constructor(client) {
        this.client = client;
    }
    /** Music generations.notifications.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/generations/notifications`), query));
    }
    /** Music generations.notifications.update */
    async update(notificationId, body) {
        return this.client.patch(appApiPath(`/music/generations/notifications/${serializePathParameter(notificationId, { name: 'notificationId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
    }
}
class MusicGenerationsEventsApi {
    constructor(client) {
        this.client = client;
    }
    /** Music generations.events.list */
    async list(generationId, params) {
        const query = buildQueryString([
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/generations/${serializePathParameter(generationId, { name: 'generationId', style: 'simple', explode: false })}/events`), query));
    }
}
class MusicGenerationsProviderModelsApi {
    constructor(client) {
        this.client = client;
    }
    /** Music generations.providerModels.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'provider_code', value: params?.providerCode, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/generations/provider_models`), query));
    }
}
class MusicGenerationsProvidersApi {
    constructor(client) {
        this.client = client;
    }
    /** Music generations.providers.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/generations/providers`), query));
    }
}
class MusicGenerationsPromptTemplatesApi {
    constructor(client) {
        this.client = client;
    }
    /** Music generations.promptTemplates.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/generations/prompt_templates`), query));
    }
}
class MusicGenerationsStylePresetsApi {
    constructor(client) {
        this.client = client;
    }
    /** Music generations.stylePresets.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/generations/style_presets`), query));
    }
}
class MusicGenerationsApi {
    constructor(client) {
        this.client = client;
        this.stylePresets = new MusicGenerationsStylePresetsApi(client);
        this.promptTemplates = new MusicGenerationsPromptTemplatesApi(client);
        this.providers = new MusicGenerationsProvidersApi(client);
        this.providerModels = new MusicGenerationsProviderModelsApi(client);
        this.events = new MusicGenerationsEventsApi(client);
        this.notifications = new MusicGenerationsNotificationsApi(client);
    }
    /** Music generations.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/generations`), query));
    }
    /** Music generations.create */
    async create(body) {
        return this.client.post(appApiPath(`/music/generations`), body, undefined, undefined, 'application/json');
    }
    /** Music generations.retrieve */
    async retrieve(generationId) {
        return this.client.get(appApiPath(`/music/generations/${serializePathParameter(generationId, { name: 'generationId', style: 'simple', explode: false })}`));
    }
}
class MusicPlayEventsApi {
    constructor(client) {
        this.client = client;
    }
    /** Music playEvents.create */
    async create(body) {
        return this.client.post(appApiPath(`/music/play_events`), body, undefined, undefined, 'application/json');
    }
}
class MusicListeningHistoryApi {
    constructor(client) {
        this.client = client;
    }
    /** Music listeningHistory.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/listening_history`), query));
    }
}
class MusicPlaybackSessionsApi {
    constructor(client) {
        this.client = client;
    }
    /** Music playback.sessions.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'device_id', value: params?.deviceId, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/playback/sessions`), query));
    }
    /** Music playback.sessions.create */
    async create(body) {
        return this.client.post(appApiPath(`/music/playback/sessions`), body, undefined, undefined, 'application/json');
    }
    /** Music playback.sessions.update */
    async update(sessionId, body) {
        return this.client.patch(appApiPath(`/music/playback/sessions/${serializePathParameter(sessionId, { name: 'sessionId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
    }
}
class MusicPlaybackApi {
    constructor(client) {
        this.client = client;
        this.sessions = new MusicPlaybackSessionsApi(client);
    }
}
class MusicDownloadsEntitlementsApi {
    constructor(client) {
        this.client = client;
    }
    /** Music downloads.entitlements.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/downloads/entitlements`), query));
    }
}
class MusicDownloadsApi {
    constructor(client) {
        this.client = client;
        this.entitlements = new MusicDownloadsEntitlementsApi(client);
    }
}
class MusicRecommendationFeedbackApi {
    constructor(client) {
        this.client = client;
    }
    /** Music recommendation.feedback.create */
    async create(body) {
        return this.client.post(appApiPath(`/music/recommendation/feedback`), body, undefined, undefined, 'application/json');
    }
}
class MusicRecommendationApi {
    constructor(client) {
        this.client = client;
        this.feedback = new MusicRecommendationFeedbackApi(client);
    }
}
class MusicContentReportsApi {
    constructor(client) {
        this.client = client;
    }
    /** Music contentReports.create */
    async create(body) {
        return this.client.post(appApiPath(`/music/content_reports`), body, undefined, undefined, 'application/json');
    }
}
class MusicCommentsApi {
    constructor(client) {
        this.client = client;
    }
    /** Music comments.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'resource_type', value: params.resourceType, style: 'form', explode: true, allowReserved: false },
            { name: 'resource_id', value: params.resourceId, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/comments`), query));
    }
    /** Music comments.create */
    async create(body) {
        return this.client.post(appApiPath(`/music/comments`), body, undefined, undefined, 'application/json');
    }
}
class MusicLibraryItemsApi {
    constructor(client) {
        this.client = client;
    }
    /** Music library.items.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'item_type', value: params?.itemType, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/library/items`), query));
    }
    /** Music library.items.create */
    async create(body) {
        return this.client.post(appApiPath(`/music/library/items`), body, undefined, undefined, 'application/json');
    }
    /** Music library.items.delete */
    async delete(itemId) {
        return this.client.delete(appApiPath(`/music/library/items/${serializePathParameter(itemId, { name: 'itemId', style: 'simple', explode: false })}`));
    }
}
class MusicLibraryApi {
    constructor(client) {
        this.client = client;
        this.items = new MusicLibraryItemsApi(client);
    }
}
class MusicChartsEntriesApi {
    constructor(client) {
        this.client = client;
    }
    /** Music charts.entries.list */
    async list(chartId, params) {
        const query = buildQueryString([
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/charts/${serializePathParameter(chartId, { name: 'chartId', style: 'simple', explode: false })}`), query));
    }
}
class MusicChartsApi {
    constructor(client) {
        this.client = client;
        this.entries = new MusicChartsEntriesApi(client);
    }
    /** Music charts.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/charts`), query));
    }
}
class MusicAudioAssetsApi {
    constructor(client) {
        this.client = client;
    }
    /** Music audio.assets.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/audio/assets`), query));
    }
}
class MusicAudioApi {
    constructor(client) {
        this.client = client;
        this.assets = new MusicAudioAssetsApi(client);
    }
}
class MusicPlaylistsFollowApi {
    constructor(client) {
        this.client = client;
    }
    /** Music playlists.follow.create */
    async create(playlistId, body) {
        return this.client.post(appApiPath(`/music/playlists/${serializePathParameter(playlistId, { name: 'playlistId', style: 'simple', explode: false })}/follow`), body, undefined, undefined, 'application/json');
    }
    /** Music playlists.follow.delete */
    async delete(playlistId) {
        return this.client.delete(appApiPath(`/music/playlists/${serializePathParameter(playlistId, { name: 'playlistId', style: 'simple', explode: false })}/follow`));
    }
}
class MusicPlaylistsTracksApi {
    constructor(client) {
        this.client = client;
    }
    /** Music playlists.tracks.create */
    async create(playlistId, body) {
        return this.client.post(appApiPath(`/music/playlists/${serializePathParameter(playlistId, { name: 'playlistId', style: 'simple', explode: false })}/tracks`), body, undefined, undefined, 'application/json');
    }
    /** Music playlists.tracks.delete */
    async delete(playlistId, trackId) {
        return this.client.delete(appApiPath(`/music/playlists/${serializePathParameter(playlistId, { name: 'playlistId', style: 'simple', explode: false })}/tracks/${serializePathParameter(trackId, { name: 'trackId', style: 'simple', explode: false })}`));
    }
}
class MusicPlaylistsApi {
    constructor(client) {
        this.client = client;
        this.tracks = new MusicPlaylistsTracksApi(client);
        this.follow = new MusicPlaylistsFollowApi(client);
    }
    /** Music playlists.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/playlists`), query));
    }
}
class MusicTracksApi {
    constructor(client) {
        this.client = client;
    }
    /** Music tracks.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'artist_id', value: params?.artistId, style: 'form', explode: true, allowReserved: false },
            { name: 'album_id', value: params?.albumId, style: 'form', explode: true, allowReserved: false },
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/tracks`), query));
    }
}
class MusicAlbumsApi {
    constructor(client) {
        this.client = client;
    }
    /** Music albums.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'artist_id', value: params?.artistId, style: 'form', explode: true, allowReserved: false },
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/albums`), query));
    }
}
class MusicArtistsApi {
    constructor(client) {
        this.client = client;
    }
    /** Music artists.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/artists`), query));
    }
}
class MusicSearchSuggestionsApi {
    constructor(client) {
        this.client = client;
    }
    /** Music search.suggestions.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'type', value: params?.type_, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/search/suggestions`), query));
    }
}
class MusicSearchApi {
    constructor(client) {
        this.client = client;
        this.suggestions = new MusicSearchSuggestionsApi(client);
    }
    /** Music search.query */
    async query(params) {
        const query = buildQueryString([
            { name: 'q', value: params.q, style: 'form', explode: true, allowReserved: false },
            { name: 'type', value: params.type_, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/search`), query));
    }
}
class MusicHomeShelvesApi {
    constructor(client) {
        this.client = client;
    }
    /** Music home.shelves.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(appApiPath(`/music/home/shelves`), query));
    }
}
class MusicHomeApi {
    constructor(client) {
        this.client = client;
        this.shelves = new MusicHomeShelvesApi(client);
    }
}
class MusicApi {
    constructor(client) {
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
function createMusicApi(client) {
    return new MusicApi(client);
}
function appendQueryString(path, rawQueryString) {
    const query = rawQueryString.replace(/^\?+/, '');
    if (!query) {
        return path;
    }
    return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}
function serializePathParameter(value, spec) {
    if (value === undefined || value === null) {
        return '';
    }
    const style = spec.style || 'simple';
    if (Array.isArray(value)) {
        return serializePathArray(spec.name, value, style, spec.explode);
    }
    if (typeof value === 'object') {
        return serializePathObject(spec.name, value, style, spec.explode);
    }
    return pathPrefix(spec.name, style) + encodePathValue(serializePathPrimitive(value));
}
function serializePathArray(name, values, style, explode) {
    const serialized = values
        .filter((item) => item !== undefined && item !== null)
        .map((item) => encodePathValue(serializePathPrimitive(item)));
    if (serialized.length === 0) {
        return pathPrefix(name, style);
    }
    if (style === 'matrix') {
        return explode
            ? serialized.map((item) => `;${name}=${item}`).join('')
            : `;${name}=${serialized.join(',')}`;
    }
    return pathPrefix(name, style) + serialized.join(explode ? '.' : ',');
}
function serializePathObject(name, value, style, explode) {
    const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
    if (entries.length === 0) {
        return pathPrefix(name, style);
    }
    if (style === 'matrix') {
        return explode
            ? entries.map(([key, entryValue]) => `;${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join('')
            : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',')}`;
    }
    const serialized = explode
        ? entries.map(([key, entryValue]) => `${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join(style === 'label' ? '.' : ',')
        : entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',');
    return pathPrefix(name, style) + serialized;
}
function pathPrefix(name, style, _objectValue) {
    if (style === 'label')
        return '.';
    if (style === 'matrix')
        return `;${name}`;
    return '';
}
function encodePathValue(value) {
    return encodeURIComponent(value);
}
function serializePathPrimitive(value) {
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value);
}
function buildQueryString(parameters) {
    const pairs = [];
    for (const parameter of parameters) {
        appendSerializedParameter(pairs, parameter);
    }
    return pairs.join('&');
}
function appendSerializedParameter(pairs, parameter) {
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
        appendObjectParameter(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
        return;
    }
    pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(serializePrimitive(parameter.value), parameter.allowReserved)}`);
}
function appendArrayParameter(pairs, name, value, style, explode, allowReserved) {
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
function appendObjectParameter(pairs, name, value, style, explode, allowReserved) {
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
function appendDeepObjectParameter(pairs, name, value, allowReserved) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serializePrimitive(value), allowReserved)}`);
        return;
    }
    for (const [key, entryValue] of Object.entries(value)) {
        if (entryValue === undefined || entryValue === null) {
            continue;
        }
        pairs.push(`${encodeQueryComponent(`${name}[${key}]`)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
    }
}
function serializePrimitive(value) {
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value);
}
function encodeQueryComponent(value) {
    return encodeURIComponent(value);
}
function encodeQueryValue(value, allowReserved) {
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

class SdkworkAppClient {
    constructor(config) {
        this.httpClient = createHttpClient(config);
        this.music = createMusicApi(this.httpClient);
    }
    setApiKey(apiKey) {
        this.httpClient.setApiKey(apiKey);
        return this;
    }
    setAuthToken(token) {
        this.httpClient.setAuthToken(token);
        return this;
    }
    setAccessToken(token) {
        this.httpClient.setAccessToken(token);
        return this;
    }
    setTokenManager(manager) {
        this.httpClient.setTokenManager(manager);
        return this;
    }
    get http() {
        return this.httpClient;
    }
}
function createClient(config) {
    return new SdkworkAppClient(config);
}

class BaseApi {
    constructor(http, basePath) {
        this.http = http;
        this.basePath = basePath;
    }
    async get(path, params, headers) {
        return this.http.get(`${this.basePath}${path}`, params, headers);
    }
    async post(path, body, params, headers, contentType) {
        return this.http.post(`${this.basePath}${path}`, body, params, headers, contentType);
    }
    async put(path, body, params, headers, contentType) {
        return this.http.put(`${this.basePath}${path}`, body, params, headers, contentType);
    }
    async delete(path, params, headers) {
        return this.http.delete(`${this.basePath}${path}`, params, headers);
    }
    async patch(path, body, params, headers, contentType) {
        return this.http.patch(`${this.basePath}${path}`, body, params, headers, contentType);
    }
    async request(method, path, body, params, headers, contentType) {
        return this.http.request(`${this.basePath}${path}`, { method: method, body, params, headers, contentType });
    }
}

export { BaseApi, HttpClient, MusicApi, SdkworkAppClient, appApiPath, createClient, createHttpClient, createMusicApi };
