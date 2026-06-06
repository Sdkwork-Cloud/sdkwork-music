import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const musicRoot = path.resolve(import.meta.dirname, "..");
const appbaseRoot = "D:/javasource/spring-ai-plus/spring-ai-plus-business/apps/sdkwork-appbase";

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(musicRoot, relativePath), "utf8"));
}

function readText(root, relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function assertExists(relativePath) {
  assert.equal(existsSync(path.join(musicRoot, relativePath)), true, `${relativePath} should exist`);
}

function assertNotExistsInAppbase(relativePath) {
  assert.equal(
    existsSync(path.join(appbaseRoot, relativePath)),
    false,
    `appbase should no longer contain ${relativePath}`,
  );
}

function listFiles(root) {
  const result = [];
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if ([".git", "node_modules", "target", "dist", ".pnpm-store"].includes(entry.name)) {
          continue;
        }
        stack.push(absolute);
      } else {
        result.push(absolute);
      }
    }
  }
  return result;
}

test("sdkwork-music owns migrated audio and media UI packages", () => {
  assertExists("packages/pc-react/content/sdkwork-audio-pc-react/package.json");
  assertExists("packages/pc-react/content/sdkwork-audio-pc-react/src/index.ts");
  assertExists("packages/pc-react/content/sdkwork-audio-pc-react/tests/audio.test.ts");
  assertExists("packages/pc-react/content/sdkwork-media-pc-react/package.json");
  assertExists("packages/pc-react/content/sdkwork-media-pc-react/src/index.ts");

  const audioPackage = readJson("packages/pc-react/content/sdkwork-audio-pc-react/package.json");
  assert.equal(audioPackage.name, "@sdkwork/audio-pc-react");
  assert.equal(audioPackage.sdkwork.workspace, "sdkwork-music");
  assert.equal(audioPackage.sdkwork.capability, "audio");

  const mediaPackage = readJson("packages/pc-react/content/sdkwork-media-pc-react/package.json");
  assert.equal(mediaPackage.name, "@sdkwork/media-pc-react");
  assert.equal(mediaPackage.sdkwork.workspace, "sdkwork-music");
  assert.equal(mediaPackage.sdkwork.capability, "media");

  const migratedPackageFiles = [
    ...listFiles(path.join(musicRoot, "packages/pc-react/content/sdkwork-audio-pc-react")),
    ...listFiles(path.join(musicRoot, "packages/pc-react/content/sdkwork-media-pc-react")),
  ];
  const staleAppbaseReferences = migratedPackageFiles
    .map((absolute) => path.relative(musicRoot, absolute).replaceAll("\\", "/"))
    .filter((relative) => /sdkwork-appbase/.test(readText(musicRoot, relative)));
  assert.deepEqual(staleAppbaseReferences.sort(), []);

  const invalidMigratedPackageReferences = migratedPackageFiles
    .map((absolute) => path.relative(musicRoot, absolute).replaceAll("\\", "/"))
    .filter((relative) =>
      /@sdkwork\/(?:image|video)-pc-react|sdkwork-(?:image|video)-pc-react|@sdkwork\/(?:audio|media)-mobile-react|sdkwork-(?:audio|media)-mobile-react/.test(
        readText(musicRoot, relative),
      ),
    );
  assert.deepEqual(invalidMigratedPackageReferences.sort(), []);
});

test("sdkwork-music exposes Rust music domain, storage, and route crates", () => {
  assertExists("Cargo.toml");
  assertExists("crates/sdkwork-music-core-rust/Cargo.toml");
  assertExists("crates/sdkwork-music-storage-sqlx-rust/Cargo.toml");
  assertExists("crates/sdkwork-routes-music-app-api/Cargo.toml");
  assertExists("crates/sdkwork-routes-music-backend-api/Cargo.toml");

  const cargoToml = readText(musicRoot, "Cargo.toml");
  assert.match(cargoToml, /sdkwork-music-core-rust/);
  assert.match(cargoToml, /sdkwork-music-storage-sqlx-rust/);
  assert.match(cargoToml, /sdkwork-routes-music-app-api/);
  assert.match(cargoToml, /sdkwork-routes-music-backend-api/);
});

