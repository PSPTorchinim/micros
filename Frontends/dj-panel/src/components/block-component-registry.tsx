/**
 * Block Component Registry
 * 
 * This file maps block kinds to their React components.
 * Import and register new block components here when adding new Strapi types.
 */

import React from 'react';
import type { ComponentType } from 'react';
import type { ContentBlock } from '../types/content-blocks';
import {
  HeroBlock,
  ImageSliderBlock,
  StepsContainerBlock,
  ArticleBlock,
  CTABlock,
  FeatureBlock,
  ContactBlock,
  FeatureTabBlock,
  ContactInfoBlock,
  LoginBlock,
  ForgotPasswordBlock,
  ChangePasswordBlock,
  ProfileBlock,
} from './molecules';

/**
 * Registry mapping block kinds to their React components
 */
const COMPONENT_REGISTRY: Record<string, ComponentType<any>> = {
  'hero-block': HeroBlock,
  'image-slider': ImageSliderBlock,
  'article-block': ArticleBlock,
  'steps-container': StepsContainerBlock,
  'cta': CTABlock,
  'feature-section': FeatureBlock,
  'contact-section': ContactBlock,
  'feature-tab': FeatureTabBlock,
  'contact-info': ContactInfoBlock,
  'login-block': LoginBlock,
  'forgot-password-block': ForgotPasswordBlock,
  'change-password-block': ChangePasswordBlock,
  'profile-block': ProfileBlock,
};

/**
 * Get the React component for a given block kind
 */
export function getBlockComponent(kind: string): ComponentType<any> | undefined {
  return COMPONENT_REGISTRY[kind];
}

/**
 * Register a new block component
 * Useful for extending the registry at runtime
 */
export function registerBlockComponent(kind: string, component: ComponentType<any>): void {
  COMPONENT_REGISTRY[kind] = component;
}

/**
 * Check if a block kind has a registered component
 */
export function hasBlockComponent(kind: string): boolean {
  return kind in COMPONENT_REGISTRY;
}

/**
 * Get all registered block kinds
 */
export function getRegisteredBlockKinds(): string[] {
  return Object.keys(COMPONENT_REGISTRY);
}
