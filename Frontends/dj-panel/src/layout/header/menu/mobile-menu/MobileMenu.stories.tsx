import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { MobileMenu } from './index';

const meta = {
  title: 'Layout/Header/Menu/MobileMenu',
  component: MobileMenu,
  parameters: {
    layout: 'padded',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      useEffect(() => {
        // Auto-open the mobile menu after a short delay
        const timer = setTimeout(() => {
          const burgerMenu = document.querySelector(
            '.navbar-burger-menu',
          ) as HTMLElement;
          if (burgerMenu) {
            burgerMenu.click();
          }
        }, 100);
        return () => clearTimeout(timer);
      }, []);
      return <Story />;
    },
  ],
} satisfies Meta<typeof MobileMenu>;

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

export const WithNestedMenus: Story = {
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
        text: 'Services',
        NavigationOrder: 1,
        Menu: 'Main',
        AuthState: 'All',
        children: [
          {
            id: 21,
            text: 'DJ Sets',
            url: '/services/dj-sets',
            NavigationOrder: 0,
            Menu: 'Main',
            AuthState: 'All',
          },
          {
            id: 22,
            text: 'Private Events',
            url: '/services/private-events',
            NavigationOrder: 1,
            Menu: 'Main',
            AuthState: 'All',
          },
          {
            id: 23,
            text: 'Corporate Events',
            url: '/services/corporate',
            NavigationOrder: 2,
            Menu: 'Main',
            AuthState: 'All',
          },
        ],
      },
      {
        id: 3,
        text: 'Media',
        NavigationOrder: 2,
        Menu: 'Main',
        AuthState: 'All',
        children: [
          {
            id: 31,
            text: 'Photos',
            url: '/media/photos',
            NavigationOrder: 0,
            Menu: 'Main',
            AuthState: 'All',
          },
          {
            id: 32,
            text: 'Videos',
            url: '/media/videos',
            NavigationOrder: 1,
            Menu: 'Main',
            AuthState: 'All',
          },
        ],
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

export const WithDeeplyNestedMenus: Story = {
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
        text: 'Services',
        NavigationOrder: 1,
        Menu: 'Main',
        AuthState: 'All',
        children: [
          {
            id: 21,
            text: 'DJ Sets',
            url: '/services/dj-sets',
            NavigationOrder: 0,
            Menu: 'Main',
            AuthState: 'All',
          },
          {
            id: 22,
            text: 'Private Events',
            url: '/services/private-events',
            NavigationOrder: 1,
            Menu: 'Main',
            AuthState: 'All',
          },
          {
            id: 23,
            text: 'Corporate Events',
            url: '/services/corporate',
            NavigationOrder: 2,
            Menu: 'Main',
            AuthState: 'All',
          },
        ],
      },
      {
        id: 3,
        text: 'Media',
        NavigationOrder: 2,
        Menu: 'Main',
        AuthState: 'All',
        children: [
          {
            id: 31,
            text: 'Photos',
            url: '/media/photos',
            NavigationOrder: 0,
            Menu: 'Main',
            AuthState: 'All',
          },
          {
            id: 32,
            text: 'Videos',
            url: '/media/videos',
            NavigationOrder: 1,
            Menu: 'Main',
            AuthState: 'All',
          },
          {
            id: 33,
            text: 'Music',
            NavigationOrder: 2,
            Menu: 'Main',
            AuthState: 'All',
            children: [
              {
                id: 331,
                text: 'Mixes',
                url: '/media/music/mixes',
                NavigationOrder: 0,
                Menu: 'Main',
                AuthState: 'All',
              },
              {
                id: 332,
                text: 'Tracks',
                url: '/media/music/tracks',
                NavigationOrder: 1,
                Menu: 'Main',
                AuthState: 'All',
              },
            ],
          },
        ],
      },
      {
        id: 4,
        text: 'Contact',
        url: '/contact',
        NavigationOrder: 3,
        Menu: 'Main',
        AuthState: 'All',
      },
      {
        id: 5,
        text: 'Login',
        url: '/login',
        NavigationOrder: 4,
        Menu: 'Login',
        AuthState: 'OnlyUnauthenticated',
      },
    ],
  },
};

export const TabletView: Story = {
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
        text: 'Services',
        NavigationOrder: 1,
        Menu: 'Main',
        AuthState: 'All',
        children: [
          {
            id: 21,
            text: 'DJ Sets',
            url: '/services/dj-sets',
            NavigationOrder: 0,
            Menu: 'Main',
            AuthState: 'All',
          },
          {
            id: 22,
            text: 'Private Events',
            url: '/services/private-events',
            NavigationOrder: 1,
            Menu: 'Main',
            AuthState: 'All',
          },
        ],
      },
      {
        id: 3,
        text: 'Media',
        url: '/media',
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
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
