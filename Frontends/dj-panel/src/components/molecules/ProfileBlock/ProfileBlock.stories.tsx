import type { Meta, StoryObj } from '@storybook/react';
import { ProfileBlock } from './ProfileBlock';
import {
  MockAuthProvider,
  MockServiceProvider,
} from '../../../../.storybook/mock-providers';

const meta = {
  title: 'Molecules/ProfileBlock',
  component: ProfileBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockAuthProvider>
        <MockServiceProvider>
          <Story />
        </MockServiceProvider>
      </MockAuthProvider>
    ),
  ],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title of the profile block',
    },
    customStyles: {
      control: 'object',
      description: 'Custom CSS styles',
    },
  },
} satisfies Meta<typeof ProfileBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomTitle: Story = {
  args: {
    title: 'User Profile',
  },
};

export const WithCustomStyles: Story = {
  args: {
    title: 'My Profile',
    customStyles: {
      backgroundColor: '#f5f5f5',
      padding: '2rem',
    },
  },
};
