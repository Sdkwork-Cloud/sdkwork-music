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

This SDK family is owner-only for `sdkwork-music` app-api routes. Appbase, IAM, Drive, or other dependency-owned APIs must stay in their own SDK families and be consumed through dependency SDKs or approved composed wrappers.
