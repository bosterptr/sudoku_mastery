use crate::database::DBPool;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(
    Clone,
    sqlx::FromRow,
    Debug,
    Deserialize,
    PartialEq,
    Serialize,
    utoipa::IntoParams,
    utoipa::ToSchema,
)]
pub struct User {
    pub id: Uuid,
}

impl User {
    pub async fn create(pool: &DBPool, user_id: Uuid) -> Result<Self, sqlx::Error> {
        let item = sqlx::query_as!(
            User,
            r#"INSERT INTO users (id) VALUES ($1) RETURNING id"#,
            user_id,
        )
        .fetch_one(pool)
        .await?;
        Ok(item)
    }

    pub async fn delete(pool: &DBPool, user_id: Uuid) -> Result<(), sqlx::Error> {
        sqlx::query!(r#"DELETE FROM users WHERE id = $1"#, user_id)
            .execute(pool)
            .await?;
        Ok(())
    }

    pub async fn clear_table(pool: &DBPool) -> Result<sqlx::postgres::PgQueryResult, sqlx::Error> {
        sqlx::query!(r#"DELETE FROM users;"#).execute(pool).await
    }
}
