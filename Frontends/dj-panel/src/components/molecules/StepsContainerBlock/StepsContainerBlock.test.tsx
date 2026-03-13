import { render, screen } from '@testing-library/react';
// @ts-ignore - React is needed for JSX
import React from 'react';
import '@testing-library/jest-dom';
import type { StepsContainer, Cta } from '../../../models/api/strapi/apiMap';
import { StepsContainerBlock } from './index';

describe('StepsContainerBlock', () => {
  const mockCta: Cta = {
    id: 1,
    documentId: 'cta-1',
    Label: 'Get Started',
    url: '/register',
    OpenInNewTab: false,
  };

  const mockSteps = [
    {
      id: 1,
      title: 'Step 1',
      description: 'First step description',
      icon: 'user-plus',
    },
    {
      id: 2,
      title: 'Step 2',
      description: 'Second step description',
      icon: 'settings',
    },
    {
      id: 3,
      title: 'Step 3',
      description: 'Third step description',
      icon: 'calendar-check',
    },
  ];

  it('renders heading and content', () => {
    const props: StepsContainer = {
      heading: 'Get Started in 3 Simple Steps',
      content: 'Join thousands of DJs',
      action: mockCta as any,
      steps: mockSteps as any,
    };

    render(<StepsContainerBlock {...props} />);

    expect(
      screen.getByText('Get Started in 3 Simple Steps'),
    ).toBeInTheDocument();
    expect(screen.getByText('Join thousands of DJs')).toBeInTheDocument();
  });

  it('renders all steps with titles and descriptions', () => {
    const props: StepsContainer = {
      heading: 'Get Started',
      content: 'Test content',
      action: mockCta as any,
      steps: mockSteps as any,
    };

    render(<StepsContainerBlock {...props} />);

    mockSteps.forEach((step) => {
      expect(screen.getByText(step.title)).toBeInTheDocument();
      expect(screen.getByText(step.description)).toBeInTheDocument();
    });
  });

  it('renders step numbers correctly', () => {
    const props: StepsContainer = {
      heading: 'Get Started',
      content: 'Test content',
      action: mockCta as any,
      steps: mockSteps as any,
    };

    const { container } = render(<StepsContainerBlock {...props} />);

    // Check that step numbers are rendered (1, 2, 3)
    const stepLabels = container.querySelectorAll('.steps-card-label');
    expect(stepLabels).toHaveLength(3);

    mockSteps.forEach((_, index) => {
      expect(stepLabels[index].textContent).toBe((index + 1).toString());
    });
  });

  it('renders CTA with correct label and url', () => {
    const props: StepsContainer = {
      heading: 'Get Started',
      content: 'Test content',
      action: mockCta as any,
      steps: mockSteps as any,
    };

    render(<StepsContainerBlock {...props} />);

    const ctaLink = screen.getByRole('link', { name: mockCta.Label });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', mockCta.url);
  });

  it('opens CTA in new tab when OpenInNewTab is true', () => {
    const ctaWithNewTab: Cta = {
      ...mockCta,
      OpenInNewTab: true,
    };

    const props: StepsContainer = {
      heading: 'Get Started',
      content: 'Test content',
      action: ctaWithNewTab as any,
      steps: mockSteps as any,
    };

    render(<StepsContainerBlock {...props} />);

    const ctaLink = screen.getByRole('link', { name: ctaWithNewTab.Label });
    expect(ctaLink).toHaveAttribute('target', '_blank');
    expect(ctaLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not add target and rel when OpenInNewTab is false', () => {
    const props: StepsContainer = {
      heading: 'Get Started',
      content: 'Test content',
      action: mockCta as any,
      steps: mockSteps as any,
    };

    render(<StepsContainerBlock {...props} />);

    const ctaLink = screen.getByRole('link', { name: mockCta.Label });
    expect(ctaLink).not.toHaveAttribute('target');
    expect(ctaLink).not.toHaveAttribute('rel');
  });

  it('handles missing CTA gracefully', () => {
    const props: StepsContainer = {
      heading: 'Get Started',
      content: 'Test content',
      action: undefined as any,
      steps: mockSteps as any,
    };

    render(<StepsContainerBlock {...props} />);

    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('handles empty steps array', () => {
    const props: StepsContainer = {
      heading: 'Get Started Empty',
      content: 'Test content',
      action: mockCta as any,
      steps: [] as any,
    };

    render(<StepsContainerBlock {...props} />);

    expect(screen.getByText('Get Started Empty')).toBeInTheDocument();
    expect(screen.queryByText('Step 1')).not.toBeInTheDocument();
  });

  it('renders with only required fields', () => {
    const props: StepsContainer = {
      heading: 'Minimal Steps Container',
      steps: mockSteps as any,
    };

    render(<StepsContainerBlock {...props} />);

    expect(screen.getByText('Minimal Steps Container')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
  });
});
