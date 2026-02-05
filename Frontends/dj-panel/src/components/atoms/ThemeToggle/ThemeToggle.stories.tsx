import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore - React is needed for JSX
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { ThemeProvider } from '../../../context/theme-context';
import { ThemeToggle } from './ThemeToggle';

const meta = {
  title: 'Atoms/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
