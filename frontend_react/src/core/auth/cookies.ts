import { Config } from 'app/common/config';
import { COMMON_COOKIE_OPTIONS } from 'app/core/constants/cookies';
import { SessionUser } from 'app/core/redux/modules/auth/types';
import { Logger } from 'app/core/utils/logger';
import Cookies from 'js-cookie';

const LAST_COMPANY_ID = 'last-company-id';
const AUTH_TOKEN_COOKIE = 'auth-token';
const REFREST_TOKEN_EXPIRATION_COOKIE = 'refresh-token-expiration';

const LOGIN_STATE_COOKIE = 'app-login-state';

/** We delete all these cookies when logging out. */
const COOKIES_TO_REMOVE = [LAST_COMPANY_ID, LOGIN_STATE_COOKIE, REFREST_TOKEN_EXPIRATION_COOKIE];

/**
 * If greater than the stored version, the user cookie will be refreshed.
 * DO NOT increment unless new required session fields are added.
 */
const THIRTEEN_MONTHS = 396;

interface RemoveAuthCookiesOptions {
  config: Config;
}

export function removeAuthCookies({ config }: RemoveAuthCookiesOptions) {
  for (const cookie of COOKIES_TO_REMOVE) {
    Cookies.remove(cookie, COMMON_COOKIE_OPTIONS);
  }
  Cookies.remove(config.authSettings.cookieName, COMMON_COOKIE_OPTIONS);
  Cookies.remove(AUTH_TOKEN_COOKIE, COMMON_COOKIE_OPTIONS);
}

export function setCookie(name: string, value: string, options?: Cookies.CookieAttributes) {
  const thirteenMonths = new Date();
  thirteenMonths.setDate(thirteenMonths.getDate() + THIRTEEN_MONTHS);

  if (
    (options?.expires instanceof Date && options.expires > thirteenMonths) ||
    (typeof options?.expires === 'number' && options.expires > THIRTEEN_MONTHS)
  ) {
    throw new Error('Cookie expiration cannot be longer than 13 months');
  }

  Cookies.set(name, value, {
    expires: THIRTEEN_MONTHS,
    ...options,
    ...COMMON_COOKIE_OPTIONS,
  });
}

interface SyncAuthTokenCookieOptions {
  config: Config;
  logger: Logger;
}

export function setAuthTokenCookie(
  authToken: string,
  { logger }: SyncAuthTokenCookieOptions,
  authTokenExpirationDate: number,
) {
  logger.info('Updating auth token cookie.');
  setCookie(AUTH_TOKEN_COOKIE, authToken, {
    expires: new Date(authTokenExpirationDate),
  });
}

export function getAuthTokenCookie() {
  return Cookies.get(AUTH_TOKEN_COOKIE);
}
export function setRefreshTokenExpirationCookie(
  refreshTokenExpirationDate: number,
  { logger }: SyncAuthTokenCookieOptions,
) {
  logger.info('Updating refresh token cookie.');
  setCookie(REFREST_TOKEN_EXPIRATION_COOKIE, refreshTokenExpirationDate.toString(), {
    expires: new Date(refreshTokenExpirationDate),
  });
}

export function getRefreshTokenExpirationCookie() {
  const data = Cookies.get(REFREST_TOKEN_EXPIRATION_COOKIE);
  if (data) return parseInt(data, 10);
  return false;
}

export function getLastCompanyIdCookie() {
  return Cookies.get(LAST_COMPANY_ID);
}

export function hasDisableAntiDevtoolsCookie() {
  return Cookies.get('RKSHUWDU') === '1';
}

interface GetUserCookieOptions {
  config: Config;
  logger: Logger;
}

export function getUserCookie({ config, logger }: GetUserCookieOptions) {
  const data = Cookies.get(config.authSettings.cookieName);

  if (!data) {
    return;
  }

  try {
    const user = JSON.parse(data) as Partial<SessionUser>;
    logger.debug('Found user cookie.', user);
    if (user.id) {
      if (typeof user.id !== 'string') {
        throw new Error('Invalid "id" value stored in user cookie.');
      }
    } else {
      throw new Error('Missing "id" value in user cookie.');
    }

    if (!user.email || typeof user.email !== 'string') {
      throw new Error('Missing or invalid "email" value stored in user cookie.');
    }
    logger.debug('Successfully loaded user data.', user);

    // eslint-disable-next-line consistent-return
    return user as SessionUser;
  } catch (err) {
    logger.errorAndReport(err as Error, 'Failed to load data from user cookie.', {
      data,
    });
    Cookies.remove(config.authSettings.cookieName, COMMON_COOKIE_OPTIONS);
  }
}

interface SaveUserCookieOptions {
  config: Config;
  logger: Logger;
}

export function saveUserCookie(
  authToken: string,
  authTokenExpirationDate: number,
  refreshTokenExpirationDate: number,
  user: SessionUser,
  { config, logger }: SaveUserCookieOptions,
) {
  logger.debug('Saving user cookie');
  setCookie(config.authSettings.cookieName, JSON.stringify(user));
  setAuthTokenCookie(authToken, { config, logger }, authTokenExpirationDate);
  setRefreshTokenExpirationCookie(refreshTokenExpirationDate, {
    config,
    logger,
  });
}
