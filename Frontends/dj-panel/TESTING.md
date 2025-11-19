# Frontend Testing Documentation

This document describes the comprehensive test suite for the DJ Panel frontend application.

## Test Coverage

The frontend testing consists of two main types of tests:

### 1. Unit and Integration Tests (Jest)

Located in `src/**/*.test.tsx` and `src/**/*.test.ts`, these tests cover:

#### Atom Components
- **Button Component** (11 tests)
  - Renders with all variants (filled, outline, flat)
  - Renders with all sizes (small, medium, large)
  - Handles click events
  - Can be disabled
  - Supports custom className
  - Full width support

- **Input Component** (14 tests)
  - Renders with and without label
  - Displays error messages
  - Handles onChange events
  - Full width support
  - Custom className support
  - Accessibility (label association)

- **ThemeToggle Component** (8 tests)
  - Renders toggle button
  - Displays correct icon based on theme
  - Calls toggleTheme function
  - Proper ARIA labels

#### Molecule Components
- **LoginForm Component** (9 tests)
  - Form rendering with all fields
  - Email and password input handling
  - Form submission
  - Error message display
  - Submit button states (loading, disabled)
  - Required field validation

- **ForgotPasswordForm Component** (9 tests)
  - Form rendering
  - Email input handling
  - Form submission
  - Error message display
  - Submit button states
  - Required field validation

#### Context Providers
- **ThemeProvider** (10 tests)
  - Provides theme context to children
  - Initializes with correct default theme
  - Loads saved theme from localStorage
  - Toggles between light and dark themes
  - Persists theme preference
  - Applies theme to document element
  - Respects system color scheme preference

#### Custom Hooks
- **useAuth Hook** (4 tests)
  - Throws error when used outside AuthProvider
  - Returns auth context correctly
  - Provides user, token, and refresh token
  - Exposes all auth methods

- **useTheme Hook** (3 tests)
  - Throws error when used outside ThemeProvider
  - Returns theme context correctly
  - Provides theme and toggleTheme function

#### Utility Functions
- **getDocId Utility** (11 tests)
  - Extracts documentId from various object shapes
  - Handles null/undefined input
  - Handles Strapi v4/v5 data structures
  - Prioritizes documentId over other fields

#### Main Application
- **App Component** (4 tests)
  - Renders without crashing
  - Wraps content with all required providers
  - Initializes HashRouter correctly

**Total Jest Tests: 80 tests across 10 test suites**

### 2. End-to-End Tests (Playwright)

Located in `e2e/**/*.spec.ts`, these tests cover:

#### Theme Toggle E2E (2 tests)
- Theme toggling functionality
- Theme persistence across page reloads

#### Navigation E2E (3 tests)
- Main application rendering
- 404 page handling
- HTML structure validation

#### Accessibility E2E (4 tests)
- Accessible theme toggle button
- Keyboard navigation
- Document title
- Lang attribute

**Total Playwright Tests: 9 tests**

## Running Tests

### Jest Unit Tests
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Playwright E2E Tests
```bash
# Run all e2e tests
npm run test:e2e

# Run e2e tests in UI mode
npm run test:e2e:ui

# Run e2e tests in headed mode (see browser)
npm run test:e2e:headed
```

### Run All Tests
```bash
npm run test:all
```

## Test Configuration

### Jest Configuration
- **Config file**: `jest.config.js`
- **Setup file**: `src/setupTests.js`
- **Test environment**: jsdom
- **CSS modules**: Mocked with identity-obj-proxy

### Playwright Configuration
- **Config file**: `playwright.config.ts`
- **Test directory**: `e2e/`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Base URL**: http://localhost:3080
- **Runs local dev server automatically**

## Best Practices

1. **Test file naming**: Use `.test.tsx` or `.test.ts` for Jest tests, `.spec.ts` for Playwright tests
2. **Co-location**: Keep test files next to the components they test
3. **Test descriptions**: Use descriptive test names that explain what is being tested
4. **Mocking**: Mock external dependencies and APIs
5. **Accessibility**: Include accessibility tests (ARIA labels, keyboard navigation)
6. **Coverage**: Aim for high coverage of critical paths and user interactions

## Writing New Tests

### Jest Component Test Template
```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { YourComponent } from './YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    const handleClick = jest.fn();
    render(<YourComponent onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Playwright E2E Test Template
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should perform expected behavior', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('selector')).toBeVisible();
    await page.click('button');
    // Add assertions
  });
});
```

## Continuous Integration

Tests are designed to run in CI/CD pipelines:
- Jest tests run quickly and don't require a running server
- Playwright tests automatically start the dev server before running
- All tests should pass before merging PRs

## Troubleshooting

### Common Issues

1. **Tests failing due to missing mocks**
   - Ensure all external dependencies are properly mocked
   - Check that localStorage, matchMedia, and other browser APIs are mocked

2. **Playwright tests timing out**
   - Increase timeout in playwright.config.ts
   - Ensure dev server starts correctly
   - Check network conditions

3. **Snapshot tests failing**
   - Review changes and update snapshots if intentional
   - Run `npm test -- -u` to update snapshots

## Future Improvements

- Add visual regression testing
- Increase test coverage to 90%+
- Add performance testing
- Add API integration tests
- Add screenshot comparison tests
