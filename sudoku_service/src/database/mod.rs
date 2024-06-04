use once_cell::sync::OnceCell;
use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};
pub type DBPool = Pool<Postgres>;
use sqlx::migrate::MigrateError;

use crate::configuration::Settings;

#[derive(Clone)]
pub struct Database {
    pub pool: &'static DBPool,
}

impl Database {
    /// create a new [`DBPool`]
    pub fn new(configuration: &Settings) -> Self {
        static POOL: OnceCell<DBPool> = OnceCell::new();
        #[cfg(debug_assertions)]
        crate::load_env_vars();

        Database {
            pool: POOL.get_or_init(|| {
                PgPoolOptions::new()
                    .max_connections(10)
                    .connect_lazy_with(configuration.database.get_options())
            }),
        }
    }

    pub async fn run_migrations(&self) -> Result<(), MigrateError> {
        sqlx::migrate!().run(self.pool).await
    }
}
