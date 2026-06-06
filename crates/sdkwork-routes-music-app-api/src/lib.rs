pub const APP_API_PREFIX: &str = "/app/v3/api";

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

pub fn app_routes() -> Vec<MusicHttpRoute> {
    vec![
        route(HttpMethod::Get, "/app/v3/api/music/home/shelves", "home.shelves.list"),
        route(HttpMethod::Get, "/app/v3/api/music/search", "search.query"),
        route(HttpMethod::Get, "/app/v3/api/music/artists", "artists.list"),
        route(HttpMethod::Get, "/app/v3/api/music/albums", "albums.list"),
        route(HttpMethod::Get, "/app/v3/api/music/tracks", "tracks.list"),
        route(HttpMethod::Get, "/app/v3/api/music/playlists", "playlists.list"),
        route(
            HttpMethod::Get,
            "/app/v3/api/music/audio/assets",
            "audio.assets.list",
        ),
        route(HttpMethod::Get, "/app/v3/api/music/charts", "charts.list"),
        route(
            HttpMethod::Get,
            "/app/v3/api/music/charts/{chartId}",
            "charts.entries.list",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/music/library/items",
            "library.items.list",
        ),
        route(
            HttpMethod::Post,
            "/app/v3/api/music/library/items",
            "library.items.create",
        ),
        route(
            HttpMethod::Delete,
            "/app/v3/api/music/library/items/{itemId}",
            "library.items.delete",
        ),
        route(
            HttpMethod::Post,
            "/app/v3/api/music/playlists/{playlistId}/tracks",
            "playlists.tracks.create",
        ),
        route(
            HttpMethod::Delete,
            "/app/v3/api/music/playlists/{playlistId}/tracks/{trackId}",
            "playlists.tracks.delete",
        ),
        route(
            HttpMethod::Post,
            "/app/v3/api/music/playlists/{playlistId}/follow",
            "playlists.follow.create",
        ),
        route(
            HttpMethod::Delete,
            "/app/v3/api/music/playlists/{playlistId}/follow",
            "playlists.follow.delete",
        ),
        route(HttpMethod::Get, "/app/v3/api/music/comments", "comments.list"),
        route(HttpMethod::Post, "/app/v3/api/music/comments", "comments.create"),
        route(
            HttpMethod::Post,
            "/app/v3/api/music/content_reports",
            "contentReports.create",
        ),
        route(
            HttpMethod::Post,
            "/app/v3/api/music/recommendation/feedback",
            "recommendation.feedback.create",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/music/search/suggestions",
            "search.suggestions.list",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/music/downloads/entitlements",
            "downloads.entitlements.list",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/music/playback/sessions",
            "playback.sessions.list",
        ),
        route(
            HttpMethod::Post,
            "/app/v3/api/music/playback/sessions",
            "playback.sessions.create",
        ),
        route(
            HttpMethod::Patch,
            "/app/v3/api/music/playback/sessions/{sessionId}",
            "playback.sessions.update",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/music/listening_history",
            "listeningHistory.list",
        ),
        route(HttpMethod::Post, "/app/v3/api/music/play_events", "playEvents.create"),
        route(
            HttpMethod::Get,
            "/app/v3/api/music/generations/style_presets",
            "generations.stylePresets.list",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/music/generations/prompt_templates",
            "generations.promptTemplates.list",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/music/generations/providers",
            "generations.providers.list",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/music/generations/provider_models",
            "generations.providerModels.list",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/music/generations",
            "generations.list",
        ),
        route(
            HttpMethod::Post,
            "/app/v3/api/music/generations",
            "generations.create",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/music/generations/{generationId}",
            "generations.retrieve",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/music/generations/{generationId}/events",
            "generations.events.list",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/music/generations/notifications",
            "generations.notifications.list",
        ),
        route(
            HttpMethod::Patch,
            "/app/v3/api/music/generations/notifications/{notificationId}",
            "generations.notifications.update",
        ),
    ]
}

pub fn app_route_manifest() -> MusicRouteManifest {
    route_manifest(
        "sdkwork-routes-music-app-api",
        "app-api",
        "sdkwork-music-app-api",
        "sdkwork-music-app-sdk",
        APP_API_PREFIX,
        app_routes(),
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
