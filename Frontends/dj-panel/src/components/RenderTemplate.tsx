// components/RenderTemplate.tsx
import React from 'react';
import type { Template } from '../models/api/strapi/apiMap';
import { StrapiService } from '../services/strapi-service';
import { ContentSkeleton } from './atoms/Skeleton';
import {
  transformStrapiBlocks,
  RefBlockRenderer,
  type RefComponent,
} from './RefBlockRenderer';
import renderBlock, { type ContentBlock } from './renderBlock';

type Props = {
  /** documentId templatek (Strapi v5) */
  template?: string;
  /** głębokość populate przy bezpośrednim renderowaniu bez dereferencji (opcjonalne) */
  populateDeep?: number;
  /** Page title to help resolve article content */
  pageTitle?: string;
};

// Helper function to fetch singleton block
async function fetchSingletonBlock(
  blockType: string,
  fetcher: () => Promise<unknown>,
): Promise<ContentBlock> {
  try {
    const data = await fetcher();
    return { __kind: blockType, ...(data ?? {}) } as ContentBlock;
  } catch {
    // Return block with defaults on error
    return { __kind: blockType } as ContentBlock;
  }
}

// Helper function to handle article rendering
async function fetchArticleBlock(
  pageTitle: string,
): Promise<ContentBlock | null> {
  try {
    const article = await StrapiService.getArticleByTitle(pageTitle);
    return article ? ({ __kind: 'article', ...article } as ContentBlock) : null;
  } catch {
    return null;
  }
}

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
        const t = StrapiService.getTemplateByDocumentId
          ? await StrapiService.getTemplateByDocumentId(template)
          : await StrapiService.getTemplateById(template);

        if (!mounted) return;
        setTpl(t ?? null);
      } catch (e: unknown) {
        if (!mounted) return;
        const error = e as Error;
        setTpl(null);
        setBlocks([]);
        setError(error.message || 'Failed to fetch template');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void fetchTemplate();
    return () => {
      mounted = false;
    };
  }, [template]);

  // 2) Extract Content blocks and transform ref-components
  React.useEffect(() => {
    let mounted = true;

    const run = async () => {
      const templateType = tpl?.TemplateType;

      // Handle singleton template types
      if (templateType === 'Login') {
        const block = await fetchSingletonBlock(
          'login-block',
          StrapiService.getLoginBlockSingleton,
        );
        if (mounted) {
          setBlocks([block]);
          setError(null);
        }
        return;
      }

      if (templateType === 'ForgotPassword') {
        const block = await fetchSingletonBlock(
          'forgot-password-block',
          StrapiService.getForgotPasswordBlockSingleton,
        );
        if (mounted) {
          setBlocks([block]);
          setError(null);
        }
        return;
      }

      if (templateType === 'ChangePassword') {
        const block = await fetchSingletonBlock(
          'change-password-block',
          StrapiService.getChangePasswordBlockSingleton,
        );
        if (mounted) {
          setBlocks([block]);
          setError(null);
        }
        return;
      }

      if (templateType === 'Profile') {
        const block = await fetchSingletonBlock(
          'profile-block',
          StrapiService.getProfileBlockSingleton,
        );
        if (mounted) {
          setBlocks([block]);
          setError(null);
        }
        return;
      }

      if (templateType === 'Company') {
        const block = await fetchSingletonBlock(
          'company-block',
          StrapiService.getCompanyBlockSingleton,
        );
        if (mounted) {
          setBlocks([block]);
          setError(null);
        }
        return;
      }

      if (templateType === 'RolesManagement') {
        if (mounted) {
          setBlocks([{ __kind: 'roles-management-block' } as ContentBlock]);
          setError(null);
        }
        return;
      }

      // Handle Standard template with content blocks
      const contentBlocks: (ContentBlock | RefComponent)[] = Array.isArray(
        tpl?.Content,
      )
        ? tpl.Content
        : [];

      // Try to fetch article if Standard template has no content
      if (
        templateType === 'Standard' &&
        contentBlocks.length === 0 &&
        pageTitle
      ) {
        const article = await fetchArticleBlock(pageTitle);
        if (mounted) {
          setBlocks(article ? [article] : []);
          setError(null);
        }
        return;
      }

      if (!contentBlocks.length) {
        if (mounted) setBlocks([]);
        return;
      }

      // Synchronous transformation of populated ref-components
      const resolved = transformStrapiBlocks(contentBlocks);
      if (mounted) setBlocks(resolved as ContentBlock[]);
    };

    void run();
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
          const blockKey: string =
            block.id?.toString() ??
            block.documentId?.toString() ??
            `${block.__component ?? 'block'}-${index}`;
          // jeżeli coś jeszcze zostało jako ref-komponent, dobij to RefBlockRendererem
          if (block.__component?.endsWith('-ref')) {
            return (
              <RefBlockRenderer
                key={blockKey}
                block={block as unknown as RefComponent}
                index={index}
              />
            );
          }
          // „zwykły" blok kolekcji (już zdereferencjonowany)
          return renderBlock(block, blockKey);
        })}
    </div>
  );
};

export default RenderTemplate;
