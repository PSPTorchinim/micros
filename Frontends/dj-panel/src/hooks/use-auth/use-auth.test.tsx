import React from 'react';
import { renderHook } from '@testing-library/react';
import { useAuth } from './use-auth';
import { AuthContext } from '../context/auth-context';
import { GetUserDTO } from '../models/api/identity/apiMap';

describe('useAuth Hook', () => {
  it('throws error when used outside AuthProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');

    console.error = originalError;
  });

  it('returns context when used within AuthProvider', () => {
    const mockUser: GetUserDTO = {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
    };

    const mockContext = {
      user: mockUser,
      token: 'mock-token',
      refreshToken: 'mock-refresh-token',
      setUser: jest.fn(),
      setToken: jest.fn(),
      setRefreshToken: jest.fn(),
      logout: jest.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={mockContext}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toEqual(mockContext);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('mock-token');
    expect(result.current.refreshToken).toBe('mock-refresh-token');
  });

  it('returns null user when not authenticated', () => {
    const mockContext = {
      user: null,
      token: null,
      refreshToken: null,
      setUser: jest.fn(),
      setToken: jest.fn(),
      setRefreshToken: jest.fn(),
      logout: jest.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={mockContext}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.refreshToken).toBeNull();
  });

  it('provides all expected methods', () => {
    const mockContext = {
      user: null,
      token: null,
      refreshToken: null,
      setUser: jest.fn(),
      setToken: jest.fn(),
      setRefreshToken: jest.fn(),
      logout: jest.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={mockContext}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(typeof result.current.setUser).toBe('function');
    expect(typeof result.current.setToken).toBe('function');
    expect(typeof result.current.setRefreshToken).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });
});
