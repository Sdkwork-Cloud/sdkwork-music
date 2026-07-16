import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("music backend SDK family owns backend authority and generated TypeScript output", () => {
  const assembly = JSON.parse(readFileSync("sdks/sdkwork-music-backend-sdk/sdk-manifest.json", "utf8"));
  assert.equal(assembly.sdkOwner, "sdkwork-music");
  assert.equal(assembly.apiAuthority, "sdkwork-music-backend-api");
  assert.equal(assembly.discoverySurface.apiPrefix, "/backend/v3/api");
  assert.equal(existsSync("sdks/sdkwork-music-backend-sdk/openapi/sdkwork-music-backend-api.openapi.json"), true);
  assert.equal(existsSync("sdks/sdkwork-music-backend-sdk/openapi/music-backend-api.openapi.json"), false);
  assert.equal(existsSync("sdks/sdkwork-music-backend-sdk/sdkwork-music-backend-sdk-typescript/generated/server-openapi/src/index.ts"), true);
});

test("music backend SDK exposes catalog, recommendation, AI moderation, and release resources", () => {
  const apiDts = readFileSync(
    "sdks/sdkwork-music-backend-sdk/sdkwork-music-backend-sdk-typescript/generated/server-openapi/dist/api/music.d.ts",
    "utf8",
  );
  const typesDts = readFileSync(
    "sdks/sdkwork-music-backend-sdk/sdkwork-music-backend-sdk-typescript/generated/server-openapi/dist/types/index.d.ts",
    "utf8",
  );

  assert.match(apiDts, /readonly charts: MusicChartsApi/);
  assert.match(apiDts, /readonly recommendation: MusicRecommendationApi/);
  assert.match(apiDts, /readonly contentReports: MusicContentReportsApi/);
  assert.match(apiDts, /readonly generations: MusicGenerationsApi/);
  assert.match(apiDts, /readonly moderation: MusicModerationApi/);
  assert.match(apiDts, /readonly rights: MusicRightsApi/);
  assert.match(apiDts, /readonly releases: MusicReleasesApi/);
  assert.match(apiDts, /create\(chartId: string, body: MusicChartEntryCommand\): Promise<MusicChartEntry>/);
  assert.match(apiDts, /resolve\(reportId: string, body: MusicContentReportResolutionCommand\): Promise<MusicContentReport>/);
  assert.match(apiDts, /create\(body: MusicAiStylePresetCommand\): Promise<MusicAiStylePreset>/);
  assert.match(apiDts, /create\(body: MusicAiPromptTemplateCommand\): Promise<MusicAiPromptTemplate>/);
  assert.match(apiDts, /readonly providerModels: MusicGenerationsProviderModelsApi/);
  assert.match(apiDts, /readonly providers: MusicGenerationsProvidersApi/);
  assert.match(apiDts, /readonly events: MusicGenerationsEventsApi/);
  assert.match(apiDts, /sync\(generationId: string, body: MusicAiGenerationTaskSyncCommand\): Promise<MusicAiGenerationTask>/);
  assert.match(apiDts, /receive\(providerCode: string, body: MusicAiGenerationProviderEventCommand\): Promise<MusicAiGenerationProviderEvent>/);
  assert.match(apiDts, /moderate\(generationId: string, body: MusicAiGenerationModerationCommand\): Promise<MusicAiGenerationTask>/);
  assert.match(apiDts, /publish\(generationId: string, body: MusicAiGenerationPublishCommand\): Promise<MusicRelease>/);
  assert.match(apiDts, /create\(body: MusicRightsPolicyCommand\): Promise<MusicRightsPolicy>/);
  assert.match(apiDts, /create\(policyId: string, body: MusicRightsTerritoryCommand\): Promise<MusicRightsTerritory>/);
  assert.match(apiDts, /create\(releaseId: string, body: MusicReleaseChannelCommand\): Promise<MusicReleaseChannel>/);
  assert.match(typesDts, /MusicMediaResource/);
  assert.match(typesDts, /MusicAiGenerationProvider/);
  assert.match(typesDts, /MusicAiGenerationProviderModel/);
  assert.match(typesDts, /MusicAiGenerationProviderAttempt/);
  assert.match(typesDts, /MusicAiGenerationProviderEvent/);
  assert.match(typesDts, /MusicAiGenerationTaskSyncCommand/);
  assert.match(typesDts, /MusicRightsPolicy/);
  assert.match(typesDts, /MusicRightsTerritory/);
  assert.match(typesDts, /MusicReleaseChannel/);
  assert.match(typesDts, /MusicAiGenerationCreditLedgerEntry/);
  assert.match(typesDts, /MusicContentReport/);
  assert.match(typesDts, /MusicModerationSignal/);
});
