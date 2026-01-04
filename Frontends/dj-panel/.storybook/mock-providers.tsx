import React, { PropsWithChildren, useState } from 'react';
import { AuthContext } from '../src/context/auth-context';

type MockAuthProviderProps = PropsWithChildren;

/**
 * Mock AuthProvider for Storybook that doesn't import the API client
 * This prevents circular dependency errors while still providing the auth context
 */
export const MockAuthProvider = ({ children }: MockAuthProviderProps) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

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
