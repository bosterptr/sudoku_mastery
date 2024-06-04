import { kafka } from "./kafkaClient";

export const producer = kafka.producer();
export const connectKafkaClient = async () => {
  await producer.connect();
};
export const disconnectKafkaClient = async () => {
  await producer.disconnect();
};
