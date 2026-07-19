//! L4 generated-SDK adapter for music generation.

mod adapter;
mod normalization;
mod requests;
mod routing;

pub use adapter::MusicGenerationProviderAdapter;
pub use requests::build_music_generation_request;
pub use routing::{resolve_music_sdk_route, MusicSdkRoute, MUSIC_GENERATION_PROVIDER_ADAPTER_ID};
