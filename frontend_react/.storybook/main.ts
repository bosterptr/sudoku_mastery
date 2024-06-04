import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/themes'
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: false,
      },
    },
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    reactDocgen: 'react-docgen', // or false if you don't need docgen at all
  },
  core: {
    disableTelemetry: true, // 👈 Disables telemetry
  },
  webpackFinal: async (config) => {
    if (config.resolve && config.resolve.alias)
      config.resolve.alias['app'] = path.resolve(__dirname, '../src');
    return config;
  },
  babel: async (options) => {
    console.log(options);
    const babelConfig = {
      ...options,
      plugins: [
        ...(options.plugins || []),
        [
          'formatjs',
          {
            idInterpolationPattern: '[sha512:contenthash:base64:6]',
            ast: true,
          },
        ],
      ],
    };
    return babelConfig;
  },
};
export default config;
