import { useState, useEffect } from 'react';
import { Page } from '../models/strapi/apiMap';
import { useServices } from './use-services';

export const usePage = (pageId: string) => {
  const [data, setData] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { contentService } = useServices();

  useEffect(() => {
    if (!pageId) return;

    const fetchPage = async () => {
      try {
        setLoading(true);
        const page = await contentService.getPageByPageId(pageId);
        setData(page);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : `Failed to fetch page ${pageId}`,
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [pageId, contentService]);

  return { data, loading, error };
};
