use sdkwork_music_core::{
    evaluate_ai_generation_publish_readiness, evaluate_track_publish_readiness,
    music_capability_manifest, normalize_ai_generation_provider_status, MusicAiGenerationTask,
    MusicAiGenerationTaskStatus, MusicAiProviderInvocationMode, MusicTrack, MusicTrackStatus,
};

#[test]
fn music_core_manifest_owns_music_domain_contracts() {
    let manifest = music_capability_manifest();
    assert_eq!(manifest.owner, "sdkwork-music");
    assert_eq!(manifest.domain, "music");
    assert_eq!(manifest.statuses, vec!["draft", "published", "archived"]);
    assert_eq!(
        manifest.ai_generation_statuses,
        vec![
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
    );
    assert!(manifest.operations.contains(&"tracks.list"));
    assert!(manifest.operations.contains(&"audio.assets.list"));
    assert!(manifest.operations.contains(&"tracks.publish"));
    assert!(manifest.operations.contains(&"home.shelves.list"));
    assert!(manifest.operations.contains(&"search.query"));
    assert!(manifest.operations.contains(&"charts.entries.list"));
    assert!(manifest.operations.contains(&"library.items.create"));
    assert!(manifest.operations.contains(&"playlists.tracks.create"));
    assert!(manifest.operations.contains(&"playlists.follow.create"));
    assert!(manifest.operations.contains(&"comments.list"));
    assert!(manifest.operations.contains(&"comments.create"));
    assert!(manifest.operations.contains(&"contentReports.create"));
    assert!(manifest.operations.contains(&"recommendation.feedback.create"));
    assert!(manifest.operations.contains(&"search.suggestions.list"));
    assert!(manifest.operations.contains(&"downloads.entitlements.list"));
    assert!(manifest.operations.contains(&"playback.sessions.create"));
    assert!(manifest.operations.contains(&"playback.sessions.update"));
    assert!(manifest.operations.contains(&"generations.stylePresets.list"));
    assert!(manifest.operations.contains(&"generations.promptTemplates.list"));
    assert!(manifest.operations.contains(&"generations.providers.list"));
    assert!(manifest.operations.contains(&"generations.providerModels.list"));
    assert!(manifest.operations.contains(&"generations.create"));
    assert!(manifest.operations.contains(&"generations.events.list"));
    assert!(manifest.operations.contains(&"generations.notifications.list"));
    assert!(manifest.operations.contains(&"generations.publish"));
    assert!(manifest.operations.contains(&"generations.providers.create"));
    assert!(manifest.operations.contains(&"generations.providerModels.create"));
    assert!(manifest.operations.contains(&"generations.attempts.list"));
    assert!(manifest.operations.contains(&"generations.sync"));
    assert!(manifest.operations.contains(&"generations.webhooks.receive"));
    assert!(manifest.operations.contains(&"contentReports.resolve"));
    assert!(manifest.operations.contains(&"rights.policies.create"));
    assert!(manifest.operations.contains(&"releases.channels.create"));
}

#[test]
fn music_core_normalizes_provider_task_and_webhook_statuses_without_terminal_regression() {
    assert_eq!(
        normalize_ai_generation_provider_status(
            MusicAiGenerationTaskStatus::Queued,
            MusicAiProviderInvocationMode::AsyncTask,
            "IN_QUEUE",
            false,
        ),
        MusicAiGenerationTaskStatus::Submitted,
    );
    assert_eq!(
        normalize_ai_generation_provider_status(
            MusicAiGenerationTaskStatus::Submitted,
            MusicAiProviderInvocationMode::Webhook,
            "IN_PROGRESS",
            false,
        ),
        MusicAiGenerationTaskStatus::Running,
    );
    assert_eq!(
        normalize_ai_generation_provider_status(
            MusicAiGenerationTaskStatus::Running,
            MusicAiProviderInvocationMode::Webhook,
            "OK",
            true,
        ),
        MusicAiGenerationTaskStatus::Succeeded,
    );
    assert_eq!(
        normalize_ai_generation_provider_status(
            MusicAiGenerationTaskStatus::Running,
            MusicAiProviderInvocationMode::Webhook,
            "OK",
            false,
        ),
        MusicAiGenerationTaskStatus::WaitingWebhook,
    );
    assert_eq!(
        normalize_ai_generation_provider_status(
            MusicAiGenerationTaskStatus::Succeeded,
            MusicAiProviderInvocationMode::AsyncTask,
            "IN_PROGRESS",
            false,
        ),
        MusicAiGenerationTaskStatus::Succeeded,
    );
    assert_eq!(
        normalize_ai_generation_provider_status(
            MusicAiGenerationTaskStatus::Running,
            MusicAiProviderInvocationMode::AsyncTask,
            "data_removed",
            false,
        ),
        MusicAiGenerationTaskStatus::Expired,
    );
}

#[test]
fn music_core_evaluates_track_publish_readiness() {
    let track = MusicTrack {
        id: "track_1",
        tenant_id: "tenant_1",
        album_id: Some("album_1"),
        artist_id: "artist_1",
        title: "Launch Theme",
        duration_seconds: 142,
        audio_asset_id: Some("asset_1"),
        status: MusicTrackStatus::Draft,
        tags: vec!["launch"],
    };

    let readiness = evaluate_track_publish_readiness(&track);
    assert!(readiness.ready);
    assert!(readiness.can_publish);
    assert!(readiness.issues.is_empty());

    let missing_audio = MusicTrack {
        audio_asset_id: None,
        ..track
    };
    let missing_audio_readiness = evaluate_track_publish_readiness(&missing_audio);
    assert!(!missing_audio_readiness.ready);
    assert_eq!(missing_audio_readiness.issues, vec!["missing-audio-asset"]);
}

#[test]
fn music_core_evaluates_ai_generation_publish_readiness() {
    let task = MusicAiGenerationTask {
        id: "task_1",
        tenant_id: "tenant_1",
        user_id: "user_1",
        prompt: "city pop song for a late subway ride",
        model_provider: "sdkwork-ai",
        model_name: "music-v1",
        generation_mode: "text_to_music",
        provider_code: "claw-router",
        provider_model: "stable-audio-3",
        provider_invocation_mode: MusicAiProviderInvocationMode::Hybrid,
        provider_task_id: Some("provider_task_1"),
        provider_status: Some("succeeded"),
        provider_output_count: 2,
        status: MusicAiGenerationTaskStatus::Succeeded,
        variant_count: 2,
        approved_variant_count: 1,
        rights_policy_id: Some("rights_policy_1"),
    };

    let readiness = evaluate_ai_generation_publish_readiness(&task);
    assert!(readiness.ready);
    assert!(readiness.can_publish);
    assert!(readiness.issues.is_empty());

    let missing_rights = MusicAiGenerationTask {
        rights_policy_id: None,
        ..task
    };
    let missing_rights_readiness = evaluate_ai_generation_publish_readiness(&missing_rights);
    assert!(!missing_rights_readiness.ready);
    assert_eq!(missing_rights_readiness.issues, vec!["missing-rights-policy"]);

    let running_task = MusicAiGenerationTask {
        status: MusicAiGenerationTaskStatus::Running,
        ..task
    };
    let running_readiness = evaluate_ai_generation_publish_readiness(&running_task);
    assert!(!running_readiness.can_publish);
    assert!(running_readiness.issues.contains(&"generation-not-succeeded"));

    let missing_provider_output = MusicAiGenerationTask {
        provider_output_count: 0,
        ..task
    };
    let missing_provider_output_readiness =
        evaluate_ai_generation_publish_readiness(&missing_provider_output);
    assert!(!missing_provider_output_readiness.can_publish);
    assert!(missing_provider_output_readiness
        .issues
        .contains(&"missing-provider-output"));
}
