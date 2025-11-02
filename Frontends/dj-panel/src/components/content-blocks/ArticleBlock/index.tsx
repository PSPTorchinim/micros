import React from 'react';
import './index.css';

export const ArticleBlock = ({ Title, items }: any) => (
  <section className="article-block">
    {Title && <h2 className="article-block__title">{Title}</h2>}
    <ul className="article-block__list">
      {items?.map((item: any, idx: number) => (
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
