import type { Meta, StoryObj } from '@storybook/react';
import { CTABlock } from '../components/content-blocks/CTABlock';

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
    heading: 'Ready to Book Your Event?',
    content:
      'Contact us today to discuss your event needs and get a custom quote.',
    action: {
      text: 'Get Started',
      url: '#/contact',
      OpenInNewTab: false,
    },
  },
};

export const WithoutAction: Story = {
  args: {
    heading: 'Premium DJ Services',
    content:
      'Elevate your event with professional DJ services tailored to your needs.',
  },
};

export const ExternalLink: Story = {
  args: {
    heading: 'Follow Us on Social Media',
    content: 'Stay updated with our latest events and special offers.',
    action: {
      text: 'Follow on Instagram',
      url: 'https://instagram.com',
      OpenInNewTab: true,
    },
  },
};

export const LongContent: Story = {
  args: {
    heading: 'Transform Your Event',
    content:
      'From intimate gatherings to large-scale celebrations, our experienced DJs and state-of-the-art equipment ensure your event is memorable. We work closely with you to understand your vision and deliver an unforgettable experience.',
    action: {
      text: 'View Packages',
      url: '#/packages',
      OpenInNewTab: false,
    },
  },
};
