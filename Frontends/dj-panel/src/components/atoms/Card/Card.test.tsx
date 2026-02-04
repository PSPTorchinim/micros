import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { Card } from './Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies correct variant class', () => {
    const { container } = render(<Card variant="outlined">Content</Card>);
    expect(container.firstChild).toHaveClass('atom-card--outlined');
  });

  it('applies correct padding class', () => {
    const { container } = render(<Card padding="large">Content</Card>);
    expect(container.firstChild).toHaveClass('atom-card--padding-large');
  });

  it('applies hoverable class when hoverable prop is true', () => {
    const { container } = render(<Card hoverable>Content</Card>);
    expect(container.firstChild).toHaveClass('atom-card--hoverable');
  });

  it('does not apply hoverable class when hoverable prop is false', () => {
    const { container } = render(<Card hoverable={false}>Content</Card>);
    expect(container.firstChild).not.toHaveClass('atom-card--hoverable');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
