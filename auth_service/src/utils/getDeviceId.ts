import { Request } from 'express';

export default function getDeviceId(req: Request<unknown>) {
  const { device } = req.signedCookies;
  if (typeof device === 'string') return device;
  return undefined;
}
