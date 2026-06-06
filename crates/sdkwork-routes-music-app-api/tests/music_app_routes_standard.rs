use sdkwork_routes_music_app_api::{
    app_route_manifest, app_routes, required_dual_token_headers, HttpMethod,
};

#[test]
fn music_app_routes_use_sdkwork_v3_prefixes_and_resource_operation_ids() {
    let routes = app_routes();
    assert_eq!(routes.len(), 37);
    assert!(routes.iter().all(|route| route.path.starts_with("/app/v3/api/music")));
    assert!(routes.iter().all(|route| route.tag == "music"));
    assert!(routes.iter().all(|route| route.operation_id.contains('.')));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "tracks.list"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "home.shelves.list"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "search.query"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "charts.entries.list"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "library.items.create"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "playEvents.create"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "playlists.tracks.create"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "playlists.follow.create"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "comments.list"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "comments.create"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "contentReports.create"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "recommendation.feedback.create"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "search.suggestions.list"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "downloads.entitlements.list"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "playback.sessions.list"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "playback.sessions.create"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Patch && route.operation_id == "playback.sessions.update"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "generations.stylePresets.list"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "generations.promptTemplates.list"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "generations.providers.list"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "generations.providerModels.list"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "generations.create"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "generations.events.list"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "generations.notifications.list"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Patch && route.operation_id == "generations.notifications.update"));
    assert_eq!(required_dual_token_headers(), ["Authorization", "Access-Token"]);
}

#[test]
fn music_app_route_manifest_exposes_sdkwork_materialization_metadata() {
    let manifest = app_route_manifest();

    assert_eq!(manifest.kind, "sdkwork.route.manifest");
    assert_eq!(manifest.package_name, "sdkwork-routes-music-app-api");
    assert_eq!(manifest.surface, "app-api");
    assert_eq!(manifest.owner, "sdkwork-music");
    assert_eq!(manifest.domain, "music");
    assert_eq!(manifest.capability, "music");
    assert_eq!(manifest.api_authority, "sdkwork-music-app-api");
    assert_eq!(manifest.sdk_family, "sdkwork-music-app-sdk");
    assert_eq!(manifest.prefix, "/app/v3/api");
    assert_eq!(manifest.auth_mode, "dual-token");
    assert_eq!(manifest.routes.len(), 37);
    assert!(manifest.routes.iter().all(|route| route.source_route_crate == manifest.package_name));
    assert!(manifest.routes.iter().all(|route| route.path.starts_with(manifest.prefix)));
}
