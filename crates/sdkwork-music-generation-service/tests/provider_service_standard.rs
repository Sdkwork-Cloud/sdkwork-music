use std::sync::Arc;

use sdkwork_music_generation_service::{
    MusicGeneratedAsset, MusicGeneratedAssetKind, MusicGenerationCommand, MusicGenerationProvider,
    MusicGenerationProviderDescriptor, MusicGenerationProviderRegistry,
    MusicGenerationProviderResult, MusicGenerationService, MusicGenerationServicePort,
    MusicGenerationStatus, MusicProviderDispatchPlan, MusicProviderSubmission,
    MusicProviderTaskMode, MusicVendorId, NormalizedMusicGenerationResult,
};

struct FakeProvider {
    descriptor: MusicGenerationProviderDescriptor,
}

#[async_trait::async_trait]
impl MusicGenerationProvider for FakeProvider {
    fn descriptor(&self) -> &MusicGenerationProviderDescriptor {
        &self.descriptor
    }
    fn validate(&self, command: &MusicGenerationCommand) -> MusicGenerationProviderResult<()> {
        command.validate()
    }
    async fn generate(
        &self,
        command: &MusicGenerationCommand,
    ) -> MusicGenerationProviderResult<MusicProviderSubmission> {
        Ok(MusicProviderSubmission {
            dispatch_plan: MusicProviderDispatchPlan {
                provider_id: self.descriptor.id.clone(),
                vendor: command.vendor.clone(),
                model: command.model.clone(),
                task_mode: MusicProviderTaskMode::Task,
            },
            result: submitted(command.vendor.as_str(), "music-task-1"),
        })
    }
    async fn retrieve(
        &self,
        plan: &MusicProviderDispatchPlan,
        provider_task_id: &str,
    ) -> MusicGenerationProviderResult<NormalizedMusicGenerationResult> {
        let mut result = submitted(plan.vendor.as_str(), provider_task_id);
        result.status = MusicGenerationStatus::Succeeded;
        result.terminal = true;
        result.outputs.push(MusicGeneratedAsset {
            output_index: 0,
            kind: MusicGeneratedAssetKind::Music,
            provider_asset_id: Some("track-1".to_string()),
            provider_url: "https://provider.example/track.mp3".to_string(),
            title: Some("Track".to_string()),
            mime_type: "audio/mpeg".to_string(),
            duration_seconds: Some(30.0),
            lyrics: None,
        });
        Ok(result)
    }
}

#[tokio::test]
async fn unified_music_service_routes_generate_and_retrieve_through_spi() {
    let provider = Arc::new(FakeProvider {
        descriptor: MusicGenerationProviderDescriptor {
            id: "fake-music-provider".to_string(),
            vendors: vec![MusicVendorId::new("suno").expect("vendor")],
            capabilities: Vec::new(),
        },
    });
    let registry = MusicGenerationProviderRegistry::builder()
        .register(provider)
        .expect("provider")
        .default_provider("fake-music-provider")
        .build()
        .expect("registry");
    let service = MusicGenerationService::new(registry);
    let submission = service
        .generate(MusicGenerationCommand {
            vendor: MusicVendorId::new("suno").expect("vendor"),
            model: "suno-v5".to_string(),
            prompt: "Anthem".to_string(),
            title: None,
            tags: None,
            negative_tags: None,
            duration_seconds: Some(30.0),
            instrumental: None,
            callback_url: None,
            idempotency_key: None,
            vendor_parameters: None,
        })
        .await
        .expect("submission");
    assert_eq!(submission.dispatch_plan.provider_id, "fake-music-provider");
    let result = service
        .retrieve(&submission.dispatch_plan, "music-task-1")
        .await
        .expect("result");
    assert_eq!(result.outputs.len(), 1);
}

fn submitted(vendor: &str, task_id: &str) -> NormalizedMusicGenerationResult {
    NormalizedMusicGenerationResult {
        vendor: vendor.to_string(),
        provider_task_id: Some(task_id.to_string()),
        provider_status: Some("submitted".to_string()),
        status: MusicGenerationStatus::Submitted,
        terminal: false,
        outputs: Vec::new(),
        error_code: None,
        error_message: None,
    }
}
