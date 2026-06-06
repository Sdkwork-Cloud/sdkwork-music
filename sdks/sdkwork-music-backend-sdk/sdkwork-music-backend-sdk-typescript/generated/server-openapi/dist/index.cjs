'use strict';

var sdkCommon = require('@sdkwork/sdk-common');

class HttpClient extends sdkCommon.BaseHttpClient {
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
        return sdkCommon.withRetry(() => execute.call(this, {
            url: path,
            method,
            ...rest,
            body: this.buildRequestBody(body, contentType),
            headers: this.buildRequestHeaders(requestHeaders, body == null ? undefined : contentType),
        }), { maxRetries: 3 });
    }
    async *streamJson(path, options = {}) {
        const stream = sdkCommon.BaseHttpClient.prototype.stream;
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

const BACKEND_API_PREFIX = '/backend/v3/api';
function backendApiPath(path) {
    if (!path) {
        return BACKEND_API_PREFIX;
    }
    if (/^https?:\/\//i.test(path)) {
        return path;
    }
    const normalizedPrefixRaw = (BACKEND_API_PREFIX).trim();
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

class MusicReleasesChannelsApi {
    constructor(client) {
        this.client = client;
    }
    /** Music releases.channels.create */
    async create(releaseId, body) {
        return this.client.post(backendApiPath(`/music/releases/${serializePathParameter(releaseId, { name: 'releaseId', style: 'simple', explode: false })}/channels`), body, undefined, undefined, 'application/json');
    }
}
class MusicReleasesApi {
    constructor(client) {
        this.client = client;
        this.channels = new MusicReleasesChannelsApi(client);
    }
    /** Music releases.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/releases`), query));
    }
}
class MusicModerationSignalsApi {
    constructor(client) {
        this.client = client;
    }
    /** Music moderation.signals.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'resource_type', value: params?.resourceType, style: 'form', explode: true, allowReserved: false },
            { name: 'resource_id', value: params?.resourceId, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/moderation/signals`), query));
    }
}
class MusicModerationApi {
    constructor(client) {
        this.client = client;
        this.signals = new MusicModerationSignalsApi(client);
    }
}
class MusicRightsPoliciesTerritoriesApi {
    constructor(client) {
        this.client = client;
    }
    /** Music rights.policies.territories.create */
    async create(policyId, body) {
        return this.client.post(backendApiPath(`/music/rights/policies/${serializePathParameter(policyId, { name: 'policyId', style: 'simple', explode: false })}/territories`), body, undefined, undefined, 'application/json');
    }
}
class MusicRightsPoliciesManagementApi {
    constructor(client) {
        this.client = client;
    }
    /** Music rights.policies.management.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/rights/policies`), query));
    }
}
class MusicRightsPoliciesApi {
    constructor(client) {
        this.client = client;
        this.management = new MusicRightsPoliciesManagementApi(client);
        this.territories = new MusicRightsPoliciesTerritoriesApi(client);
    }
    /** Music rights.policies.create */
    async create(body) {
        return this.client.post(backendApiPath(`/music/rights/policies`), body, undefined, undefined, 'application/json');
    }
}
class MusicRightsApi {
    constructor(client) {
        this.client = client;
        this.policies = new MusicRightsPoliciesApi(client);
    }
}
class MusicGenerationsWebhooksApi {
    constructor(client) {
        this.client = client;
    }
    /** Music generations.webhooks.receive */
    async receive(providerCode, body) {
        return this.client.post(backendApiPath(`/music/generations/webhooks/${serializePathParameter(providerCode, { name: 'providerCode', style: 'simple', explode: false })}/events`), body, undefined, undefined, 'application/json');
    }
}
class MusicGenerationsEventsManagementApi {
    constructor(client) {
        this.client = client;
    }
    /** Music generations.events.management.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'generation_id', value: params?.generationId, style: 'form', explode: true, allowReserved: false },
            { name: 'provider_code', value: params?.providerCode, style: 'form', explode: true, allowReserved: false },
            { name: 'source', value: params?.source, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/generations/events`), query));
    }
}
class MusicGenerationsEventsApi {
    constructor(client) {
        this.client = client;
        this.management = new MusicGenerationsEventsManagementApi(client);
    }
}
class MusicGenerationsAttemptsApi {
    constructor(client) {
        this.client = client;
    }
    /** Music generations.attempts.list */
    async list(generationId, params) {
        const query = buildQueryString([
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/generations/${serializePathParameter(generationId, { name: 'generationId', style: 'simple', explode: false })}/attempts`), query));
    }
}
class MusicGenerationsProviderModelsManagementApi {
    constructor(client) {
        this.client = client;
    }
    /** Music generations.providerModels.management.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'provider_code', value: params?.providerCode, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/generations/provider_models`), query));
    }
}
class MusicGenerationsProviderModelsApi {
    constructor(client) {
        this.client = client;
        this.management = new MusicGenerationsProviderModelsManagementApi(client);
    }
    /** Music generations.providerModels.create */
    async create(body) {
        return this.client.post(backendApiPath(`/music/generations/provider_models`), body, undefined, undefined, 'application/json');
    }
}
class MusicGenerationsProvidersManagementApi {
    constructor(client) {
        this.client = client;
    }
    /** Music generations.providers.management.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/generations/providers`), query));
    }
}
class MusicGenerationsProvidersApi {
    constructor(client) {
        this.client = client;
        this.management = new MusicGenerationsProvidersManagementApi(client);
    }
    /** Music generations.providers.create */
    async create(body) {
        return this.client.post(backendApiPath(`/music/generations/providers`), body, undefined, undefined, 'application/json');
    }
    /** Music generations.providers.update */
    async update(providerId, body) {
        return this.client.patch(backendApiPath(`/music/generations/providers/${serializePathParameter(providerId, { name: 'providerId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
    }
}
class MusicGenerationsManagementApi {
    constructor(client) {
        this.client = client;
    }
    /** Music generations.management.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
            { name: 'provider_code', value: params?.providerCode, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/generations`), query));
    }
}
class MusicGenerationsCreditLedgerApi {
    constructor(client) {
        this.client = client;
    }
    /** Music generations.creditLedger.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'user_id', value: params?.userId, style: 'form', explode: true, allowReserved: false },
            { name: 'generation_id', value: params?.generationId, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/generations/credit_ledger`), query));
    }
}
class MusicGenerationsPromptTemplatesManagementApi {
    constructor(client) {
        this.client = client;
    }
    /** Music generations.promptTemplates.management.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/generations/prompt_templates`), query));
    }
}
class MusicGenerationsPromptTemplatesApi {
    constructor(client) {
        this.client = client;
        this.management = new MusicGenerationsPromptTemplatesManagementApi(client);
    }
    /** Music generations.promptTemplates.create */
    async create(body) {
        return this.client.post(backendApiPath(`/music/generations/prompt_templates`), body, undefined, undefined, 'application/json');
    }
    /** Music generations.promptTemplates.update */
    async update(templateId, body) {
        return this.client.patch(backendApiPath(`/music/generations/prompt_templates/${serializePathParameter(templateId, { name: 'templateId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
    }
}
class MusicGenerationsStylePresetsManagementApi {
    constructor(client) {
        this.client = client;
    }
    /** Music generations.stylePresets.management.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/generations/style_presets`), query));
    }
}
class MusicGenerationsStylePresetsApi {
    constructor(client) {
        this.client = client;
        this.management = new MusicGenerationsStylePresetsManagementApi(client);
    }
    /** Music generations.stylePresets.create */
    async create(body) {
        return this.client.post(backendApiPath(`/music/generations/style_presets`), body, undefined, undefined, 'application/json');
    }
    /** Music generations.stylePresets.update */
    async update(presetId, body) {
        return this.client.patch(backendApiPath(`/music/generations/style_presets/${serializePathParameter(presetId, { name: 'presetId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
    }
}
class MusicGenerationsApi {
    constructor(client) {
        this.client = client;
        this.stylePresets = new MusicGenerationsStylePresetsApi(client);
        this.promptTemplates = new MusicGenerationsPromptTemplatesApi(client);
        this.creditLedger = new MusicGenerationsCreditLedgerApi(client);
        this.management = new MusicGenerationsManagementApi(client);
        this.providers = new MusicGenerationsProvidersApi(client);
        this.providerModels = new MusicGenerationsProviderModelsApi(client);
        this.attempts = new MusicGenerationsAttemptsApi(client);
        this.events = new MusicGenerationsEventsApi(client);
        this.webhooks = new MusicGenerationsWebhooksApi(client);
    }
    /** Music generations.sync */
    async sync(generationId, body) {
        return this.client.post(backendApiPath(`/music/generations/${serializePathParameter(generationId, { name: 'generationId', style: 'simple', explode: false })}/sync`), body, undefined, undefined, 'application/json');
    }
    /** Music generations.moderate */
    async moderate(generationId, body) {
        return this.client.post(backendApiPath(`/music/generations/${serializePathParameter(generationId, { name: 'generationId', style: 'simple', explode: false })}/moderate`), body, undefined, undefined, 'application/json');
    }
    /** Music generations.publish */
    async publish(generationId, body) {
        return this.client.post(backendApiPath(`/music/generations/${serializePathParameter(generationId, { name: 'generationId', style: 'simple', explode: false })}/publish`), body, undefined, undefined, 'application/json');
    }
}
class MusicContentReportsManagementApi {
    constructor(client) {
        this.client = client;
    }
    /** Music contentReports.management.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'resource_type', value: params?.resourceType, style: 'form', explode: true, allowReserved: false },
            { name: 'resource_id', value: params?.resourceId, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/content_reports`), query));
    }
}
class MusicContentReportsApi {
    constructor(client) {
        this.client = client;
        this.management = new MusicContentReportsManagementApi(client);
    }
    /** Music contentReports.resolve */
    async resolve(reportId, body) {
        return this.client.post(backendApiPath(`/music/content_reports/${serializePathParameter(reportId, { name: 'reportId', style: 'simple', explode: false })}/resolve`), body, undefined, undefined, 'application/json');
    }
}
class MusicRecommendationFeedbackManagementApi {
    constructor(client) {
        this.client = client;
    }
    /** Music recommendation.feedback.management.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'item_type', value: params?.itemType, style: 'form', explode: true, allowReserved: false },
            { name: 'item_id', value: params?.itemId, style: 'form', explode: true, allowReserved: false },
            { name: 'feedback_type', value: params?.feedbackType, style: 'form', explode: true, allowReserved: false },
            { name: 'limit', value: params?.limit, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/recommendation/feedback`), query));
    }
}
class MusicRecommendationFeedbackApi {
    constructor(client) {
        this.client = client;
        this.management = new MusicRecommendationFeedbackManagementApi(client);
    }
}
class MusicRecommendationShelvesManagementApi {
    constructor(client) {
        this.client = client;
    }
    /** Music recommendation.shelves.management.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/recommendation/shelves`), query));
    }
}
class MusicRecommendationShelvesApi {
    constructor(client) {
        this.client = client;
        this.management = new MusicRecommendationShelvesManagementApi(client);
    }
    /** Music recommendation.shelves.create */
    async create(body) {
        return this.client.post(backendApiPath(`/music/recommendation/shelves`), body, undefined, undefined, 'application/json');
    }
}
class MusicRecommendationApi {
    constructor(client) {
        this.client = client;
        this.shelves = new MusicRecommendationShelvesApi(client);
        this.feedback = new MusicRecommendationFeedbackApi(client);
    }
}
class MusicChartsEntriesApi {
    constructor(client) {
        this.client = client;
    }
    /** Music charts.entries.create */
    async create(chartId, body) {
        return this.client.post(backendApiPath(`/music/charts/${serializePathParameter(chartId, { name: 'chartId', style: 'simple', explode: false })}/entries`), body, undefined, undefined, 'application/json');
    }
}
class MusicChartsManagementApi {
    constructor(client) {
        this.client = client;
    }
    /** Music charts.management.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/charts`), query));
    }
}
class MusicChartsApi {
    constructor(client) {
        this.client = client;
        this.management = new MusicChartsManagementApi(client);
        this.entries = new MusicChartsEntriesApi(client);
    }
    /** Music charts.create */
    async create(body) {
        return this.client.post(backendApiPath(`/music/charts`), body, undefined, undefined, 'application/json');
    }
    /** Music charts.update */
    async update(chartId, body) {
        return this.client.patch(backendApiPath(`/music/charts/${serializePathParameter(chartId, { name: 'chartId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
    }
}
class MusicAudioAssetsManagementApi {
    constructor(client) {
        this.client = client;
    }
    /** Music audio.assets.management.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/audio/assets`), query));
    }
}
class MusicAudioAssetsApi {
    constructor(client) {
        this.client = client;
        this.management = new MusicAudioAssetsManagementApi(client);
    }
    /** Music audio.assets.create */
    async create(body) {
        return this.client.post(backendApiPath(`/music/audio/assets`), body, undefined, undefined, 'application/json');
    }
}
class MusicAudioApi {
    constructor(client) {
        this.client = client;
        this.assets = new MusicAudioAssetsApi(client);
    }
}
class MusicPlaylistsManagementApi {
    constructor(client) {
        this.client = client;
    }
    /** Music playlists.management.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/playlists`), query));
    }
}
class MusicPlaylistsApi {
    constructor(client) {
        this.client = client;
        this.management = new MusicPlaylistsManagementApi(client);
    }
}
class MusicTracksManagementApi {
    constructor(client) {
        this.client = client;
    }
    /** Music tracks.management.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'artist_id', value: params?.artistId, style: 'form', explode: true, allowReserved: false },
            { name: 'album_id', value: params?.albumId, style: 'form', explode: true, allowReserved: false },
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/tracks`), query));
    }
}
class MusicTracksApi {
    constructor(client) {
        this.client = client;
        this.management = new MusicTracksManagementApi(client);
    }
    /** Music tracks.create */
    async create(body) {
        return this.client.post(backendApiPath(`/music/tracks`), body, undefined, undefined, 'application/json');
    }
    /** Music tracks.publish */
    async publish(trackId) {
        return this.client.post(backendApiPath(`/music/tracks/${serializePathParameter(trackId, { name: 'trackId', style: 'simple', explode: false })}/publish`));
    }
    /** Music tracks.archive */
    async archive(trackId) {
        return this.client.post(backendApiPath(`/music/tracks/${serializePathParameter(trackId, { name: 'trackId', style: 'simple', explode: false })}/archive`));
    }
}
class MusicAlbumsManagementApi {
    constructor(client) {
        this.client = client;
    }
    /** Music albums.management.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'artist_id', value: params?.artistId, style: 'form', explode: true, allowReserved: false },
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/albums`), query));
    }
}
class MusicAlbumsApi {
    constructor(client) {
        this.client = client;
        this.management = new MusicAlbumsManagementApi(client);
    }
    /** Music albums.create */
    async create(body) {
        return this.client.post(backendApiPath(`/music/albums`), body, undefined, undefined, 'application/json');
    }
}
class MusicArtistsManagementApi {
    constructor(client) {
        this.client = client;
    }
    /** Music artists.management.list */
    async list(params) {
        const query = buildQueryString([
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.get(appendQueryString(backendApiPath(`/music/artists`), query));
    }
}
class MusicArtistsApi {
    constructor(client) {
        this.client = client;
        this.management = new MusicArtistsManagementApi(client);
    }
    /** Music artists.create */
    async create(body) {
        return this.client.post(backendApiPath(`/music/artists`), body, undefined, undefined, 'application/json');
    }
}
class MusicApi {
    constructor(client) {
        this.client = client;
        this.artists = new MusicArtistsApi(client);
        this.albums = new MusicAlbumsApi(client);
        this.tracks = new MusicTracksApi(client);
        this.playlists = new MusicPlaylistsApi(client);
        this.audio = new MusicAudioApi(client);
        this.charts = new MusicChartsApi(client);
        this.recommendation = new MusicRecommendationApi(client);
        this.contentReports = new MusicContentReportsApi(client);
        this.generations = new MusicGenerationsApi(client);
        this.rights = new MusicRightsApi(client);
        this.moderation = new MusicModerationApi(client);
        this.releases = new MusicReleasesApi(client);
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

class SdkworkBackendClient {
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
    return new SdkworkBackendClient(config);
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

Object.defineProperty(exports, "DEFAULT_TIMEOUT", {
    enumerable: true,
    get: function () { return sdkCommon.DEFAULT_TIMEOUT; }
});
Object.defineProperty(exports, "DefaultAuthTokenManager", {
    enumerable: true,
    get: function () { return sdkCommon.DefaultAuthTokenManager; }
});
Object.defineProperty(exports, "SUCCESS_CODES", {
    enumerable: true,
    get: function () { return sdkCommon.SUCCESS_CODES; }
});
Object.defineProperty(exports, "createTokenManager", {
    enumerable: true,
    get: function () { return sdkCommon.createTokenManager; }
});
exports.BaseApi = BaseApi;
exports.HttpClient = HttpClient;
exports.MusicApi = MusicApi;
exports.SdkworkBackendClient = SdkworkBackendClient;
exports.backendApiPath = backendApiPath;
exports.createClient = createClient;
exports.createHttpClient = createHttpClient;
exports.createMusicApi = createMusicApi;
