use crate::MusicGenerationMcpService;
use rmcp::{
    service::{RunningService, ServerInitializeError},
    transport::streamable_http_server::{
        session::local::LocalSessionManager, StreamableHttpServerConfig, StreamableHttpService,
    },
    RoleServer, ServiceExt,
};
use std::sync::Arc;
pub type MusicGenerationMcpHttpService =
    StreamableHttpService<MusicGenerationMcpService, LocalSessionManager>;
pub fn streamable_http_service(
    service: MusicGenerationMcpService,
    config: StreamableHttpServerConfig,
) -> MusicGenerationMcpHttpService {
    StreamableHttpService::new(
        move || Ok(service.clone()),
        Arc::new(LocalSessionManager::default()),
        config,
    )
}
pub async fn serve_stdio(
    service: MusicGenerationMcpService,
) -> Result<RunningService<RoleServer, MusicGenerationMcpService>, ServerInitializeError> {
    service.serve(rmcp::transport::stdio()).await
}
