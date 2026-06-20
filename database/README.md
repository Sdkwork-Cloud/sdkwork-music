# MUSIC Database Module

Canonical lifecycle assets for `sdkwork-music` per `DATABASE_FRAMEWORK_SPEC.md`.

- moduleId: `music`
- serviceCode: `MUSIC`
- tablePrefix: `music_`

## Commands

```bash
pnpm run db:materialize:contract
pnpm run db:validate
```

Legacy SQL: `crates/sdkwork-music-storage-sqlx-rust/migrations/0001_music_foundation.sql` → `database/ddl/baseline/postgres/0001_music_legacy_baseline.sql`

Runtime bootstrap: `sdkwork-music-database-host` / `connect_and_bootstrap_music_database_from_env()`. SQLite tests continue to use `SqliteMusicStore::migrate()`.
