import React, { useState, useEffect } from 'react';
import { BasicTemplate } from '../../models/strapi/apiMap';
import { ContentService } from '../../services/content-service';
import { ComponentRenderer } from '../ComponentRenderer';

export const BasicTemplateRenderer: React.FC<{ template: BasicTemplate }> = ({
  template,
}) => {
  const [templateData, setTemplateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        if (template.documentId) {
          const fullTemplate = await ContentService.getBasicTemplate(
            template.documentId,
          );
          console.log('Loaded full basic template:', fullTemplate);
          setTemplateData(fullTemplate);
        } else {
          setTemplateData(template);
        }
      } catch (error) {
        console.error('Error loading basic template:', error);
        setTemplateData(template);
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [template]);

  if (loading) {
    return <div className="template-loading">Loading template...</div>;
  }

  const content = templateData?.Content || template.Content;

  return (
    <div className="basic-template">
      {content && Array.isArray(content) ? (
        content.map((component: any, index: number) => (
          <ComponentRenderer
            key={component.id || index}
            component={component}
          />
        ))
      ) : content ? (
        <div
          className="template-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div className="no-content">No content available</div>
      )}
    </div>
  );
};
