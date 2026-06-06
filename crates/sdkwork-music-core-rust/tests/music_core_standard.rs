use sdkwork_music_core::{
    evaluate_ai_generation_publish_readiness, evaluate_track_publish_readiness,
    music_capability_manifest, MusicAiGenerationTask, MusicAiGenerationTaskStatus, MusicTrack,
    MusicTrackStatus,
};

#[test]
fn music_core_manifest_owns_music_domain_contracts() {
    let manifest = music_capability_manifest();
    assert_eq!(manifest.owner, "sdkwork-music");
    assert_eq!(manifest.domain, "music");
    assert_eq!(manifest.statuses, vec!["draft", "published", "archived"]);
    assert_eq!(
        manifest.ai_generation_statuses,
        vec!["queued", "running", "succeeded", "failed", "cancelled"],
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
    assert!(manifest.operations.contains(&"ai.stylePresets.list"));
    assert!(manifest.operations.contains(&"ai.promptTemplates.list"));
    assert!(manifest.operations.contains(&"ai.generation.tasks.create"));
    assert!(manifest.operations.contains(&"ai.generation.tasks.publish"));
    assert!(manifest.operations.contains(&"contentReports.resolve"));
    assert!(manifest.operations.contains(&"rights.policies.create"));
    assert!(manifest.operations.contains(&"releases.channels.create"));
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
}
