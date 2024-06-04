import { NextFunction, Request, Response } from 'express';
import { User } from '../db/entities';
import { InvalidTokenError } from '../errors';
import verifyToken from '../utils/verifyToken';

const getAuthTokenFromRequest = (req: Request): string | null => {
  const header = req.get('Authorization') || '';
  const [bearer, token] = header.split(' ');
  return bearer === 'Bearer' && token ? token : null;
};

export default async (
  req: Request<any>,
  _res: Response<any>,
  next: NextFunction
) => {
  try {
    const token = getAuthTokenFromRequest(req);
    if (!token) {
      throw new InvalidTokenError('Authentication token not found.');
    }
    const userId = verifyToken(token).sub;
    if (!userId || typeof userId !== 'string') {
      throw new InvalidTokenError('Authentication token is invalid.');
    }
    const user = await User.findOne({
      where: { id: userId },
      select: ['id']
    });
    if (!user) {
      throw new InvalidTokenError(
        'Authentication token is invalid: User not found.'
      );
    }
    req.currentUser = { id: user.id };
    next();
  } catch (err) {
    next(err);
  }
};
