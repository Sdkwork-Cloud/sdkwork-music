# SDKWork Music Flutter Mobile Application

Flutter mobile application for SDKWork Music.

## Architecture

- **Standard:** `FLUTTER_APP_MOBILE_ARCHITECTURE_SPEC.md`
- **UI Standard:** `APP_FLUTTER_UI_SPEC.md`
- **Framework:** Dart/Flutter
- **Platforms:** iOS, Android

## Structure

- `.sdkwork/` - Local workspace metadata
- `config/` - App, host, server, container configs
- `lib/` - Thin bootstrap, providers, shell, routes
- `packages/` - SDKWork Flutter mobile packages
- `specs/` - Component specifications
- `sdks/` - SDK families for this surface
- `test/` - Cross-package tests

## Development

```bash
flutter pub get
flutter run
flutter test
flutter build
```

## Related Specs

- `../../sdkwork-specs/FLUTTER_APP_MOBILE_ARCHITECTURE_SPEC.md`
- `../../sdkwork-specs/APP_FLUTTER_UI_SPEC.md`
