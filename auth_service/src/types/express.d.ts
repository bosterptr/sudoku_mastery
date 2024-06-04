declare namespace Express {
  export interface Response {
    resUsernameAndIP: RateLimiterRes | null;
    resSlowByIP: RateLimiterRes | null;
  }
  export interface Request {
    currentUser: { id: string;};
    signedCookies<T extends { [key: string]: string }>(
      cookies: T,
      secret: string | string[]
    ): { [P in keyof T]?: string | false };
  }
}
