import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { ForgotPasswordForm } from './ForgotPasswordForm';

describe('ForgotPasswordForm Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  it('renders forgot password form with all elements', () => {
    render(<ForgotPasswordForm onSubmit={mockOnSubmit} />);

    expect(
      screen.getByRole('heading', { name: /forgot password/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/enter your email address to reset your password/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /send reset link/i }),
    ).toBeInTheDocument();
  });

  it('displays login link', () => {
    render(<ForgotPasswordForm onSubmit={mockOnSubmit} />);

    const link = screen.getByRole('link', { name: /login/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#/users/login');
  });

  it('allows user to input email', () => {
    render(<ForgotPasswordForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  it('submits form with email', async () => {
    render(<ForgotPasswordForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', {
      name: /send reset link/i,
    });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('displays error message when provided', () => {
    render(
      <ForgotPasswordForm onSubmit={mockOnSubmit} error="Email not found" />,
    );

    expect(screen.getByText(/email not found/i)).toBeInTheDocument();
    expect(screen.getByText(/email not found/i)).toHaveClass(
      'forgot-password-form-error',
    );
  });

  it('disables submit button while submitting', async () => {
    const slowSubmit = jest.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );
    render(<ForgotPasswordForm onSubmit={slowSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', {
      name: /send reset link/i,
    });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();
    });
  });

  it('re-enables submit button after submission completes', async () => {
    render(<ForgotPasswordForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', {
      name: /send reset link/i,
    });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /send reset link/i }),
      ).not.toBeDisabled();
    });
  });

  it('requires email field', () => {
    render(<ForgotPasswordForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('required');
  });

  it('uses full width input and button', () => {
    const { container } = render(
      <ForgotPasswordForm onSubmit={mockOnSubmit} />,
    );

    const input = container.querySelector('.atom-input--full-width');
    expect(input).toBeInTheDocument();

    const button = container.querySelector('.atom-button--full-width');
    expect(button).toBeInTheDocument();
  });

  it('has proper email input type', () => {
    render(<ForgotPasswordForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('type', 'email');
  });
});
