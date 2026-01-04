import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './renderBlock.css';
import { getBlockComponent, hasBlockComponent } from './block-component-registry';
import { getBlockConfigByLegacyComponent } from '../types/block-registry';
import type {
  ContentBlock,
  ArticleContentBlock,
} from '../types/content-blocks';

/**
 * Main renderer for a single "regular" block (already dereferenced).
 * Expects block to have `__kind` (e.g., 'image-slider', 'article-block', ...).
 * If `__kind` is missing, tries to match by __component or falls back to <pre>.
 */
export function renderBlock(
  block: ContentBlock,
  index: number,
): React.ReactElement {
  const kind: string | undefined = block.__kind;

  // Try to render by __kind using the component registry
  if (kind) {
    const Component = getBlockComponent(kind);
    
    if (Component) {
      // Handle special cases that need specific prop transformations
      if (kind === 'steps-container') {
        const { heading = '', ...rest } = block as ContentBlock & {
          heading?: string;
        };
        return <Component key={index} heading={heading} {...rest} />;
      }
      
      if (kind === 'cta') {
        const { Label, url, ...rest } = block as ContentBlock & {
          Label: string;
          url: string;
        };
        return <Component key={index} Label={Label} url={url} {...rest} />;
      }
      
      // Special handling for article detail view
      if (kind === 'article') {
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

        // Convert markdown to HTML and sanitize to prevent XSS attacks
        const htmlBody = body ? DOMPurify.sanitize(marked.parse(body)) : '';

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
      
      // Default: render with all props
      return <Component key={index} {...block} />;
    }
  }

  // LEGACY/FALLBACK: try to match by __component for backward compatibility
  const comp = block.__component as string | undefined;
  if (comp) {
    const blockConfig = getBlockConfigByLegacyComponent(comp);
    if (blockConfig) {
      const Component = getBlockComponent(blockConfig.kind);
      if (Component) {
        // Handle special cases
        if (blockConfig.kind === 'steps-container') {
          const { heading = '', ...rest } = block as typeof block & {
            heading?: string;
          };
          return <Component key={index} heading={heading} {...rest} />;
        }
        
        if (blockConfig.kind === 'cta') {
          const {
            Label = '',
            url = '',
            ...rest
          } = block as typeof block & { Label?: string; url?: string };
          return <Component key={index} Label={Label} url={url} {...rest} />;
        }
        
        return <Component key={index} {...block} />;
      }
    }
  }

  // Unknown type — show raw payload
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
