use sdkwork_music_storage_sqlx::{
    music_database_tables, music_migration_names, music_storage_capability_manifest,
    NewMusicAiGenerationProject, NewMusicAiGenerationTask, NewMusicAiGenerationVariant,
    NewMusicAiPromptTemplate, NewMusicAiStylePreset, NewMusicAlbum, NewMusicArtist,
    NewMusicAudioAsset, NewMusicChart, NewMusicChartEntry, NewMusicComment,
    NewMusicContentReport, NewMusicDownloadEntitlement, NewMusicLibraryItem,
    NewMusicListeningEvent, NewMusicPlaybackSession, NewMusicPlaylist,
    NewMusicRecommendationFeedback, NewMusicRecommendationItem, NewMusicRecommendationShelf,
    NewMusicReleaseChannel, NewMusicRightsTerritory, NewMusicSearchSuggestion, NewMusicTrack,
    SqliteMusicStore,
};
use sqlx::sqlite::SqlitePoolOptions;

#[test]
fn music_storage_manifest_declares_complete_music_tables_and_migrations() {
    let manifest = music_storage_capability_manifest();
    assert_eq!(manifest.name, "sdkwork-music-storage-sqlx");
    assert_eq!(manifest.schema_version, "music.storage.v1");
    assert_eq!(music_database_tables(), manifest.tables);
    assert_eq!(music_migration_names(), manifest.migrations);
    assert_eq!(
        manifest.tables,
        vec![
            "music_artist",
            "music_album",
            "music_audio_asset",
            "music_track",
            "music_track_tag",
            "music_lyric",
            "music_lyric_line",
            "music_rights_policy",
            "music_playlist",
            "music_playlist_track",
            "music_playlist_follow",
            "music_playlist_collaborator",
            "music_comment",
            "music_content_report",
            "music_chart",
            "music_chart_entry",
            "music_recommendation_shelf",
            "music_recommendation_item",
            "music_recommendation_feedback",
            "music_user_library_item",
            "music_like",
            "music_follow",
            "music_listening_history",
            "music_download_entitlement",
            "music_playback_session",
            "music_search_index",
            "music_search_suggestion",
            "music_ai_generation_project",
            "music_ai_style_preset",
            "music_ai_prompt_template",
            "music_ai_generation_task",
            "music_ai_generation_variant",
            "music_ai_generation_credit_ledger",
            "music_moderation_signal",
            "music_release",
            "music_release_channel",
            "music_rights_territory",
            "music_play_event",
            "music_editorial_audit",
            "music_schema_version",
            "music_migration_lock",
        ],
    );
    assert!(manifest.indexes.contains(&"idx_music_track_tenant_status_updated"));
    assert!(manifest.indexes.contains(&"idx_music_audio_asset_tenant_status"));
    assert!(manifest.indexes.contains(&"idx_music_chart_entry_chart_rank"));
    assert!(manifest.indexes.contains(&"idx_music_recommendation_item_shelf_position"));
    assert!(manifest.indexes.contains(&"idx_music_comment_resource_created"));
    assert!(manifest.indexes.contains(&"idx_music_content_report_status_created"));
    assert!(manifest.indexes.contains(&"idx_music_recommendation_feedback_user_created"));
    assert!(manifest.indexes.contains(&"idx_music_download_entitlement_user_status"));
    assert!(manifest.indexes.contains(&"idx_music_playback_session_user_status"));
    assert!(manifest.indexes.contains(&"idx_music_search_suggestion_tenant_type"));
    assert!(manifest.indexes.contains(&"idx_music_ai_style_preset_tenant_status"));
    assert!(manifest.indexes.contains(&"idx_music_ai_prompt_template_tenant_status"));
    assert!(manifest.indexes.contains(&"idx_music_ai_generation_credit_ledger_user_created"));
    assert!(manifest.indexes.contains(&"idx_music_release_channel_release_status"));
    assert!(manifest.indexes.contains(&"idx_music_rights_territory_policy_region"));
    assert!(manifest.indexes.contains(&"idx_music_ai_generation_task_tenant_status_updated"));
    assert!(manifest.indexes.contains(&"idx_music_user_library_user_updated"));
    assert_eq!(manifest.migration_plan[0].name, "0001_music_foundation.sql");
    assert!(manifest.migration_plan[0].sql.contains("CREATE TABLE music_track"));
    assert!(manifest.migration_plan[0].sql.contains("CREATE TABLE music_ai_generation_task"));
    assert!(!manifest.migration_plan[0].sql.contains("source_uri"));
}

