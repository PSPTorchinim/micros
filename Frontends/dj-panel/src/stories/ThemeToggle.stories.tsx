import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from '../components/atoms/ThemeToggle';
import { ThemeProvider } from '../providers/ThemeProvider';

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
