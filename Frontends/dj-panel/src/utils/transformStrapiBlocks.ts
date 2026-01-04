// src/utils/transformStrapiBlocks.ts
import type { ContentBlock, RefComponent } from '../types/content-blocks';

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
