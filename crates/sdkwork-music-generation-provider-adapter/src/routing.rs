pub const MUSIC_GENERATION_PROVIDER_ADAPTER_ID: &str = "sdkwork-music-generation-provider-adapter";

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct MusicSdkRoute {
    pub create_resource: &'static str,
    pub create_method: &'static str,
    pub retrieve_resource: &'static str,
    pub retrieve_method: &'static str,
}

pub fn resolve_music_sdk_route() -> MusicSdkRoute {
    MusicSdkRoute {
        create_resource: "audio_suno",
        create_method: "create_v1_music_generation",
        retrieve_resource: "audio_suno",
        retrieve_method: "list_v1_music_generations",
    }
}
