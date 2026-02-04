// @ts-ignore - React is needed for JSX
import React from 'react';
import './index.css';
import type { ArticleBlock as ArticleBlockType } from '../../../models/api/strapi/apiMap';

export const ArticleBlock = (props: ArticleBlockType) => {
  const articles = Array.isArray(props.articles) ? props.articles : [];

  return (
    <section className="article-block">
      {props.Title && <h2 className="article-block__title">{props.Title}</h2>}
      <ul className="article-block__list">
        {articles.map((item) => (
          <li key={item.documentId ?? item.id ?? `article-${item.Title}`} className="article-block__item">
            {/* Articles don't have URL in Strapi schema, using documentId for linking */}
            <span>{item.Title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
