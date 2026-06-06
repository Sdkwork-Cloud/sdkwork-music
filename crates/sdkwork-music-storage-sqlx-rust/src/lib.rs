use sdkwork_drive_product::{
    ports::uploader_store::DriveUploaderStore,
    uploader::{
        CompleteStoredUploaderUploadCommand, DriveUploaderService, PrepareUploaderUploadCommand,
        UploaderActor, UploaderRetention, UploaderTarget,
    },
    DriveProductError,
};
use sdkwork_drive_storage_contract::{
    DriveObjectLocator, DriveObjectStore, DriveObjectStoreError, DriveObjectStoreErrorKind,
    PutObjectRequest,
};
use serde_json::{Map, Value};
use sha2::{Digest, Sha256};
use sqlx::{Row, SqlitePool};
use std::collections::BTreeMap;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicRepositoryBinding {
    pub domain: &'static str,
    pub repository_name: &'static str,
    pub tables: Vec<&'static str>,
    pub requires_transaction: bool,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStorageMigration {
    pub sequence: u32,
    pub name: &'static str,
    pub domain: &'static str,
    pub source_path: &'static str,
    pub sql: &'static str,
    pub checksum: String,
    pub required_tables: Vec<&'static str>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStorageCapabilityManifest {
    pub name: &'static str,
    pub schema_version: &'static str,
    pub tables: Vec<&'static str>,
    pub indexes: Vec<&'static str>,
    pub migrations: Vec<&'static str>,
    pub migration_plan: Vec<MusicStorageMigration>,
    pub repository_bindings: Vec<MusicRepositoryBinding>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicArtist {
    pub id: String,
    pub tenant_id: String,
    pub slug: String,
    pub name: String,
    pub bio: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicAlbum {
    pub id: String,
    pub tenant_id: String,
    pub artist_id: String,
    pub slug: String,
    pub title: String,
    pub release_date: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicAudioAsset {
    pub id: String,
    pub tenant_id: String,
    pub title: String,
    pub drive_space_id: String,
    pub drive_node_id: String,
    pub drive_uri: String,
    pub media_resource_id: Option<String>,
    pub media_resource_snapshot: Option<String>,
    pub mime_type: String,
    pub duration_seconds: i64,
    pub checksum_algorithm: Option<String>,
    pub checksum_value: Option<String>,
    pub status: String,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicTrack {
    pub id: String,
    pub tenant_id: String,
    pub artist_id: String,
    pub album_id: Option<String>,
    pub audio_asset_id: Option<String>,
    pub slug: String,
    pub title: String,
    pub duration_seconds: i64,
    pub tags: Vec<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicPlaylist {
    pub id: String,
    pub tenant_id: String,
    pub slug: String,
    pub title: String,
    pub description: Option<String>,
    pub track_ids: Vec<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicComment {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub resource_type: String,
    pub resource_id: String,
    pub parent_comment_id: Option<String>,
    pub body: String,
    pub moderation_status: String,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicContentReport {
    pub id: String,
    pub tenant_id: String,
    pub reporter_user_id: String,
    pub resource_type: String,
    pub resource_id: String,
    pub reason_code: String,
    pub description: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicChart {
    pub id: String,
    pub tenant_id: String,
    pub slug: String,
    pub title: String,
    pub chart_type: String,
    pub status: String,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicChartEntry {
    pub id: String,
    pub tenant_id: String,
    pub chart_id: String,
    pub track_id: String,
    pub rank: i64,
    pub score: i64,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicRecommendationShelf {
    pub id: String,
    pub tenant_id: String,
    pub slug: String,
    pub title: String,
    pub shelf_type: String,
    pub status: String,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicRecommendationItem {
    pub id: String,
    pub tenant_id: String,
    pub shelf_id: String,
    pub item_type: String,
    pub item_id: String,
    pub position: i64,
    pub reason_code: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicRecommendationFeedback {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub item_type: String,
    pub item_id: String,
    pub feedback_type: String,
    pub reason_code: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicLibraryItem {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub item_type: String,
    pub item_id: String,
    pub source: String,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicListeningEvent {
    pub id: String,
    pub tenant_id: String,
    pub user_id: Option<String>,
    pub track_id: String,
    pub duration_seconds: i64,
    pub played_seconds: i64,
    pub completion_rate: i64,
    pub source: Option<String>,
    pub occurred_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicDownloadEntitlement {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub track_id: String,
    pub audio_asset_id: String,
    pub quality: String,
    pub status: String,
    pub expires_at: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicPlaybackSession {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub device_id: String,
    pub current_track_id: Option<String>,
    pub queue_json: Option<String>,
    pub position_ms: i64,
    pub playback_state: String,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicSearchSuggestion {
    pub id: String,
    pub tenant_id: String,
    pub suggestion_type: String,
    pub display_text: String,
    pub query_text: String,
    pub weight: i64,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicAiGenerationProject {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub title: String,
    pub visibility: String,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicAiStylePreset {
    pub id: String,
    pub tenant_id: String,
    pub slug: String,
    pub title: String,
    pub style_tags: Vec<String>,
    pub prompt_hint: Option<String>,
    pub status: String,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicAiPromptTemplate {
    pub id: String,
    pub tenant_id: String,
    pub slug: String,
    pub title: String,
    pub template_text: String,
    pub variables_json: Option<String>,
    pub status: String,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicAiGenerationProvider {
    pub id: String,
    pub tenant_id: String,
    pub provider_code: String,
    pub display_name: String,
    pub provider_family: String,
    pub capability: String,
    pub invocation_mode: String,
    pub claw_router_provider_code: String,
    pub claw_router_endpoint_key: String,
    pub claw_router_standard_path: String,
    pub supports_polling: bool,
    pub supports_webhook: bool,
    pub status: String,
    pub config_snapshot: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicAiGenerationProviderModel {
    pub id: String,
    pub tenant_id: String,
    pub provider_id: String,
    pub provider_code: String,
    pub model_name: String,
    pub display_name: String,
    pub capability: String,
    pub min_duration_seconds: i64,
    pub max_duration_seconds: i64,
    pub max_variant_count: i64,
    pub supported_formats: Vec<String>,
    pub supported_style_tags: Vec<String>,
    pub pricing_unit: String,
    pub status: String,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicAiGenerationTask {
    pub id: String,
    pub tenant_id: String,
    pub project_id: Option<String>,
    pub user_id: String,
    pub prompt: String,
    pub lyrics_prompt: Option<String>,
    pub style_tags: Vec<String>,
    pub model_provider: String,
    pub model_name: String,
    pub reference_drive_uri: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicAiGenerationProviderAttempt {
    pub id: String,
    pub tenant_id: String,
    pub task_id: String,
    pub provider_id: String,
    pub provider_code: String,
    pub model_name: String,
    pub invocation_mode: String,
    pub claw_router_endpoint_key: String,
    pub claw_router_standard_path: String,
    pub claw_router_request_id: Option<String>,
    pub external_task_id: Option<String>,
    pub status: String,
    pub provider_status: Option<String>,
    pub request_snapshot: Option<String>,
    pub response_snapshot: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicAiGenerationProviderEvent {
    pub id: String,
    pub tenant_id: String,
    pub task_id: String,
    pub attempt_id: Option<String>,
    pub provider_code: String,
    pub external_task_id: Option<String>,
    pub external_event_id: Option<String>,
    pub event_type: String,
    pub source: String,
    pub provider_status: String,
    pub payload_hash: String,
    pub payload_snapshot: String,
    pub has_outputs: bool,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicReleaseChannel {
    pub id: String,
    pub tenant_id: String,
    pub release_id: String,
    pub channel_code: String,
    pub distribution_status: String,
    pub scheduled_at: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicRightsTerritory {
    pub id: String,
    pub tenant_id: String,
    pub rights_policy_id: String,
    pub region_code: String,
    pub availability: String,
    pub starts_at: Option<String>,
    pub ends_at: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewMusicAiGenerationVariant {
    pub id: String,
    pub tenant_id: String,
    pub task_id: String,
    pub audio_asset_id: Option<String>,
    pub title: String,
    pub drive_uri: String,
    pub media_resource_snapshot: Option<String>,
    pub duration_seconds: i64,
    pub moderation_status: String,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicGeneratedProviderArtifact {
    pub id: Option<String>,
    pub title: String,
    pub kind: String,
    pub content_type: String,
    pub content_length: i64,
    pub file_name: String,
    pub checksum_sha256_hex: Option<String>,
    pub duration_seconds: i64,
    pub provider_asset_id: Option<String>,
    pub provider_asset_url: Option<String>,
    pub metadata_json: Option<String>,
    pub content: Option<Vec<u8>>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ArchiveMusicGeneratedArtifactsCommand {
    pub tenant_id: String,
    pub user_id: Option<String>,
    pub anonymous_id: Option<String>,
    pub task_id: String,
    pub provider_code: String,
    pub provider_model: String,
    pub provider_task_id: Option<String>,
    pub now: String,
    pub now_epoch_ms: i64,
    pub artifacts: Vec<MusicGeneratedProviderArtifact>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ArchivedMusicGeneratedArtifacts {
    pub variants: Vec<NewMusicAiGenerationVariant>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
struct StoredMusicGeneratedArtifactObject {
    bucket: String,
    object_key: String,
    etag: Option<String>,
    version_id: Option<String>,
    checksum_sha256_hex: String,
}

pub struct MusicGeneratedArtifactArchiveService<S>
where
    S: DriveUploaderStore,
{
    drive_uploader: DriveUploaderService<S>,
    object_store: Option<Box<dyn DriveObjectStore>>,
}

impl<S> MusicGeneratedArtifactArchiveService<S>
where
    S: DriveUploaderStore,
{
    pub fn new(store: S) -> Self {
        Self {
            drive_uploader: DriveUploaderService::new(store),
            object_store: None,
        }
    }

    pub fn with_object_store(store: S, object_store: impl DriveObjectStore + 'static) -> Self {
        Self {
            drive_uploader: DriveUploaderService::new(store),
            object_store: Some(Box::new(object_store)),
        }
    }

    pub async fn archive_generated_artifacts(
        &self,
        command: ArchiveMusicGeneratedArtifactsCommand,
    ) -> Result<ArchivedMusicGeneratedArtifacts, DriveProductError> {
        let tenant_id = require_archive_identifier(&command.tenant_id, "tenant_id")?;
        let task_id = require_archive_identifier(&command.task_id, "task_id")?;
        let provider_code = require_archive_identifier(&command.provider_code, "provider_code")?;
        let provider_model = require_archive_identifier(&command.provider_model, "provider_model")?;
        let now = require_archive_text(&command.now, "now")?;
        if command.now_epoch_ms <= 0 {
            return Err(DriveProductError::Validation(
                "now_epoch_ms must be greater than zero".to_string(),
            ));
        }
        if command.artifacts.is_empty() {
            return Err(DriveProductError::Validation(
                "artifacts are required".to_string(),
            ));
        }

        let actor = archive_actor(command.user_id.as_deref(), command.anonymous_id.as_deref())?;
        let mut variants = Vec::with_capacity(command.artifacts.len());
        for (index, artifact) in command.artifacts.iter().enumerate() {
            let ordinal = index + 1;
            let upload_item_id = format!("music-ai-{task_id}-{ordinal:04}");
            let mut upload_item = self
                .drive_uploader
                .prepare_upload(PrepareUploaderUploadCommand {
                    id: upload_item_id.clone(),
                    task_id: upload_item_id.clone(),
                    tenant_id: tenant_id.clone(),
                    organization_id: None,
                    actor: actor.clone(),
                    app_id: "sdkwork-music".to_string(),
                    app_resource_type: "music_ai_generation_variant".to_string(),
                    app_resource_id: format!("{task_id}-{ordinal:04}"),
                    scene: Some("music_ai_generation".to_string()),
                    source: Some("ai_generated".to_string()),
                    upload_profile_code: upload_profile_for_kind(
                        &artifact.kind,
                        &artifact.content_type,
                    ),
                    file_fingerprint: artifact_fingerprint(artifact, &upload_item_id)?,
                    original_file_name: require_archive_text(&artifact.file_name, "file_name")?,
                    content_type: require_archive_text(&artifact.content_type, "content_type")?,
                    content_length: artifact.content_length,
                    chunk_size_bytes: 8 * 1024 * 1024,
                    target: UploaderTarget::AiGeneratedSpace {
                        parent_node_id: None,
                    },
                    retention: UploaderRetention::LongTerm,
                    operator_id: archive_operator_id(&actor),
                    now_epoch_ms: command.now_epoch_ms,
                })
                .await?;

            let stored_object = self
                .store_generated_artifact_object(
                    &tenant_id,
                    &task_id,
                    ordinal,
                    artifact,
                    &upload_item,
                )
                .await?;
            if let Some(stored_object) = stored_object.as_ref() {
                let upload_session_id = upload_item.upload_session_id.clone().ok_or_else(|| {
                    DriveProductError::Internal(
                        "drive upload item is missing upload session id".to_string(),
                    )
                })?;
                upload_item = self
                    .drive_uploader
                    .complete_stored_upload(CompleteStoredUploaderUploadCommand {
                        tenant_id: tenant_id.clone(),
                        upload_item_id: upload_item.id.clone(),
                        upload_session_id,
                        content_type: upload_item.content_type.clone(),
                        content_length: artifact.content_length,
                        checksum_sha256_hex: stored_object.checksum_sha256_hex.clone(),
                        uploaded_parts_count: 1,
                        operator_id: archive_operator_id(&actor),
                    })
                    .await?;
            }

            let drive_uri = format!(
                "drive://spaces/{}/nodes/{}",
                upload_item.space_id, upload_item.node_id
            );
            variants.push(NewMusicAiGenerationVariant {
                id: format!("variant_{task_id}_{ordinal:04}"),
                tenant_id: tenant_id.clone(),
                task_id: task_id.clone(),
                audio_asset_id: None,
                title: require_archive_text(&artifact.title, "title")?,
                drive_uri: drive_uri.clone(),
                media_resource_snapshot: Some(generated_artifact_snapshot(
                    artifact,
                    &upload_item,
                    &drive_uri,
                    &provider_code,
                    &provider_model,
                    command.provider_task_id.as_deref(),
                    ordinal,
                    &task_id,
                    stored_object.as_ref(),
                )?),
                duration_seconds: artifact.duration_seconds.max(0),
                moderation_status: "approved".to_string(),
                now: now.clone(),
            });
        }

        Ok(ArchivedMusicGeneratedArtifacts { variants })
    }

    async fn store_generated_artifact_object(
        &self,
        tenant_id: &str,
        task_id: &str,
        ordinal: usize,
        artifact: &MusicGeneratedProviderArtifact,
        upload_item: &sdkwork_drive_product::uploader::DriveUploadItem,
    ) -> Result<Option<StoredMusicGeneratedArtifactObject>, DriveProductError> {
        let Some(content) = artifact.content.as_ref() else {
            return Ok(None);
        };
        let Some(object_store) = self.object_store.as_ref() else {
            return Err(DriveProductError::Validation(
                "generated artifact content requires a drive object store".to_string(),
            ));
        };
        let bucket = upload_item.object_bucket.as_deref().ok_or_else(|| {
            DriveProductError::Internal("drive upload item is missing object bucket".to_string())
        })?;
        let object_key = upload_item.object_key.as_deref().ok_or_else(|| {
            DriveProductError::Internal("drive upload item is missing object key".to_string())
        })?;
        if artifact.content_length >= 0 && artifact.content_length != content.len() as i64 {
            return Err(DriveProductError::Validation(
                "content_length must match generated artifact content bytes".to_string(),
            ));
        }
        let checksum_sha256_hex = generated_artifact_checksum(artifact, content)?;

        let mut metadata = BTreeMap::new();
        metadata.insert("sdkwork.app".to_string(), "sdkwork-music".to_string());
        metadata.insert("sdkwork.ai.provenance".to_string(), "generated".to_string());
        metadata.insert(
            "sdkwork.ai.space_type".to_string(),
            "ai_generated".to_string(),
        );
        metadata.insert("sdkwork.music.tenant_id".to_string(), tenant_id.to_string());
        metadata.insert("sdkwork.music.task_id".to_string(), task_id.to_string());
        metadata.insert(
            "sdkwork.music.artifact_index".to_string(),
            ordinal.to_string(),
        );
        metadata.insert(
            "sdkwork.music.artifact_kind".to_string(),
            artifact.kind.trim().to_ascii_lowercase(),
        );
        if let Some(provider_asset_id) = artifact
            .provider_asset_id
            .as_deref()
            .map(str::trim)
            .filter(|value| !value.is_empty())
        {
            metadata.insert(
                "sdkwork.music.provider_asset_id".to_string(),
                provider_asset_id.to_string(),
            );
        }

        let response = object_store
            .put_object(PutObjectRequest {
                locator: DriveObjectLocator {
                    bucket: bucket.to_string(),
                    object_key: object_key.to_string(),
                },
                content_type: Some(artifact.content_type.trim().to_ascii_lowercase()),
                metadata,
                body: content.clone(),
                checksum_sha256_hex: Some(checksum_sha256_hex.clone()),
            })
            .await
            .map_err(drive_object_store_error)?;

        Ok(Some(StoredMusicGeneratedArtifactObject {
            bucket: response.locator.bucket,
            object_key: response.locator.object_key,
            etag: response.etag,
            version_id: response.version_id,
            checksum_sha256_hex,
        }))
    }
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStoredTrack {
    pub id: String,
    pub tenant_id: String,
    pub artist_id: String,
    pub artist_name: String,
    pub album_id: Option<String>,
    pub album_title: Option<String>,
    pub audio_asset_id: Option<String>,
    pub slug: String,
    pub title: String,
    pub duration_seconds: i64,
    pub status: String,
    pub tags: Vec<String>,
    pub published_at: Option<String>,
    pub updated_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStoredPlaylist {
    pub id: String,
    pub tenant_id: String,
    pub slug: String,
    pub title: String,
    pub description: Option<String>,
    pub track_ids: Vec<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStoredChartEntry {
    pub id: String,
    pub tenant_id: String,
    pub chart_id: String,
    pub track_id: String,
    pub track_title: String,
    pub artist_name: String,
    pub rank: i64,
    pub score: i64,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStoredRecommendationItem {
    pub id: String,
    pub item_type: String,
    pub item_id: String,
    pub position: i64,
    pub reason_code: Option<String>,
    pub track_title: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStoredRecommendationShelf {
    pub id: String,
    pub tenant_id: String,
    pub slug: String,
    pub title: String,
    pub shelf_type: String,
    pub items: Vec<MusicStoredRecommendationItem>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStoredLibraryItem {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub item_type: String,
    pub item_id: String,
    pub source: String,
    pub updated_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStoredListeningHistory {
    pub track_id: String,
    pub track_title: String,
    pub play_count: i64,
    pub last_played_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStoredAiGenerationTask {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub prompt: String,
    pub status: String,
    pub moderation_status: String,
    pub provider_code: Option<String>,
    pub external_task_id: Option<String>,
    pub provider_output_count: i64,
    pub variant_count: i64,
    pub approved_variant_count: i64,
    pub updated_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStoredAiGenerationProviderEvent {
    pub id: String,
    pub task_id: String,
    pub provider_code: String,
    pub event_type: String,
    pub source: String,
    pub provider_status: String,
    pub status_before: String,
    pub status_after: String,
    pub created_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStoredAiGenerationNotification {
    pub id: String,
    pub task_id: String,
    pub user_id: String,
    pub notification_type: String,
    pub status: String,
    pub created_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStoredComment {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub resource_type: String,
    pub resource_id: String,
    pub body: String,
    pub moderation_status: String,
    pub created_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStoredContentReport {
    pub id: String,
    pub tenant_id: String,
    pub resource_type: String,
    pub resource_id: String,
    pub reason_code: String,
    pub status: String,
    pub created_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStoredSearchSuggestion {
    pub id: String,
    pub display_text: String,
    pub query_text: String,
    pub weight: i64,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStoredAiStylePreset {
    pub id: String,
    pub slug: String,
    pub title: String,
    pub style_tags: Vec<String>,
    pub prompt_hint: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStoredAiPromptTemplate {
    pub id: String,
    pub slug: String,
    pub title: String,
    pub template_text: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStoredPlaybackSession {
    pub id: String,
    pub user_id: String,
    pub device_id: String,
    pub current_track_id: Option<String>,
    pub position_ms: i64,
    pub playback_state: String,
    pub updated_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicStoredDownloadEntitlement {
    pub id: String,
    pub track_id: String,
    pub audio_asset_id: String,
    pub quality: String,
    pub status: String,
    pub expires_at: Option<String>,
}

#[derive(Clone, Debug)]
pub struct SqliteMusicStore {
    pool: SqlitePool,
}

impl SqliteMusicStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }

    pub async fn migrate(&self) -> Result<(), sqlx::Error> {
        sqlx::raw_sql(music_initial_migration_sql())
            .execute(&self.pool)
            .await?;
        Ok(())
    }

    pub async fn create_artist(&self, input: NewMusicArtist) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_artist
                (id, tenant_id, slug, name, bio, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.slug)
        .bind(input.name)
        .bind(input.bio)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_album(&self, input: NewMusicAlbum) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_album
                (id, tenant_id, artist_id, slug, title, release_date, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.artist_id)
        .bind(input.slug)
        .bind(input.title)
        .bind(input.release_date)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_audio_asset(&self, input: NewMusicAudioAsset) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_audio_asset
                (id, tenant_id, title, drive_space_id, drive_node_id, drive_uri,
                 media_resource_id, media_resource_snapshot, mime_type, duration_seconds,
                 checksum_algorithm, checksum_value, status, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.title)
        .bind(input.drive_space_id)
        .bind(input.drive_node_id)
        .bind(input.drive_uri)
        .bind(input.media_resource_id)
        .bind(input.media_resource_snapshot)
        .bind(input.mime_type)
        .bind(input.duration_seconds)
        .bind(input.checksum_algorithm)
        .bind(input.checksum_value)
        .bind(input.status)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_track(&self, input: NewMusicTrack) -> Result<(), sqlx::Error> {
        let mut tx = self.pool.begin().await?;
        sqlx::query(
            r#"
            INSERT INTO music_track
                (id, tenant_id, artist_id, album_id, audio_asset_id, slug, title,
                 duration_seconds, status, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.artist_id)
        .bind(&input.album_id)
        .bind(&input.audio_asset_id)
        .bind(&input.slug)
        .bind(&input.title)
        .bind(input.duration_seconds)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&mut *tx)
        .await?;

        let mut tags = input
            .tags
            .iter()
            .map(|tag| normalize_tag_slug(tag))
            .filter(|tag| !tag.is_empty())
            .collect::<Vec<_>>();
        tags.sort();
        tags.dedup();

        for tag in tags {
            sqlx::query(
                r#"
                INSERT OR IGNORE INTO music_track_tag (track_id, tag)
                VALUES (?, ?)
                "#,
            )
            .bind(&input.id)
            .bind(tag)
            .execute(&mut *tx)
            .await?;
        }

        tx.commit().await?;
        Ok(())
    }

    pub async fn create_playlist(&self, input: NewMusicPlaylist) -> Result<(), sqlx::Error> {
        let mut tx = self.pool.begin().await?;
        sqlx::query(
            r#"
            INSERT INTO music_playlist
                (id, tenant_id, slug, title, description, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.slug)
        .bind(&input.title)
        .bind(&input.description)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&mut *tx)
        .await?;

        for (position, track_id) in input.track_ids.iter().enumerate() {
            sqlx::query(
                r#"
                INSERT INTO music_playlist_track (playlist_id, track_id, position)
                VALUES (?, ?, ?)
                "#,
            )
            .bind(&input.id)
            .bind(track_id)
            .bind(position as i64)
            .execute(&mut *tx)
            .await?;
        }

        tx.commit().await?;
        Ok(())
    }

    pub async fn create_comment(&self, input: NewMusicComment) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_comment
                (id, tenant_id, user_id, resource_type, resource_id, parent_comment_id,
                 body, moderation_status, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.user_id)
        .bind(input.resource_type)
        .bind(input.resource_id)
        .bind(input.parent_comment_id)
        .bind(input.body)
        .bind(input.moderation_status)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_content_report(
        &self,
        input: NewMusicContentReport,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_content_report
                (id, tenant_id, reporter_user_id, resource_type, resource_id, reason_code,
                 description, status, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, 'open', ?, ?)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.reporter_user_id)
        .bind(input.resource_type)
        .bind(input.resource_id)
        .bind(input.reason_code)
        .bind(input.description)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn publish_track(
        &self,
        tenant_id: &str,
        track_id: &str,
        actor_user_id: &str,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        let mut tx = self.pool.begin().await?;
        sqlx::query(
            r#"
            UPDATE music_track
            SET status = 'published',
                published_at = COALESCE(published_at, ?),
                updated_at = ?
            WHERE tenant_id = ? AND id = ?
            "#,
        )
        .bind(now)
        .bind(now)
        .bind(tenant_id)
        .bind(track_id)
        .execute(&mut *tx)
        .await?;

        sqlx::query(
            r#"
            INSERT INTO music_editorial_audit
                (id, tenant_id, resource_type, resource_id, action, actor_user_id, before_json, after_json, created_at)
            VALUES
                (?, ?, 'track', ?, 'publish', ?, NULL, NULL, ?)
            "#,
        )
        .bind(format!("audit_{tenant_id}_{track_id}_{now}"))
        .bind(tenant_id)
        .bind(track_id)
        .bind(actor_user_id)
        .bind(now)
        .execute(&mut *tx)
        .await?;

        tx.commit().await?;
        Ok(())
    }

    pub async fn create_chart(&self, input: NewMusicChart) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_chart
                (id, tenant_id, slug, title, chart_type, status, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.slug)
        .bind(input.title)
        .bind(input.chart_type)
        .bind(input.status)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn add_chart_entry(&self, input: NewMusicChartEntry) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_chart_entry
                (id, tenant_id, chart_id, track_id, rank, score, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.chart_id)
        .bind(input.track_id)
        .bind(input.rank)
        .bind(input.score)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_recommendation_shelf(
        &self,
        input: NewMusicRecommendationShelf,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_recommendation_shelf
                (id, tenant_id, slug, title, shelf_type, status, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.slug)
        .bind(input.title)
        .bind(input.shelf_type)
        .bind(input.status)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn add_recommendation_item(
        &self,
        input: NewMusicRecommendationItem,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_recommendation_item
                (id, tenant_id, shelf_id, item_type, item_id, position, reason_code, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.shelf_id)
        .bind(input.item_type)
        .bind(input.item_id)
        .bind(input.position)
        .bind(input.reason_code)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_recommendation_feedback(
        &self,
        input: NewMusicRecommendationFeedback,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_recommendation_feedback
                (id, tenant_id, user_id, item_type, item_id, feedback_type, reason_code, context_json, created_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, NULL, ?)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.user_id)
        .bind(input.item_type)
        .bind(input.item_id)
        .bind(input.feedback_type)
        .bind(input.reason_code)
        .bind(input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn save_library_item(&self, input: NewMusicLibraryItem) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_user_library_item
                (id, tenant_id, user_id, item_type, item_id, source, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (tenant_id, user_id, item_type, item_id)
            DO UPDATE SET source = excluded.source, updated_at = excluded.updated_at
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.user_id)
        .bind(input.item_type)
        .bind(input.item_id)
        .bind(input.source)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_download_entitlement(
        &self,
        input: NewMusicDownloadEntitlement,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_download_entitlement
                (id, tenant_id, user_id, track_id, audio_asset_id, quality, status, expires_at, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (tenant_id, user_id, track_id, quality)
            DO UPDATE SET audio_asset_id = excluded.audio_asset_id,
                          status = excluded.status,
                          expires_at = excluded.expires_at,
                          updated_at = excluded.updated_at
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.user_id)
        .bind(input.track_id)
        .bind(input.audio_asset_id)
        .bind(input.quality)
        .bind(input.status)
        .bind(input.expires_at)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn upsert_playback_session(
        &self,
        input: NewMusicPlaybackSession,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_playback_session
                (id, tenant_id, user_id, device_id, current_track_id, queue_json,
                 position_ms, playback_state, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (tenant_id, user_id, device_id)
            DO UPDATE SET current_track_id = excluded.current_track_id,
                          queue_json = excluded.queue_json,
                          position_ms = excluded.position_ms,
                          playback_state = excluded.playback_state,
                          updated_at = excluded.updated_at
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.user_id)
        .bind(input.device_id)
        .bind(input.current_track_id)
        .bind(input.queue_json)
        .bind(input.position_ms)
        .bind(input.playback_state)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn record_listening_event(
        &self,
        input: NewMusicListeningEvent,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_listening_history
                (id, tenant_id, user_id, track_id, duration_seconds, played_seconds,
                 completion_rate, source, occurred_at, created_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.user_id)
        .bind(&input.track_id)
        .bind(input.duration_seconds)
        .bind(input.played_seconds)
        .bind(input.completion_rate)
        .bind(&input.source)
        .bind(&input.occurred_at)
        .bind(&input.occurred_at)
        .execute(&self.pool)
        .await?;

        sqlx::query(
            r#"
            INSERT INTO music_play_event
                (id, tenant_id, track_id, user_id, occurred_at)
            VALUES
                (?, ?, ?, ?, ?)
            "#,
        )
        .bind(format!("{}_event", input.id))
        .bind(input.tenant_id)
        .bind(input.track_id)
        .bind(input.user_id)
        .bind(input.occurred_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_search_suggestion(
        &self,
        input: NewMusicSearchSuggestion,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_search_suggestion
                (id, tenant_id, suggestion_type, display_text, query_text, weight, status, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, 'active', ?, ?)
            ON CONFLICT (tenant_id, suggestion_type, query_text)
            DO UPDATE SET display_text = excluded.display_text,
                          weight = excluded.weight,
                          status = excluded.status,
                          updated_at = excluded.updated_at
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.suggestion_type)
        .bind(input.display_text)
        .bind(input.query_text)
        .bind(input.weight)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_ai_generation_project(
        &self,
        input: NewMusicAiGenerationProject,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_ai_generation_project
                (id, tenant_id, user_id, title, visibility, status, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, 'active', ?, ?)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.user_id)
        .bind(input.title)
        .bind(input.visibility)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_ai_style_preset(
        &self,
        input: NewMusicAiStylePreset,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_ai_style_preset
                (id, tenant_id, slug, title, style_tags_json, prompt_hint, status, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.slug)
        .bind(input.title)
        .bind(json_string_array(&input.style_tags))
        .bind(input.prompt_hint)
        .bind(input.status)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_ai_prompt_template(
        &self,
        input: NewMusicAiPromptTemplate,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_ai_prompt_template
                (id, tenant_id, slug, title, template_text, variables_json, status, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.slug)
        .bind(input.title)
        .bind(input.template_text)
        .bind(input.variables_json)
        .bind(input.status)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn upsert_ai_generation_provider(
        &self,
        input: NewMusicAiGenerationProvider,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_ai_generation_provider
                (id, tenant_id, provider_code, display_name, provider_family, capability,
                 invocation_mode, claw_router_provider_code, claw_router_endpoint_key,
                 claw_router_standard_path, supports_polling, supports_webhook, status,
                 config_snapshot, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(tenant_id, provider_code) DO UPDATE SET
                display_name = excluded.display_name,
                provider_family = excluded.provider_family,
                capability = excluded.capability,
                invocation_mode = excluded.invocation_mode,
                claw_router_provider_code = excluded.claw_router_provider_code,
                claw_router_endpoint_key = excluded.claw_router_endpoint_key,
                claw_router_standard_path = excluded.claw_router_standard_path,
                supports_polling = excluded.supports_polling,
                supports_webhook = excluded.supports_webhook,
                status = excluded.status,
                config_snapshot = excluded.config_snapshot,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.provider_code)
        .bind(input.display_name)
        .bind(input.provider_family)
        .bind(input.capability)
        .bind(input.invocation_mode)
        .bind(input.claw_router_provider_code)
        .bind(input.claw_router_endpoint_key)
        .bind(input.claw_router_standard_path)
        .bind(bool_int(input.supports_polling))
        .bind(bool_int(input.supports_webhook))
        .bind(input.status)
        .bind(input.config_snapshot)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn upsert_ai_generation_provider_model(
        &self,
        input: NewMusicAiGenerationProviderModel,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_ai_generation_provider_model
                (id, tenant_id, provider_id, provider_code, model_name, display_name,
                 capability, min_duration_seconds, max_duration_seconds, max_variant_count,
                 supported_formats_json, supported_style_tags_json, pricing_unit, status,
                 created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(tenant_id, provider_code, model_name) DO UPDATE SET
                display_name = excluded.display_name,
                capability = excluded.capability,
                min_duration_seconds = excluded.min_duration_seconds,
                max_duration_seconds = excluded.max_duration_seconds,
                max_variant_count = excluded.max_variant_count,
                supported_formats_json = excluded.supported_formats_json,
                supported_style_tags_json = excluded.supported_style_tags_json,
                pricing_unit = excluded.pricing_unit,
                status = excluded.status,
                updated_at = excluded.updated_at
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.provider_id)
        .bind(input.provider_code)
        .bind(input.model_name)
        .bind(input.display_name)
        .bind(input.capability)
        .bind(input.min_duration_seconds)
        .bind(input.max_duration_seconds)
        .bind(input.max_variant_count)
        .bind(json_string_array(&input.supported_formats))
        .bind(json_string_array(&input.supported_style_tags))
        .bind(input.pricing_unit)
        .bind(input.status)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_ai_generation_task(
        &self,
        input: NewMusicAiGenerationTask,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_ai_generation_task
                (id, tenant_id, project_id, user_id, prompt, lyrics_prompt, style_tags_json,
                 model_provider, model_name, generation_mode, provider_code, provider_model,
                 provider_invocation_mode, reference_drive_uri, status, moderation_status,
                 created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, 'text_to_music', ?, ?, 'async_task', ?, 'queued', 'pending', ?, ?)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.project_id)
        .bind(input.user_id)
        .bind(input.prompt)
        .bind(input.lyrics_prompt)
        .bind(json_string_array(&input.style_tags))
        .bind(&input.model_provider)
        .bind(&input.model_name)
        .bind(&input.model_provider)
        .bind(&input.model_name)
        .bind(input.reference_drive_uri)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_ai_generation_provider_attempt(
        &self,
        input: NewMusicAiGenerationProviderAttempt,
    ) -> Result<(), sqlx::Error> {
        let mut tx = self.pool.begin().await?;
        sqlx::query(
            r#"
            INSERT INTO music_ai_generation_provider_attempt
                (id, tenant_id, task_id, provider_id, provider_code, model_name,
                 invocation_mode, claw_router_endpoint_key, claw_router_standard_path,
                 claw_router_request_id, external_task_id, status, provider_status,
                 request_snapshot, response_snapshot, submitted_at, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.task_id)
        .bind(&input.provider_id)
        .bind(&input.provider_code)
        .bind(&input.model_name)
        .bind(&input.invocation_mode)
        .bind(&input.claw_router_endpoint_key)
        .bind(&input.claw_router_standard_path)
        .bind(&input.claw_router_request_id)
        .bind(&input.external_task_id)
        .bind(&input.status)
        .bind(&input.provider_status)
        .bind(&input.request_snapshot)
        .bind(&input.response_snapshot)
        .bind(&input.now)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&mut *tx)
        .await?;

        sqlx::query(
            r#"
            UPDATE music_ai_generation_task
            SET status = ?,
                provider_code = ?,
                provider_model = ?,
                provider_invocation_mode = ?,
                external_task_id = COALESCE(?, external_task_id),
                provider_status = COALESCE(?, provider_status),
                last_provider_sync_at = ?,
                updated_at = ?
            WHERE tenant_id = ? AND id = ?
            "#,
        )
        .bind(normalize_task_status("queued", input.provider_status.as_deref().unwrap_or(&input.status), false, &input.invocation_mode))
        .bind(&input.provider_code)
        .bind(&input.model_name)
        .bind(&input.invocation_mode)
        .bind(&input.external_task_id)
        .bind(&input.provider_status)
        .bind(&input.now)
        .bind(&input.now)
        .bind(&input.tenant_id)
        .bind(&input.task_id)
        .execute(&mut *tx)
        .await?;

        tx.commit().await?;
        Ok(())
    }

    pub async fn record_ai_generation_provider_event(
        &self,
        input: NewMusicAiGenerationProviderEvent,
    ) -> Result<bool, sqlx::Error> {
        let mut tx = self.pool.begin().await?;
        let status_before = task_status_in_tx(&mut tx, &input.tenant_id, &input.task_id).await?;
        let invocation_mode =
            task_invocation_mode_in_tx(&mut tx, &input.tenant_id, &input.task_id).await?;
        let status_after = normalize_task_status(
            &status_before,
            &input.provider_status,
            input.has_outputs,
            &invocation_mode,
        );
        let result = sqlx::query(
            r#"
            INSERT OR IGNORE INTO music_ai_generation_provider_event
                (id, tenant_id, task_id, attempt_id, provider_code, external_task_id,
                 external_event_id, event_type, source, provider_status, status_before,
                 status_after, payload_hash, payload_snapshot, created_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.task_id)
        .bind(&input.attempt_id)
        .bind(&input.provider_code)
        .bind(&input.external_task_id)
        .bind(&input.external_event_id)
        .bind(&input.event_type)
        .bind(&input.source)
        .bind(&input.provider_status)
        .bind(&status_before)
        .bind(&status_after)
        .bind(&input.payload_hash)
        .bind(&input.payload_snapshot)
        .bind(&input.now)
        .execute(&mut *tx)
        .await?;

        let inserted = result.rows_affected() > 0;
        if inserted {
            sqlx::query(
                r#"
                UPDATE music_ai_generation_task
                SET status = ?,
                    provider_code = ?,
                    external_task_id = COALESCE(?, external_task_id),
                    provider_status = ?,
                    provider_output_count = provider_output_count + ?,
                    last_provider_sync_at = ?,
                    completed_at = CASE
                        WHEN ? IN ('succeeded', 'failed', 'cancelled', 'expired')
                        THEN COALESCE(completed_at, ?)
                        ELSE completed_at
                    END,
                    updated_at = ?
                WHERE tenant_id = ? AND id = ?
                "#,
            )
            .bind(&status_after)
            .bind(&input.provider_code)
            .bind(&input.external_task_id)
            .bind(&input.provider_status)
            .bind(if input.has_outputs { 1_i64 } else { 0_i64 })
            .bind(&input.now)
            .bind(&status_after)
            .bind(&input.now)
            .bind(&input.now)
            .bind(&input.tenant_id)
            .bind(&input.task_id)
            .execute(&mut *tx)
            .await?;

            if matches!(status_after.as_str(), "succeeded" | "failed" | "cancelled" | "expired") {
                let user_id = task_user_id_in_tx(&mut tx, &input.tenant_id, &input.task_id).await?;
                let notification_type = format!("ai_generation_{status_after}");
                sqlx::query(
                    r#"
                    INSERT OR IGNORE INTO music_ai_generation_notification
                        (id, tenant_id, user_id, task_id, notification_type, title, body, status, created_at)
                    VALUES
                        (?, ?, ?, ?, ?, ?, ?, 'unread', ?)
                    "#,
                )
                .bind(format!("notification_{}", input.id))
                .bind(&input.tenant_id)
                .bind(user_id)
                .bind(&input.task_id)
                .bind(&notification_type)
                .bind("Music generation updated")
                .bind(format!("Generation {} is {}", input.task_id, status_after))
                .bind(&input.now)
                .execute(&mut *tx)
                .await?;
            }
        }

        tx.commit().await?;
        Ok(inserted)
    }

    pub async fn list_ai_generation_provider_events(
        &self,
        tenant_id: &str,
        task_id: &str,
    ) -> Result<Vec<MusicStoredAiGenerationProviderEvent>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, task_id, provider_code, event_type, source, provider_status,
                   status_before, status_after, created_at
            FROM music_ai_generation_provider_event
            WHERE tenant_id = ? AND task_id = ?
            ORDER BY created_at DESC, id DESC
            "#,
        )
        .bind(tenant_id)
        .bind(task_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| MusicStoredAiGenerationProviderEvent {
                id: string_cell(row, "id"),
                task_id: string_cell(row, "task_id"),
                provider_code: string_cell(row, "provider_code"),
                event_type: string_cell(row, "event_type"),
                source: string_cell(row, "source"),
                provider_status: string_cell(row, "provider_status"),
                status_before: string_cell(row, "status_before"),
                status_after: string_cell(row, "status_after"),
                created_at: string_cell(row, "created_at"),
            })
            .collect())
    }

    pub async fn list_ai_generation_notifications(
        &self,
        tenant_id: &str,
        user_id: &str,
    ) -> Result<Vec<MusicStoredAiGenerationNotification>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, task_id, user_id, notification_type, status, created_at
            FROM music_ai_generation_notification
            WHERE tenant_id = ? AND user_id = ?
            ORDER BY created_at DESC, id DESC
            "#,
        )
        .bind(tenant_id)
        .bind(user_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| MusicStoredAiGenerationNotification {
                id: string_cell(row, "id"),
                task_id: string_cell(row, "task_id"),
                user_id: string_cell(row, "user_id"),
                notification_type: string_cell(row, "notification_type"),
                status: string_cell(row, "status"),
                created_at: string_cell(row, "created_at"),
            })
            .collect())
    }

    pub async fn complete_ai_generation_task(
        &self,
        input: NewMusicAiGenerationVariant,
    ) -> Result<(), sqlx::Error> {
        self.complete_ai_generation_task_with_variants(vec![input]).await
    }

    pub async fn complete_ai_generation_task_with_variants(
        &self,
        inputs: Vec<NewMusicAiGenerationVariant>,
    ) -> Result<(), sqlx::Error> {
        let Some(first) = inputs.first() else {
            return Ok(());
        };
        let mut tx = self.pool.begin().await?;
        for input in &inputs {
            if input.tenant_id != first.tenant_id || input.task_id != first.task_id {
                return Err(sqlx::Error::Protocol(
                    "AI generation variants must belong to the same tenant task".to_string(),
                ));
            }
            sqlx::query(
                r#"
                INSERT OR IGNORE INTO music_ai_generation_variant
                    (id, tenant_id, task_id, audio_asset_id, title, drive_uri,
                     media_resource_snapshot, duration_seconds, moderation_status, created_at, updated_at)
                VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                "#,
            )
            .bind(&input.id)
            .bind(&input.tenant_id)
            .bind(&input.task_id)
            .bind(&input.audio_asset_id)
            .bind(&input.title)
            .bind(&input.drive_uri)
            .bind(&input.media_resource_snapshot)
            .bind(input.duration_seconds)
            .bind(&input.moderation_status)
            .bind(&input.now)
            .bind(&input.now)
            .execute(&mut *tx)
            .await?;
        }

        sqlx::query(
            r#"
            UPDATE music_ai_generation_task
            SET status = 'succeeded',
                moderation_status = ?,
                provider_output_count = MAX(provider_output_count, ?),
                completed_at = COALESCE(completed_at, ?),
                updated_at = ?
            WHERE tenant_id = ? AND id = ?
            "#,
        )
        .bind(&first.moderation_status)
        .bind(inputs.len() as i64)
        .bind(&first.now)
        .bind(&first.now)
        .bind(&first.tenant_id)
        .bind(&first.task_id)
        .execute(&mut *tx)
        .await?;

        tx.commit().await?;
        Ok(())
    }

    pub async fn create_release_channel(
        &self,
        input: NewMusicReleaseChannel,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_release_channel
                (id, tenant_id, release_id, channel_code, distribution_status, scheduled_at, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.release_id)
        .bind(input.channel_code)
        .bind(input.distribution_status)
        .bind(input.scheduled_at)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_rights_territory(
        &self,
        input: NewMusicRightsTerritory,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO music_rights_territory
                (id, tenant_id, rights_policy_id, region_code, availability, starts_at, ends_at, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.rights_policy_id)
        .bind(input.region_code)
        .bind(input.availability)
        .bind(input.starts_at)
        .bind(input.ends_at)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn list_published_tracks(
        &self,
        tenant_id: &str,
        q: Option<&str>,
    ) -> Result<Vec<MusicStoredTrack>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT t.id, t.tenant_id, t.artist_id, ar.name AS artist_name,
                   t.album_id, al.title AS album_title, t.audio_asset_id,
                   t.slug, t.title, t.duration_seconds, t.status,
                   t.published_at, t.updated_at
            FROM music_track t
            JOIN music_artist ar ON ar.id = t.artist_id
            LEFT JOIN music_album al ON al.id = t.album_id
            WHERE t.tenant_id = ?
              AND t.status = 'published'
            ORDER BY t.published_at DESC, t.title ASC
            "#,
        )
        .bind(tenant_id)
        .fetch_all(&self.pool)
        .await?;

        let mut tracks = Vec::with_capacity(rows.len());
        for row in rows {
            let mut track = self.track_from_row(row).await?;
            if let Some(query) = q {
                let normalized = query.trim().to_ascii_lowercase();
                if !normalized.is_empty()
                    && !track.title.to_ascii_lowercase().contains(&normalized)
                    && !track.artist_name.to_ascii_lowercase().contains(&normalized)
                    && !track.tags.iter().any(|tag| tag.contains(&normalized))
                {
                    continue;
                }
            }
            track.tags.sort();
            tracks.push(track);
        }
        Ok(tracks)
    }

    pub async fn retrieve_playlist(
        &self,
        tenant_id: &str,
        slug: &str,
    ) -> Result<Option<MusicStoredPlaylist>, sqlx::Error> {
        let row = sqlx::query(
            r#"
            SELECT id, tenant_id, slug, title, description
            FROM music_playlist
            WHERE tenant_id = ? AND slug = ?
            LIMIT 1
            "#,
        )
        .bind(tenant_id)
        .bind(slug)
        .fetch_optional(&self.pool)
        .await?;

        let Some(row) = row else {
            return Ok(None);
        };
        let playlist_id = string_cell(&row, "id");
        let track_rows = sqlx::query(
            r#"
            SELECT track_id
            FROM music_playlist_track
            WHERE playlist_id = ?
            ORDER BY position ASC
            "#,
        )
        .bind(&playlist_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(Some(MusicStoredPlaylist {
            id: playlist_id,
            tenant_id: string_cell(&row, "tenant_id"),
            slug: string_cell(&row, "slug"),
            title: string_cell(&row, "title"),
            description: optional_string_cell(&row, "description"),
            track_ids: track_rows
                .iter()
                .map(|track_row| string_cell(track_row, "track_id"))
                .collect(),
        }))
    }

    pub async fn list_comments(
        &self,
        tenant_id: &str,
        resource_type: &str,
        resource_id: &str,
    ) -> Result<Vec<MusicStoredComment>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, tenant_id, user_id, resource_type, resource_id, body, moderation_status, created_at
            FROM music_comment
            WHERE tenant_id = ?
              AND resource_type = ?
              AND resource_id = ?
              AND deleted_at IS NULL
            ORDER BY created_at DESC
            "#,
        )
        .bind(tenant_id)
        .bind(resource_type)
        .bind(resource_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| MusicStoredComment {
                id: string_cell(row, "id"),
                tenant_id: string_cell(row, "tenant_id"),
                user_id: string_cell(row, "user_id"),
                resource_type: string_cell(row, "resource_type"),
                resource_id: string_cell(row, "resource_id"),
                body: string_cell(row, "body"),
                moderation_status: string_cell(row, "moderation_status"),
                created_at: string_cell(row, "created_at"),
            })
            .collect())
    }

    pub async fn list_content_reports(
        &self,
        tenant_id: &str,
        status: Option<&str>,
    ) -> Result<Vec<MusicStoredContentReport>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, tenant_id, resource_type, resource_id, reason_code, status, created_at
            FROM music_content_report
            WHERE tenant_id = ?
              AND (? IS NULL OR status = ?)
            ORDER BY created_at DESC
            "#,
        )
        .bind(tenant_id)
        .bind(status)
        .bind(status)
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| MusicStoredContentReport {
                id: string_cell(row, "id"),
                tenant_id: string_cell(row, "tenant_id"),
                resource_type: string_cell(row, "resource_type"),
                resource_id: string_cell(row, "resource_id"),
                reason_code: string_cell(row, "reason_code"),
                status: string_cell(row, "status"),
                created_at: string_cell(row, "created_at"),
            })
            .collect())
    }

    pub async fn list_chart_entries(
        &self,
        tenant_id: &str,
        chart_id: &str,
    ) -> Result<Vec<MusicStoredChartEntry>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT e.id, e.tenant_id, e.chart_id, e.track_id, e.rank, e.score,
                   t.title AS track_title, ar.name AS artist_name
            FROM music_chart_entry e
            JOIN music_track t ON t.id = e.track_id
            JOIN music_artist ar ON ar.id = t.artist_id
            WHERE e.tenant_id = ? AND e.chart_id = ?
            ORDER BY e.rank ASC
            "#,
        )
        .bind(tenant_id)
        .bind(chart_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| MusicStoredChartEntry {
                id: string_cell(row, "id"),
                tenant_id: string_cell(row, "tenant_id"),
                chart_id: string_cell(row, "chart_id"),
                track_id: string_cell(row, "track_id"),
                track_title: string_cell(row, "track_title"),
                artist_name: string_cell(row, "artist_name"),
                rank: integer_cell(row, "rank"),
                score: integer_cell(row, "score"),
            })
            .collect())
    }

    pub async fn list_home_shelves(
        &self,
        tenant_id: &str,
    ) -> Result<Vec<MusicStoredRecommendationShelf>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, tenant_id, slug, title, shelf_type
            FROM music_recommendation_shelf
            WHERE tenant_id = ? AND status = 'active'
            ORDER BY updated_at DESC, title ASC
            "#,
        )
        .bind(tenant_id)
        .fetch_all(&self.pool)
        .await?;

        let mut shelves = Vec::with_capacity(rows.len());
        for row in rows {
            let shelf_id = string_cell(&row, "id");
            let item_rows = sqlx::query(
                r#"
                SELECT i.id, i.item_type, i.item_id, i.position, i.reason_code,
                       t.title AS track_title
                FROM music_recommendation_item i
                LEFT JOIN music_track t ON i.item_type = 'track' AND t.id = i.item_id
                WHERE i.tenant_id = ? AND i.shelf_id = ?
                ORDER BY i.position ASC
                "#,
            )
            .bind(tenant_id)
            .bind(&shelf_id)
            .fetch_all(&self.pool)
            .await?;
            shelves.push(MusicStoredRecommendationShelf {
                id: shelf_id,
                tenant_id: string_cell(&row, "tenant_id"),
                slug: string_cell(&row, "slug"),
                title: string_cell(&row, "title"),
                shelf_type: string_cell(&row, "shelf_type"),
                items: item_rows
                    .iter()
                    .map(|item_row| MusicStoredRecommendationItem {
                        id: string_cell(item_row, "id"),
                        item_type: string_cell(item_row, "item_type"),
                        item_id: string_cell(item_row, "item_id"),
                        position: integer_cell(item_row, "position"),
                        reason_code: optional_string_cell(item_row, "reason_code"),
                        track_title: optional_string_cell(item_row, "track_title"),
                    })
                    .collect(),
            });
        }
        Ok(shelves)
    }

    pub async fn list_library_items(
        &self,
        tenant_id: &str,
        user_id: &str,
    ) -> Result<Vec<MusicStoredLibraryItem>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, tenant_id, user_id, item_type, item_id, source, updated_at
            FROM music_user_library_item
            WHERE tenant_id = ? AND user_id = ?
            ORDER BY updated_at DESC
            "#,
        )
        .bind(tenant_id)
        .bind(user_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| MusicStoredLibraryItem {
                id: string_cell(row, "id"),
                tenant_id: string_cell(row, "tenant_id"),
                user_id: string_cell(row, "user_id"),
                item_type: string_cell(row, "item_type"),
                item_id: string_cell(row, "item_id"),
                source: string_cell(row, "source"),
                updated_at: string_cell(row, "updated_at"),
            })
            .collect())
    }

    pub async fn list_listening_history(
        &self,
        tenant_id: &str,
        user_id: &str,
    ) -> Result<Vec<MusicStoredListeningHistory>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT h.track_id, t.title AS track_title, COUNT(*) AS play_count,
                   MAX(h.occurred_at) AS last_played_at
            FROM music_listening_history h
            JOIN music_track t ON t.id = h.track_id
            WHERE h.tenant_id = ? AND h.user_id = ?
            GROUP BY h.track_id, t.title
            ORDER BY last_played_at DESC
            "#,
        )
        .bind(tenant_id)
        .bind(user_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| MusicStoredListeningHistory {
                track_id: string_cell(row, "track_id"),
                track_title: string_cell(row, "track_title"),
                play_count: integer_cell(row, "play_count"),
                last_played_at: string_cell(row, "last_played_at"),
            })
            .collect())
    }

    pub async fn list_ai_generation_tasks(
        &self,
        tenant_id: &str,
        user_id: Option<&str>,
    ) -> Result<Vec<MusicStoredAiGenerationTask>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT t.id, t.tenant_id, t.user_id, t.prompt, t.status, t.moderation_status,
                   t.provider_code, t.external_task_id, t.provider_output_count, t.updated_at,
                   COUNT(v.id) AS variant_count,
                   SUM(CASE WHEN v.moderation_status = 'approved' THEN 1 ELSE 0 END) AS approved_variant_count
            FROM music_ai_generation_task t
            LEFT JOIN music_ai_generation_variant v ON v.task_id = t.id
            WHERE t.tenant_id = ? AND (? IS NULL OR t.user_id = ?)
            GROUP BY t.id, t.tenant_id, t.user_id, t.prompt, t.status, t.moderation_status,
                     t.provider_code, t.external_task_id, t.provider_output_count, t.updated_at
            ORDER BY t.updated_at DESC
            "#,
        )
        .bind(tenant_id)
        .bind(user_id)
        .bind(user_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| MusicStoredAiGenerationTask {
                id: string_cell(row, "id"),
                tenant_id: string_cell(row, "tenant_id"),
                user_id: string_cell(row, "user_id"),
                prompt: string_cell(row, "prompt"),
                status: string_cell(row, "status"),
                moderation_status: string_cell(row, "moderation_status"),
                provider_code: optional_string_cell(row, "provider_code"),
                external_task_id: optional_string_cell(row, "external_task_id"),
                provider_output_count: integer_cell(row, "provider_output_count"),
                variant_count: integer_cell(row, "variant_count"),
                approved_variant_count: integer_cell(row, "approved_variant_count"),
                updated_at: string_cell(row, "updated_at"),
            })
            .collect())
    }

    pub async fn list_download_entitlements(
        &self,
        tenant_id: &str,
        user_id: &str,
    ) -> Result<Vec<MusicStoredDownloadEntitlement>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, track_id, audio_asset_id, quality, status, expires_at
            FROM music_download_entitlement
            WHERE tenant_id = ? AND user_id = ?
            ORDER BY updated_at DESC
            "#,
        )
        .bind(tenant_id)
        .bind(user_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| MusicStoredDownloadEntitlement {
                id: string_cell(row, "id"),
                track_id: string_cell(row, "track_id"),
                audio_asset_id: string_cell(row, "audio_asset_id"),
                quality: string_cell(row, "quality"),
                status: string_cell(row, "status"),
                expires_at: optional_string_cell(row, "expires_at"),
            })
            .collect())
    }

    pub async fn list_playback_sessions(
        &self,
        tenant_id: &str,
        user_id: &str,
    ) -> Result<Vec<MusicStoredPlaybackSession>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, user_id, device_id, current_track_id, position_ms, playback_state, updated_at
            FROM music_playback_session
            WHERE tenant_id = ? AND user_id = ?
            ORDER BY updated_at DESC
            "#,
        )
        .bind(tenant_id)
        .bind(user_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| MusicStoredPlaybackSession {
                id: string_cell(row, "id"),
                user_id: string_cell(row, "user_id"),
                device_id: string_cell(row, "device_id"),
                current_track_id: optional_string_cell(row, "current_track_id"),
                position_ms: integer_cell(row, "position_ms"),
                playback_state: string_cell(row, "playback_state"),
                updated_at: string_cell(row, "updated_at"),
            })
            .collect())
    }

    pub async fn list_search_suggestions(
        &self,
        tenant_id: &str,
        suggestion_type: &str,
    ) -> Result<Vec<MusicStoredSearchSuggestion>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, display_text, query_text, weight
            FROM music_search_suggestion
            WHERE tenant_id = ? AND suggestion_type = ? AND status = 'active'
            ORDER BY weight DESC, updated_at DESC
            "#,
        )
        .bind(tenant_id)
        .bind(suggestion_type)
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| MusicStoredSearchSuggestion {
                id: string_cell(row, "id"),
                display_text: string_cell(row, "display_text"),
                query_text: string_cell(row, "query_text"),
                weight: integer_cell(row, "weight"),
            })
            .collect())
    }

    pub async fn list_ai_style_presets(
        &self,
        tenant_id: &str,
    ) -> Result<Vec<MusicStoredAiStylePreset>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, slug, title, style_tags_json, prompt_hint
            FROM music_ai_style_preset
            WHERE tenant_id = ? AND status = 'active'
            ORDER BY updated_at DESC, title ASC
            "#,
        )
        .bind(tenant_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| MusicStoredAiStylePreset {
                id: string_cell(row, "id"),
                slug: string_cell(row, "slug"),
                title: string_cell(row, "title"),
                style_tags: parse_json_string_array(&string_cell(row, "style_tags_json")),
                prompt_hint: optional_string_cell(row, "prompt_hint"),
            })
            .collect())
    }

    pub async fn list_ai_prompt_templates(
        &self,
        tenant_id: &str,
    ) -> Result<Vec<MusicStoredAiPromptTemplate>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, slug, title, template_text
            FROM music_ai_prompt_template
            WHERE tenant_id = ? AND status = 'active'
            ORDER BY updated_at DESC, title ASC
            "#,
        )
        .bind(tenant_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| MusicStoredAiPromptTemplate {
                id: string_cell(row, "id"),
                slug: string_cell(row, "slug"),
                title: string_cell(row, "title"),
                template_text: string_cell(row, "template_text"),
            })
            .collect())
    }

    async fn track_from_row(
        &self,
        row: sqlx::sqlite::SqliteRow,
    ) -> Result<MusicStoredTrack, sqlx::Error> {
        let track_id = string_cell(&row, "id");
        let tags = self.track_tags(&track_id).await?;
        Ok(MusicStoredTrack {
            id: track_id,
            tenant_id: string_cell(&row, "tenant_id"),
            artist_id: string_cell(&row, "artist_id"),
            artist_name: string_cell(&row, "artist_name"),
            album_id: optional_string_cell(&row, "album_id"),
            album_title: optional_string_cell(&row, "album_title"),
            audio_asset_id: optional_string_cell(&row, "audio_asset_id"),
            slug: string_cell(&row, "slug"),
            title: string_cell(&row, "title"),
            duration_seconds: integer_cell(&row, "duration_seconds"),
            status: string_cell(&row, "status"),
            tags,
            published_at: optional_string_cell(&row, "published_at"),
            updated_at: string_cell(&row, "updated_at"),
        })
    }

    async fn track_tags(&self, track_id: &str) -> Result<Vec<String>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT tag
            FROM music_track_tag
            WHERE track_id = ?
            ORDER BY tag ASC
            "#,
        )
        .bind(track_id)
        .fetch_all(&self.pool)
        .await?;
        Ok(rows.iter().map(|row| string_cell(row, "tag")).collect())
    }
}

pub fn music_database_tables() -> Vec<&'static str> {
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
        "music_ai_generation_provider",
        "music_ai_generation_provider_model",
        "music_ai_generation_task",
        "music_ai_generation_provider_attempt",
        "music_ai_generation_provider_event",
        "music_ai_generation_variant",
        "music_ai_generation_credit_ledger",
        "music_ai_generation_notification",
        "music_moderation_signal",
        "music_release",
        "music_release_channel",
        "music_rights_territory",
        "music_play_event",
        "music_editorial_audit",
        "music_schema_version",
        "music_migration_lock",
    ]
}

pub fn music_database_indexes() -> Vec<&'static str> {
    vec![
        "idx_music_artist_tenant_slug",
        "idx_music_album_tenant_artist",
        "idx_music_audio_asset_tenant_status",
        "idx_music_track_tenant_status_updated",
        "idx_music_track_tenant_artist",
        "idx_music_track_tenant_album",
        "idx_music_track_tag_tag",
        "idx_music_lyric_track_language",
        "idx_music_lyric_line_position",
        "idx_music_rights_policy_tenant_status",
        "idx_music_playlist_tenant_slug",
        "idx_music_playlist_track_position",
        "idx_music_playlist_follow_user",
        "idx_music_playlist_collaborator_playlist",
        "idx_music_comment_resource_created",
        "idx_music_content_report_status_created",
        "idx_music_chart_tenant_status_updated",
        "idx_music_chart_entry_chart_rank",
        "idx_music_recommendation_shelf_tenant_status",
        "idx_music_recommendation_item_shelf_position",
        "idx_music_recommendation_feedback_user_created",
        "idx_music_user_library_user_updated",
        "idx_music_like_user_item",
        "idx_music_follow_user_target",
        "idx_music_listening_history_user_track",
        "idx_music_listening_history_track",
        "idx_music_download_entitlement_user_status",
        "idx_music_playback_session_user_status",
        "idx_music_search_index_query",
        "idx_music_search_suggestion_tenant_type",
        "idx_music_ai_generation_project_user_updated",
        "idx_music_ai_style_preset_tenant_status",
        "idx_music_ai_prompt_template_tenant_status",
        "idx_music_ai_generation_provider_tenant_status",
        "idx_music_ai_generation_provider_model_tenant_status",
        "idx_music_ai_generation_task_tenant_status_updated",
        "idx_music_ai_generation_task_user_updated",
        "idx_music_ai_generation_task_provider_external",
        "idx_music_ai_generation_provider_attempt_task",
        "idx_music_ai_generation_provider_event_task_created",
        "idx_music_ai_generation_notification_user_status",
        "idx_music_ai_generation_variant_task",
        "idx_music_ai_generation_credit_ledger_user_created",
        "idx_music_moderation_signal_resource",
        "idx_music_release_tenant_status_published",
        "idx_music_release_channel_release_status",
        "idx_music_rights_territory_policy_region",
        "idx_music_play_event_track",
        "idx_music_editorial_audit_resource",
    ]
}

pub fn music_migration_names() -> Vec<&'static str> {
    vec!["0001_music_foundation.sql"]
}

pub fn music_initial_migration_sql() -> &'static str {
    include_str!("../migrations/0001_music_foundation.sql")
}

pub fn music_migration_plan() -> Vec<MusicStorageMigration> {
    vec![migration(
        1,
        "0001_music_foundation.sql",
        "music",
        "migrations/0001_music_foundation.sql",
        music_initial_migration_sql(),
        music_database_tables(),
    )]
}

pub fn music_repository_bindings() -> Vec<MusicRepositoryBinding> {
    vec![
        binding("music", "music.artist.repository", vec!["music_artist"]),
        binding("music", "music.album.repository", vec!["music_album"]),
        binding(
            "music",
            "music.audio_asset.repository",
            vec!["music_audio_asset"],
        ),
        binding(
            "music",
            "music.track.repository",
            vec![
                "music_track",
                "music_track_tag",
                "music_lyric",
                "music_lyric_line",
                "music_rights_policy",
                "music_play_event",
            ],
        ),
        binding(
            "music",
            "music.playlist.repository",
            vec![
                "music_playlist",
                "music_playlist_track",
                "music_playlist_follow",
                "music_playlist_collaborator",
            ],
        ),
        binding(
            "music",
            "music.community.repository",
            vec!["music_comment", "music_content_report"],
        ),
        binding(
            "music",
            "music.chart.repository",
            vec!["music_chart", "music_chart_entry"],
        ),
        binding(
            "music",
            "music.recommendation.repository",
            vec![
                "music_recommendation_shelf",
                "music_recommendation_item",
                "music_recommendation_feedback",
            ],
        ),
        binding(
            "music",
            "music.user_engagement.repository",
            vec![
                "music_user_library_item",
                "music_like",
                "music_follow",
                "music_listening_history",
                "music_download_entitlement",
                "music_playback_session",
            ],
        ),
        binding(
            "music",
            "music.search.repository",
            vec!["music_search_index", "music_search_suggestion"],
        ),
        binding(
            "music",
            "music.ai_generation.repository",
            vec![
                "music_ai_generation_project",
                "music_ai_style_preset",
                "music_ai_prompt_template",
                "music_ai_generation_provider",
                "music_ai_generation_provider_model",
                "music_ai_generation_task",
                "music_ai_generation_provider_attempt",
                "music_ai_generation_provider_event",
                "music_ai_generation_variant",
                "music_ai_generation_credit_ledger",
                "music_ai_generation_notification",
            ],
        ),
        binding(
            "music",
            "music.moderation.repository",
            vec!["music_moderation_signal"],
        ),
        binding(
            "music",
            "music.release.repository",
            vec![
                "music_release",
                "music_release_channel",
                "music_rights_territory",
            ],
        ),
        binding("music", "music.audit.repository", vec!["music_editorial_audit"]),
    ]
}

pub fn music_storage_capability_manifest() -> MusicStorageCapabilityManifest {
    MusicStorageCapabilityManifest {
        name: "sdkwork-music-storage-sqlx",
        schema_version: "music.storage.v1",
        tables: music_database_tables(),
        indexes: music_database_indexes(),
        migrations: music_migration_names(),
        migration_plan: music_migration_plan(),
        repository_bindings: music_repository_bindings(),
    }
}

fn binding(
    domain: &'static str,
    repository_name: &'static str,
    tables: Vec<&'static str>,
) -> MusicRepositoryBinding {
    MusicRepositoryBinding {
        domain,
        repository_name,
        tables,
        requires_transaction: true,
    }
}

fn migration(
    sequence: u32,
    name: &'static str,
    domain: &'static str,
    source_path: &'static str,
    sql: &'static str,
    required_tables: Vec<&'static str>,
) -> MusicStorageMigration {
    MusicStorageMigration {
        sequence,
        name,
        domain,
        source_path,
        sql,
        checksum: migration_checksum(name, sql),
        required_tables,
    }
}

fn migration_checksum(name: &str, sql: &str) -> String {
    let mut hash = 0xcbf29ce484222325u64;
    for byte in name.bytes().chain(sql.bytes()) {
        hash ^= u64::from(byte);
        hash = hash.wrapping_mul(0x100000001b3);
    }
    format!("music-migration-checksum:{hash:016x}")
}

fn normalize_tag_slug(value: &str) -> String {
    value.trim().to_ascii_lowercase().replace(' ', "-")
}

fn bool_int(value: bool) -> i64 {
    if value { 1 } else { 0 }
}

fn require_archive_text(value: &str, field_name: &str) -> Result<String, DriveProductError> {
    let value = value.trim();
    if value.is_empty() {
        return Err(DriveProductError::Validation(format!(
            "{field_name} is required"
        )));
    }
    Ok(value.to_string())
}

fn require_archive_identifier(value: &str, field_name: &str) -> Result<String, DriveProductError> {
    let value = require_archive_text(value, field_name)?;
    if value.len() > 255
        || !value
            .chars()
            .all(|ch| ch.is_ascii_alphanumeric() || matches!(ch, '.' | '_' | ':' | '@' | '-'))
    {
        return Err(DriveProductError::Validation(format!(
            "{field_name} contains invalid characters"
        )));
    }
    Ok(value)
}

fn archive_actor(
    user_id: Option<&str>,
    anonymous_id: Option<&str>,
) -> Result<UploaderActor, DriveProductError> {
    if let Some(user_id) = user_id.map(str::trim).filter(|value| !value.is_empty()) {
        return Ok(UploaderActor::User {
            user_id: require_archive_identifier(user_id, "user_id")?,
        });
    }
    let anonymous_id = anonymous_id
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .unwrap_or("app:sdkwork-music:anonymous");
    Ok(UploaderActor::Anonymous {
        anonymous_id: require_archive_identifier(anonymous_id, "anonymous_id")?,
    })
}

fn archive_operator_id(actor: &UploaderActor) -> String {
    match actor {
        UploaderActor::Anonymous { anonymous_id } => anonymous_id.clone(),
        UploaderActor::User { user_id } => user_id.clone(),
        UploaderActor::System { operator_id } => operator_id.clone(),
    }
}

fn upload_profile_for_kind(kind: &str, content_type: &str) -> String {
    let normalized_kind = kind.trim().to_ascii_lowercase();
    match normalized_kind.as_str() {
        "image" | "video" | "audio" | "document" | "archive" | "text" => normalized_kind,
        "music" | "voice" => "audio".to_string(),
        _ if content_type.trim().to_ascii_lowercase().starts_with("image/") => "image".to_string(),
        _ if content_type.trim().to_ascii_lowercase().starts_with("video/") => "video".to_string(),
        _ if content_type.trim().to_ascii_lowercase().starts_with("audio/") => "audio".to_string(),
        _ => "generic".to_string(),
    }
}

fn artifact_fingerprint(
    artifact: &MusicGeneratedProviderArtifact,
    fallback_id: &str,
) -> Result<String, DriveProductError> {
    if let Some(checksum) = artifact
        .checksum_sha256_hex
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
    {
        validate_archive_sha256_checksum(checksum)?;
        return Ok(checksum.to_string());
    }
    Ok(format!("provider_asset:{fallback_id}"))
}

fn generated_artifact_checksum(
    artifact: &MusicGeneratedProviderArtifact,
    content: &[u8],
) -> Result<String, DriveProductError> {
    if let Some(checksum) = artifact
        .checksum_sha256_hex
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
    {
        validate_archive_sha256_checksum(checksum)?;
        return Ok(checksum.to_string());
    }
    Ok(sha256_hex(content))
}

fn sha256_hex(content: &[u8]) -> String {
    let digest = Sha256::digest(content);
    let mut output = String::with_capacity("sha256:".len() + 64);
    output.push_str("sha256:");
    for byte in digest {
        push_hex_byte(&mut output, byte);
    }
    output
}

fn push_hex_byte(output: &mut String, byte: u8) {
    const HEX: &[u8; 16] = b"0123456789abcdef";
    output.push(char::from(HEX[usize::from(byte >> 4)]));
    output.push(char::from(HEX[usize::from(byte & 0x0f)]));
}

fn validate_archive_sha256_checksum(value: &str) -> Result<(), DriveProductError> {
    let Some(hex) = value.strip_prefix("sha256:") else {
        return Err(DriveProductError::Validation(
            "checksum_sha256_hex must use sha256:<64 lowercase hex>".to_string(),
        ));
    };
    if hex.len() != 64 || !hex.bytes().all(|byte| byte.is_ascii_hexdigit()) {
        return Err(DriveProductError::Validation(
            "checksum_sha256_hex must use sha256:<64 lowercase hex>".to_string(),
        ));
    }
    Ok(())
}

#[allow(clippy::too_many_arguments)]
fn generated_artifact_snapshot(
    artifact: &MusicGeneratedProviderArtifact,
    upload_item: &sdkwork_drive_product::uploader::DriveUploadItem,
    drive_uri: &str,
    provider_code: &str,
    provider_model: &str,
    provider_task_id: Option<&str>,
    ordinal: usize,
    task_id: &str,
    stored_object: Option<&StoredMusicGeneratedArtifactObject>,
) -> Result<String, DriveProductError> {
    let kind = artifact.kind.trim().to_ascii_lowercase();
    let mut root = Map::new();
    root.insert("kind".to_string(), Value::String(kind));
    root.insert("source".to_string(), Value::String("drive".to_string()));
    root.insert("uri".to_string(), Value::String(drive_uri.to_string()));
    root.insert(
        "mimeType".to_string(),
        Value::String(artifact.content_type.trim().to_ascii_lowercase()),
    );
    root.insert(
        "sizeBytes".to_string(),
        Value::String(artifact.content_length.max(0).to_string()),
    );
    root.insert(
        "durationSeconds".to_string(),
        Value::Number(serde_json::Number::from(artifact.duration_seconds.max(0))),
    );

    let checksum = stored_object
        .map(|stored_object| stored_object.checksum_sha256_hex.as_str())
        .or_else(|| {
            artifact
                .checksum_sha256_hex
                .as_deref()
                .map(str::trim)
                .filter(|value| !value.is_empty())
        });
    if let Some(checksum) = checksum {
        validate_archive_sha256_checksum(checksum)?;
        let mut checksum_json = Map::new();
        checksum_json.insert("algorithm".to_string(), Value::String("sha256".to_string()));
        checksum_json.insert("value".to_string(), Value::String(checksum.to_string()));
        root.insert("checksum".to_string(), Value::Object(checksum_json));
    }

    let mut drive = Map::new();
    drive.insert("spaceType".to_string(), Value::String("ai_generated".to_string()));
    drive.insert("spaceId".to_string(), Value::String(upload_item.space_id.clone()));
    drive.insert("nodeId".to_string(), Value::String(upload_item.node_id.clone()));
    drive.insert("uri".to_string(), Value::String(drive_uri.to_string()));
    drive.insert("uploadItemId".to_string(), Value::String(upload_item.id.clone()));
    if let Some(upload_session_id) = &upload_item.upload_session_id {
        drive.insert(
            "uploadSessionId".to_string(),
            Value::String(upload_session_id.clone()),
        );
    }
    if let Some(storage_provider_id) = &upload_item.storage_provider_id {
        drive.insert(
            "storageProviderId".to_string(),
            Value::String(storage_provider_id.clone()),
        );
    }
    if let Some(storage_upload_id) = &upload_item.storage_upload_id {
        drive.insert(
            "storageUploadId".to_string(),
            Value::String(storage_upload_id.clone()),
        );
    }
    drive.insert(
        "uploadStatus".to_string(),
        Value::String(upload_item.status.clone()),
    );
    if let Some(stored_object) = stored_object {
        let mut object = Map::new();
        object.insert(
            "bucket".to_string(),
            Value::String(stored_object.bucket.clone()),
        );
        object.insert(
            "objectKey".to_string(),
            Value::String(stored_object.object_key.clone()),
        );
        object.insert("uploadStatus".to_string(), Value::String(upload_item.status.clone()));
        if let Some(etag) = &stored_object.etag {
            object.insert("etag".to_string(), Value::String(etag.clone()));
        }
        if let Some(version_id) = &stored_object.version_id {
            object.insert("versionId".to_string(), Value::String(version_id.clone()));
        }
        drive.insert("object".to_string(), Value::Object(object));
    } else if let (Some(bucket), Some(object_key)) =
        (upload_item.object_bucket.as_ref(), upload_item.object_key.as_ref())
    {
        let mut object = Map::new();
        object.insert("bucket".to_string(), Value::String(bucket.clone()));
        object.insert("objectKey".to_string(), Value::String(object_key.clone()));
        object.insert("uploadStatus".to_string(), Value::String("prepared".to_string()));
        drive.insert("object".to_string(), Value::Object(object));
    }
    root.insert("drive".to_string(), Value::Object(drive));

    let mut ai = Map::new();
    ai.insert("provenance".to_string(), Value::String("generated".to_string()));
    ai.insert("provider".to_string(), Value::String(provider_code.to_string()));
    ai.insert("model".to_string(), Value::String(provider_model.to_string()));
    ai.insert("taskId".to_string(), Value::String(task_id.to_string()));
    ai.insert(
        "artifactIndex".to_string(),
        Value::Number(serde_json::Number::from(ordinal as u64)),
    );
    if let Some(provider_task_id) = provider_task_id {
        ai.insert(
            "providerTaskId".to_string(),
            Value::String(provider_task_id.to_string()),
        );
    }
    if let Some(provider_asset_id) = artifact
        .provider_asset_id
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
    {
        ai.insert(
            "providerAssetId".to_string(),
            Value::String(provider_asset_id.to_string()),
        );
    }
    if let Some(provider_asset_url) = artifact
        .provider_asset_url
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
    {
        ai.insert(
            "providerAssetUrl".to_string(),
            Value::String(provider_asset_url.to_string()),
        );
    }
    root.insert("ai".to_string(), Value::Object(ai));

    if let Some(metadata) = parse_artifact_metadata(artifact.metadata_json.as_deref())? {
        root.insert("metadata".to_string(), metadata);
    }

    serde_json::to_string(&Value::Object(root)).map_err(|error| {
        DriveProductError::Internal(format!("serialize generated artifact snapshot failed: {error}"))
    })
}

fn parse_artifact_metadata(raw: Option<&str>) -> Result<Option<Value>, DriveProductError> {
    let Some(raw) = raw.map(str::trim).filter(|value| !value.is_empty()) else {
        return Ok(None);
    };
    let parsed: Value = serde_json::from_str(raw).map_err(|error| {
        DriveProductError::Validation(format!("metadata_json must be valid JSON: {error}"))
    })?;
    if parsed.is_object() {
        Ok(Some(parsed))
    } else {
        let mut wrapper = Map::new();
        wrapper.insert("providerPayload".to_string(), parsed);
        Ok(Some(Value::Object(wrapper)))
    }
}

fn drive_object_store_error(error: DriveObjectStoreError) -> DriveProductError {
    match error.kind {
        DriveObjectStoreErrorKind::NotFound => DriveProductError::NotFound(error.message),
        DriveObjectStoreErrorKind::Conflict => DriveProductError::Conflict(error.message),
        DriveObjectStoreErrorKind::PermissionDenied => {
            DriveProductError::PermissionDenied(error.message)
        }
        DriveObjectStoreErrorKind::InvalidRequest | DriveObjectStoreErrorKind::IntegrityFailed => {
            DriveProductError::Validation(error.message)
        }
        DriveObjectStoreErrorKind::RateLimited
        | DriveObjectStoreErrorKind::Timeout
        | DriveObjectStoreErrorKind::Unavailable
        | DriveObjectStoreErrorKind::UpstreamError
        | DriveObjectStoreErrorKind::NotSupported
        | DriveObjectStoreErrorKind::Internal => DriveProductError::Internal(error.message),
    }
}

fn normalize_task_status(
    current_status: &str,
    provider_status: &str,
    has_outputs: bool,
    invocation_mode: &str,
) -> String {
    let current = current_status.trim().to_ascii_lowercase();
    if matches!(
        current.as_str(),
        "succeeded" | "failed" | "cancelled" | "expired"
    ) {
        return current;
    }

    let provider = provider_status.trim().to_ascii_lowercase();
    match provider.as_str() {
        "queued" | "pending" | "submitted" | "created" | "in_queue" => "submitted".to_string(),
        "routing" | "dispatching" => "routing".to_string(),
        "running" | "processing" | "in_progress" | "generating" => "running".to_string(),
        "succeeded" | "success" | "completed" | "complete" | "ok" => {
            if has_outputs {
                "succeeded".to_string()
            } else if matches!(invocation_mode, "webhook" | "hybrid") {
                "waiting_webhook".to_string()
            } else {
                "running".to_string()
            }
        }
        "waiting_webhook" | "callback_pending" | "awaiting_callback" => "waiting_webhook".to_string(),
        "failed" | "failure" | "error" | "rejected" | "blocked" => "failed".to_string(),
        "cancelled" | "canceled" | "aborted" => "cancelled".to_string(),
        "expired" | "timeout" | "timed_out" | "data_removed" => "expired".to_string(),
        _ => current,
    }
}

async fn task_status_in_tx(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    tenant_id: &str,
    task_id: &str,
) -> Result<String, sqlx::Error> {
    let row = sqlx::query(
        r#"
        SELECT status
        FROM music_ai_generation_task
        WHERE tenant_id = ? AND id = ?
        "#,
    )
    .bind(tenant_id)
    .bind(task_id)
    .fetch_one(&mut **tx)
    .await?;

    Ok(string_cell(&row, "status"))
}

async fn task_invocation_mode_in_tx(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    tenant_id: &str,
    task_id: &str,
) -> Result<String, sqlx::Error> {
    let row = sqlx::query(
        r#"
        SELECT provider_invocation_mode
        FROM music_ai_generation_task
        WHERE tenant_id = ? AND id = ?
        "#,
    )
    .bind(tenant_id)
    .bind(task_id)
    .fetch_one(&mut **tx)
    .await?;

    Ok(string_cell(&row, "provider_invocation_mode"))
}

async fn task_user_id_in_tx(
    tx: &mut sqlx::Transaction<'_, sqlx::Sqlite>,
    tenant_id: &str,
    task_id: &str,
) -> Result<String, sqlx::Error> {
    let row = sqlx::query(
        r#"
        SELECT user_id
        FROM music_ai_generation_task
        WHERE tenant_id = ? AND id = ?
        "#,
    )
    .bind(tenant_id)
    .bind(task_id)
    .fetch_one(&mut **tx)
    .await?;

    Ok(string_cell(&row, "user_id"))
}

fn json_string_array(values: &[String]) -> String {
    let escaped = values
        .iter()
        .map(|value| format!("\"{}\"", json_escape(value)))
        .collect::<Vec<_>>();
    format!("[{}]", escaped.join(","))
}

fn json_escape(value: &str) -> String {
    value
        .chars()
        .flat_map(|character| match character {
            '\\' => "\\\\".chars().collect::<Vec<_>>(),
            '"' => "\\\"".chars().collect::<Vec<_>>(),
            '\n' => "\\n".chars().collect::<Vec<_>>(),
            '\r' => "\\r".chars().collect::<Vec<_>>(),
            '\t' => "\\t".chars().collect::<Vec<_>>(),
            other => vec![other],
        })
        .collect()
}

fn parse_json_string_array(value: &str) -> Vec<String> {
    let trimmed = value.trim();
    if trimmed.len() < 2 || !trimmed.starts_with('[') || !trimmed.ends_with(']') {
        return Vec::new();
    }
    let mut output = Vec::new();
    let mut current = String::new();
    let mut in_string = false;
    let mut escaped = false;
    for character in trimmed[1..trimmed.len() - 1].chars() {
        if escaped {
            current.push(match character {
                'n' => '\n',
                'r' => '\r',
                't' => '\t',
                other => other,
            });
            escaped = false;
            continue;
        }
        if character == '\\' && in_string {
            escaped = true;
            continue;
        }
        if character == '"' {
            if in_string {
                output.push(current.clone());
                current.clear();
            }
            in_string = !in_string;
            continue;
        }
        if in_string {
            current.push(character);
        }
    }
    output
}

fn optional_string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column).ok().flatten()
}

fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    optional_string_cell(row, column).unwrap_or_default()
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
    row.try_get::<i64, _>(column)
        .or_else(|_| row.try_get::<i32, _>(column).map(i64::from))
        .unwrap_or(0)
}
