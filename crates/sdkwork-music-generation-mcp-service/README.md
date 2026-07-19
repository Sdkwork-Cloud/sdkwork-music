# SDKWork Music Generation MCP Service

Provider-neutral MCP adapter for `MusicGenerationServicePort`.

- Tools: `music.generate`, `music.retrieve`, `music.cancel`, `music.capabilities`
- Resources: `sdkwork://music/generation/capabilities`, `sdkwork://music/generation/vendors`
- Prompt: `music.generation.request`
- Transports: stdio and MCP Streamable HTTP with SSE delivery

The mounting composition root owns authentication, authorization, origin validation, limits,
tracing, listener binding, and graceful shutdown.
