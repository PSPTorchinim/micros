import type { Meta, StoryObj } from '@storybook/react';
import { StepsContainerBlock } from './index';

const meta = {
  title: 'Content Blocks/StepsContainerBlock',
  component: StepsContainerBlock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StepsContainerBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'Get Started in 3 Simple Steps',
    content:
      'Join thousands of DJs already using DJ Beat Blaster to manage their business',
    action: {
      id: 1,
      documentId: 'cta-1',
      Label: 'Create Account',
      url: '/users/register',
      OpenInNewTab: false,
    },
    steps: [
      {
        id: 1,
        title: 'Sign Up',
        description: 'Create your free account in under 60 seconds',
        icon: 'user-plus',
      },
      {
        id: 2,
        title: 'Set Up Your Profile',
        description: 'Add your services, equipment, and availability',
        icon: 'settings',
      },
      {
        id: 3,
        title: 'Start Managing',
        description: 'Book gigs, manage clients, and grow your business',
        icon: 'calendar-check',
      },
    ],
  },
};

export const WithoutAction: Story = {
  args: {
    heading: 'How It Works',
    content: 'Follow these simple steps to get the most out of our platform',
    steps: [
      {
        id: 1,
        title: 'Create Profile',
        description: 'Set up your DJ profile with your information',
        icon: 'user',
      },
      {
        id: 2,
        title: 'Add Equipment',
        description: 'List all your DJ equipment and gear',
        icon: 'music',
      },
      {
        id: 3,
        title: 'Start Booking',
        description: 'Accept bookings and manage your calendar',
        icon: 'calendar',
      },
    ],
  },
};

export const FourSteps: Story = {
  args: {
    heading: 'Complete Setup Guide',
    content: 'Everything you need to know to get started',
    action: {
      id: 1,
      documentId: 'cta-1',
      Label: 'Get Started Free',
      url: '/register',
      OpenInNewTab: false,
    },
    steps: [
      {
        id: 1,
        title: 'Register',
        description: 'Create your account',
        icon: 'user-plus',
      },
      {
        id: 2,
        title: 'Verify Email',
        description: 'Confirm your email address',
        icon: 'mail',
      },
      {
        id: 3,
        title: 'Complete Profile',
        description: 'Add your details and preferences',
        icon: 'edit',
      },
      {
        id: 4,
        title: 'Go Live',
        description: 'Start accepting bookings',
        icon: 'check-circle',
      },
    ],
  },
};

export const ExternalLinkAction: Story = {
  args: {
    heading: 'Learn More About Our Services',
    content: 'Discover all the features we offer',
    action: {
      id: 1,
      documentId: 'cta-1',
      Label: 'Watch Tutorial',
      url: 'https://youtube.com/tutorial',
      OpenInNewTab: true,
    },
    steps: [
      {
        id: 1,
        title: 'Watch Video',
        description: 'See our platform in action',
        icon: 'play',
      },
      {
        id: 2,
        title: 'Try Demo',
        description: 'Test drive the features',
        icon: 'mouse-pointer',
      },
      {
        id: 3,
        title: 'Sign Up',
        description: 'Create your free account',
        icon: 'check',
      },
    ],
  },
};

export const MinimalSteps: Story = {
  args: {
    heading: 'Quick Start',
    steps: [
      {
        id: 1,
        title: 'Install',
        description: 'Download and install the app',
        icon: 'download',
      },
      {
        id: 2,
        title: 'Launch',
        description: 'Open the application',
        icon: 'play-circle',
      },
    ],
  },
};
