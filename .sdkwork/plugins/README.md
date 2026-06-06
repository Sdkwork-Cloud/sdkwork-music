# sdkwork-music Plugins

This directory holds application-local plugin bundles for `sdkwork-music`.

Installable plugins must use a `.codex-plugin/plugin.json` manifest and must
document any contributed skills, tools, scripts, or apps. Plugins that wrap SDK
generation or verification commands must call the canonical SDKWork commands and
the canonical `sdkgen` entrypoint.

Plugins must not vendor generated SDK output, unrelated toolchains, runtime
state, logs, caches, secrets, or private user files.
