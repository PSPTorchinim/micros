import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Routes, MemoryRouter } from 'react-router-dom';
import { useDynamicRoutes } from './DynamicRoutes';
import { Page } from '../models/strapi/strapiMap';

// Mock the strapi API
const mockGetRootPages = jest.fn();
const mockGetPagesByParentId = jest.fn();

jest.mock('../services/strapi-api', () => ({
  strapiAPI: {
    getRootPages: () => mockGetRootPages(),
    getPagesByParentId: (id: number) => mockGetPagesByParentId(id),
    fetchPageById: jest.fn(),
  },
}));

// Mock PageComponent
jest.mock('./PageComponent', () => ({
  PageComponent: ({ pageId }: { pageId?: string }) => (
    <div data-testid={`page-${pageId}`}>Page: {pageId}</div>
  ),
}));

// Mock Skeleton
jest.mock('./atoms/Skeleton', () => ({
  ContentSkeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

// Test component that uses the hook
const TestComponent = () => {
  const [routes] = useDynamicRoutes();
  return <Routes>{routes}</Routes>;
};

describe('DynamicRoutes - Route Path Construction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should build root-level routes with full path', async () => {
    // Mock data: Single root page with slug "about"
    const mockRootPages: Page[] = [
      {
        documentId: 'page-1',
        id: 1,
        Title: 'About',
        Slug: 'about',
        Visible: true,
        Menu: 'Main',
        NavigationOrder: 1,
      } as Page,
    ];

    mockGetRootPages.mockResolvedValue(mockRootPages);
    mockGetPagesByParentId.mockResolvedValue([]);

    const { findByTestId, queryByTestId } = render(
      <MemoryRouter initialEntries={['/about']}>
        <TestComponent />
      </MemoryRouter>,
    );

    // Wait for routes to be built (useEffect is async)
    await waitFor(() => {
      expect(queryByTestId('skeleton')).not.toBeInTheDocument();
    });

    // The route should be accessible at /about
    const pageElement = await findByTestId('page-page-1');
    expect(pageElement).toBeInTheDocument();
  });

  it('should build nested routes with relative paths', async () => {
    // Mock data: Parent page with child page
    const mockChildPage: Page = {
      documentId: 'page-2',
      id: 2,
      Title: 'Team',
      Slug: 'team',
      Visible: true,
      Menu: 'Main',
      NavigationOrder: 1,
    } as Page;

    const mockParentPage: Page = {
      documentId: 'page-1',
      id: 1,
      Title: 'About',
      Slug: 'about',
      Visible: true,
      Menu: 'Main',
      NavigationOrder: 1,
      subpages: [mockChildPage],
    } as Page;

    mockGetRootPages.mockResolvedValue([mockParentPage]);
    mockGetPagesByParentId.mockImplementation((id: number) => {
      if (id === 1) return Promise.resolve([mockChildPage]);
      return Promise.resolve([]);
    });

    const { findByTestId, queryByTestId } = render(
      <MemoryRouter initialEntries={['/about/team']}>
        <TestComponent />
      </MemoryRouter>,
    );

    // Wait for routes to be built
    await waitFor(() => {
      expect(queryByTestId('skeleton')).not.toBeInTheDocument();
    });

    // The nested route should be accessible at /about/team
    // This verifies that the child route uses relative path "team" under parent "about"
    const pageElement = await findByTestId('page-page-2');
    expect(pageElement).toBeInTheDocument();
  });

  it('should handle deeply nested routes correctly', async () => {
    // Mock data: Multi-level nesting
    const mockGrandChildPage: Page = {
      documentId: 'page-3',
      id: 3,
      Title: 'John Doe',
      Slug: 'john-doe',
      Visible: true,
      Menu: 'Main',
      NavigationOrder: 1,
    } as Page;

    const mockChildPage: Page = {
      documentId: 'page-2',
      id: 2,
      Title: 'Team',
      Slug: 'team',
      Visible: true,
      Menu: 'Main',
      NavigationOrder: 1,
      subpages: [mockGrandChildPage],
    } as Page;

    const mockParentPage: Page = {
      documentId: 'page-1',
      id: 1,
      Title: 'About',
      Slug: 'about',
      Visible: true,
      Menu: 'Main',
      NavigationOrder: 1,
      subpages: [mockChildPage],
    } as Page;

    mockGetRootPages.mockResolvedValue([mockParentPage]);
    mockGetPagesByParentId.mockImplementation((id: number) => {
      if (id === 1) return Promise.resolve([mockChildPage]);
      if (id === 2) return Promise.resolve([mockGrandChildPage]);
      return Promise.resolve([]);
    });

    const { findByTestId, queryByTestId } = render(
      <MemoryRouter initialEntries={['/about/team/john-doe']}>
        <TestComponent />
      </MemoryRouter>,
    );

    // Wait for routes to be built
    await waitFor(() => {
      expect(queryByTestId('skeleton')).not.toBeInTheDocument();
    });

    // The deeply nested route should be accessible at /about/team/john-doe
    const pageElement = await findByTestId('page-page-3');
    expect(pageElement).toBeInTheDocument();
  });

  it('should handle home page with empty slug correctly', async () => {
    // Mock data: Home page with slug "/"
    const mockHomePage: Page = {
      documentId: 'page-home',
      id: 1,
      Title: 'Home',
      Slug: '/',
      Visible: true,
      Menu: 'Main',
      NavigationOrder: 0,
    } as Page;

    mockGetRootPages.mockResolvedValue([mockHomePage]);
    mockGetPagesByParentId.mockResolvedValue([]);

    const { findByTestId, queryByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <TestComponent />
      </MemoryRouter>,
    );

    // Wait for routes to be built
    await waitFor(() => {
      expect(queryByTestId('skeleton')).not.toBeInTheDocument();
    });

    // The home page should be accessible at /
    const pageElement = await findByTestId('page-page-home');
    expect(pageElement).toBeInTheDocument();
  });
});
