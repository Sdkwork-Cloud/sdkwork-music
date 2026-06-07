# sdkwork-music-app-sdk

SDK family: `sdkwork-music-app-sdk`

API authority: `sdkwork-music-app-api`

API prefix: `/app/v3/api`

Audience: app, desktop, mobile, H5, and user-facing Music clients.

Generated languages: TypeScript

Authority OpenAPI:

`openapi/sdkwork-music-app-api.openapi.json`

Generated output:

`sdkwork-music-app-sdk-typescript/generated/server-openapi`

Canonical generator:

`..\sdkwork-sdk-generator\bin\sdkgen.js`

Generation:

```powershell
node .\bin\generate-sdk.mjs
```

Verification from the application root:

```powershell
pnpm sdk:check
pnpm test:node
pnpm verify
```

This SDK family is owner-only for `sdkwork-music` app-api routes. Appbase, IAM, Drive, or other dependency-owned APIs must stay in their own SDK families and be consumed through dependency SDKs or approved composed wrappers.

## SDKWork Documentation Contract

Domain: content
Capability: music
Package type: sdk-family
Status: ready

### Public API

Public exports are declared in `specs/component.spec.json` under `contracts.publicExports`.

### Required SDK Surface

- None declared in `specs/component.spec.json`.

### Configuration

Configuration keys and runtime entrypoints are declared in `specs/component.spec.json`.

### SaaS/Private/Local Behavior

This module follows the canonical standards linked from `specs/component.spec.json`, including deployment and runtime configuration rules where applicable.

### Security

Do not add secrets, live tokens, manual auth headers, or app-local credential handling to this module.

### Extension Points

Extension points are limited to declared public exports, runtime entrypoints, SDK clients, events, and config keys.

### Verification

- `pnpm test`

### Owner And Status

Owner and lifecycle status are tracked in `specs/component.spec.json`.
