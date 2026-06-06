#!/usr/bin/env node
import { copyFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, "..");

function run(script, args) {
  const result = spawnSync("node", [path.join(workspaceRoot, script), ...args], {
    cwd: workspaceRoot,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function syncOpenapiToSdkFamily(sourceFileName, familyName, targetFileName) {
  const familyOpenapiDir = path.join(workspaceRoot, "sdks", familyName, "openapi");
  mkdirSync(familyOpenapiDir, { recursive: true });
  copyFileSync(
    path.join(workspaceRoot, "generated", "openapi", sourceFileName),
    path.join(familyOpenapiDir, targetFileName),
  );
}

const check = process.argv.includes("--check");
run("tools/music_openapi_export.mjs", []);
syncOpenapiToSdkFamily("music-app-api.openapi.json", "sdkwork-music-app-sdk", "sdkwork-music-app-api.openapi.json");
syncOpenapiToSdkFamily("music-backend-api.openapi.json", "sdkwork-music-backend-sdk", "sdkwork-music-backend-api.openapi.json");
run("tools/music_schema_quality_gate.mjs", []);

if (!check) {
  run("sdks/sdkwork-music-app-sdk/bin/generate-sdk.mjs", []);
  run("sdks/sdkwork-music-backend-sdk/bin/generate-sdk.mjs", []);
}

process.stdout.write(`[music_sdk_generate] ${check ? "check passed" : "generation completed"}\n`);
