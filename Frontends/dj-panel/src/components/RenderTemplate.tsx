// components/RenderTemplate.tsx
import React from 'react';

// typ opcjonalny; jeśli masz swój Template z modeli, możesz go tu podmienić
type TemplateEntity = any;

import { strapiAPI } from '../services/strapi-api';
import { mapStrapiContentToFrontend } from '../utils/mapStrapiContentToFrontend';
import { RefBlockRenderer } from './RefBlockRenderer';
import renderBlock from './renderBlock';
import { ContentSkeleton } from './atoms/Skeleton';

type Props = {
  /** documentId templatek (Strapi v5) */
  template?: string;
  /** głębokość populate przy bezpośrednim renderowaniu bez dereferencji (opcjonalne) */
  populateDeep?: number;
  /** Page title to help resolve article content */
  pageTitle?: string;
};

export const RenderTemplate: React.FC<Props> = ({
  template,
  populateDeep = 5,
  pageTitle,
}) => {
  const [tpl, setTpl] = React.useState<TemplateEntity | null>(null);
  const [blocks, setBlocks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // 1) Pobierz template po documentId
  React.useEffect(() => {
    let mounted = true;

    const fetchTemplate = async () => {
      if (!template) {
        setTpl(null);
        setBlocks([]);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // U Ciebie istnieje getTemplateById (po documentId) — ale dodaliśmy też getTemplateByDocumentId
        // Jeśli masz tylko getTemplateById, możesz go tu użyć zamiast:
        const t = (await strapiAPI.getTemplateByDocumentId)
          ? await strapiAPI.getTemplateByDocumentId(template)
          : await strapiAPI.getTemplateById(template);

        if (!mounted) return;
        setTpl(t ?? null);
      } catch (e: any) {
        if (!mounted) return;
        setTpl(null);
        setBlocks([]);
        setError(e?.message || 'Failed to fetch template');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTemplate();
    return () => {
      mounted = false;
    };
  }, [template]);

  // 2) Wyciągnij bloki Content i zrób dereferencję ref-komponentów
  React.useEffect(() => {
    let mounted = true;

    const run = async () => {
      // Get template type
      const templateType =
        tpl?.attributes?.TemplateType || (tpl as any)?.TemplateType;

      // For Login and ForgotPassword templates, fetch the singleton blocks
      if (templateType === 'Login') {
        try {
          const loginBlock = await strapiAPI.getLoginBlockSingleton();
          if (mounted && loginBlock) {
            setBlocks([{ __kind: 'login-block', ...loginBlock }]);
          }
        } catch (e) {
          console.error('Error fetching login block singleton:', e);
          if (mounted) setBlocks([]);
        }
        return;
      }

      if (templateType === 'ForgotPassword') {
        try {
          const forgotPasswordBlock =
            await strapiAPI.getForgotPasswordBlockSingleton();
          if (mounted && forgotPasswordBlock) {
            setBlocks([
              { __kind: 'forgot-password-block', ...forgotPasswordBlock },
            ]);
          }
        } catch (e) {
          console.error('Error fetching forgot password block singleton:', e);
          if (mounted) setBlocks([]);
        }
        return;
      }

      // Strapi v5 REST zwraca zazwyczaj { id: <documentId>, attributes: {...} }
      const contentBlocks: any[] = Array.isArray(tpl?.attributes?.Content)
        ? tpl!.attributes!.Content
        : Array.isArray((tpl as any)?.Content)
          ? (tpl as any).Content
          : [];

      // If this is a Standard template with no content and we have a page title,
      // try to fetch and render the article directly
      if (
        templateType === 'Standard' &&
        contentBlocks.length === 0 &&
        pageTitle
      ) {
        try {
          const article = await strapiAPI.getArticleByTitle(pageTitle);
          if (mounted && article) {
            setBlocks([{ __kind: 'article', ...article }]);
            return;
          }
        } catch (e) {
          console.error('Error fetching article by title:', e);
        }
      }

      if (!contentBlocks.length) {
        if (mounted) setBlocks([]);
        return;
      }

      // Rekurencyjna dereferencja:
      const resolved = await mapStrapiContentToFrontend(contentBlocks);
      if (mounted) setBlocks(resolved);
    };

    run();
    return () => {
      mounted = false;
    };
  }, [tpl, populateDeep, pageTitle]);

  return (
    <div>
      {loading && <ContentSkeleton type="block" count={2} />}
      {!loading && error && (
        <div
          style={{
            background: '#fdecea',
            color: '#611a15',
            padding: 12,
            borderRadius: 8,
            border: '1px solid #f5c6cb',
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && blocks.length === 0 && (
        <div
          style={{
            background: '#f8f9fa',
            color: '#6c757d',
            padding: 12,
            borderRadius: 8,
            border: '1px solid #e9ecef',
          }}
        >
          Brak treści do wyświetlenia.
        </div>
      )}

      {!loading &&
        !error &&
        blocks.map((block, index) => {
          // jeżeli coś jeszcze zostało jako ref-komponent, dobij to RefBlockRendererem
          if (block?.__component?.endsWith?.('-ref')) {
            return <RefBlockRenderer key={index} block={block} index={index} />;
          }
          // „zwykły” blok kolekcji (już zdereferencjonowany)
          return renderBlock(block, index);
        })}
    </div>
  );
};

export default RenderTemplate;
