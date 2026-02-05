import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { AiFillHeart } from 'react-icons/ai';

import { Icon } from './Icon';

describe('Icon', () => {
  it('renders children correctly', () => {
    const { container } = render(
      <Icon>
        <AiFillHeart />
      </Icon>,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies correct size class', () => {
    const { container } = render(
      <Icon size="large">
        <AiFillHeart />
      </Icon>,
    );
    expect(container.firstChild).toHaveClass('atom-icon--large');
  });

  it('applies correct color class', () => {
    const { container } = render(
      <Icon color="primary">
        <AiFillHeart />
      </Icon>,
    );
    expect(container.firstChild).toHaveClass('atom-icon--color-primary');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Icon className="custom-class">
        <AiFillHeart />
      </Icon>,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
