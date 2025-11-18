import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CTABlock } from './index';
import type { Cta } from '../../../models/strapi/strapiMap';

describe('CTABlock', () => {
  it('renders CTA with label and url', () => {
    const props: Cta = {
      id: 1,
      documentId: 'cta-1',
      Label: 'Sign Up Now',
      url: '/register',
      OpenInNewTab: false,
    };

    render(<CTABlock {...props} />);

    // Label appears twice (heading and button)
    const elements = screen.getAllByText('Sign Up Now');
    expect(elements.length).toBe(2);

    const link = screen.getByRole('link', { name: 'Sign Up Now' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/register');
  });

  it('opens link in new tab when OpenInNewTab is true', () => {
    const props: Cta = {
      id: 1,
      documentId: 'cta-1',
      Label: 'External Resource',
      url: 'https://example.com',
      OpenInNewTab: true,
    };

    render(<CTABlock {...props} />);

    const link = screen.getByRole('link', { name: 'External Resource' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not add target and rel when OpenInNewTab is false', () => {
    const props: Cta = {
      id: 1,
      documentId: 'cta-1',
      Label: 'Internal Link',
      url: '/about',
      OpenInNewTab: false,
    };

    render(<CTABlock {...props} />);

    const link = screen.getByRole('link', { name: 'Internal Link' });
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  it('does not render link when url is missing', () => {
    const props: Cta = {
      id: 1,
      documentId: 'cta-1',
      Label: 'No Link',
      url: undefined as any,
      OpenInNewTab: false,
    };

    render(<CTABlock {...props} />);

    expect(screen.getByText('No Link')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('does not render link when url is empty string', () => {
    const props: Cta = {
      id: 1,
      documentId: 'cta-1',
      Label: 'Empty URL',
      url: '',
      OpenInNewTab: false,
    };

    render(<CTABlock {...props} />);

    expect(screen.getByText('Empty URL')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('uses Label for both heading and button text', () => {
    const props: Cta = {
      id: 1,
      documentId: 'cta-1',
      Label: 'Get Started Today',
      url: '/start',
      OpenInNewTab: false,
    };

    render(<CTABlock {...props} />);

    // Label appears in heading and button (both rendered)
    const elements = screen.getAllByText('Get Started Today');
    expect(elements.length).toBe(2); // One in heading, one in button
    
    // Label also appears in button
    const link = screen.getByRole('link', { name: 'Get Started Today' });
    expect(link.textContent).toBe('Get Started Today');
  });

  it('renders with default OpenInNewTab false', () => {
    const props: Cta = {
      id: 1,
      documentId: 'cta-1',
      Label: 'Click Here',
      url: '/destination',
    };

    render(<CTABlock {...props} />);

    const link = screen.getByRole('link', { name: 'Click Here' });
    expect(link).not.toHaveAttribute('target');
  });
});
