use crate::{
    configuration,
    database::{DBPool, Database},
    models::{user::User, user_token::Claims},
    startup::create_app,
};
use actix_http::Request;
use actix_web::{
    body::MessageBody,
    dev::{Service, ServiceResponse},
    test, Error,
};
use chrono::{Duration, Utc};
use jsonwebtoken::{encode, Algorithm, EncodingKey, Header};
use sqlx::{Executor, Row};
use std::fs;
use uuid::Uuid;

pub fn create_jwt_with_expiry(
    user_id: Uuid,
    encoding_key: EncodingKey,
) -> Result<String, jsonwebtoken::errors::Error> {
    encode::<Claims>(
        &Header::new(Algorithm::RS256),
        &Claims {
            sub: user_id,
            exp: Utc::now()
                .checked_add_signed(Duration::minutes(15))
                .expect("valid timestamp")
                .timestamp() as usize,
        },
        &encoding_key,
    )
}

pub fn create_authorization_header(jwt: &String) -> (&'static str, String) {
    ("Authorization", format!("Bearer {}", jwt))
}

async fn clear_all_tables(pool: &DBPool) -> Result<(), sqlx::Error> {
    let mut transaction = pool.begin().await?;
    let rows = sqlx::query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
    )
    .fetch_all(&mut *transaction)
    .await?;
    for row in rows {
        let table_name: String = row.get("table_name");
        if table_name != "_sqlx_migrations" {
            let sql = format!("TRUNCATE TABLE {} CASCADE;", table_name);
            transaction.execute(sql.as_str()).await?;
        }
    }
    transaction.commit().await?;
    Ok(())
}

pub async fn setup_test_app() -> (
    impl Service<Request, Response = ServiceResponse<impl MessageBody>, Error = Error>,
    Database,
    Uuid,
    (&'static str, String),
) {
    std::env::set_var("RUST_LOG", "debug");
    dotenv::dotenv().ok();
    let _ = tracing_subscriber::fmt::try_init();
    // let subscriber = get_subscriber("sudoku_service".into(), "info".into(), std::io::stdout);
    // init_subscriber(subscriber);
    let config = configuration::Settings::new().expect("couldn't load config");
    let db = Database::new(&config);
    clear_all_tables(db.pool)
        .await
        .expect("couldn't clear tables");
    let user_id = uuid::Uuid::new_v4();
    User::create(db.pool, user_id)
        .await
        .expect("Could not create user");
    let rsa_pem: Vec<u8> = fs::read("./cert/keypair.pem").expect("Failed to read PEM file");
    let rsa_encoding_key =
        EncodingKey::from_rsa_pem(&rsa_pem).expect("Failed to create DecodingKey from PEM");
    let jwt: String =
        create_jwt_with_expiry(user_id, rsa_encoding_key).expect("couldn't create jwt");
    let auth_header = create_authorization_header(&jwt);
    let app = create_app(db.pool.clone());
    let svc = test::init_service(app).await;
    (svc, db, user_id, auth_header)
}
