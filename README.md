# sdkwork-music

Music application, API, and SDK workspace for the sdkwork ecosystem.

This repository contains the Rust music domain implementation, generated OpenAPI artifacts, TypeScript SDK packages, and verification tooling needed to keep the music app and backend API surfaces aligned with the project specs.

## Workspace

- `apis/` - API contracts and API source inputs for all API kinds.
- `apps/` - Application surfaces (PC, H5, Flutter mobile).
- `crates/` - Rust music domain, storage, and route crates.
- `sdks/` - generated music SDK packages and SDK verification tests.
- `jobs/` - job definitions, schedules, and maintenance runbooks.
- `tools/` - OpenAPI export and SDK generation tools.
- `plugins/` - application/runtime plugin source packages.
- `examples/` - runnable examples and SDK/API usage examples.
- `configs/` - source-controlled config templates and profile examples.
- `deployments/` - deployment descriptors and environment topology.
- `scripts/` - thin command entrypoints for build and verification workflows.
- `docs/` - repository/application documentation and architecture decisions.
- `tests/` - migration and SDK contract tests.

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
