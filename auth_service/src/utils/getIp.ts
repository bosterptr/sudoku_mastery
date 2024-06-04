import { Request } from 'express';

function getIp(req: Request<unknown>) {
  let realIP = req.headers['x-real-ip'] || req.ip;
  if (typeof realIP === 'object') [realIP] = realIP;
  if(!realIP) throw new Error("can't get client's IP address");
  return realIP;
}
export default getIp;
