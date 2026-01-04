import React from 'react';
import { StrapiService } from '../services/strapi-service';
import { renderBlock } from './renderBlock';
import { ContentSkeleton } from './atoms/Skeleton';
import type { RefComponent, ContentBlock } from '../types/content-blocks';
import { getDocId, FIELD_BY_REF } from '../utils/transformStrapiBlocks';

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
  const isPopulated = 
    relObj && 
    typeof relObj === 'object' &&
    Object.keys(relObj as Record<string, unknown>).length > 1 &&
    (
      'documentId' in relObj ||
      'Title' in relObj ||
      '__component' in relObj ||
      Object.keys(relObj as Record<string, unknown>).some(key => 
        key !== 'id' && (relObj as Record<string, unknown>)[key] !== null
      )
    );
  
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
  }, [refUID, base, relField, relObj, isPopulated]);

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
