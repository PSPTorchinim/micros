import React from 'react';
import { marked } from 'marked';
import './renderBlock.css';
import {
  HeroBlock,
  ImageSliderBlock,
  StepsContainerBlock,
  ArticleBlock,
  CTABlock,
  FeatureBlock,
  ContactBlock,
  FeatureTabBlock,
  ContactInfoBlock,
  LoginBlock,
  ForgotPasswordBlock,
} from './content-blocks';
import type {
  ContentBlock,
  ArticleContentBlock,
} from '../types/content-blocks';

/**
 * Główny renderer jednego „zwykłego" bloku (już zdereferencjonowanego).
 * Oczekujemy, że block ma `__kind` (np. 'image-slider', 'article-block', ...).
 * Jeżeli `__kind` nie ma – próbujemy zgrubnie dopasować po __component / fallback do <pre>.
 */
export function renderBlock(
  block: ContentBlock,
  index: number,
): React.ReactElement {
  const kind: string | undefined = block.__kind;

  switch (kind) {
    case 'hero-block':
      return <HeroBlock key={index} {...block} />;
    case 'image-slider':
      return <ImageSliderBlock key={index} {...block} />;
    case 'article-block':
      return <ArticleBlock key={index} {...block} />;
    case 'steps-container':
      return <StepsContainerBlock key={index} {...block} />;
    case 'cta':
      return <CTABlock key={index} {...block} />;
    case 'feature-section':
      return <FeatureBlock key={index} {...block} />;
    case 'contact-section':
      return <ContactBlock key={index} {...block} />;
    case 'feature-tab':
      return <FeatureTabBlock key={index} {...block} />;
    case 'contact-info':
      return <ContactInfoBlock key={index} {...block} />;
    case 'login-block':
      return <LoginBlock key={index} {...block} />;
    case 'forgot-password-block':
      return <ForgotPasswordBlock key={index} {...block} />;
    case 'article': {
      // Direct article rendering for article pages
      // Handle both Strapi v5 format (with attributes) and direct format
      const articleBlock = block as ArticleContentBlock;
      const articleData =
        (articleBlock as { attributes?: Record<string, unknown> }).attributes ||
        articleBlock;
      const title =
        typeof articleData.Title === 'string' ? articleData.Title : '';
      const summary =
        typeof articleData.Summary === 'string' ? articleData.Summary : '';
      const coverUrl =
        typeof articleData.coverUrl === 'string' ? articleData.coverUrl : '';
      const body = typeof articleData.Body === 'string' ? articleData.Body : '';

      // Convert markdown to HTML if body contains markdown
      const htmlBody = body ? marked.parse(body) : '';

      return (
        <div key={index} className="article-detail">
          {coverUrl && (
            <img src={coverUrl} alt={title} className="article-detail__cover" />
          )}
          <h1 className="article-detail__title">{title}</h1>
          {summary && <p className="article-detail__summary">{summary}</p>}
          {htmlBody && (
            <div
              className="article-detail__body"
              dangerouslySetInnerHTML={{ __html: htmlBody }}
            />
          )}
        </div>
      );
    }
  }

  // LEGACY/FALLBACK: gdyby trafił tu oryginalny komponent kolekcji z __component
  const comp = block.__component as string | undefined;
  switch (comp) {
    case 'hero.hero-block':
      return <HeroBlock key={index} {...block} />;
    case 'image-sliders.image-slider':
      return <ImageSliderBlock key={index} {...block} />;
    case 'articles.article-block':
      return <ArticleBlock key={index} {...block} />;
    case 'steps-containers.steps-container':
      return <StepsContainerBlock key={index} {...block} />;
    case 'ctas.cta':
      return <CTABlock key={index} {...block} />;
    case 'feature-sections.feature-section':
      return <FeatureBlock key={index} {...block} />;
    case 'contact-sections.contact-section':
      return <ContactBlock key={index} {...block} />;
    case 'feature-tabs.feature-tab':
      return <FeatureTabBlock key={index} {...block} />;
    case 'contact-infos.contact-info':
      return <ContactInfoBlock key={index} {...block} />;
  }

  // Nieznany typ — pokaż surowy payload
  return (
    <pre
      key={index}
      style={{ background: '#fafafa', padding: 12, borderRadius: 8 }}
    >
      Unsupported block
      {'\n'}
      {JSON.stringify(block, null, 2)}
    </pre>
  );
}

export default renderBlock;
