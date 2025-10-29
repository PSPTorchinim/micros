import React from 'react';

export const CMS_BASE = `${process.env.REACT_APP_CMS_PROTOCOL || 'http'}://${process.env.REACT_APP_CMS_HOST || 'localhost'}:${process.env.REACT_APP_CMS_PORT || '1337'}`;

export function mediaUrl(url?: string | null) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${CMS_BASE}${url}`;
}

export const ArticleLink: React.FC<{
  article?: any;
  label?: string;
  newTab?: boolean;
}> = ({ article, label, newTab }) => {
  if (!article) return null;
  // handle both populated shapes (entity or entity.data)
  const entity = article?.attributes ? article : article?.data;
  const slug = entity?.attributes?.Slug ?? entity?.Slug;
  const title =
    label || entity?.attributes?.Title || entity?.Title || 'Read more';
  const href = `/articles/${slug}`;
  return (
    <a
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener' : undefined}
    >
      {title}
    </a>
  );
};
