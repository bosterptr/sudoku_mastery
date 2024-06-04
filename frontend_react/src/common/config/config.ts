import { Locale, LocaleData } from 'app/core/i18n';
import { IBuildType } from '../models/build_type';

export abstract class Config {
  public abstract apiBaseURL: string;

  public abstract baseURL: string;

  public abstract buildType: IBuildType;

  public optimizedBuild = process.env.NODE_ENV === 'production';

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
