import { AxiosResponse } from 'axios';
import lazyAxios, { ErrorResponse } from './agent';
import {
  ActivateDeviceAndNetworkAddressReqParams,
  ActivateDeviceReqParams,
  ActivateNetworkAddressReqParams,
  ActivateReqBody,
  ChangePasswordReqBody,
  ChangePasswordResBody,
  ChangePasswordWithTokenReqBody,
  ChangePasswordWithTokenResBody,
  ForgotPasswordReqBody,
  GetSessionsResBody,
  GetUserReqParams,
  GetUserResBody,
  LoginReqBody,
  LoginResBody,
  LoginResBodyError,
  RegisterReqBody,
  RegisterResBody,
  UpdateUserReqBody,
  UpdateUserReqParams,
  UpdateUserResBody,
} from './types/API_User';

const URL = 'auth/';

export const activateAccount = async ({
  token,
}: ActivateReqBody): Promise<
  AxiosResponse<Record<string, never> | ErrorResponse<{ code: 'INVALID_TOKEN' }>>
> => (await lazyAxios().getAgent()).post(`${URL}activate`, { token });
export const activateDevice = async ({
  token,
}: ActivateDeviceReqParams): Promise<
  AxiosResponse<Record<string, never> | ErrorResponse<{ code: 'WRONG_TOKEN' }>>
> => (await lazyAxios().getAgent()).post(`${URL}activateDevice/${token}`);
export const activateDeviceAndNetworkAddress = async ({
  token,
}: ActivateDeviceAndNetworkAddressReqParams): Promise<
  AxiosResponse<Record<string, never> | ErrorResponse<{ code: 'WRONG_TOKEN' }>>
> => (await lazyAxios().getAgent()).post(`${URL}activateDeviceAndNetworkAddress/${token}`);
export const activateNetworkAddress = async ({
  token,
}: ActivateNetworkAddressReqParams): Promise<
  AxiosResponse<Record<string, never> | ErrorResponse<{ code: 'WRONG_TOKEN' }>>
> => (await lazyAxios().getAgent()).post(`${URL}activateNetworkAddress/${token}`);
export const changePassword = async (body: ChangePasswordReqBody) =>
  (await lazyAxios().getAgent()).post<ChangePasswordResBody>(`${URL}changePassword`, body);
export const changePasswordWithToken = async ({
  password,
  token,
}: ChangePasswordWithTokenReqBody): Promise<
  AxiosResponse<ChangePasswordWithTokenResBody | ErrorResponse<{ code: 'INVALID_TOKEN' }>>
> =>
  (await lazyAxios().getAgent()).post<ChangePasswordWithTokenResBody>(
    `${URL}changePasswordWithToken`,
    { password, token },
  );
export const forgotPassword = async ({ email }: ForgotPasswordReqBody) =>
  (await lazyAxios().getAgent()).post(`${URL}forgotPassword`, { email });
export const getSessions = async () =>
  (await lazyAxios().getAgent()).get<GetSessionsResBody>(`${URL}sessions`);
export const getUserProfile = async ({ userId }: GetUserReqParams) =>
  (await lazyAxios().getAgent()).get<GetUserResBody>(`${URL}user/${userId}`);
export const signInWithEmail = async ({
  email,
  password,
}: LoginReqBody): Promise<AxiosResponse<LoginResBody | ErrorResponse<LoginResBodyError>>> =>
  (await lazyAxios().getAgent()).post<LoginResBody>(`${URL}login`, {
    email,
    password,
  });
export const signup = async ({ email, password, displayName }: RegisterReqBody) =>
  (await lazyAxios().getAgent()).post<RegisterResBody>(`${URL}register`, {
    email,
    password,
    displayName,
  });
export const updateUser = async ({ id, ...body }: UpdateUserReqParams & UpdateUserReqBody) =>
  (await lazyAxios().getAgent()).patch<UpdateUserResBody>(`${URL}user/${id}`, { ...body });