#[test]
fn music_storage_repositories_bind_to_music_tables() {
    let manifest = music_storage_capability_manifest();
    let names = manifest
        .repository_bindings
        .iter()
        .map(|binding| binding.repository_name)
        .collect::<Vec<_>>();
    assert_eq!(
        names,
        vec![
            "music.artist.repository",
            "music.album.repository",
            "music.audio_asset.repository",
            "music.track.repository",
            "music.playlist.repository",
            "music.community.repository",
            "music.chart.repository",
            "music.recommendation.repository",
            "music.user_engagement.repository",
            "music.search.repository",
            "music.ai_generation.repository",
            "music.moderation.repository",
            "music.release.repository",
            "music.audit.repository",
        ],
    );
}

#[tokio::test]
async fn sqlite_music_store_migrates_creates_publishes_and_reads_music() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("sqlite pool");
    let store = SqliteMusicStore::new(pool);
    store.migrate().await.expect("music migration");

    store
        .create_artist(NewMusicArtist {
            id: "artist_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            slug: "studio-band".to_owned(),
            name: "Studio Band".to_owned(),
            bio: Some("Internal music production team".to_owned()),
            now: "2026-06-06T00:00:00Z".to_owned(),
        })
        .await
        .expect("create artist");
    store
        .create_album(NewMusicAlbum {
            id: "album_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            artist_id: "artist_1".to_owned(),
            slug: "launch-pack".to_owned(),
            title: "Launch Pack".to_owned(),
            release_date: Some("2026-06-06".to_owned()),
            now: "2026-06-06T00:01:00Z".to_owned(),
        })
        .await
        .expect("create album");
    store
        .create_audio_asset(NewMusicAudioAsset {
            id: "asset_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            title: "Launch Theme WAV".to_owned(),
            drive_space_id: "space_music".to_owned(),
            drive_node_id: "node_asset_1".to_owned(),
            drive_uri: "drive://spaces/space_music/nodes/node_asset_1".to_owned(),
            media_resource_id: Some("node_asset_1".to_owned()),
            media_resource_snapshot: Some(r#"{"kind":"audio","source":"drive"}"#.to_owned()),
            mime_type: "audio/wav".to_owned(),
            duration_seconds: 142,
            checksum_algorithm: Some("sha256".to_owned()),
            checksum_value: Some("checksum-1".to_owned()),
            status: "ready".to_owned(),
            now: "2026-06-06T00:02:00Z".to_owned(),
        })
        .await
        .expect("create audio asset");
    store
        .create_track(NewMusicTrack {
            id: "track_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            artist_id: "artist_1".to_owned(),
            album_id: Some("album_1".to_owned()),
            audio_asset_id: Some("asset_1".to_owned()),
            slug: "launch-theme".to_owned(),
            title: "Launch Theme".to_owned(),
            duration_seconds: 142,
            tags: vec!["launch".to_owned(), "theme".to_owned()],
            now: "2026-06-06T00:03:00Z".to_owned(),
        })
        .await
        .expect("create track");
    store
        .create_playlist(NewMusicPlaylist {
            id: "playlist_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            slug: "release-music".to_owned(),
            title: "Release Music".to_owned(),
            description: Some("Launch ready tracks".to_owned()),
            track_ids: vec!["track_1".to_owned()],
            now: "2026-06-06T00:04:00Z".to_owned(),
        })
        .await
        .expect("create playlist");

    assert!(store
        .list_published_tracks("tenant_1", None)
        .await
        .expect("draft list")
        .is_empty());

    store
        .publish_track("tenant_1", "track_1", "user_editor", "2026-06-06T00:05:00Z")
        .await
        .expect("publish track");

    let tracks = store
        .list_published_tracks("tenant_1", Some("theme"))
        .await
        .expect("published tracks");
    assert_eq!(tracks.len(), 1);
    assert_eq!(tracks[0].slug, "launch-theme");
    assert_eq!(tracks[0].artist_name, "Studio Band");
    assert_eq!(tracks[0].album_title.as_deref(), Some("Launch Pack"));
    assert_eq!(tracks[0].tags, vec!["launch", "theme"]);

    let playlist = store
        .retrieve_playlist("tenant_1", "release-music")
        .await
        .expect("retrieve playlist")
        .expect("playlist");
    assert_eq!(playlist.track_ids, vec!["track_1"]);
}

