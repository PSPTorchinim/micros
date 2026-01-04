// src/utils/transformStrapiBlocks.ts
import type { ContentBlock, RefComponent } from '../types/content-blocks';
import { getRefFieldMapping, getBlockConfigByRefComponent } from '../types/block-registry';

/**
 * Transforms Strapi ref components into content blocks by extracting the populated data.
 * This is a synchronous transformation that works with already-populated data from the API.
 *
 * @param block - A content block, ref component, or array of them
 * @returns Transformed content block(s) with __kind property
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

  // Check if this is a ref component
  if (
    '__component' in block &&
    block.__component &&
    block.__component.endsWith('-ref')
  ) {
    const refComponent = block as RefComponent;
    const refUID = refComponent.__component;
    
    // Get block configuration from registry
    const blockConfig = getBlockConfigByRefComponent(refUID);
    
    if (!blockConfig) {
      // Unknown ref type, return as-is
      return block as ContentBlock;
    }

    // Extract the populated data from the relational field
    const populatedData = refComponent[blockConfig.refField];

    if (!populatedData || typeof populatedData !== 'object') {
      // No populated data, return as-is (will be handled by RefBlockRenderer)
      return block as ContentBlock;
    }

    // Transform the populated data into a content block with __kind
    return {
      __kind: blockConfig.kind,
      ...(populatedData as Record<string, unknown>),
    } as ContentBlock;
  }

  // For regular blocks, recursively transform nested fields
  // Track if we found any nested refs to avoid unnecessary object creation
  const resolved: Record<string, unknown> = {
    ...(block as Record<string, unknown>),
  };

  let hasNestedRefs = false;
  for (const key of Object.keys(block)) {
    const value = (block as Record<string, unknown>)[key];
    if (
      Array.isArray(value) ||
      (value &&
        typeof value === 'object' &&
        '__component' in (value as Record<string, unknown>))
    ) {
      hasNestedRefs = true;
      resolved[key] = transformStrapiBlocks(
        value as ContentBlock | RefComponent | (ContentBlock | RefComponent)[],
      );
    }
  }

  // Return original block if no transformations were made to avoid unnecessary object allocation
  return hasNestedRefs
    ? (resolved as unknown as ContentBlock)
    : (block as ContentBlock);
}
