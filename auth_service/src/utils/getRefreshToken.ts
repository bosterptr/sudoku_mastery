import { User } from '../db/entities';
import { InvalidTokenError } from '../errors';
import { createAccessToken } from './authTokens';
import verifyToken from './verifyToken';

const createAccessTokenFromRefreshToken = async (token?: string):Promise<string> => {
  if (!token) {
    throw new InvalidTokenError('refresh-token token not found.');
  }
  const { sub: userId, tokenVersion } = verifyToken(token);
  if (!userId || typeof userId !== 'string') {
    throw new InvalidTokenError('Authentication token is invalid.');
  }
  const user = await User.findOne({ select: ['id', 'tokenVersion'], where: {id: userId}});
  if (!user) {
    throw new InvalidTokenError(
      'Authentication token is invalid: User not found.'
    );
  }
  if (user.tokenVersion !== tokenVersion) {
    throw new InvalidTokenError('wrong refresh-token version');
  }
  let accessTokenExp = new Date().getTime() +15*60*1000
  return createAccessToken({ userId: user.id, exp:accessTokenExp });
};
export default createAccessTokenFromRefreshToken;
