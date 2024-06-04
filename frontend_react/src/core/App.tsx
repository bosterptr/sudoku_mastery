/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-mutable-exports */
import { Config } from 'app/common/config';
import { ErrorBoundary } from 'app/components/error-boundary';
import { AppStore, IAppStore } from 'app/core/app_store';
import { AppIntl, IAppIntl } from 'app/core/i18n';
import NOOP from 'app/utils/noop';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { createTheme } from './themes/createTheme';
import { ITheme, ThemeSchemeDark, ThemeSchemeLight } from './themes/types';
import { Logger } from './utils/logger';
import { PassthruLogger } from './utils/logger-passthru';

export let app: SudokuApp;
export let config: typeof app.config;
export let store: typeof app.store;
export let logger: typeof app.logger;

/**
 * The SudokuApp singleton manages global state (such as the Redux
 * store), and knows how to mount React components into the DOM.
 */
export class SudokuApp {
  public config: Config;

  public store: IAppStore;

  public intl: IAppIntl;

  public logger: Logger;

  private colorSchemeListener: (event: MediaQueryListEvent) => void;

  private theme: ITheme;

  private pageTitle = 'Sudoku';

  constructor(configuration: Config) {
    this.config = configuration;
    this.store = AppStore(configuration);
    this.logger = new PassthruLogger();
    this.intl = AppIntl(configuration.locales);
    this.colorSchemeListener = (event: MediaQueryListEvent) => {
      const newColorScheme = event.matches ? ThemeSchemeDark : ThemeSchemeLight;
      this.theme = createTheme(newColorScheme);
    };
    this.theme = createTheme(
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? ThemeSchemeDark
        : ThemeSchemeLight,
    );
  }

  public componentDidMount() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', this.colorSchemeListener);
  }

  public componentWillUnmount() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', this.colorSchemeListener);
  }

  /**
   * Mounts a component wrapped in the SudokuApp higher order components.
   *
   * @param element The component instance to mount.
   * @param rootElement The DOM element to mount under.
   */
  public mount(element: JSX.Element, rootElement: HTMLElement) {
    const root = createRoot(rootElement);
    root.render(this.wrap(element));
  }

  /**
   * Wraps a component in the SudokuApp higher order components.
   *
   * @param element The component instance to wrap.
   */
  public wrap(element: JSX.Element) {
    return (
      <Provider store={this.store.getReduxStore()}>
        <ThemeProvider theme={this.theme}>
          <IntlProvider
            locale={window.navigator.language}
            messages={this.intl.getMessages() as unknown as Record<string, string>}
            onError={NOOP}
            defaultRichTextElements={{
              b: (chunks) => <b>{chunks}</b>,
            }}
          >
            <ErrorBoundary name="root">{element}</ErrorBoundary>
          </IntlProvider>
        </ThemeProvider>
      </Provider>
    );
  }

  /**
   * Sets page title to the specified string if provided.
   * Defaults to "Sudoku" if no string passed in.
   */
  public setPageTitle(title?: string) {
    this.pageTitle = `${title ? `${title} - ` : ''}Sudoku`;
    this.updateDocumentTitle();
  }

  /*
   * Updates document title based on pageTitle and badgeCount
   */
  private updateDocumentTitle() {
    document.title = this.pageTitle;
  }
}

export async function initApp(configuration: Config) {
  app = new SudokuApp(configuration);
  config = app.config;
  store = app.store;
  logger = app.logger;
  await app.intl.loadLocale(navigator.languages.slice());
}
