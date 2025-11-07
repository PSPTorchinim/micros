import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeToggle } from './ThemeToggle';
import { ThemeContext } from '../../../context/theme-context';

const mockToggleTheme = jest.fn();

const renderWithThemeContext = (theme: 'light' | 'dark') => {
  return render(
    <ThemeContext.Provider value={{ theme, toggleTheme: mockToggleTheme }}>
      <ThemeToggle />
    </ThemeContext.Provider>,
  );
};

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    mockToggleTheme.mockClear();
  });

  it('renders the toggle button', () => {
    renderWithThemeContext('light');
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('theme-toggle');
  });

  it('displays sun icon in light mode', () => {
    renderWithThemeContext('light');
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Switch to dark mode');
    const svg = button.querySelector('svg');
    expect(svg).toHaveClass('theme-toggle-icon');
  });

  it('displays moon icon in dark mode', () => {
    renderWithThemeContext('dark');
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Switch to light mode');
    const svg = button.querySelector('svg');
    expect(svg).toHaveClass('theme-toggle-icon');
  });

  it('calls toggleTheme when clicked', () => {
    renderWithThemeContext('light');
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('has proper aria-label for accessibility', () => {
    renderWithThemeContext('light');
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
  });

  it('updates title based on current theme', () => {
    const { rerender } = render(
      <ThemeContext.Provider
        value={{ theme: 'light', toggleTheme: mockToggleTheme }}
      >
        <ThemeToggle />
      </ThemeContext.Provider>,
    );

    expect(screen.getByRole('button')).toHaveAttribute(
      'title',
      'Switch to dark mode',
    );

    rerender(
      <ThemeContext.Provider
        value={{ theme: 'dark', toggleTheme: mockToggleTheme }}
      >
        <ThemeToggle />
      </ThemeContext.Provider>,
    );

    expect(screen.getByRole('button')).toHaveAttribute(
      'title',
      'Switch to light mode',
    );
  });

  it('can be clicked multiple times', () => {
    renderWithThemeContext('light');
    const button = screen.getByRole('button');

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockToggleTheme).toHaveBeenCalledTimes(3);
  });
});
