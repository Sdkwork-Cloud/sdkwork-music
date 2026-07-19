use crate::McpToolError;
use sdkwork_music_generation_service::MusicProviderDispatchPlan;
use std::{
    collections::{HashMap, VecDeque},
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc, Mutex,
    },
};
#[derive(Clone, Debug)]
pub struct MusicGenerationMcpTaskContext {
    pub dispatch_plan: MusicProviderDispatchPlan,
    pub provider_task_id: String,
}
pub trait MusicGenerationMcpTaskStore: Send + Sync {
    fn save(&self, context: MusicGenerationMcpTaskContext) -> Result<String, McpToolError>;
    fn load(&self, handle: &str) -> Result<Option<MusicGenerationMcpTaskContext>, McpToolError>;
}
pub struct InMemoryMusicGenerationMcpTaskStore {
    capacity: usize,
    sequence: AtomicU64,
    state: Mutex<TaskStoreState>,
}
#[derive(Default)]
struct TaskStoreState {
    order: VecDeque<String>,
    contexts: HashMap<String, MusicGenerationMcpTaskContext>,
}
impl InMemoryMusicGenerationMcpTaskStore {
    pub const DEFAULT_CAPACITY: usize = 2_048;
    pub fn new(capacity: usize) -> Result<Self, McpToolError> {
        if capacity == 0 {
            return Err(McpToolError::invalid_request(
                "music MCP task store capacity must be greater than zero",
            ));
        }
        Ok(Self {
            capacity,
            sequence: AtomicU64::new(1),
            state: Mutex::new(TaskStoreState::default()),
        })
    }
    pub fn shared_default() -> Arc<dyn MusicGenerationMcpTaskStore> {
        Arc::new(Self::new(Self::DEFAULT_CAPACITY).expect("valid music MCP task store capacity"))
    }
}
impl MusicGenerationMcpTaskStore for InMemoryMusicGenerationMcpTaskStore {
    fn save(&self, context: MusicGenerationMcpTaskContext) -> Result<String, McpToolError> {
        let handle = format!(
            "music-task-{}",
            self.sequence.fetch_add(1, Ordering::Relaxed)
        );
        let mut state = self
            .state
            .lock()
            .map_err(|_| McpToolError::store_unavailable())?;
        while state.contexts.len() >= self.capacity {
            if let Some(expired) = state.order.pop_front() {
                state.contexts.remove(&expired);
            }
        }
        state.order.push_back(handle.clone());
        state.contexts.insert(handle.clone(), context);
        Ok(handle)
    }
    fn load(&self, handle: &str) -> Result<Option<MusicGenerationMcpTaskContext>, McpToolError> {
        Ok(self
            .state
            .lock()
            .map_err(|_| McpToolError::store_unavailable())?
            .contexts
            .get(handle.trim())
            .cloned())
    }
}
