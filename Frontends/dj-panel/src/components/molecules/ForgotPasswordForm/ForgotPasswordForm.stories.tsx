import type { Meta, StoryObj } from '@storybook/react';
import { ForgotPasswordForm } from './ForgotPasswordForm';

const meta = {
  title: 'Molecules/ForgotPasswordForm',
  component: ForgotPasswordForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: {
      action: 'submitted',
      description: 'Callback function when form is submitted',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
  },
} satisfies Meta<typeof ForgotPasswordForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: async () => {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

export const WithError: Story = {
  args: {
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    error: 'Email address not found',
  },
};

export const WithNetworkError: Story = {
  args: {
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    error: 'Network error. Please check your connection and try again.',
  },
};
