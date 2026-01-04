// components/RenderTemplate.tsx
import React from 'react';
import { StrapiService } from '../services/strapi-service';
import {
  transformStrapiBlocks,
  RefBlockRenderer,
  type RefComponent,
} from './RefBlockRenderer';
import renderBlock, { type ContentBlock } from './renderBlock';
import { ContentSkeleton } from './atoms/Skeleton';
import type { Template } from '../models/api/strapi/apiMap';

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
  const [tpl, setTpl] = React.useState<Template | null>(null);
  const [blocks, setBlocks] = React.useState<ContentBlock[]>([]);
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
        const t = (await StrapiService.getTemplateByDocumentId)
          ? await StrapiService.getTemplateByDocumentId(template)
          : await StrapiService.getTemplateById(template);

        if (!mounted) return;
        setTpl(t ?? null);
      } catch (e: unknown) {
        if (!mounted) return;
        const error = e as Error;
        setTpl(null);
        setBlocks([]);
        setError(error?.message || 'Failed to fetch template');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTemplate();
    return () => {
      mounted = false;
    };
  }, [template]);

  // 2) Extract Content blocks and transform ref-components
  React.useEffect(() => {
    let mounted = true;

    const run = async () => {
      // Get template type
      const templateType = tpl?.TemplateType;

      // For Login and ForgotPassword templates, fetch the singleton blocks
      if (templateType === 'Login') {
        try {
          const loginBlock = await StrapiService.getLoginBlockSingleton();
          if (mounted) {
            // Always render the block, even if no data is configured in Strapi
            // The component has default props that will be used
            setBlocks([
              { __kind: 'login-block', ...(loginBlock || {}) } as ContentBlock,
            ]);
          }
        } catch (e) {
          console.error('Error fetching login block singleton:', e);
          if (mounted) {
            // Still render the block with defaults on error
            setBlocks([{ __kind: 'login-block' } as ContentBlock]);
            setError(null);
          }
        }
        return;
      }

      if (templateType === 'ForgotPassword') {
        try {
          const forgotPasswordBlock =
            await StrapiService.getForgotPasswordBlockSingleton();
          if (mounted) {
            // Always render the block, even if no data is configured in Strapi
            // The component has default props that will be used
            setBlocks([
              {
                __kind: 'forgot-password-block',
                ...(forgotPasswordBlock || {}),
              } as ContentBlock,
            ]);
          }
        } catch (e) {
          console.error('Error fetching forgot password block singleton:', e);
          if (mounted) {
            // Still render the block with defaults on error
            setBlocks([{ __kind: 'forgot-password-block' } as ContentBlock]);
            setError(null);
          }
        }
        return;
      }

      if (templateType === 'ChangePassword') {
        try {
          const changePasswordBlock =
            await StrapiService.getChangePasswordBlockSingleton();
          if (mounted) {
            // Always render the block, even if no data is configured in Strapi
            // The component has default props that will be used
            setBlocks([
              {
                __kind: 'change-password-block',
                ...(changePasswordBlock || {}),
              } as ContentBlock,
            ]);
          }
        } catch (e) {
          console.error('Error fetching change password block singleton:', e);
          if (mounted) {
            // Still render the block with defaults on error
            setBlocks([{ __kind: 'change-password-block' } as ContentBlock]);
            setError(null);
          }
        }
        return;
      }

      if (templateType === 'Profile') {
        try {
          const profileBlock = await StrapiService.getProfileBlockSingleton();
          if (mounted) {
            // Always render the block, even if no data is configured in Strapi
            // The component has default props that will be used
            setBlocks([
              {
                __kind: 'profile-block',
                ...(profileBlock || {}),
              } as ContentBlock,
            ]);
          }
        } catch (e) {
          console.error('Error fetching profile block singleton:', e);
          if (mounted) {
            // Still render the block with defaults on error
            setBlocks([{ __kind: 'profile-block' } as ContentBlock]);
            setError(null);
          }
        }
        return;
      }

      // Strapi v5 REST zwraca zazwyczaj { id: <documentId>, attributes: {...} }
      const contentBlocks: (ContentBlock | RefComponent)[] = Array.isArray(
        tpl?.Content,
      )
        ? tpl!.Content
        : Array.isArray(tpl?.Content)
          ? tpl.Content
          : [];

      // If this is a Standard template with no content and we have a page title,
      // try to fetch and render the article directly
      if (
        templateType === 'Standard' &&
        contentBlocks.length === 0 &&
        pageTitle
      ) {
        try {
          const article = await StrapiService.getArticleByTitle(pageTitle);
          if (mounted) {
            if (article) {
              setBlocks([{ __kind: 'article', ...article } as ContentBlock]);
            } else {
              setBlocks([]);
            }
          }
          return;
        } catch (e) {
          console.error('Error fetching article by title:', e);
          if (mounted) {
            setBlocks([]);
            setError(null);
          }
          return;
        }
      }

      if (!contentBlocks.length) {
        if (mounted) setBlocks([]);
        return;
      }

      // Synchronous transformation of populated ref-components
      const resolved = transformStrapiBlocks(contentBlocks);
      if (mounted) setBlocks(resolved as ContentBlock[]);
    };

    run();
    return () => {
      mounted = false;
    };
  }, [tpl, populateDeep, pageTitle]);

  return (
    <div className="render-template-wrapper">
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
          if (block.__component?.endsWith?.('-ref')) {
            return (
              <RefBlockRenderer
                key={index}
                block={block as unknown as RefComponent}
                index={index}
              />
            );
          }
          // „zwykły" blok kolekcji (już zdereferencjonowany)
          return renderBlock(block, index);
        })}
    </div>
  );
};

export default RenderTemplate;
