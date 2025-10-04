import React from 'react';
import { Page } from '../models/strapi/apiMap';
import { TemplateRenderer } from './TemplateRenderer';

export const PageRenderer: React.FC<{ page: Page }> = ({ page }) => {
  return (
    <div className="page-container">
      <div className="page-content">
        {page.Content ? (
          <TemplateRenderer template={page.Content} />
        ) : (
          <div className="no-content">
            <p>No content available for this page.</p>
          </div>
        )}
      </div>
    </div>
  );
};
