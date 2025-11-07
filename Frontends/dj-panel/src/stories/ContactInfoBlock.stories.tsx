import type { Meta, StoryObj } from '@storybook/react';
import { ContactInfoBlock } from '../components/content-blocks/ContactInfoBlock';

const meta = {
  title: 'Content Blocks/ContactInfoBlock',
  component: ContactInfoBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ContactInfoBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Email: Story = {
  args: {
    iconName: '📧',
    title: 'Email Us',
    content: 'info@djbeatblaster.com',
    detail: 'We respond within 24 hours',
  },
};

export const Phone: Story = {
  args: {
    iconName: '📞',
    title: 'Call Us',
    content: '+1 (555) 123-4567',
    detail: 'Mon-Fri: 9AM-6PM EST',
  },
};

export const Location: Story = {
  args: {
    iconName: '📍',
    title: 'Visit Us',
    content: '123 Music Street, DJ City, MC 12345',
    detail: 'By appointment only',
  },
};

export const Social: Story = {
  args: {
    iconName: '💬',
    title: 'Follow Us',
    content: '@djbeatblaster',
    detail: 'Instagram, Facebook, Twitter',
  },
};

export const WithoutDetail: Story = {
  args: {
    iconName: '⏰',
    title: 'Business Hours',
    content: 'Monday - Friday: 9AM - 6PM',
  },
};
