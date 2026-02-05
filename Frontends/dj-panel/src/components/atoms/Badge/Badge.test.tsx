import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';

import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies correct variant class', () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    expect(container.firstChild).toHaveClass('atom-badge--success');
  });

  it('applies correct size class', () => {
    const { container } = render(<Badge size="large">Large</Badge>);
    expect(container.firstChild).toHaveClass('atom-badge--large');
  });

  it('applies custom className', () => {
    const { container } = render(<Badge className="custom-class">Badge</Badge>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders numeric content', () => {
    render(<Badge>99+</Badge>);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });
});
