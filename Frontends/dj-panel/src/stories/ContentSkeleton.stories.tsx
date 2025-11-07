import type { Meta, StoryObj } from '@storybook/react';
import { ContentSkeleton } from '../components/atoms/Skeleton';

const meta = {
  title: 'Atoms/ContentSkeleton',
  component: ContentSkeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['page', 'block', 'text', 'card'],
      description: 'The type of content skeleton to display',
    },
    count: {
      control: 'number',
      description: 'Number of skeleton items to display',
    },
  },
} satisfies Meta<typeof ContentSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PageSkeleton: Story = {
  args: {
    type: 'page',
    count: 1,
  },
};

export const BlockSkeleton: Story = {
  args: {
    type: 'block',
    count: 1,
  },
};

export const CardSkeleton: Story = {
  args: {
    type: 'card',
    count: 1,
  },
};

export const TextSkeleton: Story = {
  args: {
    type: 'text',
    count: 1,
  },
};

export const MultipleBlocks: Story = {
  args: {
    type: 'block',
    count: 3,
  },
};

export const MultipleCards: Story = {
  args: {
    type: 'card',
    count: 3,
  },
};
