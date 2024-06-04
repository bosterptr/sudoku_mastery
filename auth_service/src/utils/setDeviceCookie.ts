import { Response } from 'express';

export default (res: Response, deviceId: string) =>
  res.cookie('device', deviceId, {
    maxAge: 315360000000,
    signed: true,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : undefined,
    domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
  });
