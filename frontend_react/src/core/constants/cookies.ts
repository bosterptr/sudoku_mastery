import { CookieAttributes } from 'js-cookie';

export const COMMON_COOKIE_OPTIONS: CookieAttributes = {
  // domain: getCookieDomain(),
  sameSite: 'none',
  secure: true,
};

export const CURRENT_COMPANY_ID_COOKIE_NAME = 'current-company-id';
