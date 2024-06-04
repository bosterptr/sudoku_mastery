/* eslint-disable no-underscore-dangle */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/common/models/global_state';
import { app } from 'app/core/App';
import { IUser } from 'app/core/api/types/API_User';
import { selectCurrentUserId } from 'app/core/redux/modules/session/state';
import { IUserState } from 'app/core/redux/modules/user/types';
import { createSelector } from 'reselect';
import { USER_NAMESPACE_KEY } from './actionTypes';

const initialState: IUserState = {
  users: {},
};

export const UserSlice = createSlice({
  name: USER_NAMESPACE_KEY,
  initialState,
  reducers: {
    setUsers(draft, action: PayloadAction<IUser[]>) {
      action.payload.forEach((user) => {
        draft.users[user.id] = user;
      });
    },
    setUser(draft, action: PayloadAction<Pick<IUser, 'id'> & Partial<IUser>>) {
      draft.users[action.payload.id] = { ...draft.users[action.payload.id], ...action.payload };
    },
  },
});

app.store.registerReducer(USER_NAMESPACE_KEY, UserSlice);

const s = (state: RootState) => state.user.users;
export const selectUsers = (state: RootState) => s(state);
export const selectUser = (state: RootState, userId: string) => s(state)[userId];
export const selectCurrentUser = () =>
  createSelector([selectUsers, selectCurrentUserId], (users, currentUserId) => {
    if (!currentUserId) return null;
    return users[currentUserId];
  });
