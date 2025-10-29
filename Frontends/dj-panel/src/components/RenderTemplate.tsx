import React from 'react';
import { Page, Template } from '../models/strapi/strapiMap';
import {
  ImageSliderBlock,
  StepsContainerBlock,
  ArticleBlock,
  CTABlock,
} from './content-blocks';

export const RenderTemplate: React.FC<{ template: Template; page: Page }> = ({
  template,
  page,
}) => {
  const content: any[] = (template as any)?.Content || [];

  return (
    <div>
      <h1>{(page as any)?.Title}</h1>
      {(template as any)?.Name && <div>Template: {(template as any).Name}</div>}

      <div style={{ marginTop: 16 }}>
        {content.map((block: any, i: number) => {
          const type = block?.__component;
          if (!type) return null;

          switch (type) {
            case 'image-sliders.image-slider':
              return <ImageSliderBlock key={i} block={block} />;

            case 'steps-containers.steps-container':
              return <StepsContainerBlock key={i} block={block} />;

            case 'articles.article-block':
              return <ArticleBlock key={i} block={block} />;

            case 'ctas.cta':
              return <CTABlock key={i} block={block} />;

            default:
              return (
                <pre
                  key={i}
                  style={{
                    background: '#fafafa',
                    padding: 12,
                    borderRadius: 8,
                  }}
                >
                  Unsupported block: {type}
                  {'\n'}
                  {JSON.stringify(block, null, 2)}
                </pre>
              );
          }
        })}
      </div>
    </div>
  );
};
