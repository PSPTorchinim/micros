// src/utils/mapStrapiContentToFrontend.ts
import { strapiAPI } from '../services/strapi-api';
import type { ContentBlock, RefComponent } from '../types/content-blocks';

// 1) Pomocnik do wyciągania documentId z różnych kształtów populate
export function getDocId(input: unknown): string | undefined {
  if (typeof input === 'string') return input;
  if (!input || typeof input !== 'object') return undefined;

  const obj = input as Record<string, unknown>;

  // Najczęstszy u Ciebie: obiekt relacji zawiera pole documentId
  if (typeof obj.documentId === 'string') return obj.documentId;

  // Niektóre klienty spłaszczają id jako string
  if (obj.id && typeof obj.id === 'string') return obj.id;

  // Wariant Strapi v4/v5 z data/attributes
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
  'forgot-password-block-ref.forgot-password-block-ref': 'forgot_password_block',
};

// 3) Główna funkcja – rekurencyjnie rozwija refy i zagnieżdżenia
export async function mapStrapiContentToFrontend(
  block: ContentBlock | RefComponent | (ContentBlock | RefComponent)[],
): Promise<ContentBlock | ContentBlock[]> {
  if (Array.isArray(block)) {
    return Promise.all(block.map(mapStrapiContentToFrontend)) as Promise<
      ContentBlock[]
    >;
  }

  if (!block || typeof block !== 'object') {
    return block as ContentBlock;
  }

  // A) Obsługa ref-komponentów (…-ref)
  if (
    '__component' in block &&
    block.__component &&
    block.__component.endsWith('-ref')
  ) {
    const refComponent = block as RefComponent;
    const refUID = refComponent.__component; // np. "image-slider-ref.image-slider-ref"
    const base = refUID.split('-ref')[0]; // np. "image-slider"
    const relField = FIELD_BY_REF[refUID];

    // Z payloadu Template.Content masz np. { slider: { id: 26, documentId: '...' } }
    const relObj = relField ? refComponent[relField] : undefined;

    const docId = getDocId(relObj);
    // fallback, gdyby documentId nie przyszło – numeryczne id z obiektu relacji lub samego bloku
    const numericId =
      typeof (relObj as Record<string, unknown>)?.id === 'number'
        ? ((relObj as Record<string, unknown>).id as number)
        : typeof refComponent.id === 'number'
          ? refComponent.id
          : undefined;

    let data: unknown = null;

    // preferuj documentId (stabilny)
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
        case 'login-block':
          data = await strapiAPI.getLoginBlockByDocumentId(docId);
          break;
        case 'forgot-password-block':
          data = await strapiAPI.getForgotPasswordBlockByDocumentId(docId);
          break;
        default:
          // nieznany typ — oddaj surowy blok
          return block as ContentBlock;
      }
    }

    // fallback po numeric id
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
        case 'login-block':
          data = await strapiAPI.getLoginBlockById(numericId);
          break;
        case 'forgot-password-block':
          data = await strapiAPI.getForgotPasswordBlockById(numericId);
          break;
        default:
          return block as ContentBlock;
      }
    }

    // jeżeli nic nie znaleziono — zwróć oryginał (żeby UI mógł pokazać fallback <pre/>)
    if (!data) return block as ContentBlock;

    // Doklej __kind, by renderer nie musiał zgadywać
    return {
      __kind: base,
      ...(data as Record<string, unknown>),
    } as ContentBlock;
  }

  // B) Rekurencyjna obróbka zagnieżdżonych pól (tablice / obiekty z __component)
  const resolved: Record<string, unknown> = {
    ...(block as Record<string, unknown>),
  };
  for (const key of Object.keys(block)) {
    const value = (block as Record<string, unknown>)[key];
    if (
      Array.isArray(value) ||
      (value &&
        typeof value === 'object' &&
        '__component' in (value as Record<string, unknown>))
    ) {
      resolved[key] = await mapStrapiContentToFrontend(
        value as ContentBlock | RefComponent | (ContentBlock | RefComponent)[],
      );
    }
  }
  return resolved as unknown as ContentBlock;
}
