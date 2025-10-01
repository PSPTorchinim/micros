import React from 'react';
import { Page } from '../models/strapi/apiMap';
import { TemplateRenderer } from './TemplateRenderer';

export const PageRenderer: React.FC<{ page: Page }> = ({ page }) => {
  return (
    <div className="page-container">
      <div className="page-content">
        {page.Content && page.Content.length > 0 ? (
          page.Content.map((item, index) => (
            <TemplateRenderer key={`${item.id || index}`} template={item} />
          ))
        ) : (
          <div className="no-content">
            <p>No content available for this page.</p>
          </div>
        )}
      </div>
    </div>
  );
};
