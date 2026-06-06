# sdkwork-music-backend-sdk

SDK family: `sdkwork-music-backend-sdk`

API authority: `sdkwork-music-backend-api`

API prefix: `/backend/v3/api`

Audience: backend/admin, operator, automation, and control-plane Music clients.

Generated languages: TypeScript

Authority OpenAPI:

`openapi/sdkwork-music-backend-api.openapi.json`

Generated output:

`sdkwork-music-backend-sdk-typescript/generated/server-openapi`

Canonical generator:

`D:\javasource\spring-ai-plus\sdk\sdkwork-sdk-generator\bin\sdkgen.js`

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

This SDK family is owner-only for `sdkwork-music` backend-api routes. It must not expose appbase login/session flows or app/user-facing app-api behavior.

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
