import React, { useEffect, useState } from 'react';
import { Page, Template } from '../models/strapi/strapiMap';
import { strapiAPI } from '../services/strapiPages';
import { RenderTemplate } from './RenderTemplate';

interface PageComponentProps {
  pageId: number | undefined;
}

export const PageComponent: React.FC<PageComponentProps> = ({ pageId }) => {
  const [page, setPage] = useState<Page | null | undefined>(undefined);
  const [template, setTemplate] = useState<Template | null | undefined>(
    undefined,
  );

  useEffect(() => {
    (async () => {
      if (!pageId) {
        setPage(null);
        setTemplate(null);
        return;
      }
      // Use DEEP call so template.Content + nested CTAs/Articles are populated
      const fetchedPage = await strapiAPI.fetchPageByIdDeep(pageId);
      setPage(fetchedPage || null);

      // Template is already populated via deep fetch; still keep as separate state for clarity
      const tpl = (fetchedPage as any)?.template ?? null;
      setTemplate(tpl);
    })();
  }, [pageId]);

  if (page === null || template === null) {
    return <p>Page not found.</p>;
  }
  if (page === undefined || template === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <RenderTemplate template={template as any} page={page as any} />
    </div>
  );
};
