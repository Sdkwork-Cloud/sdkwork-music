# Music Technical Architecture

Status: draft
Owner: SDKWork maintainers
Updated: 2026-06-24
Specs: ARCHITECTURE_DECISION_SPEC.md, DOCUMENTATION_SPEC.md

## Document Map

- Add `TECH-<topic>.md` shards in this directory when the architecture grows beyond one reviewable screen.

## 1. Architecture Overview

## 2. Technology Choices

## 3. System Boundaries And Modules

Music generation follows L2 service -> L3 provider SPI -> L4 generated-SDK adapter. See
`../decisions/ADR-20260719-music-generation-provider-spi.md`.

`sdkwork-music-generation-mcp-service` is the independent agent-facing protocol adapter. It depends
only on `MusicGenerationServicePort` and its task-context store port, and owns the `music.*` MCP
tools, resources, prompt, error mapping, stdio serving, and Streamable HTTP/SSE service builder.

## 4. Directory And Package Layout

```text
crates/sdkwork-music-generation-provider-spi/
crates/sdkwork-music-generation-service/
crates/sdkwork-music-generation-provider-adapter/
crates/sdkwork-music-generation-mcp-service/
```

## 5. API, SDK, And Data Ownership

## 6. Security, Privacy, And Observability

## 7. Deployment And Runtime Topology

MCP hosts choose stdio or Streamable HTTP. SSE is the Streamable HTTP response channel, not a
separate compatibility endpoint. The host owns authentication, authorization, host/origin policy,
limits, observability, graceful shutdown, and production task-context persistence.

## 8. Architecture Decision Index

## 9. Verification

- `cargo test -p sdkwork-music-generation-mcp-service`
- `cargo clippy -p sdkwork-music-generation-mcp-service --all-targets -- -D warnings`
