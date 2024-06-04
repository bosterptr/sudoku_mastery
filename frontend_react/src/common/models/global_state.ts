/* eslint-disable @typescript-eslint/no-explicit-any */
import { Slice } from '@reduxjs/toolkit';
import { AUTH_NAMESPACE_KEY } from 'app/core/redux/modules/auth/state';
import { IAuthState } from 'app/core/redux/modules/auth/types';
import { SESSION_NAMESPACE_KEY } from 'app/core/redux/modules/session/state';
import { ISessionState } from 'app/core/redux/modules/session/types';
import { USER_NAMESPACE_KEY } from 'app/core/redux/modules/user/actionTypes';
import { IUserState } from 'app/core/redux/modules/user/types';

export interface RootState {
  [AUTH_NAMESPACE_KEY]: IAuthState;
  [SESSION_NAMESPACE_KEY]: ISessionState;
  [USER_NAMESPACE_KEY]: IUserState;
}
export interface RootReducers {
  [AUTH_NAMESPACE_KEY]: Slice<IAuthState, any, typeof AUTH_NAMESPACE_KEY>;
  [SESSION_NAMESPACE_KEY]: Slice<ISessionState, any, typeof SESSION_NAMESPACE_KEY>;
  [USER_NAMESPACE_KEY]: Slice<IUserState, any, typeof USER_NAMESPACE_KEY>;
}

export type Reducer<S, A> = (state: S | undefined, action: A) => S;

export type ExtractActionFromActionCreator<AC> = AC extends () => infer A
  ? A
  : AC extends (payload: any) => infer A
    ? A
    : AC extends (payload: any, error: any) => infer A
      ? A
      : never;
