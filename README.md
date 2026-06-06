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

## SDKWork Documentation Contract

Domain: content
Capability: music-workspace
Package type: rust-crate
Status: standard

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

- `pnpm typecheck`

### Owner And Status

Owner and lifecycle status are tracked in `specs/component.spec.json`.
