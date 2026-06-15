# Applications

This directory contains independently runnable application roots for SDKWork Music.

## Application Surfaces

- `sdkwork-music-pc/`: PC browser/desktop application (React + Tauri)
- `sdkwork-music-h5/`: H5 mobile web application (React + Capacitor)
- `sdkwork-music-flutter-mobile/`: Flutter mobile application (Dart/Flutter)

## Architecture Standards

Each application root follows its corresponding SDKWork architecture standard:

- PC: `APP_PC_ARCHITECTURE_SPEC.md`
- H5: `APP_H5_ARCHITECTURE_SPEC.md`
- Flutter: `FLUTTER_APP_MOBILE_ARCHITECTURE_SPEC.md`

## SDK Composition

All application surfaces share the same music domain API contracts and generated SDK families:

- App API: `sdkwork-music-app-api`
- Backend API: `sdkwork-music-backend-api`
- App SDK: `sdkwork-music-app-sdk`
- Backend SDK: `sdkwork-music-backend-sdk`

## Related Specs

- `../sdkwork-specs/APPLICATION_SPEC.md`
- `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
