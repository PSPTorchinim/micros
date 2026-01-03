import type { Meta, StoryObj } from '@storybook/react';
import { ChangePasswordBlock } from './ChangePasswordBlock';
import { MockServiceProvider } from '../../../../.storybook/mock-providers';

const meta = {
  title: 'Molecules/ChangePasswordBlock',
  component: ChangePasswordBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockServiceProvider>
        <Story />
      </MockServiceProvider>
    ),
  ],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title of the change password form',
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
      description: 'Placeholder for current password field',
    },
    newPasswordPlaceholder: {
      control: 'text',
      description: 'Placeholder for new password field',
    },
    confirmPasswordPlaceholder: {
      control: 'text',
      description: 'Placeholder for confirm password field',
    },
    customStyles: {
      control: 'object',
      description: 'Custom CSS styles',
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
    oldPasswordLabel: 'Old Password',
    newPasswordLabel: 'New Password',
    confirmPasswordLabel: 'Confirm Password',
    submitButtonText: 'Update Password',
  },
};

export const CustomPlaceholders: Story = {
  args: {
    oldPasswordPlaceholder: 'Type your old password',
    newPasswordPlaceholder: 'Type your new password',
    confirmPasswordPlaceholder: 'Re-type your new password',
  },
};

export const WithCustomStyles: Story = {
  args: {
    customStyles: {
      backgroundColor: '#f5f5f5',
      padding: '2rem',
    },
  },
};
