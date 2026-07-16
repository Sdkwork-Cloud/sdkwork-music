import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("music app SDK family owns app authority and generated TypeScript output", () => {
  const assembly = JSON.parse(readFileSync("sdks/sdkwork-music-app-sdk/sdk-manifest.json", "utf8"));
  assert.equal(assembly.sdkOwner, "sdkwork-music");
  assert.equal(assembly.apiAuthority, "sdkwork-music-app-api");
  assert.equal(assembly.discoverySurface.apiPrefix, "/app/v3/api");
  assert.equal(existsSync("sdks/sdkwork-music-app-sdk/openapi/sdkwork-music-app-api.openapi.json"), true);
  assert.equal(existsSync("sdks/sdkwork-music-app-sdk/openapi/music-app-api.openapi.json"), false);
  assert.equal(existsSync("sdks/sdkwork-music-app-sdk/sdkwork-music-app-sdk-typescript/generated/server-openapi/src/index.ts"), true);
});

test("music app SDK exposes discovery, library, playback, and AI generation resources", () => {
  const apiDts = readFileSync(
    "sdks/sdkwork-music-app-sdk/sdkwork-music-app-sdk-typescript/generated/server-openapi/dist/api/music.d.ts",
    "utf8",
  );
  const typesDts = readFileSync(
    "sdks/sdkwork-music-app-sdk/sdkwork-music-app-sdk-typescript/generated/server-openapi/dist/types/index.d.ts",
    "utf8",
  );

  assert.match(apiDts, /readonly home: MusicHomeApi/);
  assert.match(apiDts, /readonly search: MusicSearchApi/);
  assert.match(apiDts, /readonly charts: MusicChartsApi/);
  assert.match(apiDts, /readonly library: MusicLibraryApi/);
  assert.match(apiDts, /readonly comments: MusicCommentsApi/);
  assert.match(apiDts, /readonly contentReports: MusicContentReportsApi/);
  assert.match(apiDts, /readonly downloads: MusicDownloadsApi/);
  assert.match(apiDts, /readonly playback: MusicPlaybackApi/);
  assert.match(apiDts, /readonly listeningHistory: MusicListeningHistoryApi/);
  assert.match(apiDts, /readonly playEvents: MusicPlayEventsApi/);
  assert.match(apiDts, /readonly generations: MusicGenerationsApi/);
  assert.match(apiDts, /query\(params: MusicSearchQueryParams\): Promise<SearchQueryResponse>/);
  assert.match(apiDts, /create\(body: MusicCommentCommand\): Promise<MusicComment>/);
  assert.match(apiDts, /create\(body: MusicRecommendationFeedbackCommand\): Promise<MusicRecommendationFeedback>/);
  assert.match(apiDts, /create\(body: MusicPlaybackSessionCommand\): Promise<MusicPlaybackSession>/);
  assert.match(apiDts, /create\(body: MusicAiGenerationTaskCommand\): Promise<MusicAiGenerationTask>/);
  assert.match(apiDts, /readonly providerModels: MusicGenerationsProviderModelsApi/);
  assert.match(apiDts, /readonly providers: MusicGenerationsProvidersApi/);
  assert.match(apiDts, /readonly notifications: MusicGenerationsNotificationsApi/);
  assert.match(apiDts, /list\(generationId: string, params\?: MusicGenerationsEventsListParams\): Promise<GenerationsEventsListResponse>/);
  assert.match(typesDts, /MusicMediaResource/);
  assert.match(typesDts, /MusicAiGenerationTask/);
  assert.match(typesDts, /MusicAiGenerationProvider/);
  assert.match(typesDts, /MusicAiGenerationProviderModel/);
  assert.match(typesDts, /MusicAiGenerationProviderEvent/);
  assert.match(typesDts, /MusicAiGenerationNotification/);
  assert.match(typesDts, /MusicUserLibraryItem/);
  assert.match(typesDts, /MusicComment/);
  assert.match(typesDts, /MusicContentReport/);
  assert.match(typesDts, /MusicSearchSuggestion/);
  assert.match(typesDts, /MusicDownloadEntitlement/);
  assert.match(typesDts, /MusicPlaybackSession/);
  assert.match(typesDts, /MusicAiStylePreset/);
  assert.match(typesDts, /MusicAiPromptTemplate/);
});
