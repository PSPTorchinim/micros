import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { LoginForm } from './LoginForm';

describe('LoginForm Component', () => {
  const mockOnSubmit = jest.fn();

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  it('renders login form with all fields', () => {
    renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('displays forgot password link', () => {
    renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);

    const link = screen.getByRole('link', { name: /reset password/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/users/forgot-password');
  });

  it('allows user to input email and password', () => {
    renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      /password/i,
    ) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('submits form with email and password', async () => {
    renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
    });
  });

  it('displays error message when provided', () => {
    renderWithRouter(
      <LoginForm onSubmit={mockOnSubmit} error="Invalid credentials" />,
    );

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid credentials/i)).toHaveClass(
      'login-form-error',
    );
  });

  it('disables submit button while submitting', async () => {
    const slowSubmit = jest.fn(
      () => new Promise<void>((resolve) => setTimeout(resolve, 100)),
    );
    renderWithRouter(<LoginForm onSubmit={slowSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /logging in/i }),
      ).toBeDisabled();
    });
  });

  it('re-enables submit button after submission completes', async () => {
    renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /login/i })).not.toBeDisabled();
    });
  });

  it('prevents form submission without required fields', () => {
    renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
  });

  it('uses full width inputs and button', () => {
    const { container } = renderWithRouter(
      <LoginForm onSubmit={mockOnSubmit} />,
    );

    const inputs = container.querySelectorAll('.atom-input--full-width');
    expect(inputs.length).toBe(2);

    const button = container.querySelector('.atom-button--full-width');
    expect(button).toBeInTheDocument();
  });
});
