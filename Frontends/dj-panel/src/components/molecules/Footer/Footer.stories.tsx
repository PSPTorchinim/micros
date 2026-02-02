import type { Meta, StoryObj } from '@storybook/react';
import type { Footer as FooterData } from '../../../models/api/strapi/apiMap';
import { Footer } from './index';

const meta = {
  title: 'Molecules/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    footerData: {
      copyright: '© 2024 DJ Beat Blaster. All Rights Reserved.',
      columns: [
        {
          id: 1,
          title: 'Company',
          links: [
            { id: 1, label: 'Home', url: '/home', newTab: false },
            { id: 2, label: 'Services', url: '/services', newTab: false },
            { id: 3, label: 'About Us', url: '/about', newTab: false },
            { id: 4, label: 'Contact Us', url: '/contact', newTab: false },
          ],
        },
        {
          id: 2,
          title: 'Quick Links',
          links: [
            { id: 5, label: 'Privacy Policy', url: '/privacy', newTab: false },
            { id: 6, label: 'Cookie Policy', url: '/cookies', newTab: false },
            {
              id: 7,
              label: 'Manage DJ Contracts',
              url: '/contracts',
              newTab: false,
            },
            {
              id: 8,
              label: 'Manage Invoices',
              url: '/invoices',
              newTab: false,
            },
          ],
        },
      ],
      socialLinks: [
        {
          id: 1,
          platform: 'Email',
          icon: 'mail',
          detail: 'contact@djbeatblaster.com',
          url: 'mailto:contact@djbeatblaster.com',
        },
        {
          id: 2,
          platform: 'Facebook',
          icon: 'facebook',
          detail: 'facebook.com/djbeatblaster2024',
          url: 'https://facebook.com/djbeatblaster2024',
        },
        {
          id: 3,
          platform: 'Instagram',
          icon: 'instagram',
          detail: 'instagram.com/dj.beat.blaster',
          url: 'https://instagram.com/dj.beat.blaster',
        },
        {
          id: 4,
          platform: 'TikTok',
          icon: 'tiktok',
          detail: 'tiktok.com/@dj.beat.blaster',
          url: 'https://tiktok.com/@dj.beat.blaster',
        },
      ],
    } as FooterData,
  },
};

export const MinimalFooter: Story = {
  args: {
    footerData: {
      copyright: '© 2024 DJ Beat Blaster. All Rights Reserved.',
      columns: [
        {
          id: 1,
          title: 'Company',
          links: [
            { id: 1, label: 'Home', url: '/home', newTab: false },
            { id: 2, label: 'About', url: '/about', newTab: false },
          ],
        },
      ],
      socialLinks: [
        {
          id: 1,
          platform: 'Email',
          icon: 'email',
          detail: 'contact@djbeatblaster.com',
          url: 'mailto:contact@djbeatblaster.com',
        },
      ],
    } as FooterData,
  },
};

export const MusicFocusedFooter: Story = {
  args: {
    footerData: {
      copyright: '© 2024 DJ Beat Blaster. All Rights Reserved.',
      columns: [
        {
          id: 1,
          title: 'Music',
          links: [
            { id: 1, label: 'Releases', url: '/releases', newTab: false },
            { id: 2, label: 'SoundCloud', url: '/soundcloud', newTab: false },
            { id: 3, label: 'Spotify', url: '/spotify', newTab: false },
            { id: 4, label: 'Beatport', url: '/beatport', newTab: false },
          ],
        },
        {
          id: 2,
          title: 'Events',
          links: [
            { id: 5, label: 'Upcoming Shows', url: '/events', newTab: false },
            {
              id: 6,
              label: 'Past Performances',
              url: '/events/archive',
              newTab: false,
            },
            { id: 7, label: 'Book Now', url: '/booking', newTab: false },
          ],
        },
        {
          id: 3,
          title: 'Connect',
          links: [
            { id: 8, label: 'About', url: '/about', newTab: false },
            { id: 9, label: 'Contact', url: '/contact', newTab: false },
            { id: 10, label: 'Press Kit', url: '/press-kit', newTab: false },
          ],
        },
      ],
      socialLinks: [
        {
          id: 1,
          platform: 'Instagram',
          icon: 'instagram',
          detail: '@djtorchinim',
          url: 'https://instagram.com/djtorchinim',
        },
        {
          id: 2,
          platform: 'Facebook',
          icon: 'facebook',
          detail: 'DJ Beat Blaster',
          url: 'https://facebook.com/djbeatblaster',
        },
        {
          id: 3,
          platform: 'Email',
          icon: 'email',
          detail: 'bookings@djbeatblaster.com',
          url: 'mailto:bookings@djbeatblaster.com',
        },
      ],
    } as FooterData,
  },
};
