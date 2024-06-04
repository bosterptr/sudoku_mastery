import fs from 'fs';
import { sign, SignOptions } from 'jsonwebtoken';
import path from 'path';
import {v4 as uuid_v4} from 'uuid';

const privateKey = fs.readFileSync(
  path.resolve(__dirname, '../../cert', 'keypair.pem')
);
const passphrase = process.env.CERT_PASSPHRASE;
if (!passphrase)
  throw new Error('non existent enviromental variable CERT_PASSPHRASE');

export const createAccessToken = (
  { userId,exp }: { userId: string, exp:number},
  options?: SignOptions
):string =>
  sign(
    // https://www.rfc-editor.org/rfc/rfc7519#page-10
    { sub: userId, jti: uuid_v4() },
    { key: privateKey, passphrase },
    { expiresIn: exp, algorithm: 'RS256', ...options }
  );
// eslint-disable-next-line max-len
export const createRefreshToken = (
  userId: string,
  tokenVersion: number, exp:number,
  options?: SignOptions
):string =>
  sign(
    { sub: userId, tokenVersion },
    { key: privateKey, passphrase },
    {
      expiresIn: exp,
      algorithm: 'RS256',
      ...options,
    }
  );