#[tokio::test]
async fn sqlite_music_store_supports_app_discovery_library_and_ai_generation_workflows() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("sqlite pool");
    let store = SqliteMusicStore::new(pool);
    store.migrate().await.expect("music migration");

    store
        .create_artist(NewMusicArtist {
            id: "artist_ai".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            slug: "ai-studio".to_owned(),
            name: "AI Studio".to_owned(),
            bio: None,
            now: "2026-06-06T01:00:00Z".to_owned(),
        })
        .await
        .expect("create artist");
    store
        .create_audio_asset(NewMusicAudioAsset {
            id: "asset_ai".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            title: "City Pop Master".to_owned(),
            drive_space_id: "space_ai".to_owned(),
            drive_node_id: "node_ai".to_owned(),
            drive_uri: "drive://spaces/space_ai/nodes/node_ai".to_owned(),
            media_resource_id: Some("node_ai".to_owned()),
            media_resource_snapshot: Some(r#"{"kind":"audio","source":"drive","ai":{"provenance":"generated"}}"#.to_owned()),
            mime_type: "audio/mpeg".to_owned(),
            duration_seconds: 188,
            checksum_algorithm: Some("sha256".to_owned()),
            checksum_value: Some("checksum-ai".to_owned()),
            status: "ready".to_owned(),
            now: "2026-06-06T01:01:00Z".to_owned(),
        })
        .await
        .expect("create audio asset");
    store
        .create_track(NewMusicTrack {
            id: "track_ai".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            artist_id: "artist_ai".to_owned(),
            album_id: None,
            audio_asset_id: Some("asset_ai".to_owned()),
            slug: "neon-commute".to_owned(),
            title: "Neon Commute".to_owned(),
            duration_seconds: 188,
            tags: vec!["city pop".to_owned(), "ai".to_owned()],
            now: "2026-06-06T01:02:00Z".to_owned(),
        })
        .await
        .expect("create track");
    store
        .publish_track("tenant_1", "track_ai", "editor_1", "2026-06-06T01:03:00Z")
        .await
        .expect("publish track");

    store
        .create_chart(NewMusicChart {
            id: "chart_daily".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            slug: "daily-hot".to_owned(),
            title: "Daily Hot".to_owned(),
            chart_type: "daily".to_owned(),
            status: "active".to_owned(),
            now: "2026-06-06T01:04:00Z".to_owned(),
        })
        .await
        .expect("create chart");
    store
        .add_chart_entry(NewMusicChartEntry {
            id: "chart_entry_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            chart_id: "chart_daily".to_owned(),
            track_id: "track_ai".to_owned(),
            rank: 1,
            score: 9860,
            now: "2026-06-06T01:05:00Z".to_owned(),
        })
        .await
        .expect("add chart entry");

    store
        .create_recommendation_shelf(NewMusicRecommendationShelf {
            id: "shelf_home".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            slug: "for-you".to_owned(),
            title: "For You".to_owned(),
            shelf_type: "personalized".to_owned(),
            status: "active".to_owned(),
            now: "2026-06-06T01:06:00Z".to_owned(),
        })
        .await
        .expect("create shelf");
    store
        .add_recommendation_item(NewMusicRecommendationItem {
            id: "shelf_item_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            shelf_id: "shelf_home".to_owned(),
            item_type: "track".to_owned(),
            item_id: "track_ai".to_owned(),
            position: 0,
            reason_code: Some("fresh_ai_music".to_owned()),
            now: "2026-06-06T01:07:00Z".to_owned(),
        })
        .await
        .expect("add shelf item");

    store
        .save_library_item(NewMusicLibraryItem {
            id: "library_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            user_id: "user_1".to_owned(),
            item_type: "track".to_owned(),
            item_id: "track_ai".to_owned(),
            source: "favorite".to_owned(),
            now: "2026-06-06T01:08:00Z".to_owned(),
        })
        .await
        .expect("save library item");
    store
        .record_listening_event(NewMusicListeningEvent {
            id: "play_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            user_id: Some("user_1".to_owned()),
            track_id: "track_ai".to_owned(),
            duration_seconds: 188,
            played_seconds: 180,
            completion_rate: 95,
            source: Some("home_shelf".to_owned()),
            occurred_at: "2026-06-06T01:09:00Z".to_owned(),
        })
        .await
        .expect("record listening event");

    let chart_entries = store
        .list_chart_entries("tenant_1", "chart_daily")
        .await
        .expect("chart entries");
    assert_eq!(chart_entries.len(), 1);
    assert_eq!(chart_entries[0].rank, 1);
    assert_eq!(chart_entries[0].track_title, "Neon Commute");

    let shelves = store
        .list_home_shelves("tenant_1")
        .await
        .expect("home shelves");
    assert_eq!(shelves.len(), 1);
    assert_eq!(shelves[0].items.len(), 1);
    assert_eq!(shelves[0].items[0].reason_code.as_deref(), Some("fresh_ai_music"));

    let library = store
        .list_library_items("tenant_1", "user_1")
        .await
        .expect("library items");
    assert_eq!(library.len(), 1);
    assert_eq!(library[0].item_id, "track_ai");

    let history = store
        .list_listening_history("tenant_1", "user_1")
        .await
        .expect("listening history");
    assert_eq!(history.len(), 1);
    assert_eq!(history[0].play_count, 1);

    store
        .create_ai_generation_project(NewMusicAiGenerationProject {
            id: "project_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            user_id: "user_1".to_owned(),
            title: "City Pop Campaign".to_owned(),
            visibility: "private".to_owned(),
            now: "2026-06-06T01:10:00Z".to_owned(),
        })
        .await
        .expect("create AI project");
    store
        .create_ai_generation_task(NewMusicAiGenerationTask {
            id: "task_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            project_id: Some("project_1".to_owned()),
            user_id: "user_1".to_owned(),
            prompt: "city pop song for a late subway ride".to_owned(),
            lyrics_prompt: Some("short chorus about neon rain".to_owned()),
            style_tags: vec!["city-pop".to_owned(), "synth".to_owned()],
            model_provider: "sdkwork-ai".to_owned(),
            model_name: "music-v1".to_owned(),
            reference_drive_uri: Some("drive://spaces/space_ai/nodes/reference_1".to_owned()),
            now: "2026-06-06T01:11:00Z".to_owned(),
        })
        .await
        .expect("create AI task");
    store
        .complete_ai_generation_task(NewMusicAiGenerationVariant {
            id: "variant_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            task_id: "task_1".to_owned(),
            audio_asset_id: Some("asset_ai".to_owned()),
            title: "Neon Commute v1".to_owned(),
            drive_uri: "drive://spaces/space_ai/nodes/node_ai".to_owned(),
            media_resource_snapshot: Some(r#"{"kind":"audio","source":"drive","ai":{"provenance":"generated"}}"#.to_owned()),
            duration_seconds: 188,
            moderation_status: "approved".to_owned(),
            now: "2026-06-06T01:12:00Z".to_owned(),
        })
        .await
        .expect("complete AI task");

    let tasks = store
        .list_ai_generation_tasks("tenant_1", Some("user_1"))
        .await
        .expect("AI tasks");
    assert_eq!(tasks.len(), 1);
    assert_eq!(tasks[0].status, "succeeded");
    assert_eq!(tasks[0].variant_count, 1);
}

#[tokio::test]
async fn sqlite_music_store_supports_social_playback_search_and_rights_workflows() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("sqlite pool");
    let store = SqliteMusicStore::new(pool);
    store.migrate().await.expect("music migration");

    store
        .create_artist(NewMusicArtist {
            id: "artist_social".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            slug: "social-band".to_owned(),
            name: "Social Band".to_owned(),
            bio: None,
            now: "2026-06-06T02:00:00Z".to_owned(),
        })
        .await
        .expect("create artist");
    store
        .create_audio_asset(NewMusicAudioAsset {
            id: "asset_social".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            title: "Social Master".to_owned(),
            drive_space_id: "space_social".to_owned(),
            drive_node_id: "node_social".to_owned(),
            drive_uri: "drive://spaces/space_social/nodes/node_social".to_owned(),
            media_resource_id: Some("node_social".to_owned()),
            media_resource_snapshot: Some(r#"{"kind":"audio","source":"drive"}"#.to_owned()),
            mime_type: "audio/mpeg".to_owned(),
            duration_seconds: 210,
            checksum_algorithm: Some("sha256".to_owned()),
            checksum_value: Some("checksum-social".to_owned()),
            status: "ready".to_owned(),
            now: "2026-06-06T02:01:00Z".to_owned(),
        })
        .await
        .expect("create audio asset");
    store
        .create_track(NewMusicTrack {
            id: "track_social".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            artist_id: "artist_social".to_owned(),
            album_id: None,
            audio_asset_id: Some("asset_social".to_owned()),
            slug: "social-loop".to_owned(),
            title: "Social Loop".to_owned(),
            duration_seconds: 210,
            tags: vec!["social".to_owned(), "pop".to_owned()],
            now: "2026-06-06T02:02:00Z".to_owned(),
        })
        .await
        .expect("create track");
    store
        .publish_track("tenant_1", "track_social", "editor_1", "2026-06-06T02:03:00Z")
        .await
        .expect("publish track");
    store
        .create_playlist(NewMusicPlaylist {
            id: "playlist_social".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            slug: "social-mix".to_owned(),
            title: "Social Mix".to_owned(),
            description: Some("Community playlist".to_owned()),
            track_ids: vec!["track_social".to_owned()],
            now: "2026-06-06T02:04:00Z".to_owned(),
        })
        .await
        .expect("create playlist");

    store
        .create_comment(NewMusicComment {
            id: "comment_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            user_id: "user_1".to_owned(),
            resource_type: "track".to_owned(),
            resource_id: "track_social".to_owned(),
            parent_comment_id: None,
            body: "hook is strong".to_owned(),
            moderation_status: "approved".to_owned(),
            now: "2026-06-06T02:05:00Z".to_owned(),
        })
        .await
        .expect("create comment");
    store
        .create_content_report(NewMusicContentReport {
            id: "report_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            reporter_user_id: "user_2".to_owned(),
            resource_type: "comment".to_owned(),
            resource_id: "comment_1".to_owned(),
            reason_code: "spam".to_owned(),
            description: Some("looks promotional".to_owned()),
            now: "2026-06-06T02:06:00Z".to_owned(),
        })
        .await
        .expect("create content report");
    store
        .create_recommendation_feedback(NewMusicRecommendationFeedback {
            id: "feedback_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            user_id: "user_1".to_owned(),
            item_type: "track".to_owned(),
            item_id: "track_social".to_owned(),
            feedback_type: "not_interested".to_owned(),
            reason_code: Some("too_repetitive".to_owned()),
            now: "2026-06-06T02:07:00Z".to_owned(),
        })
        .await
        .expect("create recommendation feedback");
    store
        .create_search_suggestion(NewMusicSearchSuggestion {
            id: "suggestion_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            suggestion_type: "hot".to_owned(),
            display_text: "city pop commute".to_owned(),
            query_text: "city pop commute".to_owned(),
            weight: 900,
            now: "2026-06-06T02:08:00Z".to_owned(),
        })
        .await
        .expect("create search suggestion");
    store
        .create_ai_style_preset(NewMusicAiStylePreset {
            id: "style_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            slug: "city-pop".to_owned(),
            title: "City Pop".to_owned(),
            style_tags: vec!["city-pop".to_owned(), "synth".to_owned()],
            prompt_hint: Some("bright 80s city pop groove".to_owned()),
            status: "active".to_owned(),
            now: "2026-06-06T02:09:00Z".to_owned(),
        })
        .await
        .expect("create AI style preset");
    store
        .create_ai_prompt_template(NewMusicAiPromptTemplate {
            id: "template_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            slug: "ad-jingle".to_owned(),
            title: "Ad Jingle".to_owned(),
            template_text: "Create a short brand-safe jingle about {{topic}}".to_owned(),
            variables_json: Some(r#"["topic"]"#.to_owned()),
            status: "active".to_owned(),
            now: "2026-06-06T02:10:00Z".to_owned(),
        })
        .await
        .expect("create AI prompt template");
    store
        .create_download_entitlement(NewMusicDownloadEntitlement {
            id: "download_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            user_id: "user_1".to_owned(),
            track_id: "track_social".to_owned(),
            audio_asset_id: "asset_social".to_owned(),
            quality: "lossless".to_owned(),
            status: "active".to_owned(),
            expires_at: Some("2026-07-06T02:11:00Z".to_owned()),
            now: "2026-06-06T02:11:00Z".to_owned(),
        })
        .await
        .expect("create download entitlement");
    store
        .upsert_playback_session(NewMusicPlaybackSession {
            id: "session_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            user_id: "user_1".to_owned(),
            device_id: "device_phone".to_owned(),
            current_track_id: Some("track_social".to_owned()),
            queue_json: Some(r#"["track_social"]"#.to_owned()),
            position_ms: 42000,
            playback_state: "playing".to_owned(),
            now: "2026-06-06T02:12:00Z".to_owned(),
        })
        .await
        .expect("upsert playback session");
    store
        .create_rights_territory(NewMusicRightsTerritory {
            id: "territory_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            rights_policy_id: "rights_1".to_owned(),
            region_code: "CN".to_owned(),
            availability: "allowed".to_owned(),
            starts_at: Some("2026-06-06T00:00:00Z".to_owned()),
            ends_at: None,
            now: "2026-06-06T02:13:00Z".to_owned(),
        })
        .await
        .expect("create rights territory");
    store
        .create_release_channel(NewMusicReleaseChannel {
            id: "release_channel_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            release_id: "release_1".to_owned(),
            channel_code: "app".to_owned(),
            distribution_status: "scheduled".to_owned(),
            scheduled_at: Some("2026-06-07T00:00:00Z".to_owned()),
            now: "2026-06-06T02:14:00Z".to_owned(),
        })
        .await
        .expect("create release channel");

    let comments = store
        .list_comments("tenant_1", "track", "track_social")
        .await
        .expect("comments");
    assert_eq!(comments.len(), 1);
    assert_eq!(comments[0].body, "hook is strong");

    let reports = store
        .list_content_reports("tenant_1", Some("open"))
        .await
        .expect("reports");
    assert_eq!(reports.len(), 1);
    assert_eq!(reports[0].reason_code, "spam");

    let suggestions = store
        .list_search_suggestions("tenant_1", "hot")
        .await
        .expect("search suggestions");
    assert_eq!(suggestions[0].query_text, "city pop commute");

    let style_presets = store
        .list_ai_style_presets("tenant_1")
        .await
        .expect("style presets");
    assert_eq!(style_presets[0].style_tags, vec!["city-pop", "synth"]);

    let prompt_templates = store
        .list_ai_prompt_templates("tenant_1")
        .await
        .expect("prompt templates");
    assert_eq!(prompt_templates[0].slug, "ad-jingle");

    let sessions = store
        .list_playback_sessions("tenant_1", "user_1")
        .await
        .expect("playback sessions");
    assert_eq!(sessions[0].device_id, "device_phone");
    assert_eq!(sessions[0].playback_state, "playing");

    let entitlements = store
        .list_download_entitlements("tenant_1", "user_1")
        .await
        .expect("download entitlements");
    assert_eq!(entitlements[0].quality, "lossless");
}
