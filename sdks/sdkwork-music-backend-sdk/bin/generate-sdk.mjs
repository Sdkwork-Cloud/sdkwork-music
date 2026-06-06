#!/usr/bin/env node
import {
  resolveFamilySdkRoot,
  runMusicSdkGenerator,
} from "../../../tools/music_sdk_generator_runner.mjs";

runMusicSdkGenerator(
  {
    apiAuthority: "sdkwork-music-backend-api",
    apiPrefix: "/backend/v3/api",
    defaultBaseUrl: "http://127.0.0.1:18080",
    defaultOpenapiFile: "sdkwork-music-backend-api.openapi.json",
    sdkName: "sdkwork-music-backend-sdk",
    sdkRoot: resolveFamilySdkRoot(import.meta.url),
    sdkType: "backend",
  },
  process.argv.slice(2),
);
