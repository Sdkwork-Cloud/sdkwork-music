import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const musicRoot = path.resolve(import.meta.dirname, "..", "..");
const workspaceRoot = path.resolve(musicRoot, "..");

const expectedClawRouterDependency = {
  workspace: "clawrouter-open-sdk",
  role: "ai-music-generation-provider-capability",
  required: true,
  dependencyMode: "consumer-sdk",
  apiPrefix: "/v1",
  apiAuthority: "sdkwork-clawrouter.ai",
  generatedTransportImportPolicy: "forbidden",
  operations: ["sunoCreateMusicGeneration", "sunoRetrieveMusicGeneration"],
  paths: ["/suno/v1/music/generations", "/suno/v1/music/generations/{task_id}"],
  packageByLanguage: {
    typescript: "@sdkwork/clawrouter-open-sdk",
    flutter: "clawrouter_open_sdk",
    rust: "clawrouter-open-sdk",
    java: "com.sdkwork.clawrouter:clawrouter-open-sdk",
    csharp: "Sdkwork.ClawRouter.Open.Sdk",
    swift: "ClawRouterOpenSdk",
    kotlin: "com.sdkwork.clawrouter:clawrouter-open-sdk",
    go: "github.com/sdkwork/clawrouter-open-sdk",
    python: "sdkwork-clawrouter-open-sdk",
  },
};

function readJson(root, relativePath) {
  return JSON.parse(readFileSync(path.join(root, relativePath), "utf8"));
}

function listFiles(root) {
  const result = [];
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (["node_modules", "dist"].includes(entry.name)) {
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

test("music SDK families declare clawrouter-open-sdk as the provider dependency contract", () => {
  for (const family of ["sdkwork-music-app-sdk", "sdkwork-music-backend-sdk"]) {
    const familyRoot = path.join("sdks", family);
    const assembly = readJson(musicRoot, path.join(familyRoot, ".sdkwork-assembly.json"));
    const manifest = readJson(musicRoot, path.join(familyRoot, "sdk-manifest.json"));
    const componentSpec = readJson(musicRoot, path.join(familyRoot, "specs", "component.spec.json"));

    assert.deepEqual(assembly.sdkDependencies, [expectedClawRouterDependency], `${family} assembly dependency`);
    assert.deepEqual(manifest.sdkDependencies, [expectedClawRouterDependency], `${family} manifest dependency`);
    assert.deepEqual(
      componentSpec.contracts.sdkDependencies,
      [expectedClawRouterDependency],
      `${family} component dependency`,
    );
  }
});

test("music generated transports do not import dependency SDK packages directly", () => {
  for (const family of ["sdkwork-music-app-sdk", "sdkwork-music-backend-sdk"]) {
    const sourceRoot = path.join(
      musicRoot,
      "sdks",
      family,
      `${family}-typescript`,
      "generated",
      "server-openapi",
      "src",
    );
    const directImports = listFiles(sourceRoot)
      .filter((absolute) => absolute.endsWith(".ts"))
      .filter((absolute) =>
        /(?:from\s+["']@sdkwork\/clawrouter-open-sdk["']|import\(["']@sdkwork\/clawrouter-open-sdk["']\)|require\(["']@sdkwork\/clawrouter-open-sdk["']\))/.test(
          readFileSync(absolute, "utf8"),
        ),
      )
      .map((absolute) => path.relative(musicRoot, absolute).replaceAll("\\", "/"));

    assert.deepEqual(directImports, [], `${family} generated transport must consume claw-router through sdkDependencies`);
  }
});

test("music claw-router provider contract matches the current clawrouter-open-sdk Suno music operations", () => {
  const clawRouterOpenapi = readJson(
    workspaceRoot,
    path.join("sdkwork-clawrouter", "sdks", "clawrouter-open-sdk", "openapi", "clawrouter-open-sdk.openapi.json"),
  );

  assert.equal(
    clawRouterOpenapi.paths["/suno/v1/music/generations"].post.operationId,
    "sunoCreateMusicGeneration",
  );
  assert.equal(
    clawRouterOpenapi.paths["/suno/v1/music/generations/{task_id}"].get.operationId,
    "sunoRetrieveMusicGeneration",
  );
  assert.deepEqual(
    clawRouterOpenapi.components.schemas.SunoMusicGenerationRequest.additionalProperties.allOf,
    [{ $ref: "#/components/schemas/ProviderJsonValue" }],
  );
});

test("music Suno facade consumes the current clawrouter TypeScript SDK resource surface", () => {
  const clawRouterSdk = readFileSync(
    path.join(
      workspaceRoot,
      "sdkwork-clawrouter",
      "sdks",
      "clawrouter-open-sdk",
      "clawrouter-open-sdk-typescript",
      "src",
      "sdk.ts",
    ),
    "utf8",
  );
  const clawRouterAudioSunoApi = readFileSync(
    path.join(
      workspaceRoot,
      "sdkwork-clawrouter",
      "sdks",
      "clawrouter-open-sdk",
      "clawrouter-open-sdk-typescript",
      "src",
      "api",
      "audio-suno.ts",
    ),
    "utf8",
  );
  const musicSunoFacade = readFileSync(
    path.join(musicRoot, "sdks", "sdkwork-music-backend-sdk", "composed", "provider-suno.mjs"),
    "utf8",
  );
  const musicSunoFacadeTypes = readFileSync(
    path.join(musicRoot, "sdks", "sdkwork-music-backend-sdk", "composed", "provider-suno.d.ts"),
    "utf8",
  );

  assert.match(clawRouterSdk, /public readonly audioSuno: AudioSunoApi;/);
  assert.match(clawRouterAudioSunoApi, /export class AudioSunoV1MusicGenerationsApi/);
  assert.match(clawRouterAudioSunoApi, /async create\(body: SunoMusicGenerationRequest\)/);
  assert.match(clawRouterAudioSunoApi, /async retrieve\(taskId: string\)/);
  assert.match(musicSunoFacade, /clawRouter\?\.audioSuno\?\.v1\?\.music\?\.generations/);
  assert.match(musicSunoFacadeTypes, /audioSuno:\s*\{\s*v1:\s*\{\s*music:\s*\{\s*generations: ClawRouterSunoGenerationsClient;/);
  assert.match(musicSunoFacadeTypes, /export type ProviderJsonValue/);
  assert.match(musicSunoFacadeTypes, /\[key: string\]: ProviderJsonValue \| undefined;/);
});
