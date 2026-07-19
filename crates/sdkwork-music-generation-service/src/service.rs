use std::sync::Arc;

use async_trait::async_trait;
use sdkwork_music_generation_provider_spi::{
    MusicGenerationCommand, MusicGenerationProviderDescriptor, MusicGenerationProviderError,
    MusicGenerationProviderRegistry, MusicGenerationProviderResult, MusicProviderDispatchPlan,
    MusicProviderSubmission, NormalizedMusicGenerationResult,
};

#[async_trait]
pub trait MusicGenerationServicePort: Send + Sync {
    async fn generate(
        &self,
        command: MusicGenerationCommand,
    ) -> MusicGenerationProviderResult<MusicProviderSubmission>;
    async fn retrieve(
        &self,
        dispatch_plan: &MusicProviderDispatchPlan,
        provider_task_id: &str,
    ) -> MusicGenerationProviderResult<NormalizedMusicGenerationResult>;
    async fn cancel(
        &self,
        dispatch_plan: &MusicProviderDispatchPlan,
        provider_task_id: &str,
    ) -> MusicGenerationProviderResult<NormalizedMusicGenerationResult>;
    fn provider_descriptors(&self) -> Vec<MusicGenerationProviderDescriptor>;
}

#[derive(Clone)]
pub struct MusicGenerationService {
    providers: Arc<MusicGenerationProviderRegistry>,
}

impl MusicGenerationService {
    pub fn new(providers: MusicGenerationProviderRegistry) -> Self {
        Self {
            providers: Arc::new(providers),
        }
    }

    fn provider_for_dispatch(
        &self,
        plan: &MusicProviderDispatchPlan,
    ) -> MusicGenerationProviderResult<
        Arc<dyn sdkwork_music_generation_provider_spi::MusicGenerationProvider>,
    > {
        if !plan.provider_id.trim().is_empty() {
            return self.providers.select_by_id(&plan.provider_id);
        }
        self.providers.select_for_vendor(&plan.vendor)
    }
}

#[async_trait]
impl MusicGenerationServicePort for MusicGenerationService {
    async fn generate(
        &self,
        command: MusicGenerationCommand,
    ) -> MusicGenerationProviderResult<MusicProviderSubmission> {
        let provider = self.providers.select_for_vendor(&command.vendor)?;
        provider.validate(&command)?;
        provider.generate(&command).await
    }
    async fn retrieve(
        &self,
        dispatch_plan: &MusicProviderDispatchPlan,
        provider_task_id: &str,
    ) -> MusicGenerationProviderResult<NormalizedMusicGenerationResult> {
        if provider_task_id.trim().is_empty() {
            return Err(MusicGenerationProviderError::InvalidRequest(
                "provider_task_id is required".to_string(),
            ));
        }
        self.provider_for_dispatch(dispatch_plan)?
            .retrieve(dispatch_plan, provider_task_id.trim())
            .await
    }
    async fn cancel(
        &self,
        dispatch_plan: &MusicProviderDispatchPlan,
        provider_task_id: &str,
    ) -> MusicGenerationProviderResult<NormalizedMusicGenerationResult> {
        if provider_task_id.trim().is_empty() {
            return Err(MusicGenerationProviderError::InvalidRequest(
                "provider_task_id is required".to_string(),
            ));
        }
        self.provider_for_dispatch(dispatch_plan)?
            .cancel(dispatch_plan, provider_task_id.trim())
            .await
    }
    fn provider_descriptors(&self) -> Vec<MusicGenerationProviderDescriptor> {
        self.providers.descriptors()
    }
}
