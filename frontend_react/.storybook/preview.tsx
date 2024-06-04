import type { Preview, ReactRenderer } from '@storybook/react';
// import { withThemes } from '@react-theming/storybook-addon';
import { IntlProvider } from 'react-intl';
import React from 'react';
import { AppIntl } from '../src/core/i18n';
import { DevConfig } from '../src/common/config/dev';
import { initApp } from '../src/core/App';

import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';

import { lightTheme } from '../src/core/themes/lightTheme';

/* TODO: replace with your own global styles, or remove */
const GlobalStyles = createGlobalStyle`
 body {
  background-color: ${(p) => p.theme.palette.background.canvas};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 300;
  height: 100%;
  margin: 0;
  outline: none !important;
  padding: 0;
  *:focus, *:visited, *:active, *:hover  { outline:0 !important;}
  *::-moz-focus-inner {border:0;}
  *::selection {
  background: #1648ff;
  color: #fff;
  text-shadow: none;
  }
  a {
  color: #142a51;
  text-decoration: none;
  }
  * {
  box-sizing: border-box;
  }
}`;

initApp(new DevConfig());

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
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
          b: (chunks) => <b>{chunks}</b>,
        }}
      >
        <Story />
      </IntlProvider>
    ),
    withThemeFromJSXProvider<ReactRenderer>({
      themes: {
        light: lightTheme,
        dark: lightTheme,
      },
      defaultTheme: 'light',
      Provider: ThemeProvider,
      GlobalStyles,
    }),
  ],
};

export default preview;
