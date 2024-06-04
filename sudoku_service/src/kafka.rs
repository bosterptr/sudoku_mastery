use std::str::FromStr;

use crate::database::DBPool;
use crate::kafka_messages;
use crate::models::user::User;
use crate::proto_constants::auth::v1::user_topics;
use futures::StreamExt;
use prost::Message as ProstMessage;
use rdkafka::config::ClientConfig;
use rdkafka::config::RDKafkaLogLevel;
use rdkafka::consumer::CommitMode;
use rdkafka::consumer::{Consumer, StreamConsumer};
use rdkafka::error::KafkaError;
use rdkafka::Message;
use tracing::{debug, error, info, warn};
use uuid::Uuid;
use tokio::sync::Notify;
use std::sync::Arc;

pub struct IngestConsumer<'a> {
    consumer: StreamConsumer,
    pool: &'a DBPool,
}
// TODO: handle graceful shutdown
impl<'a> IngestConsumer<'a> {
    pub fn new(brokers: String, topics: &[&str], pool: &'a DBPool) -> Result<Self, KafkaError> {
        let consumer = new_consumer(brokers, topics)?;
        Ok(IngestConsumer { consumer, pool })
    }
    
    pub async fn consume_messages(&self, shutdown_notify: Arc<Notify>) -> Result<(), KafkaError> {
        let mut message_stream = self.consumer.stream();

        loop {
            tokio::select! {
                message = message_stream.next() => {
                    match message {
                        Some(Ok(m)) => {
                            match m.topic() {
                                user_topics::CREATED => {
                                    if let Some(payload) = m.payload() {
                                        match kafka_messages::user::Created::decode(payload) {
                                            Ok(decoded_msg) => {
                                                debug!("Received user created: {:?}", decoded_msg.id);
                                                match Uuid::from_str(&decoded_msg.id) {
                                                    Ok(id) => {
                                                        match User::create(&self.pool, id).await {
                                                            Ok(_) => {
                                                                if let Err(e) = self.consumer.commit_message(&m, CommitMode::Async) {
                                                                    error!("Failed to commit message: {:?}", e);
                                                                }
                                                            }
                                                            Err(e) => {
                                                                warn!("Couldn't create user: {:?}", e);
                                                                break;
                                                            }
                                                        };
                                                    }
                                                    Err(e) => {
                                                        warn!("Couldn't parse uuid: {:?}", e);
                                                        break;
                                                    }
                                                }
                                            }
                                            Err(e) => {
                                                warn!("Error decoding user created: {:?}", e);
                                                break;
                                            }
                                        }
                                    }
                                }
                                _ => {}
                            }
                        }
                        Some(Err(e)) => error!("Kafka error: {:?}", e),
                        None => break,
                    }
                },
                _ = shutdown_notify.notified() => {
                    info!("Received shutdown signal, stopping kafka consumer...");
                    break;
                }
            }
        }

        info!("IngestConsumer has been shut down.");
        Ok(())
    }}

fn new_consumer(brokers: String, topics: &[&str]) -> Result<StreamConsumer, KafkaError> {
    info!("subscribing to topics {:?}", topics);
    let stream_consumer: StreamConsumer = ClientConfig::new()
        .set("group.id", "sudoku-service")
        .set("bootstrap.servers", &brokers)
        .set("auto.offset.reset", "earliest")
        .set("enable.partition.eof", "false")
        .set("session.timeout.ms", "6000")
        .set("enable.auto.commit", "false")
        .set_log_level(RDKafkaLogLevel::Debug)
        .create()?;
    stream_consumer.subscribe(topics)?;
    Ok(stream_consumer)
}
