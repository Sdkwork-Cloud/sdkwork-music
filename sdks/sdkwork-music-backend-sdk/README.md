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
