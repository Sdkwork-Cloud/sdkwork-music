//! SDKWork Music database pool bootstrap via `sdkwork-database`.

use sdkwork_database_config::DatabaseConfig;
use sdkwork_database_sqlx::{create_pool_from_config, DatabasePool, PoolError};

pub use sdkwork_music_database_host::{
    bootstrap_music_database, bootstrap_music_database_from_env, MusicDatabaseHost,
};

pub type MusicDatabasePool = DatabasePool;

pub async fn connect_music_database_pool_from_env() -> Result<MusicDatabasePool, PoolError> {
    let config = DatabaseConfig::from_env("MUSIC")?;
    create_pool_from_config(config).await
}

pub async fn connect_and_bootstrap_music_database_from_env() -> Result<MusicDatabaseHost, String> {
    let pool = connect_music_database_pool_from_env()
        .await
        .map_err(|error| error.to_string())?;
    bootstrap_music_database(pool).await
}
