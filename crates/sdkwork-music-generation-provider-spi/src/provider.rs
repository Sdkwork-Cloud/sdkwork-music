use async_trait::async_trait;

use crate::{
    MusicGenerationCommand, MusicGenerationProviderError, MusicGenerationProviderResult,
    MusicProviderDispatchPlan, MusicVendorId, NormalizedMusicGenerationResult,
};

#[derive(Clone, Copy, Debug, Eq, Hash, PartialEq)]
pub enum MusicGenerationProviderCapability {
    TextToMusic,
    MultipleTracks,
    Lyrics,
    Polling,
    Webhook,
    Cancellation,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MusicGenerationProviderDescriptor {
    pub id: String,
    pub vendors: Vec<MusicVendorId>,
    pub capabilities: Vec<MusicGenerationProviderCapability>,
}

impl MusicGenerationProviderDescriptor {
    pub fn supports_vendor(&self, vendor: &MusicVendorId) -> bool {
        self.vendors.iter().any(|candidate| candidate == vendor)
    }
}

#[derive(Clone, Debug, PartialEq)]
pub struct MusicProviderSubmission {
    pub dispatch_plan: MusicProviderDispatchPlan,
    pub result: NormalizedMusicGenerationResult,
}

#[async_trait]
pub trait MusicGenerationProvider: Send + Sync {
    fn descriptor(&self) -> &MusicGenerationProviderDescriptor;
    fn validate(&self, command: &MusicGenerationCommand) -> MusicGenerationProviderResult<()>;
    async fn generate(
        &self,
        command: &MusicGenerationCommand,
    ) -> MusicGenerationProviderResult<MusicProviderSubmission>;
    async fn retrieve(
        &self,
        dispatch_plan: &MusicProviderDispatchPlan,
        provider_task_id: &str,
    ) -> MusicGenerationProviderResult<NormalizedMusicGenerationResult>;
    async fn cancel(
        &self,
        _dispatch_plan: &MusicProviderDispatchPlan,
        _provider_task_id: &str,
    ) -> MusicGenerationProviderResult<NormalizedMusicGenerationResult> {
        Err(MusicGenerationProviderError::UnsupportedCapability(
            "cancellation".to_string(),
        ))
    }
}
