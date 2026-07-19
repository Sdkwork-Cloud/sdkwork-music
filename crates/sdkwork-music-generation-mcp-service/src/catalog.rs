use rmcp::model::{
    GetPromptResult, ListPromptsResult, ListResourcesResult, Prompt, PromptMessage, Resource,
    ResourceContents, Role,
};
use sdkwork_music_generation_service::{
    MusicGenerationProviderCapability, MusicGenerationProviderDescriptor,
};
pub(crate) const CAPABILITIES_URI: &str = "sdkwork://music/generation/capabilities";
pub(crate) const VENDORS_URI: &str = "sdkwork://music/generation/vendors";
pub(crate) const GENERATION_PROMPT: &str = "music.generation.request";
pub(crate) fn resources() -> ListResourcesResult {
    ListResourcesResult::with_all_items(vec![
        Resource::new(CAPABILITIES_URI, "music-generation-capabilities")
            .with_title("Music generation capabilities")
            .with_mime_type("application/json"),
        Resource::new(VENDORS_URI, "music-generation-vendors")
            .with_title("Music generation vendors")
            .with_mime_type("application/json"),
    ])
}
pub(crate) fn catalog(descriptors: Vec<MusicGenerationProviderDescriptor>) -> serde_json::Value {
    let providers = descriptors.into_iter().map(|descriptor| serde_json::json!({"vendors":descriptor.vendors.into_iter().map(|vendor|vendor.to_string()).collect::<Vec<_>>(),"capabilities":descriptor.capabilities.into_iter().map(capability_name).collect::<Vec<_>>() })).collect::<Vec<_>>();
    serde_json::json!({"domain":"music","tools":["music.generate","music.retrieve","music.cancel","music.capabilities"],"transports":["stdio","streamable-http-sse"],"providers":providers})
}
pub(crate) fn read(
    uri: &str,
    descriptors: Vec<MusicGenerationProviderDescriptor>,
) -> Option<ResourceContents> {
    let catalog = catalog(descriptors);
    let value = match uri {
        CAPABILITIES_URI => catalog,
        VENDORS_URI => catalog.get("providers")?.clone(),
        _ => return None,
    };
    Some(
        ResourceContents::text(serde_json::to_string_pretty(&value).ok()?, uri)
            .with_mime_type("application/json"),
    )
}
pub(crate) fn prompts() -> ListPromptsResult {
    ListPromptsResult::with_all_items(vec![Prompt::new(
        GENERATION_PROMPT,
        Some("Prepare a provider-neutral music generation request for music.generate."),
        None,
    )])
}
pub(crate) fn prompt() -> GetPromptResult {
    GetPromptResult::new(vec![PromptMessage::new_text(Role::User, "Create a music generation request. Inspect sdkwork://music/generation/vendors, choose model and duration supported by the vendor, keep provider-only fields inside vendorParameters with its schema identifier, and invoke music.generate.")]).with_description("Provider-neutral music generation request workflow")
}
fn capability_name(capability: MusicGenerationProviderCapability) -> &'static str {
    match capability {
        MusicGenerationProviderCapability::TextToMusic => "text-to-music",
        MusicGenerationProviderCapability::MultipleTracks => "multiple-tracks",
        MusicGenerationProviderCapability::Lyrics => "lyrics",
        MusicGenerationProviderCapability::Polling => "polling",
        MusicGenerationProviderCapability::Webhook => "webhook",
        MusicGenerationProviderCapability::Cancellation => "cancellation",
    }
}
