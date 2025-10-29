import React from 'react';
import { ArticleLink } from './shared';

type Props = { block: any };

export const CTABlock: React.FC<Props> = ({ block }) => {
  const article = block?.Article?.data ?? block?.Article;
  return (
    <p style={{ margin: '1rem 0' }}>
      <ArticleLink
        article={article}
        label={block?.Label}
        newTab={!!block?.OpenInNewTab}
      />
    </p>
  );
};
