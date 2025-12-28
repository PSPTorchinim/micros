import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { DashboardBlock } from './DashboardBlock';
import { AuthContext } from '../../../context/auth-context';

const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  activated: true,
  roles: [
    { id: '1', name: 'User', description: 'Basic user role' },
    { id: '2', name: 'Admin', description: 'Admin role' },
  ],
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{
          user: mockUser,
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
          setUser: jest.fn(),
          setToken: jest.fn(),
          setRefreshToken: jest.fn(),
          logout: jest.fn(),
        }}
      >
        {ui}
      </AuthContext.Provider>
    </MemoryRouter>,
  );
};

describe('DashboardBlock Component', () => {
  it('renders dashboard with title', () => {
    renderWithProviders(<DashboardBlock />);

    expect(
      screen.getByRole('heading', { name: /dashboard/i }),
    ).toBeInTheDocument();
  });

  it('displays welcome message with user email', () => {
    renderWithProviders(<DashboardBlock />);

    expect(screen.getByText(/welcome to your dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it('displays user stats', () => {
    renderWithProviders(<DashboardBlock />);

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Roles')).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('displays quick links', () => {
    renderWithProviders(<DashboardBlock />);

    const profileLink = screen.getByRole('link', { name: /profile/i });
    const passwordLink = screen.getByRole('link', {
      name: /change password/i,
    });

    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute('href', '/profile');

    expect(passwordLink).toBeInTheDocument();
    expect(passwordLink).toHaveAttribute('href', '/change-password');
  });

  it('uses custom title and welcome message', () => {
    renderWithProviders(
      <DashboardBlock
        title="My Dashboard"
        welcomeMessage="Hello, welcome back"
      />,
    );

    expect(
      screen.getByRole('heading', { name: /my dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/hello, welcome back/i)).toBeInTheDocument();
  });

  it('handles inactive user status', () => {
    const inactiveUser = { ...mockUser, activated: false };

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: inactiveUser,
            token: 'mock-token',
            refreshToken: 'mock-refresh-token',
            setUser: jest.fn(),
            setToken: jest.fn(),
            setRefreshToken: jest.fn(),
            logout: jest.fn(),
          }}
        >
          <DashboardBlock />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });
});
