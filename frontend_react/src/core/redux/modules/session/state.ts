/* eslint-disable no-underscore-dangle */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/common/models/global_state';
import { app } from 'app/core/App';
import { SessionUser } from 'app/core/redux/modules/auth/types';
import { createSelector } from 'reselect';
import { ISessionState } from './types';

export const SESSION_NAMESPACE_KEY = 'session';
const initialState: ISessionState = {
  firstPageLoaded: false,
  user: null,
};
export const SessionSlice = createSlice({
  name: SESSION_NAMESPACE_KEY,
  initialState,
  reducers: {
    firstPageLoaded(draft, action: PayloadAction<boolean>) {
      draft.firstPageLoaded = action.payload;
    },
    setSessionUser(draft, action: PayloadAction<SessionUser | null>) {
      draft.user = action.payload;
    },
  },
});

app.store.registerReducer(SESSION_NAMESPACE_KEY, SessionSlice);

export const selectState = (state: RootState) => state.session;
export const selectIsFirstPageLoaded = () =>
  createSelector([selectState], (state) => state.firstPageLoaded);
export const selectCurrentUserId = (state: RootState) => selectState(state).user?.id;
export const selectIsLoggedIn = (state: RootState) => Boolean(selectState(state).user);
export const selectCurrentUser = () => createSelector([selectState], (state) => state.user);
