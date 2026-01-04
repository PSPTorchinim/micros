import React from 'react';
import { StrapiService } from '../services/strapi-service';
import { renderBlock } from './renderBlock';
import { ContentSkeleton } from './atoms/Skeleton';
import type { RefComponent, ContentBlock } from '../types/content-blocks';

/**
 * Extracts documentId from various Strapi populate shapes
 * @param input - The input object, string, or undefined
 * @returns The documentId as a string, or undefined if not found
 */
export function getDocId(input: unknown): string | undefined {
  if (typeof input === 'string') return input;
  if (!input || typeof input !== 'object') return undefined;

  const obj = input as Record<string, unknown>;

  // Most common case: object with documentId field
  if (typeof obj.documentId === 'string') return obj.documentId;

  // Some clients flatten id as string
  if (obj.id && typeof obj.id === 'string') return obj.id;

  // Strapi v4/v5 variants with data/attributes
  const data = obj.data as Record<string, unknown> | undefined;
  if (
    data?.attributes &&
    typeof (data.attributes as Record<string, unknown>).documentId === 'string'
  ) {
    return (data.attributes as Record<string, unknown>).documentId as string;
  }
  if (data?.id && typeof data.id === 'string') return data.id;

  return undefined;
}

// Mapping of ref component names to their relational field names
export const FIELD_BY_REF: Record<string, string> = {
  'article-block-ref.article-block-ref': 'block',
  'hero-block-ref.hero-block-ref': 'hero_block',
  'image-slider-ref.image-slider-ref': 'slider',
  'steps-container-ref.steps-container-ref': 'container',
  'cta-ref.cta-ref': 'cta',
  'feature-section-ref.feature-section-ref': 'feature_section',
  'contact-section-ref.contact-section-ref': 'contact_section',
  'feature-tab-ref.feature-tab-ref': 'feature_tab',
  'contact-info-ref.contact-info-ref': 'contact_info',
};

/**
 * Recursively processes content blocks to prepare them for rendering.
 * - Ref components are returned as-is (will be handled by RefBlockRenderer)
 * - Regular blocks with nested components/arrays are processed recursively
 * - Other blocks are returned unchanged
 *
 * @param block - A content block, ref component, or array of them
 * @returns Processed content block(s)
 */
export function transformStrapiBlocks(
  block: ContentBlock | RefComponent | (ContentBlock | RefComponent)[],
): ContentBlock | ContentBlock[] {
  // Handle arrays
  if (Array.isArray(block)) {
    return block.map(transformStrapiBlocks) as ContentBlock[];
  }

  if (!block || typeof block !== 'object') {
    return block as ContentBlock;
  }

  // Check if this is a ref component - return as-is, RefBlockRenderer will handle it
  if (
    '__component' in block &&
    block.__component &&
    block.__component.endsWith('-ref')
  ) {
    return block as ContentBlock;
  }

  // For regular blocks, recursively process nested fields
  const resolved: Record<string, unknown> = {
    ...(block as Record<string, unknown>),
  };

  let hasNestedComponents = false;
  for (const key of Object.keys(block)) {
    const value = (block as Record<string, unknown>)[key];
    if (
      Array.isArray(value) ||
      (value &&
        typeof value === 'object' &&
        '__component' in (value as Record<string, unknown>))
    ) {
      hasNestedComponents = true;
      resolved[key] = transformStrapiBlocks(
        value as ContentBlock | RefComponent | (ContentBlock | RefComponent)[],
      );
    }
  }

  // Return original block if no transformations were made to avoid unnecessary object allocation
  return hasNestedComponents
    ? (resolved as unknown as ContentBlock)
    : (block as ContentBlock);
}

/**
 * Unified renderer for ref components that handles both populated and non-populated data.
 * First checks if data is already populated (from deep populate), then falls back to async fetching.
 * 
 * Supported ref components:
 *  - article-block-ref.article-block-ref -> field: "block"
 *  - hero-block-ref.hero-block-ref -> "hero_block"
 *  - image-slider-ref.image-slider-ref -> "slider"
 *  - steps-container-ref.steps-container-ref -> "container"
 *  - cta-ref.cta-ref -> "cta"
 *  - feature-section-ref.feature-section-ref -> "feature_section"
 *  - contact-section-ref.contact-section-ref -> "contact_section"
 *  - feature-tab-ref.feature-tab-ref -> "feature_tab"
 *  - contact-info-ref.contact-info-ref -> "contact_info"
 */

interface Props {
  block: RefComponent;
  index: number;
}

