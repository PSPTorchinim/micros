/**
 * Centralized Block Registry
 * 
 * This file contains the single source of truth for all Strapi content block types.
 * When adding new block types from Strapi, developers should:
 * 1. Create the molecule/component for visualization
 * 2. Add the block configuration here
 * 3. That's it! No changes needed to renderBlock, transformStrapiBlocks, or other infrastructure files.
 */

import type { ComponentType } from 'react';
import type { ContentBlock } from './content-blocks';

/**
 * Configuration for a single block type
 */
export interface BlockTypeConfig {
  /** The __kind identifier used in content blocks (e.g., 'hero-block') */
  kind: string;
  
  /** The __component identifier from Strapi for ref components (e.g., 'hero-block-ref.hero-block-ref') */
  refComponent: string;
  
  /** The relational field name in the ref component that contains the populated data (e.g., 'hero_block') */
  refField: string;
  
  /** The legacy __component identifier from Strapi for direct components (e.g., 'hero.hero-block') */
  legacyComponent?: string;
  
  /** The Strapi collection/single type name (e.g., 'hero-block', 'login-block') */
  strapiType: string;
  
  /** Whether this is a singleton type in Strapi (like login-block, forgot-password-block) */
  isSingleton?: boolean;
  
  /** The React component to render this block */
  component?: ComponentType<any>;
}

/**
 * Registry of all block types
 * Add new block types here when they are added to Strapi
 */
export const BLOCK_REGISTRY: BlockTypeConfig[] = [
  {
    kind: 'hero-block',
    refComponent: 'hero-block-ref.hero-block-ref',
    refField: 'hero_block',
    legacyComponent: 'hero.hero-block',
    strapiType: 'hero-block',
  },
  {
    kind: 'image-slider',
    refComponent: 'image-slider-ref.image-slider-ref',
    refField: 'slider',
    legacyComponent: 'image-sliders.image-slider',
    strapiType: 'image-slider',
  },
  {
    kind: 'article-block',
    refComponent: 'article-block-ref.article-block-ref',
    refField: 'block',
    legacyComponent: 'articles.article-block',
    strapiType: 'article-block',
  },
  {
    kind: 'steps-container',
    refComponent: 'steps-container-ref.steps-container-ref',
    refField: 'container',
    legacyComponent: 'steps-containers.steps-container',
    strapiType: 'steps-container',
  },
  {
    kind: 'cta',
    refComponent: 'cta-ref.cta-ref',
    refField: 'cta',
    legacyComponent: 'ctas.cta',
    strapiType: 'cta',
  },
  {
    kind: 'feature-section',
    refComponent: 'feature-section-ref.feature-section-ref',
    refField: 'feature_section',
    legacyComponent: 'feature-sections.feature-section',
    strapiType: 'feature-section',
  },
  {
    kind: 'contact-section',
    refComponent: 'contact-section-ref.contact-section-ref',
    refField: 'contact_section',
    legacyComponent: 'contact-sections.contact-section',
    strapiType: 'contact-section',
  },
  {
    kind: 'feature-tab',
    refComponent: 'feature-tab-ref.feature-tab-ref',
    refField: 'feature_tab',
    legacyComponent: 'feature-tabs.feature-tab',
    strapiType: 'feature-tab',
  },
  {
    kind: 'contact-info',
    refComponent: 'contact-info-ref.contact-info-ref',
    refField: 'contact_info',
    legacyComponent: 'contact-infos.contact-info',
    strapiType: 'contact-info',
  },
  {
    kind: 'login-block',
    refComponent: 'login-block-ref.login-block-ref',
    refField: 'login_block',
    strapiType: 'login-block',
    isSingleton: true,
  },
  {
    kind: 'forgot-password-block',
    refComponent: 'forgot-password-block-ref.forgot-password-block-ref',
    refField: 'forgot_password_block',
    strapiType: 'forgot-password-block',
    isSingleton: true,
  },
  {
    kind: 'change-password-block',
    refComponent: 'change-password-block-ref.change-password-block-ref',
    refField: 'change_password_block',
    strapiType: 'change-password-block',
    isSingleton: true,
  },
  {
    kind: 'profile-block',
    refComponent: 'profile-block-ref.profile-block-ref',
    refField: 'profile_block',
    strapiType: 'profile-block',
    isSingleton: true,
  },
  {
    kind: 'article',
    refComponent: 'article-ref.article-ref',
    refField: 'article',
    strapiType: 'article',
  },
];

/**
 * Utility functions for working with the block registry
 */

/** Get block config by kind */
export function getBlockConfigByKind(kind: string): BlockTypeConfig | undefined {
  return BLOCK_REGISTRY.find((config) => config.kind === kind);
}

/** Get block config by ref component */
export function getBlockConfigByRefComponent(refComponent: string): BlockTypeConfig | undefined {
  return BLOCK_REGISTRY.find((config) => config.refComponent === refComponent);
}

/** Get block config by legacy component */
export function getBlockConfigByLegacyComponent(component: string): BlockTypeConfig | undefined {
  return BLOCK_REGISTRY.find((config) => config.legacyComponent === component);
}

/** Get all ref components mapped to their ref fields */
export function getRefFieldMapping(): Record<string, string> {
  const mapping: Record<string, string> = {};
  BLOCK_REGISTRY.forEach((config) => {
    mapping[config.refComponent] = config.refField;
  });
  return mapping;
}

/** Get all kinds mapped to their legacy components */
export function getLegacyComponentMapping(): Record<string, string> {
  const mapping: Record<string, string> = {};
  BLOCK_REGISTRY.forEach((config) => {
    if (config.legacyComponent) {
      mapping[config.legacyComponent] = config.kind;
    }
  });
  return mapping;
}

/** Get populate configuration for Template.Content */
export function getTemplateContentPopulateConfig(): Record<string, any> {
  const config: Record<string, any> = {
    Content: {
      on: {} as Record<string, any>,
    },
    page: {
      fields: [
        'documentId',
        'Title',
        'Slug',
        'Menu',
        'AuthState',
        'NavigationOrder',
        'NavigationAction',
      ],
    },
  };

  // Build populate config from registry
  BLOCK_REGISTRY.forEach((blockConfig) => {
    if (!blockConfig.isSingleton) {
      config.Content.on[blockConfig.refComponent] = {
        populate: { [blockConfig.refField]: { populate: '*' } },
      };
    }
  });

  return config;
}

/**
 * Type guard to check if a value is a valid block kind
 */
export function isValidBlockKind(kind: unknown): kind is string {
  return typeof kind === 'string' && BLOCK_REGISTRY.some((config) => config.kind === kind);
}
