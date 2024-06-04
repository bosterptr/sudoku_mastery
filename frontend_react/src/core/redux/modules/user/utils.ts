import { IUser } from 'app/core/redux/modules/user/types';

// eslint-disable-next-line import/prefer-default-export
export function normalizeSetUsers(users: Record<string, IUser>) {
  const normalizedUsers: Record<string, IUser> = {};
  Object.entries(users).forEach(([, user]) => {
    normalizedUsers[user.id] = user;
  });

  return normalizedUsers;
}
