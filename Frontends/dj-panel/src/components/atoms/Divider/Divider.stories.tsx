import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore - React is needed for JSX
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Atoms/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
    },
    spacing: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  args: {},
};

export const Horizontal: Story = {
  render: () => (
    <div>
      <p>Content above divider</p>
      <Divider />
      <p>Content below divider</p>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div>
      <p>Solid divider</p>
      <Divider variant="solid" />
      <p>Dashed divider</p>
      <Divider variant="dashed" />
      <p>Dotted divider</p>
      <Divider variant="dotted" />
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div>
      <p>Small spacing</p>
      <Divider spacing="small" />
      <p>Medium spacing</p>
      <Divider spacing="medium" />
      <p>Large spacing</p>
      <Divider spacing="large" />
      <p>End</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', height: '100px' }}>
      <span>Left content</span>
      <Divider orientation="vertical" />
      <span>Middle content</span>
      <Divider orientation="vertical" variant="dashed" />
      <span>Right content</span>
    </div>
  ),
};
