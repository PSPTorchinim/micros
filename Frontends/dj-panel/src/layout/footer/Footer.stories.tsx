import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './index';
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillMail,
  AiFillTikTok,
} from 'react-icons/ai';
import { BrowserRouter } from 'react-router-dom';

const meta = {
  title: 'Layout/Footer',
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
    content3: '© 2024 DJ Beat Blaster. All Rights Reserved.',
    logoSrc: 'https://presentation-website-assets.teleporthq.io/logos/logo.png',
    logoAlt: 'DJ Management Logo',
    socialLinkTitleCategory: 'Connect with Us',
    links: [
      {
        title: 'Company',
        items: [
          { href: '/home', text: 'Home' },
          { href: '/services', text: 'Services' },
          { href: '/about', text: 'About Us' },
          { href: '/contact', text: 'Contact Us' },
        ],
      },
      {
        title: 'Quick Links',
        items: [
          { href: '/privacy', text: 'Privacy Policy' },
          { href: '/cookies', text: 'Cookie Policy' },
          { href: '/contracts', text: 'Manage DJ Contracts' },
          { href: '/invoices', text: 'Manage Invoices' },
        ],
      },
    ],
    socialLinks: [
      {
        title: 'Email',
        content: 'Send us an email for any questions or concerns.',
        detail: 'contact@djbeatblaster.com',
        iconPath: AiFillMail,
      },
      {
        title: 'Facebook',
        content: 'Stay connected with us on Facebook.',
        detail: 'facebook.com/djbeatblaster2024',
        iconPath: AiFillFacebook,
      },
      {
        title: 'Instagram',
        content: 'Follow us on Instagram for the latest updates.',
        detail: 'instagram.com/dj.beat.blaster',
        iconPath: AiFillInstagram,
      },
      {
        title: 'TikTok',
        content: 'Follow us on TikTok for the latest updates.',
        detail: 'tiktok.com/@dj.beat.blaster',
        iconPath: AiFillTikTok,
      },
    ],
    privacyLink: 'Privacy Policy',
    termsLink: 'Terms of Service',
    cookiesLink: 'Cookie Policy',
  },
};

export const MinimalFooter: Story = {
  args: {
    content3: '© 2024 DJ Beat Blaster. All Rights Reserved.',
    logoSrc: 'https://presentation-website-assets.teleporthq.io/logos/logo.png',
    logoAlt: 'DJ Management Logo',
    socialLinkTitleCategory: 'Connect with Us',
    links: [
      {
        title: 'Company',
        items: [
          { href: '/home', text: 'Home' },
          { href: '/about', text: 'About' },
        ],
      },
    ],
    socialLinks: [
      {
        title: 'Email',
        content: 'Send us an email.',
        detail: 'contact@djbeatblaster.com',
        iconPath: AiFillMail,
      },
    ],
    privacyLink: 'Privacy Policy',
    termsLink: 'Terms of Service',
    cookiesLink: 'Cookie Policy',
  },
};

export const MusicFocusedFooter: Story = {
  args: {
    content3: '© 2024 DJ Beat Blaster. All Rights Reserved.',
    logoSrc: 'https://presentation-website-assets.teleporthq.io/logos/logo.png',
    logoAlt: 'DJ Management Logo',
    socialLinkTitleCategory: 'Follow the Beat',
    links: [
      {
        title: 'Music',
        items: [
          { href: '/releases', text: 'Releases' },
          { href: '/soundcloud', text: 'SoundCloud' },
          { href: '/spotify', text: 'Spotify' },
          { href: '/beatport', text: 'Beatport' },
        ],
      },
      {
        title: 'Events',
        items: [
          { href: '/events', text: 'Upcoming Shows' },
          { href: '/events/archive', text: 'Past Performances' },
          { href: '/booking', text: 'Book Now' },
        ],
      },
      {
        title: 'Connect',
        items: [
          { href: '/about', text: 'About' },
          { href: '/contact', text: 'Contact' },
          { href: '/press-kit', text: 'Press Kit' },
        ],
      },
    ],
    socialLinks: [
      {
        title: 'Instagram',
        content: 'Follow us on Instagram.',
        detail: '@djtorchinim',
        iconPath: AiFillInstagram,
      },
      {
        title: 'Facebook',
        content: 'Like us on Facebook.',
        detail: 'DJ Beat Blaster',
        iconPath: AiFillFacebook,
      },
      {
        title: 'Email',
        content: 'Get in touch.',
        detail: 'bookings@djbeatblaster.com',
        iconPath: AiFillMail,
      },
    ],
    privacyLink: 'Privacy Policy',
    termsLink: 'Terms of Service',
    cookiesLink: 'Cookie Policy',
  },
};
