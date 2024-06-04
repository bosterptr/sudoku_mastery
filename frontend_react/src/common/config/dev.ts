import { Config } from 'app/common/config';
import { Locale, LocaleData } from 'app/core/i18n';
import { PRODUCTION_API_BASE_URL, PRODUCTION_BASE_URL } from './constants';
import { BuildTypeDev } from '../models/build_type';

/**
 * Configuration overrides for the development environment.
 */
export class DevConfig extends Config {
  public buildType = BuildTypeDev;

  public baseURL = process.env.BASE_URL || PRODUCTION_BASE_URL;

  public apiBaseURL = PRODUCTION_API_BASE_URL;

  public authSettings = {
    /** Name of the cookie to store user authentication in. */
    cookieName: 'auth',
  };

  public locales: Locale[] = [
    {
      name: 'English',
      languageCode: 'en',
      locale: 'en-US',
      default: true,
    },
    {
      name: 'Polski',
      languageCode: 'pl',
      locale: 'pl-PL',
      loader: () =>
        import(
          /* webpackChunkName: 'core.locales.pl-PL' */ 'app/core/i18n/locales/pl-PL'
        ) as unknown as Promise<LocaleData>,
    },
  ];
}
