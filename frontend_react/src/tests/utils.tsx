// test-utils.js
import { RenderOptions, render as rtlRender } from '@testing-library/react';
import { ProductionConfig } from 'app/common/config/production';
import { RootState } from 'app/common/models/global_state';
import { AppStore, IAppStore } from 'app/core/app_store';
import { AppIntl } from 'app/core/i18n';
import { lightTheme } from 'app/core/themes/lightTheme';
import { ReactElement, ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: IAppStore;
}
function render(ui: ReactElement, extendedRenderOptions: ExtendedRenderOptions = {}) {
  const {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = AppStore(new ProductionConfig(), preloadedState),
    ...renderOptions
  } = extendedRenderOptions;
  const AllTheProviders = ({ children }: { children: ReactNode }) => {
    return (
      <MemoryRouter>
        <ThemeProvider theme={lightTheme}>
          <IntlProvider
            locale={window.navigator.language}
            messages={AppIntl([
              {
                name: 'English',
                languageCode: 'en',
                locale: 'en-US',
                default: true,
              },
            ]).getMessages()}
            onError={() => {}}
            defaultRichTextElements={{
              // eslint-disable-next-line react/no-unstable-nested-components
              b: (chunks) => <b>{chunks}</b>,
            }}
          >
            <Provider store={store.getReduxStore()}>{children}</Provider>
          </IntlProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
  };
  return rtlRender(ui, { wrapper: AllTheProviders, ...renderOptions });
}
class NoErrorThrownError extends Error {}
const getError = async <T extends Error>(call: () => unknown): Promise<T> => {
  try {
    await call();

    throw new NoErrorThrownError();
  } catch (error: unknown) {
    return error as T;
  }
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { render, getError };
