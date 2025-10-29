import React from 'react';
import { ArticleLink } from './shared';

type Props = { block: any };

export const ArticleBlock: React.FC<Props> = ({ block }) => {
  const items = block?.Items?.data ?? block?.Items ?? [];
  return (
    <div style={{ margin: '1rem 0' }}>
      {block?.Title && <h3>{block.Title}</h3>}
      <ul>
        {items.map((it: any) => {
          const id = it?.id ?? it?.attributes?.id ?? `${Math.random()}`;
          const entity = it?.attributes ? it : { attributes: it };
          return (
            <li key={id}>
              <ArticleLink article={entity} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
