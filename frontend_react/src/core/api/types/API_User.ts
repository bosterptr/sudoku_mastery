export interface IUser {
  id: string;
  blocked: boolean | null;
  displayName: string;
  email: string | null;
  profileBio: string | null;
  createdAt: string | null;
  updatedAt: string | null;
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

export type RegisterReqParams = Record<string, never>;
export interface RegisterReqBody {
  email: string;
  password: string;
  displayName: string;
}
export type RegisterResBody = Record<string, never>;

export type ActivateReqParams = Record<string, never>;
export interface ActivateReqBody {
  token: string;
}
export type ActivateResBody = Record<string, never>;

export type LoginReqParams = Record<string, never>;
export interface LoginReqBody {
  email: string;
  password: string;
  deviceCode?: string;
  networkAddressCode?: string;
}
export type LoginResBody = AuthenticationResBody;
export interface LoginResBodyError {
  code:
    | 'NEW_DEVICE'
    | 'NEW_DEVICE_AND_NETWORK_ADDRESS'
    | 'NEW_NETWORK_ADDRESS'
    | 'WRONG_CREDENTIALS'
    | 'UNACTIVATED_USER';
}

export type ForgotPasswordReqParams = Record<string, never>;
export interface ForgotPasswordReqBody {
  email: string;
}
export type ForgotPasswordResBody = Record<string, never>;

export type ChangePasswordWithTokenReqParams = Record<string, never>;
export interface ChangePasswordWithTokenReqBody {
  password: string;
  token: string;
}
export type ChangePasswordWithTokenResBody = AuthenticationResBody;

export interface ActivateDeviceReqParams {
  token: string;
}
export type ActivateDeviceReqBody = Record<string, never>;
export type ActivateDeviceResBody = Record<string, never>;

export interface ActivateNetworkAddressReqParams {
  token: string;
}
export type ActivateNetworkAddressReqBody = Record<string, never>;
export type ActivateNetworkAddressResBody = Record<string, never>;

export interface ActivateDeviceAndNetworkAddressReqParams {
  token: string;
}
export type ActivateDeviceAndNetworkAddressReqBody = Record<string, never>;
export type ActivateDeviceAndNetworkAddressResBody = Record<string, never>;

export type RefreshTokenReqParams = Record<string, never>;
export type RefreshTokenReqBody = Record<string, never>;
export interface RefreshTokenResBody {
  accessToken: string;
  expirationDate: number;
}

export type ChangePasswordReqParams = Record<string, never>;
export interface ChangePasswordReqBody {
  password: string;
  newPassword: string;
}
export type ChangePasswordResBody = AuthenticationResBody;

export type GetSessionsReqParams = Record<string, never>;
export type GetSessionsReqBody = Record<string, never>;
export interface GetSessionsResBody {
  devices: Device[];
  networkAddresses: NetworkAddress[];
}

export interface GetUserReqParams {
  userId: IUser['id'];
}
export type GetUserReqBody = Record<string, never>;
export type GetUserResBody = IUser;

export interface UpdateUserReqParams {
  id: IUser['id'];
}
export type UpdateUserReqBody = Partial<Pick<IUser, 'profileBio' | 'displayName'>>;
export interface UpdateUserResBody {
  affected?: number;
}
