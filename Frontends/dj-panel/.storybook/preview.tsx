import type { Preview } from '@storybook/react-webpack5';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../src/context/theme-context';
import { MockAuthProvider } from './mock-providers';
import React from 'react';
import '../src/index.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <BrowserRouter>
        <ThemeProvider>
          <MockAuthProvider>
            <Story />
          </MockAuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
      ],
    },
  },
};

export default preview;