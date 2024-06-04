import { Request, Response, Router } from 'express';
import { getConnection } from 'typeorm';
import { producer } from '../mq';
import redis from '../redis';
import logger from '../utils/logger';

const { DISCONNECT, CONNECT } = producer.events;
let producerIsConnected = false;
producer.on(CONNECT, () => {
  producerIsConnected = true;
  logger.info('Connected producer');
});
producer.on(DISCONNECT, () => {
  producerIsConnected = false;
  logger.info('Disconnected producer');
});

const router = Router();

router.get('/liveness', (_req: Request, res: Response) => res.status(200).send());

router.get('/readiness', async (_req: Request, res: Response) => {
  try {
    if (
      getConnection().isConnected === true &&
      (await redis.ping()) === 'PONG' &&
      producerIsConnected
    ) {
      return res.status(200).send();
    }
    return res.status(503).send();
  } catch (e) {
    logger.error(e);
    return res.status(503).send(e);
  }
});

export default router;
