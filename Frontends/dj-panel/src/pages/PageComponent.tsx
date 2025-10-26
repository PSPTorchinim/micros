import React from 'react';
import { Page } from '../models/strapi/strapiMap';

interface PageComponentProps {
  page: Page;
}

export const PageComponent: React.FC<PageComponentProps> = ({ page }) => {
  // Render page content, you can expand this as needed
  return (
    <div>
      <h1>{page.Title}</h1>
      {/* Render more fields as needed */}
    </div>
  );
};
