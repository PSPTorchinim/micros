import React, { useEffect, useState } from 'react';
import { Page } from '../models/strapi/strapiMap';
import { strapiAPI } from '../services/strapi-api';
import { Route, Outlet } from 'react-router-dom';
import { PageComponent } from './PageComponent';
import { ContentSkeleton } from './atoms/Skeleton';

function buildPath(page: Page, parentPath = ''): string {
  const slug = (page as any)?.Slug || (page as any)?.Title || (page as any)?.id;
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
    const isRoot = !parentPath;
    const rawPath = buildPath(page, parentPath).replace(/^\/+/g, '');
    // Special handling for home/root page
    const isHomePage = isRoot && (page as any)?.Slug === '/';
    const path = isHomePage
      ? ''
      : isRoot
        ? rawPath.replace(/^\/+/g, '')
        : rawPath.replace(/^\//, '');
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

      routes.push(
        <Route key={path || 'index'} path={path} element={<Outlet />}>
          <Route index element={<PageComponent pageId={page.documentId} />} />
          {childrenRoutes}
        </Route>,
      );
    } else {
      // If this is the home page, use index route
      if (isHomePage) {
        routes.push(
          <Route
            key="index"
            index
            element={<PageComponent pageId={page.documentId} />}
          />,
        );
      } else {
        routes.push(
          <Route
            key={path}
            path={path}
            element={<PageComponent pageId={page.documentId} />}
          />,
        );
      }
    }

    // For navigation URLs, always use leading slash
    const url = '/' + rawPath.replace(/^\/+/g, '');
    nav.push({
      id: (page as any).id ?? 0,
      text: (page as any).Title || String((page as any).id),
      url,
      ...(childrenNav.length ? { children: childrenNav } : {}),
      NavigationOrder: (page as any).NavigationOrder ?? 0,
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

  async function fetchAllChildren(page: Page): Promise<Page> {
    if (!(page as any).id) return page;
    const children = await strapiAPI.getPagesByParentId((page as any).id);
    if (!children || children.length === 0) return page;

    if (Array.isArray(children)) {
      const subpagesWithChildren = await Promise.all(
        children.map(async (child: Page) => await fetchAllChildren(child)),
      );
      return { ...(page as any), subpages: subpagesWithChildren } as any;
    }
    return page;
  }

  useEffect(() => {
    (async () => {
      const rootPages = (await strapiAPI.getRootPages()) || [];
      const pagesWithChildren = await Promise.all(
        rootPages.map((p) => fetchAllChildren(p)),
      );
      let { routes, nav } = buildRoutesAndNav(pagesWithChildren);

      if (
        !routes.some(
          (r) =>
            r &&
            r.type &&
            r.props &&
            typeof r.props === 'object' &&
            r.props !== null &&
            'index' in r.props &&
            r.props.index,
        )
      ) {
        routes = [
          <Route
            key="fallback-index"
            index
            element={<ContentSkeleton type="page" />}
          />,
          ...routes,
        ];
      }
      setRoutes(routes);
      setNavigation(nav);
    })();
  }, []);

  return [routes, navigation] as const;
}
