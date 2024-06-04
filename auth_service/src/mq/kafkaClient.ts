import { Kafka, logLevel } from 'kafkajs';

const broker = process.env.KAFKA_BROKER;
if(!broker) throw new Error("KAFKA_BROKER isn't set");
export const kafkaClientName = 'auth_service';

export const kafka = new Kafka({
  logLevel: logLevel.WARN,
  clientId: kafkaClientName,
  brokers: [broker],
  retry: {
    retries: 1000
  }
});
