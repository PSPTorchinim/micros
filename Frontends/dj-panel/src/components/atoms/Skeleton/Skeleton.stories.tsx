import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore - React is needed for JSX
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'rectangular', 'circular'],
      description: 'The shape variant of the skeleton',
    },
    width: {
      control: 'text',
      description: 'The width of the skeleton (CSS value or number for px)',
    },
    height: {
      control: 'text',
      description: 'The height of the skeleton (CSS value or number for px)',
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    variant: 'text',
    width: '100%',
  },
};

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    width: 300,
    height: 200,
  },
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: 80,
    height: 80,
  },
};

export const CustomWidth: Story = {
  args: {
    variant: 'text',
    width: '60%',
  },
};

export const CustomHeight: Story = {
  args: {
    variant: 'rectangular',
    width: '100%',
    height: 100,
  },
};

export const MultipleLines: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="95%" />
    </div>
  ),
};

export const CardExample: Story = {
  render: () => (
    <div
      style={{
        width: '300px',
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
      }}
    >
      <Skeleton variant="rectangular" width="100%" height={180} />
      <div style={{ marginTop: '16px' }}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />
      </div>
    </div>
  ),
};