export const RefBlockRenderer: React.FC<Props> = ({ block, index }) => {
  const refUID = block.__component as string;
  const base = refUID?.replace(/-ref(?:\..+)?$/, ''); // Extract base name (e.g., "image-slider")
  const relField = FIELD_BY_REF[refUID];

  const relObj = relField ? block[relField] : undefined;
  
  // Check if data is already populated - must have actual data fields beyond just id
  const isPopulated = React.useMemo(() => {
    if (!relObj || typeof relObj !== 'object') return false;
    
    const keys = Object.keys(relObj as Record<string, unknown>);
    if (keys.length <= 1) return false;
    
    return (
      'documentId' in relObj ||
      'Title' in relObj ||
      '__component' in relObj ||
      keys.some(key => key !== 'id' && (relObj as Record<string, unknown>)[key] !== null)
    );
  }, [relObj]);
  
  const [resolved, setResolved] = React.useState<ContentBlock | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancel = false;

    const resolveRef = async () => {
      try {
        if (!base) {
          setError('Unknown ref base');
          return;
        }

        if (!relField) {
          setError(`Unknown ref type: ${refUID}`);
          return;
        }

        // Fast path: data is already populated
        if (isPopulated) {
          if (!cancel) {
            setResolved({
              __kind: base,
              ...(relObj as Record<string, unknown>),
            } as ContentBlock);
          }
          return;
        }

        // Slow path: need to fetch data async
        setError(null);
        setResolved(null);

        const docId = getDocId(relObj);
        const numericId =
          typeof (relObj as Record<string, unknown>)?.id === 'number'
            ? ((relObj as Record<string, unknown>).id as number)
            : undefined;

        let data: unknown = null;

        // Try fetching by documentId first (stable identifier)
        if (docId) {
          switch (base) {
            case 'article-block':
              data = await StrapiService.getArticleBlockByDocumentId(docId);
              break;
            case 'hero-block':
              data = await StrapiService.getHeroBlockByDocumentId(docId);
              break;
            case 'image-slider':
              data = await StrapiService.getImageSliderBlockByDocumentId(docId);
              break;
            case 'steps-container':
              data =
                await StrapiService.getStepsContainerBlockByDocumentId(docId);
              break;
            case 'cta':
              data = await StrapiService.getCTABlockByDocumentId(docId);
              break;
            case 'feature-section':
              data = await StrapiService.getFeatureSectionByDocumentId(docId);
              break;
            case 'contact-section':
              data = await StrapiService.getContactSectionByDocumentId(docId);
              break;
            case 'feature-tab':
              data = await StrapiService.getFeatureTabBlockByDocumentId(docId);
              break;
            case 'contact-info':
              data = await StrapiService.getContactInfoBlockByDocumentId(docId);
              break;
            default:
              setError(`Unknown ref base: ${base}`);
              return;
          }
        }

        // Fallback: try numeric id
        if (!data && numericId) {
          switch (base) {
            case 'article-block':
              data = await StrapiService.getArticleBlockById(numericId);
              break;
            case 'hero-block':
              data = await StrapiService.getHeroBlockById(numericId);
              break;
            case 'image-slider':
              data = await StrapiService.getImageSliderBlockById(numericId);
              break;
            case 'steps-container':
              data = await StrapiService.getStepsContainerBlockById(numericId);
              break;
            case 'cta':
              data = await StrapiService.getCTABlockById(numericId);
              break;
            case 'feature-section':
              data = await StrapiService.getFeatureSectionById(numericId);
              break;
            case 'contact-section':
              data = await StrapiService.getContactSectionById(numericId);
              break;
            case 'feature-tab':
              data = await StrapiService.getFeatureTabBlockById(numericId);
              break;
            case 'contact-info':
              data = await StrapiService.getContactInfoBlockById(numericId);
              break;
            default:
              setError(`Unknown ref base: ${base}`);
              return;
          }
        }

        if (cancel) return;

        if (!data) {
          setError(
            `${refUID}: Not found${
              docId
                ? ` (documentId: ${docId})`
                : numericId
                  ? ` (id: ${numericId})`
                  : ''
            }`,
          );
          return;
        }

        setResolved({
          __kind: base,
          ...(data as Record<string, unknown>),
        } as ContentBlock);
      } catch (e: unknown) {
        const error = e as Error;
        if (!cancel)
          setError(error?.message || 'Failed to fetch referenced block');
      }
    };

    resolveRef();
    return () => {
      cancel = true;
    };
  }, [refUID, base, relField, block]);

  if (error) {
    return (
      <pre
        key={index}
        style={{
          background: '#fdecea',
          color: '#611a15',
          padding: 12,
          borderRadius: 8,
          border: '1px solid #f5c6cb',
        }}
      >
        {error}
      </pre>
    );
  }

  if (!resolved) {
    return <ContentSkeleton key={index} type="block" />;
  }

  return renderBlock(resolved, index);
};
