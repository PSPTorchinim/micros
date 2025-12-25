import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { Menu } from './Menu';

const meta = {
  title: 'Components/Molecules/Menu',
  component: Menu,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['mobile', 'desktop'],
      description: 'Menu variant - mobile or desktop',
    },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleLinks = [
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
];

const linksWithAuth = [
  ...sampleLinks,
  {
    id: 5,
    text: 'Login',
    url: '/login',
    NavigationOrder: 4,
    Menu: 'Login',
    AuthState: 'OnlyUnauthenticated',
  },
  {
    id: 6,
    text: 'Logout',
    url: '#',
    NavigationOrder: 5,
    Menu: 'Login',
    AuthState: 'OnlyAuthenticated',
    NavigationAction: 'Action',
  },
];

const linksWithDropdowns = [
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
];

const linksWithNestedDropdowns = [
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
];

// Desktop Stories
export const DesktopDefault: Story = {
  args: {
    variant: 'desktop',
    links: sampleLinks,
  },
};

export const DesktopWithLoginLinks: Story = {
  args: {
    variant: 'desktop',
    links: linksWithAuth,
  },
};

export const DesktopWithDropdowns: Story = {
  args: {
    variant: 'desktop',
    links: linksWithDropdowns,
  },
};

export const DesktopWithNestedDropdowns: Story = {
  args: {
    variant: 'desktop',
    links: linksWithNestedDropdowns,
  },
};

// Mobile Stories
const MobileDecorator = (Story: any) => {
  useEffect(() => {
    // Auto-open the mobile menu after a short delay
    const timer = setTimeout(() => {
      const burgerMenu = document.querySelector(
        '.menu-burger-menu',
      ) as HTMLElement;
      if (burgerMenu) {
        burgerMenu.click();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  return <Story />;
};

export const MobileDefault: Story = {
  args: {
    variant: 'mobile',
    logoSrc: 'https://presentation-website-assets.teleporthq.io/logos/logo.png',
    logoAlt: 'DJ Beat Blaster Logo',
    links: sampleLinks,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [MobileDecorator],
};

export const MobileWithLoginLinks: Story = {
  args: {
    variant: 'mobile',
    logoSrc: 'https://presentation-website-assets.teleporthq.io/logos/logo.png',
    logoAlt: 'DJ Beat Blaster Logo',
    links: linksWithAuth,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [MobileDecorator],
};

export const MobileWithDropdowns: Story = {
  args: {
    variant: 'mobile',
    logoSrc: 'https://presentation-website-assets.teleporthq.io/logos/logo.png',
    logoAlt: 'DJ Beat Blaster Logo',
    links: linksWithDropdowns,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [MobileDecorator],
};

export const MobileWithNestedDropdowns: Story = {
  args: {
    variant: 'mobile',
    logoSrc: 'https://presentation-website-assets.teleporthq.io/logos/logo.png',
    logoAlt: 'DJ Beat Blaster Logo',
    links: linksWithNestedDropdowns,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [MobileDecorator],
};

export const MobileTabletView: Story = {
  args: {
    variant: 'mobile',
    logoSrc: 'https://presentation-website-assets.teleporthq.io/logos/logo.png',
    logoAlt: 'DJ Beat Blaster Logo',
    links: linksWithDropdowns,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  decorators: [MobileDecorator],
};
