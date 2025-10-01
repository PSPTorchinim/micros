import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContentService } from '../services/content-service';
import { Page } from '../models/strapi/apiMap';
import { PageRenderer } from './PageRenderer';

interface DynamicPageProps {
  url?: string;
}

export const DynamicPage: React.FC<DynamicPageProps> = ({ url }) => {
  const { '*': wildcardPath } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cleanUrl = (rawUrl: string): string => {
    const cleaned = rawUrl.replace(/\/+/g, '/');
    return cleaned === '/' ? '/' : cleaned.replace(/\/$/, '');
  };

  const currentUrl = cleanUrl(url || `/${wildcardPath || ''}`);

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        setError(null);

        let foundPage = await ContentService.getPageByUrl(currentUrl);

        if (foundPage) {
          setPage(foundPage);
        } else {
          setError('Page not found');
          console.warn(`No page found for URL: ${currentUrl}`);
        }
      } catch (err) {
        console.error('Error loading page:', err);
        setError('Failed to load page');
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [currentUrl]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h1>Error</h1>
        <p>{error}</p>
        <p>URL: {currentUrl}</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="not-found-container">
        <h1>404 - Page Not Found</h1>
        <p>The page "{currentUrl}" could not be found.</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return <PageRenderer page={page} />;
};
