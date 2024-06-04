/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/common/models/global_state';
import { app } from 'app/core/App';
import { APIState, IAuthAPIStateKeys, IAuthState } from './types';

export const AUTH_NAMESPACE_KEY = 'auth';
const initialState: IAuthState = {};
export type IAuthPayloadAction = PayloadAction<{
  key: IAuthAPIStateKeys;
  state: APIState;
}>;
export const AuthSlice = createSlice({
  name: AUTH_NAMESPACE_KEY,
  initialState,
  reducers: {
    setAPIState(draft, action: PayloadAction<{ key: IAuthAPIStateKeys; state: APIState }>) {
      draft[action.payload.key] = action.payload.state;
    },
  },
});

app.store.registerReducer(AUTH_NAMESPACE_KEY, AuthSlice);

export const selectAuthAPIState = (state: RootState, key: IAuthAPIStateKeys) =>
  state.auth[key] || {
    done: false,
    hasErrored: false,
    isLoading: false,
  };
