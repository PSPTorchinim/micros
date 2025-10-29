import React from 'react';
import { ArticleLink } from './shared';

type Props = { block: any };

export const StepsContainerBlock: React.FC<Props> = ({ block }) => {
  const steps: any[] = block?.Steps || [];
  return (
    <div style={{ margin: '1rem 0' }}>
      {block?.Title && <h3>{block.Title}</h3>}
      {block?.Description && <p>{block.Description}</p>}
      <ol>
        {steps.map((st, idx) => {
          const cta = st?.CTA;
          const article = cta?.Article?.data ?? cta?.Article;
          return (
            <li key={idx} style={{ marginBottom: 12 }}>
              {st?.Title && <strong>{st.Title}</strong>}
              {st?.Description && <div>{st.Description}</div>}
              {cta && (
                <div style={{ marginTop: 6 }}>
                  <ArticleLink
                    article={article}
                    label={cta?.Label}
                    newTab={!!cta?.OpenInNewTab}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};
