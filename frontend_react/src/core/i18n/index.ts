/* eslint-disable no-underscore-dangle */
import { MessageFormatElement, ResolvedIntlConfig } from 'react-intl';
import { config, logger } from '../App';

export interface BaseLocale {
  name: string;
  languageCode: string;
  /**
   * https://tools.ietf.org/html/bcp47. (es-ES, es, en-US, en, etc)
   */
  locale: string;
  default?: boolean;
}
export type LocaleData = ResolvedIntlConfig['messages'];
/**
 * A locale that requires its application specific data to be loaded asynchronously.
 */
export interface DynamicLocale extends BaseLocale {
  loader: () => Promise<LocaleData>;
}

/**
 * A locale that has its application specific data assigned at initialization.
 */
export type StaticLocale = BaseLocale;

export type Locale = DynamicLocale | StaticLocale;
export interface LocaleMapping {
  [key: string]: Locale;
}

const determineDefaultLocale = (allLocales: Locale[]): Locale => {
  for (const locale of allLocales) {
    if (locale.default) {
      return locale;
    }
  }
  return allLocales[0];
};
export interface IAppIntl {
  getMessages: () => Record<string, string> | Record<string, MessageFormatElement[]> | undefined;
  resolveLocaleFromCode: (languageCode: string) => BaseLocale | null;
  loadLocale: (preferredLanguageCodes: string[]) => Promise<void>;
}

export const AppIntl = (allLocales: Locale[]): IAppIntl => {
  const _allLocales: Locale[] = allLocales;
  let _locale: Locale | undefined;
  const _defaultLocale: Locale = determineDefaultLocale(allLocales);
  let mapping: LocaleMapping = {};
  let _messages: LocaleData | undefined = {};

  const buildMapping = () => {
    mapping = {};
    _allLocales.forEach((locale) =>
      locale.languageCode
        .toLowerCase()
        .split('-')
        .forEach((_: string, idx: number, codeParts: string[]) => {
          // build mappings with increasing specificity for each scope addition
          const code = codeParts.slice(0, idx + 1).join('-');

          if (!mapping[code]) {
            mapping[code] = locale;
          }
        }),
    );
  };
  buildMapping();

  const getMessages = () => {
    if (!config.optimizedBuild || !_messages || Object.keys(_messages).length === 0)
      return undefined;
    return _messages;
  };

  const resolveLocaleFromCode = (languageCode: string) => {
    if (!languageCode) {
      return null;
    }

    const codeParts = languageCode.toLowerCase().split('-');
    let idx = codeParts.length;

    while (idx > 0) {
      // try matching with decreasing specifity on language scopes
      const fuzzyLanguageCode = codeParts.slice(0, idx).join('-');

      if (mapping[fuzzyLanguageCode]) {
        return mapping[fuzzyLanguageCode];
      }
      // eslint-disable-next-line no-plusplus
      idx--;
    }

    return null;
  };

  // sets locale to first match from preferredLanguageCodes, otherwise uses default
  const _setLocale = (preferredLanguageCodes: string[]) => {
    for (const langCode of preferredLanguageCodes) {
      const locale = resolveLocaleFromCode(langCode);
      if (locale) {
        _locale = locale;
        return;
      }
    }
    _locale = _defaultLocale;
  };

  const loadLocale = async (preferredLanguageCodes: string[]) => {
    _setLocale(preferredLanguageCodes);

    let localeData: LocaleData;

    const locale = _locale || _defaultLocale;
    if ('loader' in locale) {
      try {
        localeData = await locale.loader();
      } catch (error) {
        logger.errorAndReport(
          error instanceof Error ? error : Error(),
          '[Intl] Error loading locale data',
          {
            locale: locale.name,
            error,
          },
        );
        return;
      }
    } else {
      localeData = {};
    }
    _messages = localeData;
  };
  return {
    getMessages,
    resolveLocaleFromCode,
    loadLocale,
  };
};
