/**
 * Generic type definitions for content blocks from Strapi
 *
 * This file provides a flexible type system that works with any Strapi content type
 * without requiring manual updates when new block types are added.
 *
 * To add a new content type from Strapi:
 * 1. Create the corresponding molecule component (e.g., NewBlockType.tsx)
 * 2. Add a case in renderBlock.tsx to handle the new __kind value
 * 3. Optionally add mapping in RefBlockRenderer.tsx if using reference components
 *
 * No changes needed to this file!
 */

import type {
  Template,
  TemplateTemplateTypeEnum,
} from '../models/api/strapi/apiMap';

/**
 * Generic content block that can represent any Strapi content type
 *
 * The __kind property identifies the block type (e.g., 'hero-block', 'article-block')
 * The __component property is the Strapi component identifier (e.g., 'hero.hero-block')
 *
 * The index signature allows any additional properties from Strapi to pass through.
 * For type safety, components should define their own specific prop interfaces.
 *
 * @example
 * // In component files, define specific prop interfaces:
 * interface HeroBlockProps {
 *   title?: string;
 *   subtitle?: string;
 *   [key: string]: unknown;  // Maintain flexibility
 * }
 */
export interface ContentBlock {
  __kind: string;
  __component?: string;
  [key: string]: unknown;
}

/**
 * Reference components that need to be resolved
 */
export interface RefComponent {
  __component: string;
  id?: number;
  documentId?: string;
  [key: string]: unknown;
}

/**
 * Template entity with proper typing
 */
export interface TemplateEntity extends Partial<Template> {
  id?: number;
  documentId?: string;
  attributes?: {
    TemplateType?: TemplateTemplateTypeEnum | undefined;
    Content?: (ContentBlock | RefComponent)[];
    Name?: string;
    [key: string]: unknown;
  };
  TemplateType?: TemplateTemplateTypeEnum | undefined;
  Content?: (ContentBlock | RefComponent)[];
  Name?: string;
}

/**
 * Type guard to check if a block is a reference component
 */
export function isRefComponent(block: unknown): block is RefComponent {
  return (
    typeof block === 'object' &&
    block !== null &&
    '__component' in block &&
    typeof (block as RefComponent).__component === 'string' &&
    (block as RefComponent).__component.endsWith('-ref')
  );
}

/**
 * Type guard to check if a block is a content block
 */
export function isContentBlock(block: unknown): block is ContentBlock {
  return (
    typeof block === 'object' &&
    block !== null &&
    '__kind' in block &&
    typeof (block as ContentBlock).__kind === 'string'
  );
}
