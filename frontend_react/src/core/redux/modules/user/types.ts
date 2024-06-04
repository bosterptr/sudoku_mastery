export interface IUser {
  id: string;
  blocked: boolean | null;
  displayName: string;
  email: string | null;
  profileBio: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface IUserState {
  users: Record<string, IUser>;
}
