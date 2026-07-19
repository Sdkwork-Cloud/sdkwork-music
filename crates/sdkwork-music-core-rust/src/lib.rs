#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum MusicTrackStatus {
    Draft,
    Published,
    Archived,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum MusicAiGenerationTaskStatus {
    Queued,
    Routing,
    Submitted,
    Running,
    WaitingWebhook,
    Succeeded,
    Failed,
    Cancelled,
    Expired,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum MusicAiProviderInvocationMode {
    Sync,
    AsyncTask,
    Webhook,
    Hybrid,
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
    pub generation_mode: &'static str,
    pub provider_code: &'static str,
    pub provider_model: &'static str,
    pub provider_invocation_mode: MusicAiProviderInvocationMode,
    pub provider_task_id: Option<&'static str>,
    pub provider_status: Option<&'static str>,
    pub provider_output_count: i64,
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
        ai_generation_statuses: vec![
            "queued",
            "routing",
            "submitted",
            "running",
            "waiting_webhook",
            "succeeded",
            "failed",
            "cancelled",
            "expired",
        ],
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
            "generations.stylePresets.list",
            "generations.promptTemplates.list",
            "generations.providers.list",
            "generations.providerModels.list",
            "generations.list",
            "generations.create",
            "generations.retrieve",
            "generations.events.list",
            "generations.notifications.list",
            "generations.notifications.update",
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
            "generations.stylePresets.management.list",
            "generations.stylePresets.create",
            "generations.promptTemplates.management.list",
            "generations.promptTemplates.create",
            "generations.providers.management.list",
            "generations.providers.create",
            "generations.providers.update",
            "generations.providerModels.management.list",
            "generations.providerModels.create",
            "generations.creditLedger.list",
            "generations.management.list",
            "generations.attempts.list",
            "generations.events.management.list",
            "generations.sync",
            "generations.webhooks.receive",
            "generations.moderate",
            "generations.publish",
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
    if track
        .audio_asset_id
        .map(str::trim)
        .unwrap_or_default()
        .is_empty()
    {
        issues.push("missing-audio-asset");
    }
    if track
        .tags
        .iter()
        .filter(|tag| !tag.trim().is_empty())
        .count()
        == 0
    {
        issues.push("missing-tags");
    }

    let can_publish = issues.is_empty() && matches!(track.status, MusicTrackStatus::Draft);
    MusicTrackPublishReadiness {
        ready: issues.is_empty(),
        can_publish,
        issues,
    }
}

pub fn normalize_ai_generation_provider_status(
    current: MusicAiGenerationTaskStatus,
    invocation_mode: MusicAiProviderInvocationMode,
    provider_status: &str,
    has_outputs: bool,
) -> MusicAiGenerationTaskStatus {
    if is_terminal_ai_generation_status(&current) {
        return current;
    }

    let normalized = provider_status.trim().to_ascii_lowercase();
    if matches!(
        normalized.as_str(),
        "queued" | "queueing" | "pending" | "submitted" | "created" | "in_queue"
    ) {
        return MusicAiGenerationTaskStatus::Submitted;
    }
    if matches!(
        normalized.as_str(),
        "running" | "processing" | "in_progress" | "generating" | "started"
    ) {
        return MusicAiGenerationTaskStatus::Running;
    }
    if matches!(
        normalized.as_str(),
        "succeeded" | "success" | "completed" | "complete" | "ok" | "done" | "finished"
    ) {
        return if has_outputs {
            MusicAiGenerationTaskStatus::Succeeded
        } else if matches!(
            invocation_mode,
            MusicAiProviderInvocationMode::Webhook | MusicAiProviderInvocationMode::Hybrid
        ) {
            MusicAiGenerationTaskStatus::WaitingWebhook
        } else {
            MusicAiGenerationTaskStatus::Running
        };
    }
    if matches!(
        normalized.as_str(),
        "failed" | "failure" | "error" | "errored" | "rejected" | "blocked"
    ) {
        return MusicAiGenerationTaskStatus::Failed;
    }
    if matches!(normalized.as_str(), "cancelled" | "canceled" | "aborted") {
        return MusicAiGenerationTaskStatus::Cancelled;
    }
    if matches!(
        normalized.as_str(),
        "expired" | "timeout" | "timed_out" | "data_removed"
    ) {
        return MusicAiGenerationTaskStatus::Expired;
    }

    match invocation_mode {
        MusicAiProviderInvocationMode::Webhook => MusicAiGenerationTaskStatus::WaitingWebhook,
        _ => current,
    }
}

fn is_terminal_ai_generation_status(status: &MusicAiGenerationTaskStatus) -> bool {
    matches!(
        status,
        MusicAiGenerationTaskStatus::Succeeded
            | MusicAiGenerationTaskStatus::Failed
            | MusicAiGenerationTaskStatus::Cancelled
            | MusicAiGenerationTaskStatus::Expired
    )
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
    if task.generation_mode.trim().is_empty() {
        issues.push("missing-generation-mode");
    }
    if task.provider_code.trim().is_empty() {
        issues.push("missing-provider-code");
    }
    if task.provider_model.trim().is_empty() {
        issues.push("missing-provider-model");
    }
    if !matches!(task.status, MusicAiGenerationTaskStatus::Succeeded) {
        issues.push("generation-not-succeeded");
    }
    if task.provider_output_count <= 0 {
        issues.push("missing-provider-output");
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
