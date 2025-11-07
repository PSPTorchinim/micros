import type { Meta, StoryObj } from '@storybook/react';
import { FeatureBlock } from './index';

const meta = {
  title: 'Content Blocks/FeatureBlock',
  component: FeatureBlock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    reversed: {
      control: 'boolean',
      description: 'Reverse the layout (image on right instead of left)',
    },
  },
} satisfies Meta<typeof FeatureBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    reversed: false,
    tabs: [
      {
        title: 'Professional Equipment',
        description: 'State-of-the-art sound systems and lighting equipment for any venue size.',
        imgSrc: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800',
        imgAlt: 'DJ Equipment',
      },
      {
        title: 'Extensive Music Library',
        description: 'Thousands of tracks across all genres to match your event perfectly.',
        imgSrc: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        imgAlt: 'Music Library',
      },
      {
        title: 'Expert DJs',
        description: 'Experienced professionals who read the crowd and keep the party going.',
        imgSrc: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800',
        imgAlt: 'DJ Performance',
      },
    ],
  },
};

export const Reversed: Story = {
  args: {
    reversed: true,
    tabs: [
      {
        title: 'Wedding Services',
        description: 'Make your special day unforgettable with our wedding DJ packages.',
        imgSrc: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        imgAlt: 'Wedding',
      },
      {
        title: 'Corporate Events',
        description: 'Professional entertainment for conferences, galas, and company parties.',
        imgSrc: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
        imgAlt: 'Corporate Event',
      },
      {
        title: 'Private Parties',
        description: 'From birthdays to anniversaries, we bring the energy to your celebration.',
        imgSrc: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
        imgAlt: 'Party',
      },
    ],
  },
};

export const TwoTabs: Story = {
  args: {
    reversed: false,
    tabs: [
      {
        title: 'Indoor Events',
        description: 'Perfect sound and lighting setups for indoor venues of any size.',
        imgSrc: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
        imgAlt: 'Indoor Event',
      },
      {
        title: 'Outdoor Events',
        description: 'Weather-resistant equipment designed for outdoor celebrations.',
        imgSrc: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
        imgAlt: 'Outdoor Event',
      },
    ],
  },
};
