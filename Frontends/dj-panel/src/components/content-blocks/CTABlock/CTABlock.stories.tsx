import type { Meta, StoryObj } from '@storybook/react';
import { CTABlock } from './index';

const meta = {
  title: 'Content Blocks/CTABlock',
  component: CTABlock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CTABlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 1,
    documentId: 'cta-1',
    Label: 'Get Started Now',
    url: '#/contact',
    OpenInNewTab: false,
  },
};

export const ExternalLink: Story = {
  args: {
    id: 2,
    documentId: 'cta-2',
    Label: 'Follow on Instagram',
    url: 'https://instagram.com',
    OpenInNewTab: true,
  },
};

export const LongLabel: Story = {
  args: {
    id: 3,
    documentId: 'cta-3',
    Label: 'View Our Complete Service Packages',
    url: '#/packages',
    OpenInNewTab: false,
  },
};

export const BookingCTA: Story = {
  args: {
    id: 4,
    documentId: 'cta-4',
    Label: 'Book Your Event Today',
    url: '#/book',
    OpenInNewTab: false,
  },
};
