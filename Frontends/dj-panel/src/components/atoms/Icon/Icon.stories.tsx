import type { Meta, StoryObj } from '@storybook/react';
import { AiFillHeart, AiFillHome, AiFillStar } from 'react-icons/ai';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'xlarge'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'muted', 'error', 'success', 'inherit'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    children: <AiFillHeart />,
    size: 'medium',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Icon size="small">
        <AiFillHeart />
      </Icon>
      <Icon size="medium">
        <AiFillHeart />
      </Icon>
      <Icon size="large">
        <AiFillHeart />
      </Icon>
      <Icon size="xlarge">
        <AiFillHeart />
      </Icon>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Icon color="primary">
        <AiFillStar />
      </Icon>
      <Icon color="secondary">
        <AiFillStar />
      </Icon>
      <Icon color="muted">
        <AiFillStar />
      </Icon>
      <Icon color="error">
        <AiFillStar />
      </Icon>
      <Icon color="success">
        <AiFillStar />
      </Icon>
    </div>
  ),
};

export const DifferentIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Icon color="primary">
        <AiFillHeart />
      </Icon>
      <Icon color="primary">
        <AiFillStar />
      </Icon>
      <Icon color="primary">
        <AiFillHome />
      </Icon>
    </div>
  ),
};
