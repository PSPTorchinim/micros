import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Atoms/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'filled'],
    },
    padding: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: 'This is a card with default elevated variant',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Card variant="elevated">
        <h3>Elevated Card</h3>
        <p>This card has a shadow effect</p>
      </Card>
      <Card variant="outlined">
        <h3>Outlined Card</h3>
        <p>This card has a border</p>
      </Card>
      <Card variant="filled">
        <h3>Filled Card</h3>
        <p>This card has a filled background</p>
      </Card>
    </div>
  ),
};

export const Paddings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Card padding="none">Content with no padding</Card>
      <Card padding="small">Content with small padding</Card>
      <Card padding="medium">Content with medium padding</Card>
      <Card padding="large">Content with large padding</Card>
    </div>
  ),
};

export const Hoverable: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Card hoverable>
        <h3>Hover Me</h3>
        <p>This card responds to hover</p>
      </Card>
      <Card hoverable variant="outlined">
        <h3>Hover Me Too</h3>
        <p>This outlined card also responds to hover</p>
      </Card>
    </div>
  ),
};

export const WithContent: Story = {
  args: {
    children: (
      <div>
        <h2 style={{ marginTop: 0 }}>Card Title</h2>
        <p>
          This is a card with rich content. It can contain any React elements
          including text, images, buttons, and more.
        </p>
        <button style={{ marginTop: '1rem' }}>Action Button</button>
      </div>
    ),
  },
};
