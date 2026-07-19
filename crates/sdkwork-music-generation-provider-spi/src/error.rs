#[derive(Clone, Debug, Eq, PartialEq, thiserror::Error)]
pub enum MusicGenerationProviderError {
    #[error("music generation request is invalid: {0}")]
    InvalidRequest(String),
    #[error("music generation vendor is unsupported: {0}")]
    UnsupportedVendor(String),
    #[error("music generation capability is unsupported: {0}")]
    UnsupportedCapability(String),
    #[error("music generation parameter is unsupported: {0}")]
    UnsupportedParameter(String),
    #[error("music generation provider is not configured: {0}")]
    ProviderNotConfigured(String),
    #[error("music generation provider is unavailable: {0}")]
    ProviderUnavailable(String),
    #[error("music generation provider rate limited the request: {0}")]
    RateLimited(String),
    #[error("music generation provider rejected the request: {0}")]
    Rejected(String),
    #[error("music generation provider timed out: {0}")]
    Timeout(String),
    #[error("music generation provider transport failed: {0}")]
    Transport(String),
    #[error("music generation provider returned an invalid response: {0}")]
    InvalidProviderResponse(String),
    #[error("music generation provider configuration is invalid: {0}")]
    Configuration(String),
}

impl MusicGenerationProviderError {
    pub fn retryable(&self) -> bool {
        matches!(
            self,
            Self::ProviderUnavailable(_)
                | Self::RateLimited(_)
                | Self::Timeout(_)
                | Self::Transport(_)
        )
    }
}

pub type MusicGenerationProviderResult<T> = Result<T, MusicGenerationProviderError>;
