# sdkwork-music

Music application, API, and SDK workspace for the sdkwork ecosystem.

This repository contains the Rust music domain implementation, generated OpenAPI artifacts, TypeScript SDK packages, and verification tooling needed to keep the music app and backend API surfaces aligned with the project specs.

## Workspace

- `crates/` - Rust music domain, storage, and route crates.
- `generated/openapi/` - generated OpenAPI specifications for music app and backend APIs.
- `packages/` - workspace TypeScript packages.
- `sdks/` - generated music SDK packages and SDK verification tests.
- `tests/` - migration and SDK contract tests.
- `tools/` - OpenAPI export and SDK generation tools.

## Common Commands

```powershell
pnpm verify
pnpm typecheck
pnpm sdk:generate
```
