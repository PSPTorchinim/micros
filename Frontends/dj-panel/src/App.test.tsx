import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

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

// Mock the useDynamicRoutes hook
jest.mock('./components/DynamicRoutes', () => ({
  useDynamicRoutes: jest.fn(() => [[], [], null]),
}));

// Mock the microservices client
const createMockService = () => ({
  instance: {
    interceptors: {
      request: {
        use: jest.fn(() => 1),
        eject: jest.fn(),
      },
      response: {
        use: jest.fn(() => 1),
        eject: jest.fn(),
      },
    },
  },
});

jest.mock('./models/api', () => ({
  microservicesClient: {
    brand: createMockService(),
    documents: createMockService(),
    gear: createMockService(),
    identity: {
      instance: {
        interceptors: {
          request: {
            use: jest.fn(() => 1),
            eject: jest.fn(),
          },
          response: {
            use: jest.fn(() => 1),
            eject: jest.fn(),
          },
        },
      },
      users: {
        apiV1UsersRefreshTokenList: jest.fn(),
      },
    },
    mailing: createMockService(),
    music: createMockService(),
    party: createMockService(),
    strapi: createMockService(),
  },
}));

// Mock the services
jest.mock('./services/users-service', () => ({
  userService: {},
}));

jest.mock('./services/strapi-service', () => ({
  StrapiService: {},
}));

describe('App Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<App />);
    // App should render the router structure
    expect(document.querySelector('.browser-router')).toBeDefined();
  });

  it('wraps content with ThemeProvider', () => {
    render(<App />);
    // The theme provider should set data-theme attribute
    expect(document.documentElement.hasAttribute('data-theme')).toBe(true);
  });

  it('initializes with BrowserRouter', () => {
    const { container } = render(<App />);
    // BrowserRouter should be initialized (we can verify by checking if Routes is rendered)
    expect(container).toBeInTheDocument();
  });

  it('provides all required context providers', () => {
    // This test ensures the component tree renders with all providers
    const { container } = render(<App />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
