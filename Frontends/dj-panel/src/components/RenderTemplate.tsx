import React from 'react';
import { Page, Template } from '../models/strapi/strapiMap';

export const RenderTemplate: React.FC<{ template: Template; page: Page }> = ({
  template,
  page,
}) => {
  return (
    <div>
      <h1>{page.Title}</h1>
      <div>Template: {template.Name}</div>
      {/* Render more fields as needed */}
    </div>
  );
};
