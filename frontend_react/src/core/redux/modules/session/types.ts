export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
}

export interface ISessionState {
  firstPageLoaded: boolean;
  user: SessionUser | null;
}
