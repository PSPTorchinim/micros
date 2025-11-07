import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './LoginForm';

const meta = {
  title: 'Molecules/LoginForm',
  component: LoginForm,
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
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: async (email: string, password: string) => {
      console.log('Login submitted:', { email, password });
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

export const WithError: Story = {
  args: {
    onSubmit: async (email: string, password: string) => {
      console.log('Login submitted:', { email, password });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    error: 'Invalid email or password',
  },
};

export const WithLongError: Story = {
  args: {
    onSubmit: async (email: string, password: string) => {
      console.log('Login submitted:', { email, password });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    error: 'Your account has been locked due to multiple failed login attempts. Please try again in 15 minutes or reset your password.',
  },
};
