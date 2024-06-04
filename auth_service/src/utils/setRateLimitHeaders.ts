import { Response } from 'express';
import { RateLimiterRes } from 'rate-limiter-flexible';
import {
  maxConsecutiveFailsByUsernameAndIP,
  maxWrongAttemptsByIPperDay,
} from '../constants/rateLimit';

const setRateLimitHeaders = (
  res: Response,
  resUsernameAndIP: RateLimiterRes | null,
  resSlowByIP: RateLimiterRes | null,
) => {
  if (resUsernameAndIP)
    res.set({
      'X-RateLimit-Remaining-IP-Email': Number.isNaN(resUsernameAndIP.remainingPoints)
        ? maxConsecutiveFailsByUsernameAndIP
        : resUsernameAndIP.remainingPoints,
      'X-RateLimit-Reset-IP-Email': Number.isNaN(resUsernameAndIP.remainingPoints)
        ? -1
        : new Date(Date.now() + resUsernameAndIP.msBeforeNext).getTime(),
    });
  if (resSlowByIP)
    res.set({
      'X-RateLimit-Remaining-IP': Number.isNaN(resSlowByIP.remainingPoints)
        ? maxWrongAttemptsByIPperDay
        : resSlowByIP.remainingPoints,
      'X-RateLimit-Reset-IP': Number.isNaN(resSlowByIP.remainingPoints)
        ? -1
        : new Date(Date.now() + resSlowByIP.msBeforeNext).getTime(),
    });

  const headers = {
    'X-RateLimit-Limit-IP': maxWrongAttemptsByIPperDay,
    'X-RateLimit-Limit-IP-Email': maxConsecutiveFailsByUsernameAndIP,
  };
  res.set(headers);
  let retrySecs = 0;
  // Check if IP or email + IP is already blocked
  if (resSlowByIP !== null && resSlowByIP.consumedPoints >= maxWrongAttemptsByIPperDay) {
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
  }
  if (
    resUsernameAndIP !== null &&
    resUsernameAndIP.consumedPoints >= maxConsecutiveFailsByUsernameAndIP
  ) {
    retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
  }
  if (retrySecs > 0) {
    res.set('Retry-After', String(retrySecs));
    res.status(429).send('Too Many Requests');
  }
};

export default setRateLimitHeaders;
