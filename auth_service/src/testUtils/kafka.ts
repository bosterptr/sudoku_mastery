import { kafka } from '../mq/kafkaClient';
import logger from '../utils/logger';

const admin = kafka.admin();

const kafkaTopics = [
  'auth.user.created_not_activated',
  'auth.user.created',
  'auth.user.requested_new_password',
  'auth.user.already_registered',
  'auth.device_and_network_address.detected_not_approved',
  'auth.device.detected_not_approved',
  'auth.network_address.detected_not_approved',
];
const topicObjects = (topics: string[]) => {
  const arr: { topic: string }[] = [];
  topics.forEach((topic) => {
    arr.push({ topic });
  });
  return arr;
};

// remember to connect and disconnect when you are done
export const createKafkaTopics = async () => {
  try {
    await admin.connect();
    await admin.createTopics({
      topics: topicObjects(kafkaTopics),
    });
    await admin.disconnect();
  } catch (err) {
    logger.info(err);
    throw err;
  }
};

export const deleteKafkaTopics = async () => {
  await admin.connect();
  await admin.deleteTopics({
    topics: kafkaTopics,
  });
  await admin.disconnect();
};
