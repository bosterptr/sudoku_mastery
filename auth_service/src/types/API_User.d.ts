import { User } from '../db/entities';

type UpdateResult = {
  affected?: number;
};
/* eslint-disable @typescript-eslint/no-empty-interface */
interface APIError {
  name: string;
  message: string;
  status?: number;
  response?: any;
}

export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
}

export interface AuthenticationResBody {
  accessToken: { exp: number; token: string };
  refreshToken: { exp: number };
  user: SessionUser;
}

interface Device {
  id: string;
  ua: string | null;
}

interface NetworkAddress {
  ip: string;
}

interface RegisterReqParams {}
interface RegisterReqBody {
  displayName: string;
  email: string;
  password: string;
}
interface RegisterResBody {}

interface ActivateReqParams {}
interface ActivateReqBody {
  token: string;
}
interface ActivateResBody {}

interface LoginReqParams {}
interface LoginReqBody {
  email: string;
  password: string;
  deviceCode?: string;
  networkAddressCode?: string;
}
type LoginResBody = AuthenticationResBody;

interface ForgotPasswordReqParams {}
interface ForgotPasswordReqBody {
  email: string;
}
interface ForgotPasswordResBody {}

interface NewPasswordReqParams {}
interface NewPasswordReqBody {
  password: string;
  token: string;
}
type NewPasswordResBody = AuthenticationResBody;

interface ActivateDeviceReqParams {
  token: string;
}
interface ActivateDeviceReqBody {}
interface ActivateDeviceResBody {}

interface ActivateNetworkAddressReqParams {
  token: string;
}
interface ActivateNetworkAddressReqBody {}
interface ActivateNetworkAddressResBody {}

interface ActivateDeviceAndNetworkAddressReqParams {
  token: string;
}
interface ActivateDeviceAndNetworkAddressReqBody {}
interface ActivateDeviceAndNetworkAddressResBody {}

interface RefreshTokenReqParams {}
interface RefreshTokenReqBody {}
interface RefreshTokenResBody {
  accessToken: string;
}

interface ChangePasswordReqParams {}
interface ChangePasswordReqBody {
  password: string;
  newPassword: string;
}
interface ChangePasswordResBody {
  tokenVersion: string;
}

interface GetSessionsReqParams {}
interface GetSessionsReqBody {}
interface GetSessionsResBody {
  devices: Device[];
  networkAddresses: NetworkAddress[];
}

interface GetUserReqParams {
  userId: User['id'];
}
interface GetUserReqBody {}
type GetUserResBody = Pick<
  User,
  | 'id'
  | 'blocked'
  | 'displayName'
  | 'email'
  | 'profileBio'
  | 'createdAt'
  | 'updatedAt'
>;

interface UpdateUserReqParams {
  userId: User['id'];
}
type UpdateUserReqBody = Partial<
  Pick<
    User,
    | 'profileBio'
  >
>;
type UpdateUserResBody = UpdateResult;
