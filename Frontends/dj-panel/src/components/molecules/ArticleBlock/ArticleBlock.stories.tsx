import type { Meta, StoryObj } from '@storybook/react';
import { ArticleBlock } from './index';

const meta = {
  title: 'Molecules/ArticleBlock',
  component: ArticleBlock,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ArticleBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    Title: 'Our Services',
    articles: [
      {
        Title: 'Wedding DJ Services',
      },
      {
        Title: 'Corporate Events',
      },
      {
        Title: 'Private Parties',
      },
      {
        Title: 'Club Nights',
      },
    ],
  },
};

export const WithoutLinks: Story = {
  args: {
    Title: 'Event Checklist',
    articles: [
      { Title: 'Book the venue' },
      { Title: 'Select music playlist' },
      { Title: 'Arrange equipment setup' },
      { Title: 'Sound check' },
      { Title: 'Final rehearsal' },
    ],
  },
};

export const MixedLinks: Story = {
  args: {
    Title: 'Quick Links',
    articles: [
      {
        Title: 'About Us',
      },
      { Title: 'Our Team' },
      {
        Title: 'Contact',
      },
      { Title: 'Equipment List' },
      {
        Title: 'Portfolio',
      },
    ],
  },
};

export const WithoutTitle: Story = {
  args: {
    articles: [
      {
        Title: 'Latest Events',
      },
      {
        Title: 'Upcoming Gigs',
      },
      {
        Title: 'Past Performances',
      },
    ],
  },
};
