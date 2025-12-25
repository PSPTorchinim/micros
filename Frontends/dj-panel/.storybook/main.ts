import type { StorybookConfig } from '@storybook/react-webpack5';
import webpack from 'webpack';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        'process.env': JSON.stringify({
          REACT_APP_API_SECURE_KEY: process.env.REACT_APP_API_SECURE_KEY || '',
        }),
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      })
    );

    // Add fallbacks for Node.js modules
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: path.resolve(__dirname, '../node_modules/buffer'),
      process: path.resolve(__dirname, '../node_modules/process/browser'),
    };

    return config;
  },
};
export default config;
