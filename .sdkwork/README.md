# sdkwork-music Workspace

This directory is the source-controlled SDKWork workspace metadata for the
`sdkwork-music` application root.

It follows the SDKWork Repository Workspace Standard and keeps application-local
development knowledge separate from generated SDK control-plane files and
runtime user-private state.

Authoritative directories:

- `skills/` stores application-local workflow guidance for music API, Rust,
  OpenAPI, and SDK generation work.
- `plugins/` stores application-local plugin bundles when this application
  needs them.

Generated SDK `.sdkwork/` directories under `generated/server-openapi` are owned
by `sdkgen` and must not be edited as repository workspace metadata. Runtime
state belongs under user-private runtime directories, not this source tree.
