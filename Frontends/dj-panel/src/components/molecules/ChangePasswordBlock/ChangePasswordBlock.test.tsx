import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { ChangePasswordBlock } from './ChangePasswordBlock';
import { ServiceContext } from '../../../context/service-context';

const mockUsersService = {
  ChangePassword: jest.fn(),
  GetMe: jest.fn(),
  Login: jest.fn(),
  forgotPassword: jest.fn(),
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ServiceContext.Provider
        value={{
          usersService: mockUsersService as any,
        }}
      >
        {ui}
      </ServiceContext.Provider>
    </MemoryRouter>,
  );
};

describe('ChangePasswordBlock Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsersService.ChangePassword.mockResolvedValue({
      success: true,
      data: true,
    });
  });

  it('renders change password form with all fields', () => {
    renderWithProviders(<ChangePasswordBlock />);

    expect(
      screen.getByRole('heading', { name: /change password/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^new password$/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/confirm new password/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /change password/i }),
    ).toBeInTheDocument();
  });

  it('allows user to input passwords', () => {
    renderWithProviders(<ChangePasswordBlock />);

    const oldPasswordInput = screen.getByLabelText(
      /current password/i,
    ) as HTMLInputElement;
    const newPasswordInput = screen.getByLabelText(
      /^new password$/i,
    ) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(
      /confirm new password/i,
    ) as HTMLInputElement;

    fireEvent.change(oldPasswordInput, { target: { value: 'oldPass123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newPass123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newPass123' } });

    expect(oldPasswordInput.value).toBe('oldPass123');
    expect(newPasswordInput.value).toBe('newPass123');
    expect(confirmPasswordInput.value).toBe('newPass123');
  });

  it('shows error when passwords do not match', async () => {
    renderWithProviders(<ChangePasswordBlock />);

    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: { value: 'oldPass123' },
    });
    fireEvent.change(screen.getByLabelText(/^new password$/i), {
      target: { value: 'newPass123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: 'differentPass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/new passwords do not match/i),
      ).toBeInTheDocument();
    });
  });

  it('shows error when new password is too short', async () => {
    renderWithProviders(<ChangePasswordBlock />);

    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: { value: 'oldPass123' },
    });
    fireEvent.change(screen.getByLabelText(/^new password$/i), {
      target: { value: 'short' },
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: 'short' },
    });

    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/must be at least 6 characters/i),
      ).toBeInTheDocument();
    });
  });

  it('shows error when new password is same as old password', async () => {
    renderWithProviders(<ChangePasswordBlock />);

    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: { value: 'samePass123' },
    });
    fireEvent.change(screen.getByLabelText(/^new password$/i), {
      target: { value: 'samePass123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: 'samePass123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/must be different from current password/i),
      ).toBeInTheDocument();
    });
  });

  it('calls ChangePassword service on valid submission', async () => {
    renderWithProviders(<ChangePasswordBlock />);

    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: { value: 'oldPass123' },
    });
    fireEvent.change(screen.getByLabelText(/^new password$/i), {
      target: { value: 'newPass123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: 'newPass123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(mockUsersService.ChangePassword).toHaveBeenCalledWith(
        'oldPass123',
        'newPass123',
      );
    });
  });

  it('shows success message on successful password change', async () => {
    renderWithProviders(<ChangePasswordBlock />);

    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: { value: 'oldPass123' },
    });
    fireEvent.change(screen.getByLabelText(/^new password$/i), {
      target: { value: 'newPass123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: 'newPass123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/password changed successfully/i),
      ).toBeInTheDocument();
    });
  });
});
