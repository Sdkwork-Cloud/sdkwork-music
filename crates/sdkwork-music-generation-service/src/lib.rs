//! Unified application service for music generation providers.

mod service;

pub use sdkwork_music_generation_provider_spi::*;
pub use service::{MusicGenerationService, MusicGenerationServicePort};
