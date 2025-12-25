import type { StorybookConfig } from '@storybook/react-webpack5';
import webpack from 'webpack';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    // Add webpack plugins to handle process.env and other Node.js globals
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.REACT_APP_API_SECURE_KEY': JSON.stringify(
          process.env.REACT_APP_API_SECURE_KEY || ''
        ),
        'process.env.REACT_APP_API_GATEWAY': JSON.stringify(
          process.env.REACT_APP_API_GATEWAY || ''
        ),
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );

    // Add fallbacks for Node.js modules
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: false,
      process: false,
    };

    return config;
  },
};
export default config;
