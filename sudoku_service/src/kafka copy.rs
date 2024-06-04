use std::time::Duration;

use rdkafka::config::ClientConfig;
use rdkafka::config::RDKafkaLogLevel;
use rdkafka::consumer::{Consumer, StreamConsumer};
use rdkafka::error::KafkaError;

use crate::cache::RedisCache;
use futures::StreamExt;
use rdkafka::message::{BorrowedMessage, Message as KafkaMessage};
use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct MessagePayload(String);

impl MessagePayload {
    pub fn as_str(&self) -> &str {
        self.0.as_str()
    }
}

/// generic way to turn a borrowed message into a (wrapped) string
impl<'a> From<&'a BorrowedMessage<'a>> for MessagePayload {
    fn from(bm: &'a BorrowedMessage) -> Self {
        match bm.payload_view::<str>() {
            Some(Ok(s)) => MessagePayload(String::from(s)),
            Some(Err(e)) => MessagePayload(format!("{:?}", e)),
            None => MessagePayload(String::from("")),
        }
    }
}

pub struct IngestConsumer {
    consumer: StreamConsumer,
}

impl IngestConsumer {
    pub fn new(
        brokers: String,
        topics: &[String],
        redis_cache: RedisCache,
    ) -> Result<Self, KafkaError> {
        let consumer = new_consumer(brokers, topics)?;
        Ok(IngestConsumer {
            consumer,
        })
    }

    fn process_message(borrowed_message: BorrowedMessage) -> HashMap<String, usize> {
        let message_payload = MessagePayload::from(&borrowed_message);
        let splitted = message_payload
            .as_str()
            .split_whitespace()
            .map(|token| token.to_string())
            .collect::<Vec<String>>();
        let mut counts: HashMap<String, usize> = HashMap::new();
        for token in splitted {
            if let Some(count) = counts.get_mut(token.as_str()) {
                *count += 1;
            } else {
                counts.insert(token, 1);
            }
        }
        counts
    }

    pub async fn run(&self) {
        let mut stream = self.consumer.start_with(Duration::from_millis(50), false);
        loop {
            match stream.next().await {
                Some(Ok(borrowed_message)) => {
                    let topic_name = borrowed_message.topic().to_owned();
                }
                Some(Err(kafka_error)) => match kafka_error {
                    KafkaError::PartitionEOF(partition) => {
                        info!("at end of partition {:?}", partition);
                    }
                    _ => error!(
                        "{}",
                        &format!("errors from kafka, {}", kafka_error.to_string())
                    ),
                },
                None => {}
            }
        }
    }
}

fn new_consumer(brokers: String, topics: &[String]) -> Result<StreamConsumer, KafkaError> {
    let msg = topics.join(" ");
    info!("subscribing to topics {}", msg);
    let stream_consumer: StreamConsumer = ClientConfig::new()
        .set("group.id", "sudoku-service")
        .set("bootstrap.servers", &brokers)
        .set("auto.offset.reset", "earliest")
        .set("enable.partition.eof", "true")
        .set("session.timeout.ms", "6000")
        .set("enable.auto.commit", "true")
        .set_log_level(RDKafkaLogLevel::Debug)
        .create()?;
    let topics = topics
        .iter()
        .map(|topic| topic.as_str())
        .collect::<Vec<&str>>();
    stream_consumer.subscribe(topics.as_slice())?;
    Ok(stream_consumer)
}