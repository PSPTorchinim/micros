import React, { useEffect, useState } from 'react';
import { Page } from '../models/strapi/strapiMap';
import { strapiAPI } from '../services/strapiPages';
import { Route, Outlet } from 'react-router-dom';
import { PageComponent } from './PageComponent';

function buildPath(page: Page, parentPath = ''): string {
  const slug = page.Slug || page.Title || page.id;
  // Remove trailing slash from parentPath and leading slash from slug
  const cleanParent = parentPath.replace(/\/+$/, '');
  const cleanSlug = String(slug).replace(/^\/+/, '');
  const path = `${cleanParent}/${cleanSlug}`.replace(/\\/g, '/');
  return path.replace(/\/+/g, '/');
}

type NavigationItem = {
  id: number;
  text: string;
  url: string;
  children?: NavigationItem[];
  NavigationOrder: number;
};

function buildRoutesAndNav(
  pages: Page[],
  parentPath = '',
): { routes: React.ReactElement[]; nav: NavigationItem[] } {
  let routes: React.ReactElement[] = [];
  let nav: NavigationItem[] = [];
  pages.forEach((page) => {
    const path = '/' + buildPath(page, parentPath).replace(/^\/+/g, '');
    let childrenRoutes: React.ReactElement[] = [];
    let childrenNav: NavigationItem[] = [];
    if (
      page.subpages &&
      Array.isArray(page.subpages) &&
      page.subpages.length > 0
    ) {
      const result = buildRoutesAndNav(
        page.subpages as Page[],
        buildPath(page, parentPath),
      );
      childrenRoutes = result.routes;
      childrenNav = result.nav;
      // Parent: render only Outlet for children
      routes.push(
        <Route key={path} path={path} element={<Outlet />}>
          {/* Index route for parent content */}
          <Route index element={<PageComponent page={page} />} />
          {childrenRoutes}
        </Route>,
      );
    } else {
      // Leaf: render only its own content
      routes.push(
        <Route
          key={path}
          path={path}
          element={<PageComponent page={page} />}
        />,
      );
    }
    let url = path;
    url = url.replace(/\/+/, '/');
    nav.push({
      id: page.id ?? 0,
      text: page.Title || String(page.id),
      url,
      ...(childrenNav.length ? { children: childrenNav } : {}),
      NavigationOrder: page.NavigationOrder ?? 0,
    });
  });
  return {
    routes,
    nav: nav.sort((a, b) => a.NavigationOrder - b.NavigationOrder),
  };
}

export function useDynamicRoutes() {
  const [routes, setRoutes] = useState<React.ReactElement[]>([]);
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);

  // Recursively fetch all child pages for a given page
  async function fetchAllChildren(page: Page): Promise<Page> {
    // Always fetch children by parent id from Strapi
    if (!page.id) return page;
    const children = await strapiAPI.fetchPagesByParentId(page.id);
    if (!children || children.length === 0) {
      return page;
    }
    const subpagesWithChildren = await Promise.all(
      children.map(async (child: Page) => await fetchAllChildren(child)),
    );
    return { ...page, subpages: subpagesWithChildren } as any;
  }

  useEffect(() => {
    async function loadPages() {
      const rootPages = await strapiAPI.fetchRootPages();
      // Recursively fetch all children for each root page
      const pagesWithChildren = await Promise.all(
        rootPages.map((page) => fetchAllChildren(page)),
      );
      const { routes, nav } = buildRoutesAndNav(pagesWithChildren);
      setRoutes(routes);
      setNavigation(nav);
    }
    loadPages();
  }, []);
  return [routes, navigation] as const;
}
