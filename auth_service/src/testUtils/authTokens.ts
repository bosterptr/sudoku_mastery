import fs from 'fs';
import { sign, SignOptions } from 'jsonwebtoken';
import path from 'path';

const privateKey = fs.readFileSync(
  path.resolve(__dirname, '../../cert', 'keypair.pem'),
);

export const createAccessToken = (userId: string, options?: SignOptions):string =>
  sign({ sub: userId }, privateKey, { expiresIn: '15m', algorithm: 'RS256', ...options });
export const createRefreshToken = (userId: string, tokenVersion: number, options?: SignOptions):string =>
  sign({ sub: userId, tokenVersion }, privateKey, {
    expiresIn: '7d',
    algorithm: 'RS256',
    ...options,
  });
