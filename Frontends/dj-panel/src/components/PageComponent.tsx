import React, { useEffect, useState } from 'react';
import './PageComponent.css';
import type { Page } from '../models/api/strapi/apiMap';
import { strapiAPI } from '../services/strapi-microservice';
import { RenderTemplate } from './RenderTemplate';
import { ContentSkeleton } from './atoms/Skeleton';

interface PageComponentProps {
  pageId?: string;
}

export const PageComponent: React.FC<PageComponentProps> = ({ pageId }) => {
  const [page, setPage] = useState<Page | null | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (!pageId) {
        setPage(null);
        return;
      }
      const fetchedPage = await strapiAPI.fetchPageById(pageId);
      setPage(fetchedPage || null);
    })();
  }, [pageId]);

  // Update document title when page loads
  useEffect(() => {
    if (page?.Title) {
      document.title = page.Title;
    }
  }, [page]);

  if (page === null) {
    return <p>Page not found.</p>;
  }
  if (page === undefined) {
    return <ContentSkeleton type="page" />;
  }

  return (
    <div className="page-component-wrapper">
      <RenderTemplate
        template={page?.template?.documentId}
        pageTitle={page?.Title}
      />
    </div>
  );
};
