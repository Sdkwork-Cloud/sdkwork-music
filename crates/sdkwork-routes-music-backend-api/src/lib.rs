pub const BACKEND_API_PREFIX: &str = "/backend/v3/api";

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum HttpMethod {
    Delete,
    Get,
    Patch,
    Post,
    Put,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicHttpRoute {
    pub method: HttpMethod,
    pub path: &'static str,
    pub tag: &'static str,
    pub operation_id: &'static str,
}

impl MusicHttpRoute {
    pub const fn new(
        method: HttpMethod,
        path: &'static str,
        tag: &'static str,
        operation_id: &'static str,
    ) -> Self {
        Self {
            method,
            path,
            tag,
            operation_id,
        }
    }
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicRouteManifestRoute {
    pub method: HttpMethod,
    pub path: &'static str,
    pub tag: &'static str,
    pub operation_id: &'static str,
    pub auth_mode: &'static str,
    pub source_route_crate: &'static str,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicRouteManifest {
    pub kind: &'static str,
    pub package_name: &'static str,
    pub surface: &'static str,
    pub owner: &'static str,
    pub domain: &'static str,
    pub capability: &'static str,
    pub api_authority: &'static str,
    pub sdk_family: &'static str,
    pub prefix: &'static str,
    pub auth_mode: &'static str,
    pub routes: Vec<MusicRouteManifestRoute>,
}

pub fn backend_routes() -> Vec<MusicHttpRoute> {
    vec![
        route(HttpMethod::Get, "/backend/v3/api/music/artists", "artists.management.list"),
        route(HttpMethod::Post, "/backend/v3/api/music/artists", "artists.create"),
        route(HttpMethod::Get, "/backend/v3/api/music/albums", "albums.management.list"),
        route(HttpMethod::Post, "/backend/v3/api/music/albums", "albums.create"),
        route(HttpMethod::Get, "/backend/v3/api/music/tracks", "tracks.management.list"),
        route(HttpMethod::Post, "/backend/v3/api/music/tracks", "tracks.create"),
        route(
            HttpMethod::Post,
            "/backend/v3/api/music/tracks/{trackId}/publish",
            "tracks.publish",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/music/tracks/{trackId}/archive",
            "tracks.archive",
        ),
        route(HttpMethod::Get, "/backend/v3/api/music/playlists", "playlists.management.list"),
        route(
            HttpMethod::Get,
            "/backend/v3/api/music/audio/assets",
            "audio.assets.management.list",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/music/audio/assets",
            "audio.assets.create",
        ),
        route(HttpMethod::Get, "/backend/v3/api/music/charts", "charts.management.list"),
        route(HttpMethod::Post, "/backend/v3/api/music/charts", "charts.create"),
        route(
            HttpMethod::Patch,
            "/backend/v3/api/music/charts/{chartId}",
            "charts.update",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/music/charts/{chartId}/entries",
            "charts.entries.create",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/music/recommendation/shelves",
            "recommendation.shelves.management.list",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/music/recommendation/shelves",
            "recommendation.shelves.create",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/music/recommendation/feedback",
            "recommendation.feedback.management.list",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/music/content_reports",
            "contentReports.management.list",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/music/content_reports/{reportId}/resolve",
            "contentReports.resolve",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/music/generations/style_presets",
            "generations.stylePresets.management.list",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/music/generations/style_presets",
            "generations.stylePresets.create",
        ),
        route(
            HttpMethod::Patch,
            "/backend/v3/api/music/generations/style_presets/{presetId}",
            "generations.stylePresets.update",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/music/generations/prompt_templates",
            "generations.promptTemplates.management.list",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/music/generations/prompt_templates",
            "generations.promptTemplates.create",
        ),
        route(
            HttpMethod::Patch,
            "/backend/v3/api/music/generations/prompt_templates/{templateId}",
            "generations.promptTemplates.update",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/music/generations/credit_ledger",
            "generations.creditLedger.list",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/music/generations",
            "generations.management.list",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/music/generations/providers",
            "generations.providers.management.list",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/music/generations/providers",
            "generations.providers.create",
        ),
        route(
            HttpMethod::Patch,
            "/backend/v3/api/music/generations/providers/{providerId}",
            "generations.providers.update",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/music/generations/provider_models",
            "generations.providerModels.management.list",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/music/generations/provider_models",
            "generations.providerModels.create",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/music/generations/{generationId}/attempts",
            "generations.attempts.list",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/music/generations/events",
            "generations.events.management.list",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/music/generations/{generationId}/sync",
            "generations.sync",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/music/generations/webhooks/{providerCode}/events",
            "generations.webhooks.receive",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/music/generations/{generationId}/moderate",
            "generations.moderate",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/music/generations/{generationId}/publish",
            "generations.publish",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/music/rights/policies",
            "rights.policies.management.list",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/music/rights/policies",
            "rights.policies.create",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/music/rights/policies/{policyId}/territories",
            "rights.policies.territories.create",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/music/moderation/signals",
            "moderation.signals.list",
        ),
        route(HttpMethod::Get, "/backend/v3/api/music/releases", "releases.list"),
        route(
            HttpMethod::Post,
            "/backend/v3/api/music/releases/{releaseId}/channels",
            "releases.channels.create",
        ),
    ]
}

pub fn backend_route_manifest() -> MusicRouteManifest {
    route_manifest(
        "sdkwork-routes-music-backend-api",
        "backend-api",
        "sdkwork-music-backend-api",
        "sdkwork-music-backend-sdk",
        BACKEND_API_PREFIX,
        backend_routes(),
    )
}

pub fn required_dual_token_headers() -> [&'static str; 2] {
    ["Authorization", "Access-Token"]
}

fn route(method: HttpMethod, path: &'static str, operation_id: &'static str) -> MusicHttpRoute {
    MusicHttpRoute::new(method, path, "music", operation_id)
}

fn route_manifest(
    package_name: &'static str,
    surface: &'static str,
    api_authority: &'static str,
    sdk_family: &'static str,
    prefix: &'static str,
    routes: Vec<MusicHttpRoute>,
) -> MusicRouteManifest {
    MusicRouteManifest {
        kind: "sdkwork.route.manifest",
        package_name,
        surface,
        owner: "sdkwork-music",
        domain: "music",
        capability: "music",
        api_authority,
        sdk_family,
        prefix,
        auth_mode: "dual-token",
        routes: routes
            .into_iter()
            .map(|route| MusicRouteManifestRoute {
                method: route.method,
                path: route.path,
                tag: route.tag,
                operation_id: route.operation_id,
                auth_mode: "dual-token",
                source_route_crate: package_name,
            })
            .collect(),
    }
}
