import { useState, useEffect, useCallback } from 'react';
import { useServices } from './use-services';
import { Page } from '../models/strapi/apiMap';

interface RouteConfig {
  path: string;
  pageId: string;
  children?: RouteConfig[];
}

export const useDynamicRoutes = () => {
  const [routes, setRoutes] = useState<RouteConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { contentService } = useServices();

  const buildRouteConfig = useCallback((pages: Page[]): RouteConfig[] => {
    const routes: RouteConfig[] = [];
    const routeMap = new Map<string, RouteConfig>();

    // Create all routes
    pages.forEach((page) => {
      if (!page.URL || !page.Name) return;

      const route: RouteConfig = {
        path: page.URL === '/' ? '/' : page.URL,
        pageId: page.Name,
      };

      routes.push(route);
      routeMap.set(page.URL, route);
    });

    // Organize hierarchical routes if needed
    pages.forEach((page) => {
      if (page.ParentPage && page.URL) {
        const parentPath = page.ParentPage.URL;
        const parentRoute = routeMap.get(parentPath);

        if (parentRoute) {
          if (!parentRoute.children) {
            parentRoute.children = [];
          }

          const childRoute = routeMap.get(page.URL);
          if (childRoute) {
            parentRoute.children.push(childRoute);
          }
        }
      }
    });

    return routes;
  }, []);

  const fetchRoutes = useCallback(async () => {
    try {
      setLoading(true);
      const pages = await contentService.getAllPages();
      const routeConfig = buildRouteConfig(pages);
      setRoutes(routeConfig);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  }, [contentService, buildRouteConfig]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const refreshRoutes = useCallback(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  return { routes, loading, error, refreshRoutes };
};
