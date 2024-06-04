import { Server } from 'http';
import { register } from 'prom-client';
import 'reflect-metadata';
import { getConnection } from 'typeorm';
import app from './app';
import { createDatabaseConnection } from './db/createDatabaseConnection';
import { connectKafkaClient, disconnectKafkaClient } from './mq';
import redis from './redis';
import logger from './utils/logger';

let server: Server;
const port = process.env.PORT;

const errorTypes: ['unhandledRejection', 'uncaughtException'] = [
  'unhandledRejection',
  'uncaughtException',
];
const signalTraps: ['SIGTERM', 'SIGINT', 'SIGUSR2'] = [
  'SIGTERM',
  'SIGINT',
  'SIGUSR2',
];

errorTypes.forEach((type) => {
  process.on(type, async (e) => {
    try {
      logger.info(`process.on ${type}`);
      logger.error(e);
      await redis.quit();
      logger.info('Disconected from the redis db');
      await getConnection().close();
      logger.info('Disconected from the sql db');
      await disconnectKafkaClient();
      logger.info('Disconected kafka producer');
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

// eslint-disable-next-line array-callback-return
signalTraps.forEach((type) => {
  process.once(type, async () => {
    try {
      logger.info(`${type} signal received.`);
      await redis.quit();
      logger.info('Disconected from the redis db');
      await getConnection().close();
      logger.info('Disconected from the sql db');
      await disconnectKafkaClient();
      logger.info('Disconected kafka producer');
      register.clear();
      server.close();
      process.exit(0);
    } finally {
      process.kill(process.pid, type);
    }
  });
});

const startServer = async () => {
  try {
    const connection = await createDatabaseConnection();
    logger.info('Typeorm connection established');
    logger.info('Running migrations');
    await connection.runMigrations();
    await connectKafkaClient();
    logger.info('Kafka connection established');
    if ((await redis.ping()) !== 'PONG')
      throw new Error('Redis connection is still not established');
    logger.info('Redis connection established');
    server = app
      .listen(port, () => {
        logger.info(`App listening on port ${port}!`);
      })
      .on('error', (err) => logger.error(err));
  } catch (err) {
    logger.info(err);
  }
};

startServer();
