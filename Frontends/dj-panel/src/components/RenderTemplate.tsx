import React from 'react';
import { Template } from '../models/strapi/strapiMap';
import {
  HeroBlock,
  ImageSliderBlock,
  StepsContainerBlock,
  ArticleBlock,
  CTABlock,
} from './content-blocks';

export const RenderTemplate: React.FC<{ template: Template }> = ({
  template,
}) => {
  const content: any[] = (template as any)?.Content || [];

  return (
    <div>
      <div style={{ marginTop: 16 }}>
        {content.map((block: any, i: number) => {
          const type = block?.__component;
          if (!type) return null;

          switch (type) {
            case 'hero.hero-block':
              return <HeroBlock key={i} block={block} />;

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
