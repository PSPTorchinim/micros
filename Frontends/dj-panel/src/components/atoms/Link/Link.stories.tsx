import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';

const meta: Meta<typeof Link> = {
  title: 'Atoms/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'muted'],
    },
    underline: {
      control: 'select',
      options: ['none', 'hover', 'always'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    children: 'Default Link',
    to: '/home',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Link variant="default" to="/home">
        Default Link
      </Link>
      <Link variant="primary" to="/home">
        Primary Link
      </Link>
      <Link variant="secondary" to="/home">
        Secondary Link
      </Link>
      <Link variant="muted" to="/home">
        Muted Link
      </Link>
    </div>
  ),
};

export const Underline: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Link underline="none" to="/home">
        No Underline
      </Link>
      <Link underline="hover" to="/home">
        Underline on Hover
      </Link>
      <Link underline="always" to="/home">
        Always Underlined
      </Link>
    </div>
  ),
};

export const ExternalLink: Story = {
  args: {
    children: 'External Link',
    href: 'https://example.com',
    external: true,
  },
};

export const MailtoLink: Story = {
  args: {
    children: 'Email Us',
    href: 'mailto:info@example.com',
  },
};
