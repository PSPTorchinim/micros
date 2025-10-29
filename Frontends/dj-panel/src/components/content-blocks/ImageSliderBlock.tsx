import React from 'react';
import { ArticleLink, mediaUrl } from './shared';

type Props = { block: any };

export const ImageSliderBlock: React.FC<Props> = ({ block }) => {
  const slides: any[] = block?.Slides || [];
  return (
    <div style={{ margin: '1rem 0' }}>
      {block?.Title && <h3>{block.Title}</h3>}
      <div style={{ display: 'grid', gap: 12 }}>
        {slides.map((s, idx) => {
          const url =
            s?.Image?.data?.attributes?.url ??
            s?.Image?.url ??
            (Array.isArray(s?.Image) ? s?.Image?.[0]?.url : undefined);
          const caption = s?.Caption;
          const cta = s?.CTA;
          const article = cta?.Article?.data ?? cta?.Article;
          return (
            <div
              key={idx}
              style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}
            >
              {url && (
                <img
                  src={mediaUrl(url)}
                  alt={caption || `slide-${idx}`}
                  style={{ maxWidth: '100%', display: 'block' }}
                />
              )}
              {caption && <div style={{ marginTop: 8 }}>{caption}</div>}
              {cta && (
                <div style={{ marginTop: 8 }}>
                  <ArticleLink
                    article={article}
                    label={cta?.Label}
                    newTab={!!cta?.OpenInNewTab}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
