// src/utils/mapStrapiContentToFrontend.ts
import { strapiAPI } from '../services/strapi-api';

// 1) Pomocnik do wyciągania documentId z różnych kształtów populate
export function getDocId(input: any): string | undefined {
  if (!input) return undefined;

  // Najczęstszy u Ciebie: obiekt relacji zawiera pole documentId
  if (typeof input.documentId === 'string') return input.documentId;

  // Czasem przychodzi jako string (np. connect: ["docId"])
  if (typeof input === 'string') return input;

  // Niektóre klienty spłaszczają id jako string
  if (input?.id && typeof input.id === 'string') return input.id;

  // Wariant Strapi v4/v5 z data/attributes
  if (input?.data?.attributes?.documentId)
    return input.data.attributes.documentId;
  if (typeof input?.data?.id === 'string') return input.data.id;

  return undefined;
}

// 2) Mapowanie nazw pól relacji w ref-komponentach (zgodnie z Twoim payloadem)
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
  'login-block-ref.login-block-ref': 'login_block',
};

// 3) Główna funkcja – rekurencyjnie rozwija refy i zagnieżdżenia
export async function mapStrapiContentToFrontend(block: any): Promise<any> {
  if (Array.isArray(block)) {
    return Promise.all(block.map(mapStrapiContentToFrontend));
  }
  if (!block || typeof block !== 'object') {
    return block;
  }

  // A) Obsługa ref-komponentów (…-ref)
  if (block.__component && block.__component.endsWith('-ref')) {
    const refUID = block.__component as string; // np. "image-slider-ref.image-slider-ref"
    const base = refUID.split('-ref')[0]; // np. "image-slider"
    const relField = FIELD_BY_REF[refUID];

    // Z payloadu Template.Content masz np. { slider: { id: 26, documentId: '...' } }
    const relObj = relField ? block[relField] : undefined;

    const docId = getDocId(relObj);
    // fallback, gdyby documentId nie przyszło – numeryczne id z obiektu relacji lub samego bloku
    const numericId =
      typeof relObj?.id === 'number'
        ? relObj.id
        : typeof block.id === 'number'
          ? block.id
          : undefined;

    let data: any = null;

    // preferuj documentId (stabilny)
    if (docId) {
      switch (base) {
        case 'article-block':
          data = await (strapiAPI as any).getArticleBlockByDocumentId(docId);
          break;
        case 'hero-block':
          data = await (strapiAPI as any).getHeroBlockByDocumentId(docId);
          break;
        case 'image-slider':
          data = await (strapiAPI as any).getImageSliderBlockByDocumentId(
            docId,
          );
          break;
        case 'steps-container':
          data = await (strapiAPI as any).getStepsContainerBlockByDocumentId(
            docId,
          );
          break;
        case 'cta':
          data = await (strapiAPI as any).getCTABlockByDocumentId(docId);
          break;
        case 'feature-section':
          data = await (strapiAPI as any).getFeatureSectionByDocumentId(docId);
          break;
        case 'contact-section':
          data = await (strapiAPI as any).getContactSectionByDocumentId(docId);
          break;
        case 'feature-tab':
          data = await (strapiAPI as any).getFeatureTabBlockByDocumentId(docId);
          break;
        case 'contact-info':
          data = await (strapiAPI as any).getContactInfoBlockByDocumentId(
            docId,
          );
          break;
        case 'login-block':
          data = await (strapiAPI as any).getLoginBlockByDocumentId(docId);
          break;
        default:
          // nieznany typ — oddaj surowy blok
          return block;
      }
    }

    // fallback po numeric id
    if (!data && numericId) {
      switch (base) {
        case 'article-block':
          data = await (strapiAPI as any).getArticleBlockById(numericId);
          break;
        case 'hero-block':
          data = await (strapiAPI as any).getHeroBlockById(numericId);
          break;
        case 'image-slider':
          data = await (strapiAPI as any).getImageSliderBlockById(numericId);
          break;
        case 'steps-container':
          data = await (strapiAPI as any).getStepsContainerBlockById(numericId);
          break;
        case 'cta':
          data = await (strapiAPI as any).getCTABlockById(numericId);
          break;
        case 'feature-section':
          data = await (strapiAPI as any).getFeatureSectionById(numericId);
          break;
        case 'contact-section':
          data = await (strapiAPI as any).getContactSectionById(numericId);
          break;
        case 'feature-tab':
          data = await (strapiAPI as any).getFeatureTabBlockById(numericId);
          break;
        case 'contact-info':
          data = await (strapiAPI as any).getContactInfoBlockById(numericId);
          break;
        default:
          return block;
      }
    }

    // jeżeli nic nie znaleziono — zwróć oryginał (żeby UI mógł pokazać fallback <pre/>)
    if (!data) return block;

    // Doklej __kind, by renderer nie musiał zgadywać
    return { __kind: base, ...data };
  }

  // B) Rekurencyjna obróbka zagnieżdżonych pól (tablice / obiekty z __component)
  const resolved: any = { ...block };
  for (const key of Object.keys(block)) {
    const value = (block as any)[key];
    if (
      Array.isArray(value) ||
      (value && typeof value === 'object' && value.__component)
    ) {
      resolved[key] = await mapStrapiContentToFrontend(value);
    }
  }
  return resolved;
}
