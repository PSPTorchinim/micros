import type { Meta, StoryObj } from '@storybook/react';
import { DashboardBlock } from './DashboardBlock';
import { MockAuthProvider } from '../../../../.storybook/mock-providers';

const meta = {
  title: 'Molecules/DashboardBlock',
  component: DashboardBlock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockAuthProvider>
        <Story />
      </MockAuthProvider>
    ),
  ],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title of the dashboard',
    },
    welcomeMessage: {
      control: 'text',
      description: 'Welcome message displayed to the user',
    },
    customStyles: {
      control: 'object',
      description: 'Custom CSS styles',
    },
  },
} satisfies Meta<typeof DashboardBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomTitle: Story = {
  args: {
    title: 'My Dashboard',
    welcomeMessage: 'Hello, welcome back!',
  },
};

export const ShortWelcome: Story = {
  args: {
    welcomeMessage: 'Welcome back',
  },
};

export const WithCustomStyles: Story = {
  args: {
    customStyles: {
      backgroundColor: '#f5f5f5',
    },
  },
};
