use crate::{
    GenerateMusicInput, InMemoryMusicGenerationMcpTaskStore, McpToolError,
    MusicGenerationMcpTaskContext, MusicGenerationMcpTaskStore, MusicGenerationResult,
    MusicTaskInput,
};
use rmcp::{
    handler::server::{router::tool::ToolRouter, wrapper::Parameters},
    model::{
        CallToolResult, ErrorData, GetPromptRequestParams, GetPromptResult, Implementation,
        ListPromptsResult, ListResourcesResult, PaginatedRequestParams, ReadResourceRequestParams,
        ReadResourceResult, ServerCapabilities, ServerInfo, Tool,
    },
    service::RequestContext,
    tool, tool_handler, tool_router, Json, RoleServer, ServerHandler,
};
use sdkwork_music_generation_service::{
    MusicGenerationProviderDescriptor, MusicGenerationServicePort,
};
use std::sync::Arc;
#[derive(Clone)]
pub struct MusicGenerationMcpService {
    generation_service: Arc<dyn MusicGenerationServicePort>,
    task_store: Arc<dyn MusicGenerationMcpTaskStore>,
    tool_router: ToolRouter<Self>,
}
impl MusicGenerationMcpService {
    pub fn new(generation_service: Arc<dyn MusicGenerationServicePort>) -> Self {
        Self::with_task_store(
            generation_service,
            InMemoryMusicGenerationMcpTaskStore::shared_default(),
        )
    }
    pub fn with_task_store(
        generation_service: Arc<dyn MusicGenerationServicePort>,
        task_store: Arc<dyn MusicGenerationMcpTaskStore>,
    ) -> Self {
        Self {
            generation_service,
            task_store,
            tool_router: Self::tool_router(),
        }
    }
    pub fn tools(&self) -> Vec<Tool> {
        self.tool_router.list_all()
    }
    pub fn provider_descriptors(&self) -> Vec<MusicGenerationProviderDescriptor> {
        self.generation_service.provider_descriptors()
    }
    fn task_context(&self, handle: &str) -> Result<MusicGenerationMcpTaskContext, McpToolError> {
        let handle = handle.trim();
        if handle.is_empty() {
            return Err(McpToolError::invalid_request("taskHandle is required"));
        }
        self.task_store
            .load(handle)?
            .ok_or_else(|| McpToolError::task_not_found(handle))
    }
}
#[tool_router]
impl MusicGenerationMcpService {
    #[tool(
        name = "music.generate",
        description = "Generate music through the unified music generation service."
    )]
    async fn generate(
        &self,
        Parameters(input): Parameters<GenerateMusicInput>,
    ) -> Result<Json<MusicGenerationResult>, Json<McpToolError>> {
        let submission = self
            .generation_service
            .generate(input.try_into().map_err(Json)?)
            .await
            .map_err(|error| Json(error.into()))?;
        let task_handle = match submission.result.provider_task_id.as_deref() {
            Some(provider_task_id) => Some(
                self.task_store
                    .save(MusicGenerationMcpTaskContext {
                        dispatch_plan: submission.dispatch_plan.clone(),
                        provider_task_id: provider_task_id.into(),
                    })
                    .map_err(Json)?,
            ),
            None => None,
        };
        Ok(Json(MusicGenerationResult::from_submission(
            &submission,
            task_handle,
        )))
    }
    #[tool(
        name = "music.retrieve",
        description = "Retrieve a music generation task by the task handle returned from music.generate."
    )]
    async fn retrieve(
        &self,
        Parameters(input): Parameters<MusicTaskInput>,
    ) -> Result<Json<MusicGenerationResult>, Json<McpToolError>> {
        let context = self.task_context(&input.task_handle).map_err(Json)?;
        let result = self
            .generation_service
            .retrieve(&context.dispatch_plan, &context.provider_task_id)
            .await
            .map_err(|error| Json(error.into()))?;
        Ok(Json(MusicGenerationResult::from_normalized(
            &result,
            Some(input.task_handle),
        )))
    }
    #[tool(
        name = "music.cancel",
        description = "Cancel a music generation task by the task handle returned from music.generate."
    )]
    async fn cancel(
        &self,
        Parameters(input): Parameters<MusicTaskInput>,
    ) -> Result<Json<MusicGenerationResult>, Json<McpToolError>> {
        let context = self.task_context(&input.task_handle).map_err(Json)?;
        let result = self
            .generation_service
            .cancel(&context.dispatch_plan, &context.provider_task_id)
            .await
            .map_err(|error| Json(error.into()))?;
        Ok(Json(MusicGenerationResult::from_normalized(
            &result,
            Some(input.task_handle),
        )))
    }
    #[tool(
        name = "music.capabilities",
        description = "List registered music generation vendors and capabilities."
    )]
    async fn capabilities(&self) -> CallToolResult {
        CallToolResult::structured(crate::catalog::catalog(self.provider_descriptors()))
    }
}
#[tool_handler(router = self.tool_router)]
impl ServerHandler for MusicGenerationMcpService {
    fn get_info(&self) -> ServerInfo {
        ServerInfo::new(ServerCapabilities::builder().enable_tools().enable_resources().enable_prompts().build()).with_server_info(Implementation::new("sdkwork-music-generation-mcp-service", env!("CARGO_PKG_VERSION"))).with_instructions("Use provider-neutral music generation tools and inspect capability resources before setting vendor-specific parameters.")
    }
    async fn list_resources(
        &self,
        _: Option<PaginatedRequestParams>,
        _: RequestContext<RoleServer>,
    ) -> Result<ListResourcesResult, ErrorData> {
        Ok(crate::catalog::resources())
    }
    async fn read_resource(
        &self,
        request: ReadResourceRequestParams,
        _: RequestContext<RoleServer>,
    ) -> Result<ReadResourceResult, ErrorData> {
        crate::catalog::read(&request.uri, self.provider_descriptors())
            .map(|content| ReadResourceResult::new(vec![content]))
            .ok_or_else(|| ErrorData::resource_not_found("music MCP resource was not found", None))
    }
    async fn list_prompts(
        &self,
        _: Option<PaginatedRequestParams>,
        _: RequestContext<RoleServer>,
    ) -> Result<ListPromptsResult, ErrorData> {
        Ok(crate::catalog::prompts())
    }
    async fn get_prompt(
        &self,
        request: GetPromptRequestParams,
        _: RequestContext<RoleServer>,
    ) -> Result<GetPromptResult, ErrorData> {
        if request.name == crate::catalog::GENERATION_PROMPT {
            Ok(crate::catalog::prompt())
        } else {
            Err(ErrorData::invalid_params(
                "music MCP prompt was not found",
                None,
            ))
        }
    }
}
