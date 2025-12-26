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
    items: [
      {
        Title: 'Wedding DJ Services',
        url: '#/services/wedding',
      },
      {
        Title: 'Corporate Events',
        url: '#/services/corporate',
      },
      {
        Title: 'Private Parties',
        url: '#/services/private',
      },
      {
        Title: 'Club Nights',
        url: '#/services/club',
      },
    ],
  },
};

export const WithoutLinks: Story = {
  args: {
    Title: 'Event Checklist',
    items: [
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
    items: [
      {
        Title: 'About Us',
        url: '#/about',
      },
      { Title: 'Our Team' },
      {
        Title: 'Contact',
        url: '#/contact',
      },
      { Title: 'Equipment List' },
      {
        Title: 'Portfolio',
        url: '#/portfolio',
      },
    ],
  },
};

export const WithoutTitle: Story = {
  args: {
    items: [
      {
        Title: 'Latest Events',
        url: '#/events/latest',
      },
      {
        Title: 'Upcoming Gigs',
        url: '#/events/upcoming',
      },
      {
        Title: 'Past Performances',
        url: '#/events/past',
      },
    ],
  },
};
