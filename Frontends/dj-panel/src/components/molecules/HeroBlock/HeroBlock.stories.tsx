import type { Meta, StoryObj } from '@storybook/react';
import { HeroBlock } from './index';

const meta = {
  title: 'Content Blocks/HeroBlock',
  component: HeroBlock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HeroBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'Welcome to DJ Beat Blaster',
    content:
      'Professional DJ services for all your events. From weddings to corporate events, we bring the party to life.',
    actions: [
      {
        id: 1,
        documentId: 'cta-1',
        Label: 'Get Started',
        url: '#/get-started',
        OpenInNewTab: false,
      },
      {
        id: 2,
        documentId: 'cta-2',
        Label: 'Learn More',
        url: '#/learn-more',
        OpenInNewTab: false,
      },
    ],
  },
};

export const SingleAction: Story = {
  args: {
    heading: 'Book Your DJ Today',
    content: 'Create unforgettable moments with our professional DJ services.',
    actions: [
      {
        id: 1,
        documentId: 'cta-1',
        Label: 'Book Now',
        url: '#/book',
        OpenInNewTab: false,
      },
    ],
  },
};

export const ExternalLink: Story = {
  args: {
    heading: 'Join Our Community',
    content:
      'Connect with us on social media and stay updated with the latest events.',
    actions: [
      {
        id: 1,
        documentId: 'cta-1',
        Label: 'Follow Us',
        url: 'https://facebook.com',
        OpenInNewTab: true,
      },
    ],
  },
};

export const LongContent: Story = {
  args: {
    heading: 'Premium DJ Services for Every Occasion',
    content:
      "Whether you're planning a wedding, corporate event, birthday party, or any special celebration, our experienced DJs bring professional equipment, extensive music libraries, and the energy to make your event unforgettable. We work with you to create the perfect atmosphere for your guests.",
    actions: [
      {
        id: 1,
        documentId: 'cta-1',
        Label: 'View Packages',
        url: '#/packages',
        OpenInNewTab: false,
      },
      {
        id: 2,
        documentId: 'cta-2',
        Label: 'Contact Us',
        url: '#/contact',
        OpenInNewTab: false,
      },
    ],
  },
};
