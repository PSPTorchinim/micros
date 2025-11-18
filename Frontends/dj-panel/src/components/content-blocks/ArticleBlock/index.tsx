import React from 'react';
import './index.css';
import { ArticleBlock as ArticleBlockType } from '../../../models/strapi/strapiMap';

export const ArticleBlock = (articlesBlock: ArticleBlockType) => (
  <section className="article-block">
    {articlesBlock.Title && (
      <h2 className="article-block__title">{articlesBlock.Title}</h2>
    )}
    <ul className="article-block__list">
      {articlesBlock.articles?.map((item: any, idx: number) => (
        <li key={idx} className="article-block__item">
          {item.url ? (
            <a href={item.url} className="article-block__link">
              {item.Title}
            </a>
          ) : (
            <span>{item.Title}</span>
          )}
        </li>
      ))}
    </ul>
  </section>
);
