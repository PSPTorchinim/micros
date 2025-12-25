import type { Meta, StoryObj } from '@storybook/react';
import { ContentSkeleton } from './Skeleton';

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
      options: [
        'page',
        'block',
        'text',
        'card',
        'hero',
        'article',
        'feature',
        'cta',
        'slider',
      ],
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

export const HeroSkeleton: Story = {
  args: {
    type: 'hero',
    count: 1,
  },
};

export const ArticleSkeleton: Story = {
  args: {
    type: 'article',
    count: 1,
  },
};

export const FeatureSkeleton: Story = {
  args: {
    type: 'feature',
    count: 1,
  },
};

export const CTASkeleton: Story = {
  args: {
    type: 'cta',
    count: 1,
  },
};

export const SliderSkeleton: Story = {
  args: {
    type: 'slider',
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

export const AllSkeletonTypes: Story = {
  args: {
    type: 'page',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h3>Hero Skeleton</h3>
        <ContentSkeleton type="hero" />
      </div>
      <div>
        <h3>Article Skeleton</h3>
        <ContentSkeleton type="article" />
      </div>
      <div>
        <h3>Feature Skeleton</h3>
        <ContentSkeleton type="feature" />
      </div>
      <div>
        <h3>CTA Skeleton</h3>
        <ContentSkeleton type="cta" />
      </div>
      <div>
        <h3>Slider Skeleton</h3>
        <ContentSkeleton type="slider" />
      </div>
    </div>
  ),
};
