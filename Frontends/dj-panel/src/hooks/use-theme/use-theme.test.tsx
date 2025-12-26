import React from 'react';
import { renderHook } from '@testing-library/react';
import { useTheme } from './use-theme';
import { ThemeContext } from '../../context/theme-context';

describe('useTheme Hook', () => {
  it('throws error when used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');

    console.error = originalError;
  });

  it('returns context when used within ThemeProvider', () => {
    const mockContext = {
      theme: 'light' as const,
      toggleTheme: jest.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeContext.Provider value={mockContext}>
        {children}
      </ThemeContext.Provider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current).toEqual(mockContext);
    expect(result.current.theme).toBe('light');
    expect(result.current.toggleTheme).toBe(mockContext.toggleTheme);
  });

  it('returns dark theme when context provides dark theme', () => {
    const mockContext = {
      theme: 'dark' as const,
      toggleTheme: jest.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeContext.Provider value={mockContext}>
        {children}
      </ThemeContext.Provider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('dark');
  });
});
