#!/usr/bin/env node
import {
  resolveFamilySdkRoot,
  runMusicSdkGenerator,
} from "../../../tools/music_sdk_generator_runner.mjs";

runMusicSdkGenerator(
  {
    apiAuthority: "sdkwork-music-app-api",
    apiPrefix: "/app/v3/api",
    defaultBaseUrl: "http://127.0.0.1:18080",
    defaultOpenapiFile: "sdkwork-music-app-api.openapi.json",
    sdkName: "sdkwork-music-app-sdk",
    sdkRoot: resolveFamilySdkRoot(import.meta.url),
    sdkType: "app",
  },
  process.argv.slice(2),
);
