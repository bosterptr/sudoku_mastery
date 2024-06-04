export const USER_NAMESPACE_KEY = 'user';

// eslint-disable-next-line no-shadow
const enum Names {
  getUserProfile,
  setUsers,
}

export default {
  getUserProfile: `${USER_NAMESPACE_KEY}/${Names.getUserProfile}`,
  setUsers: `${USER_NAMESPACE_KEY}/${Names.setUsers}`,
} as const;
