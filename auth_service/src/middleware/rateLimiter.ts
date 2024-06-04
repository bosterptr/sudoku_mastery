import { NextFunction, Request, Response } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import {
  maxConsecutiveFailsByUsernameAndIP,
  maxWrongAttemptsByIPperDay,
} from '../constants/rateLimit';
import redis from '../redis';
import getIp from '../utils/getIp';
import setRateLimitHeaders from '../utils/setRateLimitHeaders';

export const limiterSlowBruteByIP = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 24, // Block for 1 day, if 100 wrong attempts per day
});

export const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'login_fail_consecutive_username_and_ip',
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
  blockDuration: 60 * 60, // Block for 1 hour
});

export const getEmailIPkey = (email: string, ip: string) => `${email}_${ip}`;

export async function rateLimit(req: Request<any>, res: Response<any>, next: NextFunction) {
  const ipAddr = getIp(req);
  const emailIPkey = getEmailIPkey(req.body.email, ipAddr);
  const [resUsernameAndIP, resSlowByIP] = await Promise.all([
    limiterConsecutiveFailsByUsernameAndIP.get(emailIPkey),
    limiterSlowBruteByIP.get(ipAddr),
  ]);
  setRateLimitHeaders(res, resUsernameAndIP, resSlowByIP);
  res.resUsernameAndIP = resUsernameAndIP;
  res.resSlowByIP = resSlowByIP;
  next();
}
