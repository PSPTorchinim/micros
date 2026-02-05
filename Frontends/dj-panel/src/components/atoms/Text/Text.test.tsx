import '@testing-library/jest-dom';
// @ts-ignore - React is needed for JSX
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render, screen } from '@testing-library/react';

import { Text } from './Text';

describe('Text', () => {
  it('renders children correctly', () => {
    render(<Text>Hello World</Text>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('applies correct variant class', () => {
    const { container } = render(<Text variant="h1">Heading</Text>);
    expect(container.firstChild).toHaveClass('atom-text--h1');
  });

  it('applies correct weight class', () => {
    const { container } = render(<Text weight="bold">Bold text</Text>);
    expect(container.firstChild).toHaveClass('atom-text--weight-bold');
  });

  it('applies correct alignment class', () => {
    const { container } = render(<Text align="center">Centered</Text>);
    expect(container.firstChild).toHaveClass('atom-text--align-center');
  });

  it('applies correct color class', () => {
    const { container } = render(<Text color="primary">Primary text</Text>);
    expect(container.firstChild).toHaveClass('atom-text--color-primary');
  });

  it('uses custom element when as prop is provided', () => {
    const { container } = render(<Text as="span">Span element</Text>);
    expect(container.firstChild?.nodeName).toBe('SPAN');
  });

  it('applies custom className', () => {
    const { container } = render(<Text className="custom-class">Text</Text>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
