export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
}

export interface APIState {
  done: boolean;
  hasErrored: boolean;
  isLoading: boolean;
}
// eslint-disable-next-line no-shadow
export const AuthAPIStateKeys = {
  loginWithEmail: 0,
  changePassword: 1,
  changePasswordWithToken: 2,
  activateAccount: 3,
  forgotPassword: 4,
} as const;
export type IAuthAPIStateKeys = (typeof AuthAPIStateKeys)[keyof typeof AuthAPIStateKeys];
export interface AuthAPIState {
  [AuthAPIStateKeys.loginWithEmail]?: APIState;
  [AuthAPIStateKeys.changePassword]?: APIState;
  [AuthAPIStateKeys.changePasswordWithToken]?: APIState;
  [AuthAPIStateKeys.activateAccount]?: APIState;
  [AuthAPIStateKeys.forgotPassword]?: APIState;
}
export type IAuthState = AuthAPIState;
