use secrecy::{ExposeSecret, Secret};
use serde::Deserialize;
use sqlx::postgres::{PgConnectOptions, PgSslMode};
use std::env;

#[derive(Deserialize, Clone)]
pub struct ApplicationSettings {
    pub port: u16,
    pub host: String,
    pub jwt_token_path: String,
}

#[derive(Deserialize, Clone)]
pub struct DatabaseSettings {
    pub username: String,
    pub database: String,
    pub password: Secret<String>,
    pub port: u16,
    pub host: String,
    pub require_ssl: bool,
}

impl DatabaseSettings {
    pub fn get_options(&self) -> PgConnectOptions {
        let ssl_mode = if self.require_ssl {
            PgSslMode::Require
        } else {
            PgSslMode::Prefer
        };
        PgConnectOptions::new()
            .host(&self.host)
            .port(self.port)
            .database(&self.database)
            .password(self.password.expose_secret())
            .username(&self.username)
            .ssl_mode(ssl_mode)
    }
}

#[derive(Deserialize, Clone)]
pub struct Settings {
    pub database: DatabaseSettings,
    pub application: ApplicationSettings,
}

impl Settings {
    pub fn new() -> Result<Settings, anyhow::Error> {
        let database_settings = DatabaseSettings {
            database: env::var("DB_DATABASE_NAME")?,
            host: env::var("DB_HOST")?,
            password: Secret::new(env::var("DB_PASSWORD")?),
            port: env::var("DB_PORT")?.parse::<u16>()?,
            require_ssl: env::var("DB_REQUIRE_SSL")?.parse::<bool>()?,
            username: env::var("DB_USERNAME")?,
        };
        let application_settings = ApplicationSettings {
            host: env::var("HOST")?,
            jwt_token_path: env::var("JWT_TOKEN_PATH")?,
            port: env::var("PORT")?.parse::<u16>()?,
        };
        Ok(Settings {
            application: application_settings,
            database: database_settings,
        })
    }
}
