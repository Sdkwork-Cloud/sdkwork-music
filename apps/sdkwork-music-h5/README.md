# SDKWork Music H5 Application

H5 mobile web application for SDKWork Music.

## Architecture

- **Standard:** `APP_H5_ARCHITECTURE_SPEC.md`
- **UI Standard:** `APP_MOBILE_REACT_UI_SPEC.md`
- **Framework:** React + TypeScript + Capacitor
- **Platforms:** Web, iOS, Android

## Structure

- `.sdkwork/` - Local workspace metadata
- `bin/` - iOS and Android Capacitor build outputs
- `config/` - Browser, host, server, container configs
- `src/` - Thin bootstrap, providers, mobile shell
- `packages/` - SDKWork H5 packages
- `specs/` - Component specifications
- `sdks/` - SDK families for this surface

## Development

```bash
pnpm install
pnpm dev
pnpm build
pnpm test
```

## Capacitor

```bash
pnpm build:ios
pnpm build:android
```

## Related Specs

- `../../sdkwork-specs/APP_H5_ARCHITECTURE_SPEC.md`
- `../../sdkwork-specs/APP_MOBILE_REACT_UI_SPEC.md`
