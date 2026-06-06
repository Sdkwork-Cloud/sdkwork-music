use sdkwork_routes_music_backend_api::{
    backend_route_manifest, backend_routes, required_dual_token_headers, HttpMethod,
};

#[test]
fn music_backend_routes_use_sdkwork_v3_prefixes_and_resource_operation_ids() {
    let routes = backend_routes();
    assert_eq!(routes.len(), 36);
    assert!(routes.iter().all(|route| route.path.starts_with("/backend/v3/api/music")));
    assert!(routes.iter().all(|route| route.tag == "music"));
    assert!(routes.iter().all(|route| route.operation_id.contains('.')));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "tracks.publish"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "audio.assets.create"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "charts.entries.create"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "recommendation.shelves.create"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "contentReports.management.list"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "contentReports.resolve"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "ai.stylePresets.management.list"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "ai.stylePresets.create"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "ai.promptTemplates.management.list"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "ai.promptTemplates.create"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "ai.generation.creditLedger.list"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "ai.generation.tasks.moderate"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "ai.generation.tasks.publish"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "rights.policies.management.list"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "rights.policies.create"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "rights.policies.territories.create"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "releases.channels.create"));
    assert!(routes.iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "moderation.signals.list"));
    assert_eq!(required_dual_token_headers(), ["Authorization", "Access-Token"]);
}

#[test]
fn music_backend_route_manifest_exposes_sdkwork_materialization_metadata() {
    let manifest = backend_route_manifest();

    assert_eq!(manifest.kind, "sdkwork.route.manifest");
    assert_eq!(manifest.package_name, "sdkwork-routes-music-backend-api");
    assert_eq!(manifest.surface, "backend-api");
    assert_eq!(manifest.owner, "sdkwork-music");
    assert_eq!(manifest.domain, "music");
    assert_eq!(manifest.capability, "music");
    assert_eq!(manifest.api_authority, "sdkwork-music-backend-api");
    assert_eq!(manifest.sdk_family, "sdkwork-music-backend-sdk");
    assert_eq!(manifest.prefix, "/backend/v3/api");
    assert_eq!(manifest.auth_mode, "dual-token");
    assert_eq!(manifest.routes.len(), 36);
    assert!(manifest.routes.iter().all(|route| route.source_route_crate == manifest.package_name));
    assert!(manifest.routes.iter().all(|route| route.path.starts_with(manifest.prefix)));
}
