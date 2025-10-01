import React, { useState, useEffect, JSX } from 'react';
import { ContentService } from '../../services/content-service';
import { Article } from '../../models/strapi/apiMap';

interface ArticlesComponentProps {
  data: {
    id: number;
    __component: string;
    article?: Article;
  };
}

export const ArticlesComponent: React.FC<ArticlesComponentProps> = ({
  data,
}) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('ArticlesComponent data:', data);

        if (data) {
          setArticle(
            await ContentService.getArticleByName(data.article?.Title || ''),
          );
        } else {
          // If no article is directly provided, we might need to fetch it
          console.warn('No article data provided in component');
        }
      } catch (err) {
        console.error('Error loading article:', err);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [data]);

  const renderContent = (content: any) => {
    if (!content) return null;

    if (Array.isArray(content)) {
      return content.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <p key={index}>
              {block.children?.map((child: any, childIndex: number) => (
                <span key={childIndex}>{child.text}</span>
              ))}
            </p>
          );
        }
        if (block.type === 'heading') {
          const HeadingTag =
            `h${block.level || 2}` as keyof JSX.IntrinsicElements;
          return (
            <HeadingTag key={index}>
              {block.children?.map((child: any, childIndex: number) => (
                <span key={childIndex}>{child.text}</span>
              ))}
            </HeadingTag>
          );
        }
        return null;
      });
    }

    // If content is a string, render it directly
    if (typeof content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }

    return <pre>{JSON.stringify(content, null, 2)}</pre>;
  };

  if (loading) {
    return <div className="articles-loading">Loading article...</div>;
  }

  if (error) {
    return <div className="articles-error">Error: {error}</div>;
  }

  if (!article) {
    return (
      <div className="articles-no-content">No article content available</div>
    );
  }

  return (
    <article className="articles-component">
      {article.Hero && (
        <div className="article-hero">
          <img
            src={article.Hero.url}
            alt={
              article.Hero.alternativeText ||
              article.Title ||
              'Article hero image'
            }
            className="hero-image"
          />
        </div>
      )}

      {article.Title && (
        <header className="article-header">
          <h1 className="article-title">{article.Title}</h1>
        </header>
      )}

      {article.Content && (
        <div className="article-content">{renderContent(article.Content)}</div>
      )}
    </article>
  );
};
