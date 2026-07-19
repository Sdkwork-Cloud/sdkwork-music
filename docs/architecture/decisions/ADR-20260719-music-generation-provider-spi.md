# ADR-20260719: Music Generation Provider SPI

Status: accepted
Date: 2026-07-19
Owner: SDKWork Music maintainers

## Decision

Use `sdkwork-music-generation-service` as the public L2 entrypoint,
`sdkwork-music-generation-provider-spi` as the L3 contract, and
`sdkwork-music-generation-provider-adapter` as the L4 owner of Suno SDK routing and DTO conversion.
Vendor-specific extensions are versioned and decoded only by the adapter.

Unsupported fields, including `instrumental` until the generated Rust SDK exposes it, fail
explicitly instead of being ignored or translated through prompt rewriting.
