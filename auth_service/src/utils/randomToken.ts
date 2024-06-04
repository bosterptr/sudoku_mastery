import * as crypto from 'crypto';

// should not have more than 256 characters, otherwise unpredictability will be broken
const charsLength = 62;
const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export default function randomString(length: number) {
  const randomBytes = crypto.randomBytes(length);
  const result = new Array(length);

  let cursor = 0;
  for (let i = 0; i < length; i += 1) {
    cursor += randomBytes[i];
    result[i] = chars[cursor % charsLength];
  }

  return result.join('');
}
