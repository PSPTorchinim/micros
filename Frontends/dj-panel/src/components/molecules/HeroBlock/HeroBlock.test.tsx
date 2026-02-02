import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import type { HeroBlock as HeroBlockType } from '../../../models/api/strapi/apiMap';
import { HeroBlock } from './index';

describe('HeroBlock', () => {
  it('renders heading and content', () => {
    const props: HeroBlockType = {
      heading: 'Welcome to DJ Beat Blaster',
      content: 'Your complete platform for managing DJ gigs',
    };

    render(<HeroBlock {...props} />);

    expect(screen.getByText('Welcome to DJ Beat Blaster')).toBeInTheDocument();
    expect(
      screen.getByText('Your complete platform for managing DJ gigs'),
    ).toBeInTheDocument();
  });

  it('renders CTA actions with correct labels and URLs', () => {
    const props: HeroBlockType = {
      heading: 'Welcome',
      content: 'Test content',
      actions: [
        {
          id: 1,
          documentId: 'cta-1',
          Label: 'Get Started Free',
          url: '/users/register',
          OpenInNewTab: false,
        },
        {
          id: 2,
          documentId: 'cta-2',
          Label: 'Learn More',
          url: '/about',
          OpenInNewTab: false,
        },
      ] as any,
    };

    render(<HeroBlock {...props} />);

    const getStartedLink = screen.getByRole('link', {
      name: 'Get Started Free',
    });
    expect(getStartedLink).toBeInTheDocument();
    expect(getStartedLink).toHaveAttribute('href', '/users/register');

    const learnMoreLink = screen.getByRole('link', { name: 'Learn More' });
    expect(learnMoreLink).toBeInTheDocument();
    expect(learnMoreLink).toHaveAttribute('href', '/about');
  });

  it('opens CTA in new tab when OpenInNewTab is true', () => {
    const props: HeroBlockType = {
      heading: 'Welcome',
      content: 'Test content',
      actions: [
        {
          id: 1,
          documentId: 'cta-1',
          Label: 'External Link',
          url: 'https://example.com',
          OpenInNewTab: true,
        },
      ] as any,
    };

    render(<HeroBlock {...props} />);

    const link = screen.getByRole('link', { name: 'External Link' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not add target and rel when OpenInNewTab is false', () => {
    const props: HeroBlockType = {
      heading: 'Welcome',
      content: 'Test content',
      actions: [
        {
          id: 1,
          documentId: 'cta-1',
          Label: 'Internal Link',
          url: '/register',
          OpenInNewTab: false,
        },
      ] as any,
    };

    render(<HeroBlock {...props} />);

    const link = screen.getByRole('link', { name: 'Internal Link' });
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  it('handles missing actions gracefully', () => {
    const props: HeroBlockType = {
      heading: 'Welcome',
      content: 'Test content',
      actions: undefined,
    };

    render(<HeroBlock {...props} />);

    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('handles empty actions array', () => {
    const props: HeroBlockType = {
      heading: 'Welcome',
      content: 'Test content',
      actions: [] as any,
    };

    render(<HeroBlock {...props} />);

    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders multiple CTAs correctly', () => {
    const props: HeroBlockType = {
      heading: 'Welcome',
      content: 'Test content',
      actions: [
        {
          id: 1,
          documentId: 'cta-1',
          Label: 'CTA 1',
          url: '/link1',
          OpenInNewTab: false,
        },
        {
          id: 2,
          documentId: 'cta-2',
          Label: 'CTA 2',
          url: '/link2',
          OpenInNewTab: false,
        },
        {
          id: 3,
          documentId: 'cta-3',
          Label: 'CTA 3',
          url: '/link3',
          OpenInNewTab: true,
        },
      ] as any,
    };

    render(<HeroBlock {...props} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);

    expect(screen.getByRole('link', { name: 'CTA 1' })).toHaveAttribute(
      'href',
      '/link1',
    );
    expect(screen.getByRole('link', { name: 'CTA 2' })).toHaveAttribute(
      'href',
      '/link2',
    );
    expect(screen.getByRole('link', { name: 'CTA 3' })).toHaveAttribute(
      'href',
      '/link3',
    );
    expect(screen.getByRole('link', { name: 'CTA 3' })).toHaveAttribute(
      'target',
      '_blank',
    );
  });

  it('renders with only heading', () => {
    const props: HeroBlockType = {
      heading: 'Minimal Hero',
    };

    render(<HeroBlock {...props} />);

    expect(screen.getByText('Minimal Hero')).toBeInTheDocument();
  });
});
