import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const app = JSON.parse(readFileSync("generated/openapi/music-app-api.openapi.json", "utf8"));
const backend = JSON.parse(readFileSync("generated/openapi/music-backend-api.openapi.json", "utf8"));

function operations(document) {
  return Object.entries(document.paths ?? {}).flatMap(([path, pathItem]) =>
    Object.entries(pathItem ?? {})
      .filter(([method]) => ["get", "post", "put", "patch", "delete"].includes(method))
      .map(([method, operation]) => ({ method, operation, path })),
  );
}

function operation(document, path, method) {
  const resolved = document.paths?.[path]?.[method];
  assert.ok(resolved, `${method.toUpperCase()} ${path} should exist`);
  return resolved;
}

function parameterNames(operation) {
  return (operation.parameters ?? []).map((parameter) => parameter.name);
}

test("music OpenAPI documents are owner-only sdkwork-v3 compatible inputs", () => {
  for (const [surface, document, prefix, authority] of [
    ["app", app, "/app/v3/api", "sdkwork-music-app-api"],
    ["backend", backend, "/backend/v3/api", "sdkwork-music-backend-api"],
  ]) {
    assert.equal(document.openapi, "3.1.2", surface);
    assert.equal(document["x-sdkwork-owner"], "sdkwork-music", surface);
    assert.equal(document["x-sdkwork-api-authority"], authority, surface);
    assert.deepEqual(document.components.securitySchemes.AuthToken, {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    });
    assert.deepEqual(document.components.securitySchemes.AccessToken, {
      type: "apiKey",
      in: "header",
      name: "Access-Token",
    });
    for (const { path, operation } of operations(document)) {
      assert.ok(path.startsWith(prefix), `${surface} path prefix ${path}`);
      assert.equal(operation["x-sdkwork-owner"], "sdkwork-music", `${surface} owner ${path}`);
      assert.equal(operation["x-sdkwork-api-authority"], authority, `${surface} authority ${path}`);
      assert.equal(operation["x-sdkwork-domain"], "music", `${surface} domain ${path}`);
      assert.deepEqual(operation.tags, ["music"], `${surface} tag ${path}`);
      assert.match(operation.operationId, /^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/u);
      assert.deepEqual(operation.security, [{ AuthToken: [], AccessToken: [] }], `${surface} security ${path}`);
    }
  }
  assert.equal(operations(app).length, 32);
  assert.equal(operations(backend).length, 36);

  assert.deepEqual(parameterNames(operation(app, "/app/v3/api/music/tracks", "get")), [
    "artist_id",
    "album_id",
    "q",
    "status",
  ]);
  assert.deepEqual(parameterNames(operation(backend, "/backend/v3/api/music/tracks", "get")), [
    "artist_id",
    "album_id",
    "q",
    "status",
  ]);

  const createAudioAsset = operation(backend, "/backend/v3/api/music/audio/assets", "post");
  assert.equal(createAudioAsset.operationId, "audio.assets.create");
  assert.deepEqual(
    createAudioAsset.requestBody.content["application/json"].schema,
    { $ref: "#/components/schemas/MusicAudioAssetCommand" },
  );

  assert.ok(app.components.schemas.MusicMediaResource);
  assert.ok(app.components.schemas.MusicHomeShelf);
  assert.ok(app.components.schemas.MusicChartEntry);
  assert.ok(app.components.schemas.MusicUserLibraryItem);
  assert.ok(app.components.schemas.MusicAiGenerationTask);
  assert.ok(app.components.schemas.MusicAiGenerationVariant);
  assert.ok(app.components.schemas.MusicComment);
  assert.ok(app.components.schemas.MusicContentReport);
  assert.ok(app.components.schemas.MusicRecommendationFeedback);
  assert.ok(app.components.schemas.MusicSearchSuggestion);
  assert.ok(app.components.schemas.MusicDownloadEntitlement);
  assert.ok(app.components.schemas.MusicPlaybackSession);
  assert.ok(app.components.schemas.MusicAiStylePreset);
  assert.ok(app.components.schemas.MusicAiPromptTemplate);
  assert.ok(backend.components.schemas.MusicRightsPolicy);
  assert.ok(backend.components.schemas.MusicRightsTerritory);
  assert.ok(backend.components.schemas.MusicReleaseChannel);
  assert.ok(backend.components.schemas.MusicAiGenerationCreditLedgerEntry);
  assert.ok(backend.components.schemas.MusicModerationSignal);

  assert.equal(operation(app, "/app/v3/api/music/home/shelves", "get").operationId, "home.shelves.list");
  assert.equal(operation(app, "/app/v3/api/music/search", "get").operationId, "search.query");
  assert.deepEqual(parameterNames(operation(app, "/app/v3/api/music/search", "get")), ["q", "type", "limit"]);
  assert.equal(operation(app, "/app/v3/api/music/charts", "get").operationId, "charts.list");
  assert.equal(operation(app, "/app/v3/api/music/charts/{chartId}", "get").operationId, "charts.entries.list");
  assert.equal(operation(app, "/app/v3/api/music/library/items", "post").operationId, "library.items.create");
  assert.equal(
    operation(app, "/app/v3/api/music/playlists/{playlistId}/tracks", "post").operationId,
    "playlists.tracks.create",
  );
  assert.equal(
    operation(app, "/app/v3/api/music/playlists/{playlistId}/tracks/{trackId}", "delete").operationId,
    "playlists.tracks.delete",
  );
  assert.equal(
    operation(app, "/app/v3/api/music/playlists/{playlistId}/follow", "post").operationId,
    "playlists.follow.create",
  );
  assert.equal(
    operation(app, "/app/v3/api/music/playlists/{playlistId}/follow", "delete").operationId,
    "playlists.follow.delete",
  );
  assert.equal(operation(app, "/app/v3/api/music/comments", "get").operationId, "comments.list");
  assert.equal(operation(app, "/app/v3/api/music/comments", "post").operationId, "comments.create");
  assert.equal(operation(app, "/app/v3/api/music/content_reports", "post").operationId, "contentReports.create");
  assert.equal(
    operation(app, "/app/v3/api/music/recommendation/feedback", "post").operationId,
    "recommendation.feedback.create",
  );
  assert.equal(
    operation(app, "/app/v3/api/music/search/suggestions", "get").operationId,
    "search.suggestions.list",
  );
  assert.equal(
    operation(app, "/app/v3/api/music/downloads/entitlements", "get").operationId,
    "downloads.entitlements.list",
  );
  assert.equal(
    operation(app, "/app/v3/api/music/playback/sessions", "get").operationId,
    "playback.sessions.list",
  );
  assert.equal(
    operation(app, "/app/v3/api/music/playback/sessions", "post").operationId,
    "playback.sessions.create",
  );
  assert.equal(
    operation(app, "/app/v3/api/music/playback/sessions/{sessionId}", "patch").operationId,
    "playback.sessions.update",
  );
  assert.equal(
    operation(app, "/app/v3/api/music/ai/style_presets", "get").operationId,
    "ai.stylePresets.list",
  );
  assert.equal(
    operation(app, "/app/v3/api/music/ai/prompt_templates", "get").operationId,
    "ai.promptTemplates.list",
  );
  assert.equal(operation(app, "/app/v3/api/music/play_events", "post").operationId, "playEvents.create");
  assert.equal(
    operation(app, "/app/v3/api/music/ai/generation/tasks", "post").operationId,
    "ai.generation.tasks.create",
  );
  assert.equal(
    operation(app, "/app/v3/api/music/ai/generation/tasks/{taskId}", "get").operationId,
    "ai.generation.tasks.retrieve",
  );

  assert.equal(operation(backend, "/backend/v3/api/music/charts", "post").operationId, "charts.create");
  assert.equal(
    operation(backend, "/backend/v3/api/music/charts/{chartId}/entries", "post").operationId,
    "charts.entries.create",
  );
  assert.equal(
    operation(backend, "/backend/v3/api/music/recommendation/shelves", "post").operationId,
    "recommendation.shelves.create",
  );
  assert.equal(
    operation(backend, "/backend/v3/api/music/recommendation/feedback", "get").operationId,
    "recommendation.feedback.management.list",
  );
  assert.equal(
    operation(backend, "/backend/v3/api/music/content_reports", "get").operationId,
    "contentReports.management.list",
  );
  assert.equal(
    operation(backend, "/backend/v3/api/music/content_reports/{reportId}/resolve", "post").operationId,
    "contentReports.resolve",
  );
  assert.equal(
    operation(backend, "/backend/v3/api/music/ai/style_presets", "post").operationId,
    "ai.stylePresets.create",
  );
  assert.equal(
    operation(backend, "/backend/v3/api/music/ai/style_presets/{presetId}", "patch").operationId,
    "ai.stylePresets.update",
  );
  assert.equal(
    operation(backend, "/backend/v3/api/music/ai/prompt_templates", "post").operationId,
    "ai.promptTemplates.create",
  );
  assert.equal(
    operation(backend, "/backend/v3/api/music/ai/prompt_templates/{templateId}", "patch").operationId,
    "ai.promptTemplates.update",
  );
  assert.equal(
    operation(backend, "/backend/v3/api/music/ai/generation/credit_ledger", "get").operationId,
    "ai.generation.creditLedger.list",
  );
  assert.equal(
    operation(backend, "/backend/v3/api/music/ai/generation/tasks/{taskId}/moderate", "post").operationId,
    "ai.generation.tasks.moderate",
  );
  assert.equal(
    operation(backend, "/backend/v3/api/music/ai/generation/tasks/{taskId}/publish", "post").operationId,
    "ai.generation.tasks.publish",
  );
  assert.equal(
    operation(backend, "/backend/v3/api/music/moderation/signals", "get").operationId,
    "moderation.signals.list",
  );
  assert.equal(
    operation(backend, "/backend/v3/api/music/rights/policies", "post").operationId,
    "rights.policies.create",
  );
  assert.equal(
    operation(backend, "/backend/v3/api/music/rights/policies/{policyId}/territories", "post").operationId,
    "rights.policies.territories.create",
  );
  assert.equal(
    operation(backend, "/backend/v3/api/music/releases/{releaseId}/channels", "post").operationId,
    "releases.channels.create",
  );
});