test("sdkwork-music has SDKWork v3 OpenAPI authorities and SDK families", () => {
  assertExists("generated/openapi/music-app-api.openapi.json");
  assertExists("generated/openapi/music-backend-api.openapi.json");
  assertExists("sdks/sdkwork-music-app-sdk/openapi/sdkwork-music-app-api.openapi.json");
  assertExists("sdks/sdkwork-music-backend-sdk/openapi/sdkwork-music-backend-api.openapi.json");
  assertExists("sdks/sdkwork-music-app-sdk/.sdkwork-assembly.json");
  assertExists("sdks/sdkwork-music-backend-sdk/.sdkwork-assembly.json");
  assertExists("sdks/_route-manifests/app-api/sdkwork-routes-music-app-api.route-manifest.json");
  assertExists("sdks/_route-manifests/backend-api/sdkwork-routes-music-backend-api.route-manifest.json");
  assertExists("sdks/sdkwork-music-app-sdk/bin/generate-sdk.mjs");
  assertExists("sdks/sdkwork-music-backend-sdk/bin/generate-sdk.mjs");
  assertExists("tools/music_sdk_generate.mjs");

  const appOpenapi = readJson("generated/openapi/music-app-api.openapi.json");
  assert.equal(appOpenapi.openapi, "3.1.2");
  assert.equal(appOpenapi.info["x-sdkwork-owner"], "sdkwork-music");
  assert.equal(appOpenapi.info["x-sdkwork-api-authority"], "sdkwork-music-app-api");
  assert.ok(appOpenapi.paths["/app/v3/api/music/artists"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/albums"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/tracks"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/playlists"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/audio/assets"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/home/shelves"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/search"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/charts"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/charts/{chartId}"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/library/items"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/playlists/{playlistId}/tracks"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/playlists/{playlistId}/follow"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/comments"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/content_reports"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/recommendation/feedback"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/search/suggestions"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/downloads/entitlements"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/playback/sessions"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/playback/sessions/{sessionId}"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/listening_history"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/play_events"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/ai/style_presets"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/ai/prompt_templates"]);
  assert.ok(appOpenapi.paths["/app/v3/api/music/ai/generation/tasks"]);
  assert.ok(appOpenapi.components.schemas.MusicTrack);
  assert.ok(appOpenapi.components.schemas.MusicAudioAsset);
  assert.ok(appOpenapi.components.schemas.MusicMediaResource);
  assert.ok(appOpenapi.components.schemas.MusicAiGenerationTask);
  assert.ok(appOpenapi.components.schemas.MusicComment);
  assert.ok(appOpenapi.components.schemas.MusicPlaybackSession);
  assert.deepEqual(appOpenapi.paths["/app/v3/api/music/tracks"].get.security, [{ AuthToken: [], AccessToken: [] }]);
  assert.equal(
    appOpenapi.paths["/app/v3/api/music/tracks"].get["x-sdkwork-source-route-crate"],
    "sdkwork-routes-music-app-api",
  );

  const backendOpenapi = readJson("generated/openapi/music-backend-api.openapi.json");
  assert.equal(backendOpenapi.openapi, "3.1.2");
  assert.equal(backendOpenapi.info["x-sdkwork-owner"], "sdkwork-music");
  assert.equal(backendOpenapi.info["x-sdkwork-api-authority"], "sdkwork-music-backend-api");
  assert.ok(backendOpenapi.paths["/backend/v3/api/music/artists"]);
  assert.ok(backendOpenapi.paths["/backend/v3/api/music/albums"]);
  assert.ok(backendOpenapi.paths["/backend/v3/api/music/tracks"]);
  assert.ok(backendOpenapi.paths["/backend/v3/api/music/playlists"]);
  assert.ok(backendOpenapi.paths["/backend/v3/api/music/audio/assets"]);
  assert.ok(backendOpenapi.paths["/backend/v3/api/music/charts"]);
  assert.ok(backendOpenapi.paths["/backend/v3/api/music/charts/{chartId}/entries"]);
  assert.ok(backendOpenapi.paths["/backend/v3/api/music/recommendation/shelves"]);
  assert.ok(backendOpenapi.paths["/backend/v3/api/music/ai/generation/tasks"]);
  assert.ok(backendOpenapi.paths["/backend/v3/api/music/ai/style_presets"]);
  assert.ok(backendOpenapi.paths["/backend/v3/api/music/ai/prompt_templates"]);
  assert.ok(backendOpenapi.paths["/backend/v3/api/music/ai/generation/credit_ledger"]);
  assert.ok(backendOpenapi.paths["/backend/v3/api/music/content_reports"]);
  assert.ok(backendOpenapi.paths["/backend/v3/api/music/content_reports/{reportId}/resolve"]);
  assert.ok(backendOpenapi.paths["/backend/v3/api/music/rights/policies"]);
  assert.ok(backendOpenapi.paths["/backend/v3/api/music/rights/policies/{policyId}/territories"]);
  assert.ok(backendOpenapi.paths["/backend/v3/api/music/moderation/signals"]);
  assert.ok(backendOpenapi.paths["/backend/v3/api/music/releases/{releaseId}/channels"]);
  assert.equal(
    backendOpenapi.paths["/backend/v3/api/music/audio/assets"].post.operationId,
    "audio.assets.create",
  );
  assert.equal(
    backendOpenapi.paths["/backend/v3/api/music/audio/assets"].post["x-sdkwork-source-route-crate"],
    "sdkwork-routes-music-backend-api",
  );

  const appRouteManifest = readJson("sdks/_route-manifests/app-api/sdkwork-routes-music-app-api.route-manifest.json");
  assert.equal(appRouteManifest.kind, "sdkwork.route.manifest");
  assert.equal(appRouteManifest.surface, "app-api");
  assert.equal(appRouteManifest.apiAuthority, "sdkwork-music-app-api");
  assert.equal(appRouteManifest.sdkFamily, "sdkwork-music-app-sdk");
  assert.equal(appRouteManifest.routes.length, 32);

  const backendRouteManifest = readJson(
    "sdks/_route-manifests/backend-api/sdkwork-routes-music-backend-api.route-manifest.json",
  );
  assert.equal(backendRouteManifest.kind, "sdkwork.route.manifest");
  assert.equal(backendRouteManifest.surface, "backend-api");
  assert.equal(backendRouteManifest.apiAuthority, "sdkwork-music-backend-api");
  assert.equal(backendRouteManifest.sdkFamily, "sdkwork-music-backend-sdk");
  assert.equal(backendRouteManifest.routes.length, 36);
});

