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
    const fetchPage = async () => {
      if (!pageId) {
        setPage(null);
        return;
      }
      const fetchedPage = await strapiAPI.fetchPageById(pageId);
      setPage(fetchedPage || null);
    };
    fetchPage();
  }, [pageId]);

  useEffect(() => {
    const fetchTemplate = async () => {
      console.log('Fetching template for page:', page);
      if (page && page.template && page.template.id !== undefined) {
        const fetchedTemplate = await strapiAPI.fetchTemplate(page.template.id);
        console.log('Fetched template:', fetchedTemplate);
        setTemplate(fetchedTemplate || null);
      } else {
        setTemplate(null);
      }
    };
    fetchTemplate();
  }, [page]);

  return (
    <div>
      {page != undefined && template != undefined ? (
        <>
          <RenderTemplate template={template} page={page} />
        </>
      ) : page === null || template === null ? (
        <p>Page not found.</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
