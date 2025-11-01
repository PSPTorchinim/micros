import React, { useEffect, useState } from 'react';
import { Page, Template } from '../models/strapi/strapiMap';
import { strapiAPI } from '../services/strapi-api';
import { RenderTemplate } from './RenderTemplate';

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
    return <p>Loading...</p>;
  }

  return (
    <div>
      <RenderTemplate template={page?.template?.documentId} />
    </div>
  );
};
