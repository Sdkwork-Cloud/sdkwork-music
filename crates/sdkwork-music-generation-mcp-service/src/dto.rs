use crate::McpToolError;
use rmcp::schemars::JsonSchema;
use sdkwork_music_generation_service::{
    MusicGeneratedAssetKind, MusicGenerationCommand, MusicGenerationStatus,
    MusicGenerationVendorParameters, MusicProviderSubmission, MusicVendorId,
    NormalizedMusicGenerationResult,
};
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Clone, Debug, Deserialize, JsonSchema, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct VendorParametersInput {
    pub schema: String,
    pub values: Value,
}
#[derive(Clone, Debug, Deserialize, JsonSchema, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GenerateMusicInput {
    pub vendor: String,
    pub model: String,
    pub prompt: String,
    #[serde(default)]
    pub title: Option<String>,
    #[serde(default)]
    pub tags: Option<String>,
    #[serde(default)]
    pub negative_tags: Option<String>,
    #[serde(default)]
    pub duration_seconds: Option<f64>,
    #[serde(default)]
    pub instrumental: Option<bool>,
    #[serde(default)]
    pub callback_url: Option<String>,
    #[serde(default)]
    pub idempotency_key: Option<String>,
    #[serde(default)]
    pub vendor_parameters: Option<VendorParametersInput>,
}
#[derive(Clone, Debug, Deserialize, JsonSchema, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MusicTaskInput {
    pub task_handle: String,
}
#[derive(Clone, Debug, JsonSchema, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MusicGenerationResult {
    pub vendor: String,
    pub task_handle: Option<String>,
    pub status: String,
    pub terminal: bool,
    pub outputs: Vec<MusicOutput>,
    pub error_code: Option<String>,
    pub error_message: Option<String>,
}
#[derive(Clone, Debug, JsonSchema, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MusicOutput {
    pub output_index: i32,
    pub kind: String,
    pub url: String,
    pub title: Option<String>,
    pub mime_type: String,
    pub duration_seconds: Option<f64>,
    pub lyrics: Option<String>,
}

impl TryFrom<GenerateMusicInput> for MusicGenerationCommand {
    type Error = McpToolError;
    fn try_from(input: GenerateMusicInput) -> Result<Self, Self::Error> {
        Ok(Self {
            vendor: MusicVendorId::new(input.vendor).map_err(McpToolError::from)?,
            model: input.model,
            prompt: input.prompt,
            title: input.title,
            tags: input.tags,
            negative_tags: input.negative_tags,
            duration_seconds: input.duration_seconds,
            instrumental: input.instrumental,
            callback_url: input.callback_url,
            idempotency_key: input.idempotency_key,
            vendor_parameters: input.vendor_parameters.map(|parameters| {
                MusicGenerationVendorParameters {
                    schema: parameters.schema,
                    values: parameters.values,
                }
            }),
        })
    }
}
impl MusicGenerationResult {
    pub(crate) fn from_submission(
        submission: &MusicProviderSubmission,
        task_handle: Option<String>,
    ) -> Self {
        Self::from_normalized(&submission.result, task_handle)
    }
    pub(crate) fn from_normalized(
        result: &NormalizedMusicGenerationResult,
        task_handle: Option<String>,
    ) -> Self {
        Self {
            vendor: result.vendor.clone(),
            task_handle,
            status: status_name(result.status).into(),
            terminal: result.terminal,
            outputs: result
                .outputs
                .iter()
                .map(|output| MusicOutput {
                    output_index: output.output_index,
                    kind: asset_kind(output.kind).into(),
                    url: output.provider_url.clone(),
                    title: output.title.clone(),
                    mime_type: output.mime_type.clone(),
                    duration_seconds: output.duration_seconds,
                    lyrics: output.lyrics.clone(),
                })
                .collect(),
            error_code: result.error_code.clone(),
            error_message: result.error_message.clone(),
        }
    }
}
fn status_name(status: MusicGenerationStatus) -> &'static str {
    match status {
        MusicGenerationStatus::Submitted => "submitted",
        MusicGenerationStatus::Running => "running",
        MusicGenerationStatus::Succeeded => "succeeded",
        MusicGenerationStatus::Failed => "failed",
        MusicGenerationStatus::Cancelled => "cancelled",
        MusicGenerationStatus::Expired => "expired",
    }
}
fn asset_kind(kind: MusicGeneratedAssetKind) -> &'static str {
    match kind {
        MusicGeneratedAssetKind::Music => "music",
        MusicGeneratedAssetKind::CoverImage => "cover-image",
        MusicGeneratedAssetKind::Video => "video",
    }
}
