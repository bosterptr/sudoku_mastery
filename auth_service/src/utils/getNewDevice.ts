import { Request } from 'express';

export default function getNewDevice(req: Request<unknown>): string | boolean | undefined {
  if (!req.signedCookies.device) return req.headers['user-agent'];
  return false;
}
