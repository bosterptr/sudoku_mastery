#![deny(clippy::all)]
#![warn(clippy::cargo)]
#![warn(clippy::nursery)]
#![warn(clippy::pedantic)]
#![warn(clippy::perf)]
#![warn(clippy::complexity)]
#![warn(clippy::style)]
#![warn(clippy::correctness)]
#![warn(clippy::suspicious)]
use futures::FutureExt;
use std::env;
use std::fmt::{Debug, Display};
use sudoku_service::configuration;
use sudoku_service::kafka::IngestConsumer;
use sudoku_service::proto_constants::auth::v1::user_topics;
use sudoku_service::startup::Application;
use tracing_subscriber;
use sudoku_service::database::Database;
use tokio::signal;
use tokio::sync::Notify;
use std::sync::Arc;

#[actix_web::main]
async fn main() -> anyhow::Result<()> {
    // #[cfg(debug_assertions)]
    // load_env_vars();
    tracing_subscriber::fmt::init();
    let notify = Arc::new(Notify::new());
    let shutdown_notify = notify.clone();
    tokio::spawn(async move {
        signal::ctrl_c().await.expect("Failed to listen for shutdown signal");
        shutdown_notify.notify_one();
    });
    let config = configuration::Settings::new()?;
    let application = Application::build(&config.clone()).await?;
    let application_task = application.run_until_stopped().fuse();
    let db = Database::new(&config);
    let ingest_consumer = IngestConsumer::new(
        env::var("KAFKA_BROKERS").expect("env KAFKA_BROKERS isn't set"),
        &[user_topics::CREATED],
        db.pool,
    )
    .expect("Failed to construct ingest consumer");
    let consume_task = ingest_consumer.consume_messages(notify).fuse();
    futures::pin_mut!(application_task, consume_task);
    // futures::pin_mut!(application_task);
    futures::select! {
        o = application_task => report_exit("API", o),
        o = consume_task =>  report_exit("Kafka consumer", o),
    };
    Ok(())
}

fn report_exit<E: Debug + Display>(task_name: &str, outcome: Result<(), E>) {
    match outcome {
        Ok(()) => {
            tracing::info!("{} has exited", task_name);
        }
        Err(e) => {
            tracing::error!(
                error.cause_chain = ?e,
                error.message = %e,
                "{} failed",
                task_name
            );
        }
    }
}
