#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MusicTrackStatus {
    Draft,
    Published,
    Archived,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MusicAiGenerationTaskStatus {
    Queued,
    Running,
    Succeeded,
    Failed,
    Cancelled,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicTrack {
    pub id: &'static str,
    pub tenant_id: &'static str,
    pub album_id: Option<&'static str>,
    pub artist_id: &'static str,
    pub title: &'static str,
    pub duration_seconds: i64,
    pub audio_asset_id: Option<&'static str>,
    pub status: MusicTrackStatus,
    pub tags: Vec<&'static str>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicAiGenerationTask {
    pub id: &'static str,
    pub tenant_id: &'static str,
    pub user_id: &'static str,
    pub prompt: &'static str,
    pub model_provider: &'static str,
    pub model_name: &'static str,
    pub status: MusicAiGenerationTaskStatus,
    pub variant_count: i64,
    pub approved_variant_count: i64,
    pub rights_policy_id: Option<&'static str>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicTrackPublishReadiness {
    pub ready: bool,
    pub can_publish: bool,
    pub issues: Vec<&'static str>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicCapabilityManifest {
    pub owner: &'static str,
    pub domain: &'static str,
    pub statuses: Vec<&'static str>,
    pub ai_generation_statuses: Vec<&'static str>,
    pub operations: Vec<&'static str>,
}

pub fn music_capability_manifest() -> MusicCapabilityManifest {
    MusicCapabilityManifest {
        owner: "sdkwork-music",
        domain: "music",
        statuses: vec!["draft", "published", "archived"],
        ai_generation_statuses: vec!["queued", "running", "succeeded", "failed", "cancelled"],
        operations: vec![
            "home.shelves.list",
            "search.query",
            "artists.list",
            "albums.list",
            "tracks.list",
            "playlists.list",
            "audio.assets.list",
            "charts.list",
            "charts.entries.list",
            "library.items.list",
            "library.items.create",
            "library.items.delete",
            "playlists.tracks.create",
            "playlists.follow.create",
            "comments.list",
            "comments.create",
            "contentReports.create",
            "recommendation.feedback.create",
            "search.suggestions.list",
            "downloads.entitlements.list",
            "playback.sessions.list",
            "playback.sessions.create",
            "playback.sessions.update",
            "listeningHistory.list",
            "playEvents.create",
            "ai.stylePresets.list",
            "ai.promptTemplates.list",
            "ai.generation.tasks.list",
            "ai.generation.tasks.create",
            "ai.generation.tasks.retrieve",
            "artists.management.list",
            "artists.create",
            "albums.management.list",
            "albums.create",
            "tracks.management.list",
            "tracks.create",
            "tracks.publish",
            "tracks.archive",
            "playlists.management.list",
            "playlists.create",
            "audio.assets.management.list",
            "audio.assets.create",
            "charts.management.list",
            "charts.create",
            "charts.update",
            "charts.entries.create",
            "recommendation.shelves.management.list",
            "recommendation.shelves.create",
            "contentReports.management.list",
            "contentReports.resolve",
            "ai.stylePresets.management.list",
            "ai.stylePresets.create",
            "ai.promptTemplates.management.list",
            "ai.promptTemplates.create",
            "ai.generation.creditLedger.list",
            "ai.generation.tasks.management.list",
            "ai.generation.tasks.moderate",
            "ai.generation.tasks.publish",
            "rights.policies.management.list",
            "rights.policies.create",
            "rights.policies.territories.create",
            "moderation.signals.list",
            "releases.list",
            "releases.channels.create",
        ],
    }
}

pub fn evaluate_track_publish_readiness(track: &MusicTrack) -> MusicTrackPublishReadiness {
    let mut issues = Vec::new();
    if track.title.trim().is_empty() {
        issues.push("missing-title");
    }
    if track.artist_id.trim().is_empty() {
        issues.push("missing-artist");
    }
    if track.duration_seconds <= 0 {
        issues.push("invalid-duration");
    }
    if track.audio_asset_id.map(str::trim).unwrap_or_default().is_empty() {
        issues.push("missing-audio-asset");
    }
    if track.tags.iter().filter(|tag| !tag.trim().is_empty()).count() == 0 {
        issues.push("missing-tags");
    }

    let can_publish = issues.is_empty() && matches!(track.status, MusicTrackStatus::Draft);
    MusicTrackPublishReadiness {
        ready: issues.is_empty(),
        can_publish,
        issues,
    }
}

pub fn evaluate_ai_generation_publish_readiness(
    task: &MusicAiGenerationTask,
) -> MusicTrackPublishReadiness {
    let mut issues = Vec::new();
    if task.prompt.trim().is_empty() {
        issues.push("missing-prompt");
    }
    if task.model_provider.trim().is_empty() {
        issues.push("missing-model-provider");
    }
    if task.model_name.trim().is_empty() {
        issues.push("missing-model-name");
    }
    if !matches!(task.status, MusicAiGenerationTaskStatus::Succeeded) {
        issues.push("generation-not-succeeded");
    }
    if task.variant_count <= 0 {
        issues.push("missing-generated-variant");
    }
    if task.approved_variant_count <= 0 {
        issues.push("missing-approved-variant");
    }
    if task
        .rights_policy_id
        .map(str::trim)
        .unwrap_or_default()
        .is_empty()
    {
        issues.push("missing-rights-policy");
    }

    MusicTrackPublishReadiness {
        ready: issues.is_empty(),
        can_publish: issues.is_empty(),
        issues,
    }
}
