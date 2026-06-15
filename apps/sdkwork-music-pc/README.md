# SDKWork Music PC Application

PC browser/desktop application for SDKWork Music.

## Architecture

- **Standard:** `APP_PC_ARCHITECTURE_SPEC.md`
- **UI Standard:** `APP_PC_REACT_UI_SPEC.md`
- **Framework:** React + TypeScript
- **Platforms:** Web, Windows, macOS, Linux

## Structure

- `.sdkwork/` - Local workspace metadata
- `config/` - Browser, desktop, server, container configs
- `src/` - Thin bootstrap, providers, route assembly
- `packages/` - SDKWork PC packages
- `specs/` - Component specifications
- `sdks/` - SDK families for this surface

## Development

```bash
pnpm install
pnpm dev
pnpm build
pnpm test
```

## Related Specs

- `../../sdkwork-specs/APP_PC_ARCHITECTURE_SPEC.md`
- `../../sdkwork-specs/APP_PC_REACT_UI_SPEC.md`
