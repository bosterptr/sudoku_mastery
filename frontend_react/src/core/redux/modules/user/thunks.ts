/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from 'app/common/models/global_state';
import {
  GetUserReqParams,
  UpdateUserReqBody,
  UpdateUserReqParams,
} from 'app/core/api/types/API_User';
import { getUserProfile, updateUser } from 'app/core/api/user';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import UserActions from './actions';

const UserThunks = {
  thunkGetUserProfile:
    (payload: GetUserReqParams): ThunkAction<Promise<void>, RootState, unknown, AnyAction> =>
    async (dispatch) => {
      const response = await getUserProfile(payload);
      const user = response.data;
      dispatch(UserActions.setUsers([user]));
    },
  thunkUpdateUser:
    (
      payload: UpdateUserReqParams & UpdateUserReqBody,
    ): ThunkAction<Promise<void>, RootState, unknown, AnyAction> =>
    async (dispatch) => {
      await updateUser(payload);
      dispatch(UserActions.setUser(payload));
    },
};
export default UserThunks;
