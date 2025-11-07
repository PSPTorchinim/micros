import React from 'react';
import { strapiAPI } from '../services/strapi-api';
import { renderBlock } from './renderBlock';
import { ContentSkeleton } from './atoms/Skeleton';

/**
 * Renderer komponentu referencyjnego (np. "image-slider-ref.image-slider-ref").
 * Zakłada, że w payloadzie ref-komponentu jest pole relacyjne z documentId:
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
const FIELD_BY_REF: Record<string, string> = {
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

// uniwersalny ekstraktor documentId z różnych kształtów populate
function getDocId(input: any): string | undefined {
  if (!input) return undefined;

  // Najczęstszy przypadek u Ciebie: obiekt z documentId
  if (typeof input.documentId === 'string') return input.documentId;

  // czasem API zwraca stringa (np. connect: ["docId"])
  if (typeof input === 'string') return input;

  // niektóre klienty spłaszczają id jako string
  if (input?.id && typeof input.id === 'string') return input.id;

  // Strapi v4/v5 warianty z data/attributes
  if (input?.data?.attributes?.documentId)
    return input.data.attributes.documentId;
  if (typeof input?.data?.id === 'string') return input.data.id;

  return undefined;
}

export const RefBlockRenderer: React.FC<{ block: any; index: number }> = ({
  block,
  index,
}) => {
  const refUID = block?.__component as string;
  const base = refUID?.split('-ref')[0]; // 'image-slider', 'article-block', ...
  const relField = FIELD_BY_REF[refUID];

  const relObj = relField ? block?.[relField] : undefined;
  const docId = getDocId(relObj);
  const numericId = typeof relObj?.id === 'number' ? relObj.id : undefined;

  const [resolved, setResolved] = React.useState<any>(null);
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

        let data: any = null;

        // 1) Preferuj documentId (stabilny identyfikator)
        if (docId) {
          switch (base) {
            case 'article-block':
              data = await strapiAPI.getArticleBlockByDocumentId(docId);
              break;
            case 'hero-block':
              data = await strapiAPI.getHeroBlockByDocumentId(docId);
              break;
            case 'image-slider':
              data = await strapiAPI.getImageSliderBlockByDocumentId(docId);
              break;
            case 'steps-container':
              data = await strapiAPI.getStepsContainerBlockByDocumentId(docId);
              break;
            case 'cta':
              data = await strapiAPI.getCTABlockByDocumentId(docId);
              break;
            case 'feature-section':
              data = await strapiAPI.getFeatureSectionByDocumentId(docId);
              break;
            case 'contact-section':
              data = await strapiAPI.getContactSectionByDocumentId(docId);
              break;
            case 'feature-tab':
              data = await strapiAPI.getFeatureTabBlockByDocumentId(docId);
              break;
            case 'contact-info':
              data = await strapiAPI.getContactInfoBlockByDocumentId(docId);
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
              data = await strapiAPI.getArticleBlockById(numericId);
              break;
            case 'hero-block':
              data = await strapiAPI.getHeroBlockById(numericId);
              break;
            case 'image-slider':
              data = await strapiAPI.getImageSliderBlockById(numericId);
              break;
            case 'steps-container':
              data = await strapiAPI.getStepsContainerBlockById(numericId);
              break;
            case 'cta':
              data = await strapiAPI.getCTABlockById(numericId);
              break;
            case 'feature-section':
              data = await strapiAPI.getFeatureSectionById(numericId);
              break;
            case 'contact-section':
              data = await strapiAPI.getContactSectionById(numericId);
              break;
            case 'feature-tab':
              data = await strapiAPI.getFeatureTabBlockById(numericId);
              break;
            case 'contact-info':
              data = await strapiAPI.getContactInfoBlockById(numericId);
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
        setResolved({ __kind: base, ...data });
      } catch (e: any) {
        if (!cancel) setError(e?.message || 'Failed to fetch referenced block');
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
