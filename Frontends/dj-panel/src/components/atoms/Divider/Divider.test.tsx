import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';

import { Divider } from './Divider';

describe('Divider', () => {
  it('renders correctly', () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('applies correct orientation class', () => {
    const { container } = render(<Divider orientation="vertical" />);
    expect(container.firstChild).toHaveClass('atom-divider--vertical');
  });

  it('applies correct variant class', () => {
    const { container } = render(<Divider variant="dashed" />);
    expect(container.firstChild).toHaveClass('atom-divider--dashed');
  });

  it('applies correct spacing class', () => {
    const { container } = render(<Divider spacing="large" />);
    expect(container.firstChild).toHaveClass('atom-divider--spacing-large');
  });

  it('applies custom className', () => {
    const { container } = render(<Divider className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
