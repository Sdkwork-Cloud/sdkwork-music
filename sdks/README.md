# sdkwork-music SDK Workspace

This directory owns the generated SDK families for `sdkwork-music`.

SDK families:

- `sdkwork-music-app-sdk`: app/user-facing Music App API SDK family.
- `sdkwork-music-backend-sdk`: backend/admin Music Backend API SDK family.

Generation flow:

1. `tools/music_openapi_export.mjs` materializes owner-only OpenAPI authority documents into `generated/openapi/`.
2. `tools/music_sdk_generate.mjs` copies authority documents into the owning SDK family `openapi/` directory.
3. `tools/music_schema_quality_gate.mjs` checks OpenAPI `3.1.2`, owner, authority, prefix, operation IDs, and dual-token security.
4. `sdks/sdkwork-music-*-sdk/bin/generate-sdk.mjs` invokes the canonical SDK generator.

Canonical generator:

`D:\javasource\spring-ai-plus\sdk\sdkwork-sdk-generator\bin\sdkgen.js`

Generated SDK transport output belongs under each family language workspace at `generated/server-openapi`.
Do not edit generated transport files by hand; change the route/OpenAPI/generator input and regenerate.

Verification:

```powershell
pnpm sdk:check
pnpm test:node
pnpm verify
```
