import type { Meta, StoryObj } from '@storybook/react';
import { ChangePasswordBlock } from './index';

const meta = {
  title: 'Molecules/ChangePasswordBlock',
  component: ChangePasswordBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the change password form',
    },
    description: {
      control: 'text',
      description: 'Description text shown below the title',
    },
    oldPasswordLabel: {
      control: 'text',
      description: 'Label for the current password field',
    },
    newPasswordLabel: {
      control: 'text',
      description: 'Label for the new password field',
    },
    confirmPasswordLabel: {
      control: 'text',
      description: 'Label for the confirm password field',
    },
    submitButtonText: {
      control: 'text',
      description: 'Text for the submit button',
    },
    oldPasswordPlaceholder: {
      control: 'text',
      description: 'Placeholder for the current password field',
    },
    newPasswordPlaceholder: {
      control: 'text',
      description: 'Placeholder for the new password field',
    },
    confirmPasswordPlaceholder: {
      control: 'text',
      description: 'Placeholder for the confirm password field',
    },
    successRedirectPath: {
      control: 'text',
      description: 'Path to redirect to after successful password change',
    },
  },
} satisfies Meta<typeof ChangePasswordBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomLabels: Story = {
  args: {
    title: 'Update Your Password',
    description: 'Please enter your current password and choose a new one.',
    oldPasswordLabel: 'Old Password',
    newPasswordLabel: 'Choose New Password',
    confirmPasswordLabel: 'Repeat New Password',
    submitButtonText: 'Update Password',
  },
};

export const CustomPlaceholders: Story = {
  args: {
    oldPasswordPlaceholder: 'Type your old password here',
    newPasswordPlaceholder: 'Create a strong new password',
    confirmPasswordPlaceholder: 'Re-enter your new password',
  },
};

export const WithCustomRedirect: Story = {
  args: {
    successRedirectPath: '/profile',
  },
};

export const FullyCustomized: Story = {
  args: {
    title: 'Security Update',
    description:
      'For your security, please change your password regularly. Use a strong password with at least 6 characters.',
    oldPasswordLabel: 'Current Password',
    newPasswordLabel: 'New Password',
    confirmPasswordLabel: 'Verify New Password',
    submitButtonText: 'Save New Password',
    oldPasswordPlaceholder: 'Enter current password',
    newPasswordPlaceholder: 'Enter new password (min. 6 characters)',
    confirmPasswordPlaceholder: 'Confirm new password',
    successRedirectPath: '/account',
  },
};
