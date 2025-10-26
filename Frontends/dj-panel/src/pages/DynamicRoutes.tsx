import React, { useEffect, useState } from 'react';
import { Page } from '../models/strapi/strapiMap';
import { strapiAPI } from '../services/strapiPages';
import { Route } from 'react-router-dom';
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
  // Helper to map PageMenuEnum1 to PageMenuEnum if needed
  function mapPageMenuEnum(page: any): any {
    if (page.Menu && typeof page.Menu === 'string') {
      // If Menu is a string, try to map to PageMenuEnum
      page.Menu = page.Menu;
    }
    if (page.subpages && Array.isArray(page.subpages)) {
      page.subpages = page.subpages.map(mapPageMenuEnum);
    }
    return page;
  }
  pages = pages.map(mapPageMenuEnum);
  pages.forEach((page) => {
    const path = buildPath(page, parentPath).replace(/^\//, '');
    let childrenRoutes: React.ReactElement[] = [];
    let childrenNav: NavigationItem[] = [];
    if (
      page.subpages &&
      Array.isArray(page.subpages) &&
      page.subpages.length > 0
    ) {
      // Cast as Page[] to satisfy TS
      const result = buildRoutesAndNav(
        page.subpages as Page[],
        buildPath(page, parentPath),
      );
      childrenRoutes = result.routes;
      childrenNav = result.nav;
    }
    routes.push(
      <Route key={path} path={path} element={<PageComponent page={page} />}>
        {childrenRoutes}
      </Route>,
    );
    // Ensure no double slashes in nav url
    let url = path.startsWith('/') ? path : '/' + path;
    url = url.replace(/\/+/g, '/');
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
  useEffect(() => {
    strapiAPI.fetchRootPages().then((pages) => {
      const { routes, nav } = buildRoutesAndNav(pages);
      setRoutes(routes);
      setNavigation(nav);
    });
  }, []);
  return [routes, navigation] as const;
}
