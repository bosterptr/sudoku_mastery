import fs from 'fs';
import { verify } from 'jsonwebtoken';
import { isPlainObject } from 'lodash';
import path from 'path';
import { InvalidTokenError } from '../errors';

const publicKey = fs.readFileSync(
  path.resolve(__dirname, '../../cert', 'publickey.crt'),
);

export default (token: string): { [key: string]: unknown } => {
  try {
    const payload = verify(token, publicKey, { algorithms: ['RS256'] });
    if (isPlainObject(payload)) {
      return payload as { [key: string]: unknown };
    }
    throw new Error();
  } catch (error) {
    throw new InvalidTokenError();
  }
};
