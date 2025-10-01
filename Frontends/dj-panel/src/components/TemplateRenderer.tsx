import React from 'react';
import { BasicTemplateRenderer } from './Templates/BasicTemplateRenderer';

export const TemplateRenderer: React.FC<{ template: any }> = ({ template }) => {
  switch (template.Type) {
    case 'Basic':
      return <BasicTemplateRenderer template={template} />;

    default:
      return (
        <div className="unknown-template">
          <h3>Unknown Template Type: {template.Type || 'undefined'}</h3>
          <p>Template ID: {template.id}</p>
          {template.Name && <p>Template Name: {template.Name}</p>}
        </div>
      );
  }
};
