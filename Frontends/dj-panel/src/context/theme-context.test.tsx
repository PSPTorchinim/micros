import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, ThemeContext } from './theme-context';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const TestComponent: React.FC = () => {
  const context = React.useContext(ThemeContext);

  if (!context) {
    return <div>No context</div>;
  }

  return (
    <div>
      <div data-testid="theme">{context.theme}</div>
      <button onClick={context.toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorageMock.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('provides theme context to children', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('theme')).toBeInTheDocument();
  });

  it('initializes with light theme by default when no preferences exist', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('loads saved theme from localStorage', () => {
    localStorageMock.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('toggles theme from light to dark', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('light');

    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('toggles theme from dark to light', () => {
    localStorageMock.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');

    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);

    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('saves theme to localStorage when changed', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);

    expect(localStorageMock.getItem('theme')).toBe('dark');
  });

  it('applies theme to document element', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('prefers dark mode when system prefers dark and no saved theme', () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('can toggle theme multiple times', () => {
    localStorageMock.clear(); // Ensure clean state
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    const button = screen.getByRole('button', { name: /toggle theme/i });

    expect(screen.getByTestId('theme')).toHaveTextContent('light');

    fireEvent.click(button);
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');

    fireEvent.click(button);
    expect(screen.getByTestId('theme')).toHaveTextContent('light');

    fireEvent.click(button);
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });
});
