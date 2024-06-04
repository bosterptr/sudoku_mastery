import { Response } from 'express';
import { AuthenticationResBody } from '../types/API_User';
import { createAccessToken, createRefreshToken } from './authTokens';

const refreshTokenMaxAge = 604800000; // 7 days

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const authenticate = async (
  res: Response<AuthenticationResBody>,
  user: {
    id: string;
    tokenVersion: number;
    email: string;
    displayName:string
  }
) => {
  let accessTokenExp = new Date().getTime() +15*60*1000
  let refreshTokenExp = new Date().getTime() +7*60*60*1000
  const accessToken = createAccessToken({ userId: user.id,exp:accessTokenExp });
  const refreshToken = createRefreshToken(user.id, user.tokenVersion,refreshTokenExp);
  res.cookie('refresh-token', refreshToken, {
    maxAge: refreshTokenMaxAge,
    signed: true,
    sameSite: 'strict',
    path: '/api/auth/refresh_token',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: process.env.NODE_ENV === 'production',
  });
  const response = {
    accessToken:{
      token:accessToken,
      exp:accessTokenExp
    },
    refreshToken: {
      exp: refreshTokenExp
    },
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
    },
  };
  return res.status(201).send(response);
};

export default authenticate;
