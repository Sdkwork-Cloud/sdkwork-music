use crate::MusicGenerationProviderError;

#[derive(Clone, Debug, Eq, Hash, PartialEq, serde::Deserialize, serde::Serialize)]
#[serde(transparent)]
pub struct MusicVendorId(String);

impl MusicVendorId {
    pub fn new(value: impl Into<String>) -> Result<Self, MusicGenerationProviderError> {
        let value = value.into().trim().to_ascii_lowercase().replace('_', "-");
        if value.is_empty() {
            return Err(MusicGenerationProviderError::InvalidRequest(
                "vendor is required".to_string(),
            ));
        }
        if !value
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || byte == b'-')
        {
            return Err(MusicGenerationProviderError::InvalidRequest(
                "vendor must use lowercase letters, digits, or hyphens".to_string(),
            ));
        }
        Ok(Self(value))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl std::fmt::Display for MusicVendorId {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        formatter.write_str(self.as_str())
    }
}

#[derive(Clone, Debug, Eq, PartialEq, serde::Deserialize, serde::Serialize)]
pub struct MusicGenerationVendorParameters {
    pub schema: String,
    pub values: serde_json::Value,
}

#[derive(Clone, Debug, PartialEq)]
pub struct MusicGenerationCommand {
    pub vendor: MusicVendorId,
    pub model: String,
    pub prompt: String,
    pub title: Option<String>,
    pub tags: Option<String>,
    pub negative_tags: Option<String>,
    pub duration_seconds: Option<f64>,
    pub instrumental: Option<bool>,
    pub callback_url: Option<String>,
    pub idempotency_key: Option<String>,
    pub vendor_parameters: Option<MusicGenerationVendorParameters>,
}

impl MusicGenerationCommand {
    pub fn validate(&self) -> Result<(), MusicGenerationProviderError> {
        if self.model.trim().is_empty() {
            return Err(MusicGenerationProviderError::InvalidRequest(
                "model is required".to_string(),
            ));
        }
        if self.prompt.trim().is_empty() {
            return Err(MusicGenerationProviderError::InvalidRequest(
                "prompt is required".to_string(),
            ));
        }
        if self
            .duration_seconds
            .is_some_and(|duration| !duration.is_finite() || duration <= 0.0)
        {
            return Err(MusicGenerationProviderError::InvalidRequest(
                "duration_seconds must be greater than 0".to_string(),
            ));
        }
        Ok(())
    }
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum MusicProviderTaskMode {
    Task,
    Webhook,
}

#[derive(Clone, Debug, PartialEq)]
pub struct MusicProviderDispatchPlan {
    pub provider_id: String,
    pub vendor: MusicVendorId,
    pub model: String,
    pub task_mode: MusicProviderTaskMode,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum MusicGeneratedAssetKind {
    Music,
    CoverImage,
    Video,
}

#[derive(Clone, Debug, PartialEq)]
pub struct MusicGeneratedAsset {
    pub output_index: i32,
    pub kind: MusicGeneratedAssetKind,
    pub provider_asset_id: Option<String>,
    pub provider_url: String,
    pub title: Option<String>,
    pub mime_type: String,
    pub duration_seconds: Option<f64>,
    pub lyrics: Option<String>,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum MusicGenerationStatus {
    Submitted,
    Running,
    Succeeded,
    Failed,
    Cancelled,
    Expired,
}

#[derive(Clone, Debug, PartialEq)]
pub struct NormalizedMusicGenerationResult {
    pub vendor: String,
    pub provider_task_id: Option<String>,
    pub provider_status: Option<String>,
    pub status: MusicGenerationStatus,
    pub terminal: bool,
    pub outputs: Vec<MusicGeneratedAsset>,
    pub error_code: Option<String>,
    pub error_message: Option<String>,
}
