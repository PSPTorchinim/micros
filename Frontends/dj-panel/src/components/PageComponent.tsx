import React, { useEffect, useState } from 'react';
import type { Page } from '../models/strapi/strapiMap';
import { strapiAPI } from '../services/strapi-api';
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

  if (page === null) {
    return <p>Page not found.</p>;
  }
  if (page === undefined) {
    return <ContentSkeleton type="page" />;
  }

  return (
    <div>
      <RenderTemplate
        template={page?.template?.documentId}
        pageTitle={page?.Title}
      />
    </div>
  );
};
