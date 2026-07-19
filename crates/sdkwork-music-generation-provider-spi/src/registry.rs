use std::collections::BTreeMap;
use std::sync::Arc;

use crate::{
    MusicGenerationProvider, MusicGenerationProviderError, MusicGenerationProviderResult,
    MusicVendorId,
};

#[derive(Clone, Default)]
pub struct MusicGenerationProviderRegistry {
    providers: BTreeMap<String, Arc<dyn MusicGenerationProvider>>,
    default_provider_id: Option<String>,
}

impl MusicGenerationProviderRegistry {
    pub fn builder() -> MusicGenerationProviderRegistryBuilder {
        MusicGenerationProviderRegistryBuilder::default()
    }
    pub fn select_for_vendor(
        &self,
        vendor: &MusicVendorId,
    ) -> MusicGenerationProviderResult<Arc<dyn MusicGenerationProvider>> {
        if let Some(provider) = self
            .default_provider_id
            .as_deref()
            .and_then(|id| self.providers.get(id))
            .filter(|provider| provider.descriptor().supports_vendor(vendor))
        {
            return Ok(provider.clone());
        }
        self.providers
            .values()
            .find(|provider| provider.descriptor().supports_vendor(vendor))
            .cloned()
            .ok_or_else(|| MusicGenerationProviderError::UnsupportedVendor(vendor.to_string()))
    }
    pub fn select_by_id(
        &self,
        provider_id: &str,
    ) -> MusicGenerationProviderResult<Arc<dyn MusicGenerationProvider>> {
        self.providers.get(provider_id).cloned().ok_or_else(|| {
            MusicGenerationProviderError::ProviderNotConfigured(provider_id.to_string())
        })
    }
    pub fn descriptors(&self) -> Vec<crate::MusicGenerationProviderDescriptor> {
        self.providers
            .values()
            .map(|provider| provider.descriptor().clone())
            .collect()
    }
}

#[derive(Default)]
pub struct MusicGenerationProviderRegistryBuilder {
    providers: BTreeMap<String, Arc<dyn MusicGenerationProvider>>,
    default_provider_id: Option<String>,
}

impl MusicGenerationProviderRegistryBuilder {
    pub fn register(
        mut self,
        provider: Arc<dyn MusicGenerationProvider>,
    ) -> MusicGenerationProviderResult<Self> {
        let id = provider.descriptor().id.trim().to_string();
        if id.is_empty() {
            return Err(MusicGenerationProviderError::Configuration(
                "provider id is required".to_string(),
            ));
        }
        if self.providers.insert(id.clone(), provider).is_some() {
            return Err(MusicGenerationProviderError::Configuration(format!(
                "duplicate provider id: {id}"
            )));
        }
        Ok(self)
    }
    pub fn default_provider(mut self, provider_id: impl Into<String>) -> Self {
        self.default_provider_id = Some(provider_id.into());
        self
    }
    pub fn build(self) -> MusicGenerationProviderResult<MusicGenerationProviderRegistry> {
        if let Some(id) = self.default_provider_id.as_deref() {
            if !self.providers.contains_key(id) {
                return Err(MusicGenerationProviderError::Configuration(format!(
                    "default provider is not registered: {id}"
                )));
            }
        }
        Ok(MusicGenerationProviderRegistry {
            providers: self.providers,
            default_provider_id: self.default_provider_id,
        })
    }
}
