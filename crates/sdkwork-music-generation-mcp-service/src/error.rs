use schemars::JsonSchema;
use sdkwork_music_generation_service::MusicGenerationProviderError;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, JsonSchema, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct McpToolError {
    pub code: String,
    pub message: String,
    pub retryable: bool,
}
impl McpToolError {
    pub(crate) fn invalid_request(message: impl Into<String>) -> Self {
        Self {
            code: "invalid_request".into(),
            message: message.into(),
            retryable: false,
        }
    }
    pub(crate) fn task_not_found(handle: &str) -> Self {
        Self {
            code: "task_not_found".into(),
            message: format!("music generation task handle was not found: {handle}"),
            retryable: false,
        }
    }
    pub(crate) fn store_unavailable() -> Self {
        Self {
            code: "task_store_unavailable".into(),
            message: "music MCP task store is unavailable".into(),
            retryable: true,
        }
    }
}
impl From<MusicGenerationProviderError> for McpToolError {
    fn from(error: MusicGenerationProviderError) -> Self {
        let code = match &error {
            MusicGenerationProviderError::InvalidRequest(_) => "invalid_request",
            MusicGenerationProviderError::UnsupportedVendor(_) => "unsupported_vendor",
            MusicGenerationProviderError::UnsupportedCapability(_) => "unsupported_capability",
            MusicGenerationProviderError::UnsupportedParameter(_) => "unsupported_parameter",
            MusicGenerationProviderError::ProviderNotConfigured(_) => "provider_not_configured",
            MusicGenerationProviderError::ProviderUnavailable(_) => "provider_unavailable",
            MusicGenerationProviderError::RateLimited(_) => "rate_limited",
            MusicGenerationProviderError::Rejected(_) => "rejected",
            MusicGenerationProviderError::Timeout(_) => "timeout",
            MusicGenerationProviderError::Transport(_) => "transport",
            MusicGenerationProviderError::InvalidProviderResponse(_) => "invalid_provider_response",
            MusicGenerationProviderError::Configuration(_) => "configuration",
        };
        Self {
            code: code.into(),
            message: error.to_string(),
            retryable: error.retryable(),
        }
    }
}
