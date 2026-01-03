import React, { PropsWithChildren, useState } from 'react';
import { AuthContext } from '../src/context/auth-context';
import { ServiceContext } from '../src/context/service-context';

type MockAuthProviderProps = PropsWithChildren;

/**
 * Mock AuthProvider for Storybook that doesn't import the API client
 * This prevents circular dependency errors while still providing the auth context
 */
export const MockAuthProvider = ({ children }: MockAuthProviderProps) => {
  const [user, setUser] = useState<any | null>({
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'demo@example.com',
    activated: true,
    roles: [
      { id: '1', name: 'User', description: 'Basic user role' },
      { id: '2', name: 'DJ', description: 'DJ role' },
    ],
  });
  const [token, setToken] = useState<string | null>('mock-token');
  const [refreshToken, setRefreshToken] = useState<string | null>(
    'mock-refresh-token',
  );

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        logout,
        setUser,
        setToken,
        setRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Mock ServiceProvider for Storybook
 * Provides mock service implementations for components that need them
 */
export const MockServiceProvider = ({ children }: PropsWithChildren) => {
  const mockUsersService = {
    GetMe: async () => ({
      success: true,
      data: {
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'demo@example.com',
          activated: true,
          roles: [
            { id: '1', name: 'User', description: 'Basic user role' },
            { id: '2', name: 'DJ', description: 'DJ role' },
          ],
        },
      },
    }),
    ChangePassword: async () => ({
      success: true,
      data: true,
      message: 'Password changed successfully',
    }),
    Login: async () => ({ success: true, data: {} }),
    forgotPassword: async () => ({ success: true, data: true }),
  };

  const mockStrapiService = {} as any;

  return (
    <ServiceContext.Provider
      value={{
        usersService: mockUsersService as any,
        strapiService: mockStrapiService,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};