test("sdkwork-music declares application workspace metadata for SDK generation", () => {
  assertExists(".sdkwork/README.md");
  assertExists(".sdkwork/.gitignore");
  assertExists(".sdkwork/skills/README.md");
  assertExists(".sdkwork/plugins/README.md");

  const workspaceReadme = readText(musicRoot, ".sdkwork/README.md");
  assert.match(workspaceReadme, /sdkwork-music/);
  assert.match(workspaceReadme, /SDKWork Repository Workspace Standard/);

  const workspaceIgnore = readText(musicRoot, ".sdkwork/.gitignore");
  assert.match(workspaceIgnore, /^local\//m);
  assert.match(workspaceIgnore, /^tmp\//m);
  assert.match(workspaceIgnore, /^cache\//m);
  assert.match(workspaceIgnore, /^secrets\//m);
});

test("sdkwork-music documents SDK workspace and family generation contracts", () => {
  assertExists("sdks/README.md");
  assertExists("sdks/sdkwork-music-app-sdk/README.md");
  assertExists("sdks/sdkwork-music-backend-sdk/README.md");

  const workspaceReadme = readText(musicRoot, "sdks/README.md");
  assert.match(workspaceReadme, /sdkwork-music-app-sdk/);
  assert.match(workspaceReadme, /sdkwork-music-backend-sdk/);
  assert.match(workspaceReadme, /D:\\javasource\\spring-ai-plus\\sdk\\sdkwork-sdk-generator\\bin\\sdkgen\.js/);

  const appReadme = readText(musicRoot, "sdks/sdkwork-music-app-sdk/README.md");
  assert.match(appReadme, /SDK family: `sdkwork-music-app-sdk`/);
  assert.match(appReadme, /API authority: `sdkwork-music-app-api`/);
  assert.match(appReadme, /API prefix: `\/app\/v3\/api`/);
  assert.match(appReadme, /Generated languages: TypeScript/);

  const backendReadme = readText(musicRoot, "sdks/sdkwork-music-backend-sdk/README.md");
  assert.match(backendReadme, /SDK family: `sdkwork-music-backend-sdk`/);
  assert.match(backendReadme, /API authority: `sdkwork-music-backend-api`/);
  assert.match(backendReadme, /API prefix: `\/backend\/v3\/api`/);
  assert.match(backendReadme, /Generated languages: TypeScript/);
});

test("sdkwork-appbase no longer owns music or audio package code", () => {
  assertNotExistsInAppbase("packages/pc-react/content/sdkwork-audio-pc-react");
  assertNotExistsInAppbase("packages/pc-react/content/sdkwork-media-pc-react");

  const tsconfig = readText(appbaseRoot, "tsconfig.base.json");
  assert.doesNotMatch(tsconfig, /@sdkwork\/audio-pc-react/);
  assert.doesNotMatch(tsconfig, /sdkwork-audio-pc-react/);
  assert.doesNotMatch(tsconfig, /@sdkwork\/media-pc-react/);
  assert.doesNotMatch(tsconfig, /sdkwork-media-pc-react/);
  assert.doesNotMatch(tsconfig, /@sdkwork\/audio-mobile-react/);
  assert.doesNotMatch(tsconfig, /sdkwork-audio-mobile-react/);
  assert.doesNotMatch(tsconfig, /@sdkwork\/media-mobile-react/);
  assert.doesNotMatch(tsconfig, /sdkwork-media-mobile-react/);

  const lockfile = readText(appbaseRoot, "pnpm-lock.yaml");
  assert.doesNotMatch(lockfile, /@sdkwork\/audio-pc-react/);
  assert.doesNotMatch(lockfile, /sdkwork-audio-pc-react/);
  assert.doesNotMatch(lockfile, /@sdkwork\/media-pc-react/);
  assert.doesNotMatch(lockfile, /sdkwork-media-pc-react/);
  assert.doesNotMatch(lockfile, /@sdkwork\/audio-mobile-react/);
  assert.doesNotMatch(lockfile, /sdkwork-audio-mobile-react/);
  assert.doesNotMatch(lockfile, /@sdkwork\/media-mobile-react/);
  assert.doesNotMatch(lockfile, /sdkwork-media-mobile-react/);

  const appbaseFiles = listFiles(appbaseRoot);
  const forbidden = [];
  for (const absolute of appbaseFiles) {
    const relative = path.relative(appbaseRoot, absolute).replaceAll("\\", "/");
    if (relative.includes("pnpm-lock.yaml")) {
      continue;
    }
    const content = readFileSync(absolute, "utf8");
    if (
      /@sdkwork\/audio-pc-react|sdkwork-audio-pc-react|@sdkwork\/media-pc-react|sdkwork-media-pc-react|@sdkwork\/audio-mobile-react|sdkwork-audio-mobile-react|@sdkwork\/media-mobile-react|sdkwork-media-mobile-react/.test(content)
    ) {
      forbidden.push(relative);
    }
  }
  assert.deepEqual(forbidden.sort(), []);
});
