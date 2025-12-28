import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { ProfileBlock } from './ProfileBlock';
import { AuthContext } from '../../../context/auth-context';
import { ServiceContext } from '../../../context/service-context';

const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  activated: true,
  roles: [{ id: '1', name: 'User', description: 'Basic user role' }],
};

const mockUsersService = {
  GetMe: jest.fn().mockResolvedValue({
    success: true,
    data: { user: mockUser },
  }),
  Login: jest.fn(),
  ChangePassword: jest.fn(),
  forgotPassword: jest.fn(),
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
        <ServiceContext.Provider
          value={{
            usersService: mockUsersService as any,
          }}
        >
          {ui}
        </ServiceContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>,
  );
};

describe('ProfileBlock Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile block with title', async () => {
    renderWithProviders(<ProfileBlock />);

    expect(
      await screen.findByRole('heading', { name: /my profile/i }),
    ).toBeInTheDocument();
  });

  it('displays user information', async () => {
    renderWithProviders(<ProfileBlock />);

    expect(await screen.findByText(mockUser.email)).toBeInTheDocument();
    expect(await screen.findByText(mockUser.id)).toBeInTheDocument();
    expect(await screen.findByText(/active/i)).toBeInTheDocument();
  });

  it('displays user roles', async () => {
    renderWithProviders(<ProfileBlock />);

    expect(await screen.findByText('User')).toBeInTheDocument();
  });

  it('uses custom title when provided', async () => {
    renderWithProviders(<ProfileBlock title="User Profile" />);

    expect(
      await screen.findByRole('heading', { name: /user profile/i }),
    ).toBeInTheDocument();
  });
});
