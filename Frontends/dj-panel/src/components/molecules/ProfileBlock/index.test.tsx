import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { AuthContext } from '../../../context/auth-context';
import type { GetUserDTO } from '../../../models/api/identity/apiMap';
import { ProfileBlock } from './index';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock user data
const mockUser: GetUserDTO = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
};

// Helper to render component with auth context
const renderWithAuth = (user: GetUserDTO | null = null) => {
  const mockAuthContext = {
    user,
    token: user ? 'mock-token' : null,
    refreshToken: user ? 'mock-refresh-token' : null,
    setUser: jest.fn(),
    setToken: jest.fn(),
    setRefreshToken: jest.fn(),
    logout: jest.fn(),
  };

  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <ProfileBlock />
    </AuthContext.Provider>,
  );
};

describe('ProfileBlock', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders with default props when user is authenticated', () => {
    renderWithAuth(mockUser);

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(
      screen.getByText('View and manage your profile information.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Change Password')).toBeInTheDocument();
  });

  it('renders custom labels when provided', () => {
    const mockAuthContext = {
      user: mockUser,
      token: 'mock-token',
      refreshToken: 'mock-refresh-token',
      setUser: jest.fn(),
      setToken: jest.fn(),
      setRefreshToken: jest.fn(),
      logout: jest.fn(),
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <ProfileBlock
          title="My Account"
          description="Account information"
          usernameLabel="User Name"
          emailLabel="Email Address"
        />
      </AuthContext.Provider>,
    );

    expect(screen.getByText('My Account')).toBeInTheDocument();
    expect(screen.getByText('Account information')).toBeInTheDocument();
    expect(screen.getByText('User Name')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('shows error message when user is not authenticated', () => {
    renderWithAuth(null);

    expect(
      screen.getByText('No user information available. Please log in.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Change Password')).not.toBeInTheDocument();
  });

  it('displays N/A for missing user fields', () => {
    const incompleteUser: GetUserDTO = {
      id: '2',
    };

    renderWithAuth(incompleteUser);

    const values = screen.getAllByText('N/A');
    expect(values).toHaveLength(2); // Both username and email should show N/A
  });

  it('applies custom styles when provided', () => {
    const customStyles = { backgroundColor: 'red' };
    const mockAuthContext = {
      user: mockUser,
      token: 'mock-token',
      refreshToken: 'mock-refresh-token',
      setUser: jest.fn(),
      setToken: jest.fn(),
      setRefreshToken: jest.fn(),
      logout: jest.fn(),
    };

    const { container } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <ProfileBlock customStyles={customStyles} />
      </AuthContext.Provider>,
    );

    const profileContainer = container.querySelector(
      '.profile-block-container',
    );
    expect(profileContainer).not.toBeNull();
    expect(profileContainer).toHaveAttribute('style');
    expect(profileContainer?.getAttribute('style')).toContain(
      'background-color',
    );
  });

  it('navigates to change password page when button is clicked', () => {
    renderWithAuth(mockUser);

    const changePasswordButton = screen.getByText('Change Password');
    fireEvent.click(changePasswordButton);

    expect(mockNavigate).toHaveBeenCalledWith('/change-password');
  });

  it('uses custom change password URL when provided', () => {
    const mockAuthContext = {
      user: mockUser,
      token: 'mock-token',
      refreshToken: 'mock-refresh-token',
      setUser: jest.fn(),
      setToken: jest.fn(),
      setRefreshToken: jest.fn(),
      logout: jest.fn(),
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <ProfileBlock changePasswordUrl="/custom-change-password" />
      </AuthContext.Provider>,
    );

    const changePasswordButton = screen.getByText('Change Password');
    fireEvent.click(changePasswordButton);

    expect(mockNavigate).toHaveBeenCalledWith('/custom-change-password');
  });
});
