import Redis from 'ioredis';
import logger from './utils/logger';

// export default new Redis({
//   name: 'default',
//   port: 6379,
//   host: process.env.REDIS_HOST,
//   password: process.env.REDIS_PASSWORD,
//   db: parseInt(process.env.REDIS_DB_NUMBER, 10),
//   enableOfflineQueue: false,
//   enableReadyCheck: true,
//   // retryStrategy: (times) => Math.min(times * 50, 2000),
//   // reconnectOnError: (error) => {
//   //   const targetErrors = [/READONLY/, /ETIMEDOUT/];
//   //   targetErrors.forEach((targetError) => {
//   //     if (targetError.test(error.message)) {
//   //       return true;
//   //     }
//   //     return false;
//   //   });
//   //   return false;
//   // },
// });

const redis = new Redis({
  name: 'default',
  port: 6379,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB_NUMBER, 10),
  enableOfflineQueue: false,
  enableReadyCheck: true,
});

redis.once('ready', () => {
  logger.info('redis is ready');
});

redis.on('error', (e) => {
  logger.error('Error: %s', e.message);
});

export default redis;
