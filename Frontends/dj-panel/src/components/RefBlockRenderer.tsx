import React from 'react';
import { StrapiService } from '../services/strapi-service';
import { renderBlock } from './renderBlock';
import { ContentSkeleton } from './atoms/Skeleton';
import type { RefComponent, ContentBlock } from '../types/content-blocks';
import { getBlockConfigByRefComponent } from '../types/block-registry';

/**
 * Renderer for reference components (e.g. "image-slider-ref.image-slider-ref").
 * Uses the block registry to dynamically determine how to fetch and render blocks.
 */

// uniwersalny ekstraktor documentId z różnych kształtów populate
function getDocId(input: unknown): string | undefined {
  if (!input || typeof input !== 'object') return undefined;

  const obj = input as Record<string, unknown>;

  // Najczęstszy przypadek u Ciebie: obiekt z documentId
  if (typeof obj.documentId === 'string') return obj.documentId;

  // czasem API zwraca stringa (np. connect: ["docId"])
  if (typeof input === 'string') return input;

  // niektóre klienty spłaszczają id jako string
  if (obj.id && typeof obj.id === 'string') return obj.id;

  // Strapi v4/v5 warianty z data/attributes
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

interface Props {
  block: RefComponent;
  index: number;
}

export const RefBlockRenderer: React.FC<Props> = ({ block, index }) => {
  const refUID = block.__component as string;
  
  // Get block configuration from registry
  const blockConfig = getBlockConfigByRefComponent(refUID);
  
  if (!blockConfig) {
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
        Unknown ref component type: {refUID}
      </pre>
    );
  }

  const relField = blockConfig.refField;
  const base = blockConfig.kind;

  const relObj = relField ? block[relField] : undefined;
  const docId = getDocId(relObj);
  const numericId =
    typeof (relObj as Record<string, unknown>)?.id === 'number'
      ? ((relObj as Record<string, unknown>).id as number)
      : undefined;

  const [resolved, setResolved] = React.useState<ContentBlock | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancel = false;

    const fetchRef = async () => {
      setError(null);
      setResolved(null);

      try {
        if (!base) {
          setError('Unknown ref base');
          return;
        }

        let data: unknown = null;

        // 1) Preferuj documentId (stabilny identyfikator)
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

        // 2) Fallback: po numerycznym id (gdyby documentId nie przyszedł)
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

        // Doklej znacznik typu, żeby renderBlock nie musiał zgadywać
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

    fetchRef();
    return () => {
      cancel = true;
    };
  }, [refUID, base, relField, docId, numericId]);

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
