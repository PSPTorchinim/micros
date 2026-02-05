import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Link } from './Link';

describe('Link', () => {
  it('renders children correctly', () => {
    render(
      <MemoryRouter>
        <Link to="/test">Test Link</Link>
      </MemoryRouter>,
    );
    expect(screen.getByText('Test Link')).toBeInTheDocument();
  });

  it('renders as RouterLink for internal links', () => {
    render(
      <MemoryRouter>
        <Link to="/test">Internal Link</Link>
      </MemoryRouter>,
    );
    const link = screen.getByText('Internal Link');
    expect(link).toBeInTheDocument();
  });

  it('renders as anchor tag for external links', () => {
    render(
      <Link href="https://example.com" external>
        External Link
      </Link>,
    );
    const link = screen.getByText('External Link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('applies correct variant class', () => {
    render(
      <MemoryRouter>
        <Link variant="primary" to="/test">
          Primary Link
        </Link>
      </MemoryRouter>,
    );
    expect(screen.getByText('Primary Link')).toHaveClass('atom-link--primary');
  });

  it('applies correct underline class', () => {
    render(
      <MemoryRouter>
        <Link underline="always" to="/test">
          Always Underlined
        </Link>
      </MemoryRouter>,
    );
    expect(screen.getByText('Always Underlined')).toHaveClass(
      'atom-link--underline-always',
    );
  });

  it('handles mailto links correctly', () => {
    render(<Link href="mailto:test@example.com">Email Link</Link>);
    const link = screen.getByText('Email Link');
    expect(link).toHaveAttribute('href', 'mailto:test@example.com');
  });

  it('applies custom className', () => {
    render(
      <MemoryRouter>
        <Link className="custom-class" to="/test">
          Link
        </Link>
      </MemoryRouter>,
    );
    expect(screen.getByText('Link')).toHaveClass('custom-class');
  });
});
