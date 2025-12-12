import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './index';
import { BrowserRouter } from 'react-router-dom';

const meta = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    logoSrc: 'https://presentation-website-assets.teleporthq.io/logos/logo.png',
    logoAlt: 'DJ Beat Blaster Logo',
    links: [
      {
        id: 1,
        text: 'Home',
        url: '/',
        NavigationOrder: 0,
        Menu: 'Main',
        AuthState: 'All',
      },
      {
        id: 2,
        text: 'About',
        url: '/about',
        NavigationOrder: 1,
        Menu: 'Main',
        AuthState: 'All',
      },
      {
        id: 3,
        text: 'Events',
        url: '/events',
        NavigationOrder: 2,
        Menu: 'Main',
        AuthState: 'All',
      },
      {
        id: 4,
        text: 'Contact',
        url: '/contact',
        NavigationOrder: 3,
        Menu: 'Main',
        AuthState: 'All',
      },
    ],
  },
};

export const WithLoginLinks: Story = {
  args: {
    logoSrc: 'https://presentation-website-assets.teleporthq.io/logos/logo.png',
    logoAlt: 'DJ Beat Blaster Logo',
    links: [
      {
        id: 1,
        text: 'Home',
        url: '/',
        NavigationOrder: 0,
        Menu: 'Main',
        AuthState: 'All',
      },
      {
        id: 2,
        text: 'About',
        url: '/about',
        NavigationOrder: 1,
        Menu: 'Main',
        AuthState: 'All',
      },
      {
        id: 3,
        text: 'Events',
        url: '/events',
        NavigationOrder: 2,
        Menu: 'Main',
        AuthState: 'All',
      },
      {
        id: 4,
        text: 'Login',
        url: '/login',
        NavigationOrder: 3,
        Menu: 'Login',
        AuthState: 'OnlyUnauthenticated',
      },
      {
        id: 5,
        text: 'Logout',
        url: '#',
        NavigationOrder: 4,
        Menu: 'Login',
        AuthState: 'OnlyAuthenticated',
        NavigationAction: 'Action',
      },
    ],
  },
};

export const MinimalHeader: Story = {
  args: {
    logoSrc: 'https://presentation-website-assets.teleporthq.io/logos/logo.png',
    logoAlt: 'DJ Beat Blaster Logo',
    links: [
      {
        id: 1,
        text: 'Home',
        url: '/',
        NavigationOrder: 0,
        Menu: 'Main',
        AuthState: 'All',
      },
      {
        id: 2,
        text: 'Contact',
        url: '/contact',
        NavigationOrder: 1,
        Menu: 'Main',
        AuthState: 'All',
      },
    ],
  },
};

export const ExtendedNavigation: Story = {
  args: {
    logoSrc: 'https://presentation-website-assets.teleporthq.io/logos/logo.png',
    logoAlt: 'DJ Beat Blaster Logo',
    links: [
      {
        id: 1,
        text: 'Home',
        url: '/',
        NavigationOrder: 0,
        Menu: 'Main',
        AuthState: 'All',
      },
      {
        id: 2,
        text: 'About',
        url: '/about',
        NavigationOrder: 1,
        Menu: 'Main',
        AuthState: 'All',
      },
      {
        id: 3,
        text: 'Events',
        url: '/events',
        NavigationOrder: 2,
        Menu: 'Main',
        AuthState: 'All',
      },
      {
        id: 4,
        text: 'Music',
        url: '/music',
        NavigationOrder: 3,
        Menu: 'Main',
        AuthState: 'All',
      },
      {
        id: 5,
        text: 'Gallery',
        url: '/gallery',
        NavigationOrder: 4,
        Menu: 'Main',
        AuthState: 'All',
      },
      {
        id: 6,
        text: 'Blog',
        url: '/blog',
        NavigationOrder: 5,
        Menu: 'Main',
        AuthState: 'All',
      },
      {
        id: 7,
        text: 'Contact',
        url: '/contact',
        NavigationOrder: 6,
        Menu: 'Main',
        AuthState: 'All',
      },
    ],
  },
};
