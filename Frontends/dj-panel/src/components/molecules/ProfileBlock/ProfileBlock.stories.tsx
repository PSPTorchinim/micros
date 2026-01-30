import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AuthContext } from '../../../context/auth-context';
import { ProfileBlock } from './index';

const meta = {
  title: 'Molecules/ProfileBlock',
  component: ProfileBlock,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => {
      // Mock user data for ProfileBlock stories
      const mockUser = {
        id: '1',
        username: 'johndoe',
        email: 'john.doe@example.com',
      };

      const mockAuthValue = {
        user: mockUser,
        token: 'mock-token',
        refreshToken: 'mock-refresh-token',
        logout: () => {},
        setUser: () => {},
        setToken: () => {},
        setRefreshToken: () => {},
      };

      return (
        <AuthContext.Provider value={mockAuthValue}>
          <Story />
        </AuthContext.Provider>
      );
    },
  ],
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the profile block',
    },
    description: {
      control: 'text',
      description: 'Description text shown below the title',
    },
    emailLabel: {
      control: 'text',
      description: 'Label for the email field',
    },
    usernameLabel: {
      control: 'text',
      description: 'Label for the username field',
    },
    changePasswordButtonText: {
      control: 'text',
      description: 'Text for the change password button',
    },
    changePasswordUrl: {
      control: 'text',
      description: 'URL to navigate to when change password is clicked',
    },
    customStyles: {
      control: 'object',
      description: 'Custom CSS styles to apply to the container',
    },
  },
} satisfies Meta<typeof ProfileBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomLabels: Story = {
  args: {
    title: 'My Account',
    description: 'View your account information below.',
    emailLabel: 'Email Address',
    usernameLabel: 'User Name',
    changePasswordButtonText: 'Update Password',
  },
};

export const CustomChangePasswordUrl: Story = {
  args: {
    changePasswordUrl: '/account/security',
  },
};

export const FullyCustomized: Story = {
  args: {
    title: 'User Profile',
    description:
      'Here you can view your profile information and manage your account settings.',
    emailLabel: 'Your Email',
    usernameLabel: 'Display Name',
    changePasswordButtonText: 'Change My Password',
    changePasswordUrl: '/settings/password',
  },
};

export const LoggedOut: Story = {
  args: {},
  decorators: [
    (Story) => {
      // Override the default decorator to show logged out state
      const mockAuthValue = {
        user: null,
        token: null,
        refreshToken: null,
        logout: () => {},
        setUser: () => {},
        setToken: () => {},
        setRefreshToken: () => {},
      };

      return (
        <AuthContext.Provider value={mockAuthValue}>
          <Story />
        </AuthContext.Provider>
      );
    },
  ],
};
