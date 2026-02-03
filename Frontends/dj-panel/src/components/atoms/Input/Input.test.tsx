import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { Input } from './Input';

describe('Input Component', () => {
  it('renders without label', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText(/enter text/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('atom-input');
  });

  it('renders with label', () => {
    render(<Input label="Username" />);
    const label = screen.getByText(/username/i);
    const input = screen.getByLabelText(/username/i);
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('renders with error message', () => {
    render(<Input error="This field is required" />);
    const error = screen.getByText(/this field is required/i);
    const input = screen.getByRole('textbox');
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass('atom-input-error');
    expect(input).toHaveClass('atom-input--error');
  });

  it('renders with fullWidth prop', () => {
    render(<Input fullWidth />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('atom-input--full-width');
  });

  it('applies custom className', () => {
    render(<Input className="custom-input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-input');
    expect(input).toHaveClass('atom-input');
  });

  it('handles onChange event', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('passes through native input props', () => {
    render(<Input type="email" placeholder="Enter email" required />);
    const input = screen.getByPlaceholderText(/enter email/i);
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('required');
  });

  it('uses provided id', () => {
    render(<Input id="custom-id" label="Custom ID" />);
    const input = screen.getByLabelText(/custom id/i);
    expect(input).toHaveAttribute('id', 'custom-id');
  });

  it('generates random id when not provided', () => {
    const { container } = render(<Input label="Auto ID" />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('id');
    // useId generates IDs like ":r0:", ":r1:", etc. Just verify it exists and is non-empty
    expect(input?.id).toBeTruthy();
    expect(input?.id.length).toBeGreaterThan(0);
  });

  it('associates label with input via id', () => {
    render(<Input id="test-input" label="Test Label" />);
    const label = screen.getByText(/test label/i) as HTMLLabelElement;
    const input = screen.getByLabelText(/test label/i);
    expect(label.htmlFor).toBe('test-input');
    expect(input.id).toBe('test-input');
  });

  it('renders with both label and error', () => {
    render(<Input label="Email" error="Invalid email format" />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
  });

  it('renders wrapper with fullWidth class', () => {
    const { container } = render(<Input fullWidth />);
    const wrapper = container.querySelector('.atom-input-wrapper');
    expect(wrapper).toHaveClass('atom-input-wrapper--full-width');
  });
});
