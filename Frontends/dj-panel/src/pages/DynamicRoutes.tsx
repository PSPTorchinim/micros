import React, { useEffect, useState } from 'react';
import { Page } from '../models/strapi/apiMap';
import { fetchAllPages } from '../services/strapiPages';

function buildPath(page: Page, parentPath = ''): string {
  const slug = page.Slug || page.Title || page.id;
  const path = `${parentPath}/${slug}`.replace(/\\/g, '/');
  return path;
}

import { Route } from 'react-router-dom';
import { PageComponent } from './PageComponent';

function buildRoutes(pages: Page[], parentPath = ''): any[] {
  return pages.flatMap((page) => {
    const path = buildPath(page, parentPath).replace(/^\//, '');
    const children = page.Subpages
      ? buildRoutes(
          Array.isArray(page.Subpages) ? page.Subpages : [page.Subpages],
          buildPath(page, parentPath),
        )
      : [];
    return [
      <Route key={path} path={path} element={<PageComponent page={page} />}>
        {children}
      </Route>,
    ];
  });
}

export const DynamicRoutes: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  useEffect(() => {
    fetchAllPages().then(setPages);
  }, []);
  if (!pages.length) return null;
  return <>{buildRoutes(pages)}</>;
};
