/**
 * Type definitions for content blocks
 * These types align with Strapi content types and extend the generated types
 */

import type {
  Article,
  ArticleBlock,
  HeroBlock,
  FeatureSection,
  FeatureTab,
  ImageSlider,
  StepsContainer,
  Cta,
  ContactSection,
  ContactInfo,
  LoginBlock,
  ForgotPasswordBlock,
  Template,
} from '../models/api/strapi/apiMap';

/**
 * Base content block with kind identifier
 */
export interface BaseContentBlock {
  __kind: string;
  __component?: string;
}

/**
 * Article content block
 */
export interface ArticleContentBlock
  extends BaseContentBlock,
    Partial<Article> {
  __kind: 'article';
}

/**
 * Article block (list of articles)
 */
export interface ArticleBlockContentBlock
  extends BaseContentBlock,
    Partial<ArticleBlock> {
  __kind: 'article-block';
}

/**
 * Hero block
 */
export interface HeroBlockContentBlock
  extends BaseContentBlock,
    Partial<HeroBlock> {
  __kind: 'hero-block';
}

/**
 * Feature section
 */
export interface FeatureSectionContentBlock
  extends BaseContentBlock,
    Partial<FeatureSection> {
  __kind: 'feature-section';
}

/**
 * Feature tab
 */
export interface FeatureTabContentBlock
  extends BaseContentBlock,
    Partial<FeatureTab> {
  __kind: 'feature-tab';
}

/**
 * Image slider
 */
export interface ImageSliderContentBlock
  extends BaseContentBlock,
    Partial<ImageSlider> {
  __kind: 'image-slider';
}

/**
 * Steps container
 */
export interface StepsContainerContentBlock
  extends BaseContentBlock,
    Partial<StepsContainer> {
  __kind: 'steps-container';
}

/**
 * CTA block
 */
export interface CTAContentBlock extends BaseContentBlock, Partial<Cta> {
  __kind: 'cta';
}

/**
 * Contact section
 */
export interface ContactSectionContentBlock
  extends BaseContentBlock,
    Partial<ContactSection> {
  __kind: 'contact-section';
}

/**
 * Contact info
 */
export interface ContactInfoContentBlock
  extends BaseContentBlock,
    Partial<ContactInfo> {
  __kind: 'contact-info';
}

/**
 * Login block
 */
export interface LoginBlockContentBlock
  extends BaseContentBlock,
    Partial<LoginBlock> {
  __kind: 'login-block';
}

/**
 * Forgot password block
 */
export interface ForgotPasswordBlockContentBlock
  extends BaseContentBlock,
    Partial<ForgotPasswordBlock> {
  __kind: 'forgot-password-block';
}

/**
 * Union type of all content blocks
 */
export type ContentBlock =
  | ArticleContentBlock
  | ArticleBlockContentBlock
  | HeroBlockContentBlock
  | FeatureSectionContentBlock
  | FeatureTabContentBlock
  | ImageSliderContentBlock
  | StepsContainerContentBlock
  | CTAContentBlock
  | ContactSectionContentBlock
  | ContactInfoContentBlock
  | LoginBlockContentBlock
  | ForgotPasswordBlockContentBlock;

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
    TemplateType?:
      | 'Standard'
      | 'Login'
      | 'ForgotPassword'
      | 'ChangePassword'
      | 'Profile';
    Content?: (ContentBlock | RefComponent)[];
    Name?: string;
    [key: string]: unknown;
  };
  TemplateType?:
    | 'Standard'
    | 'Login'
    | 'ForgotPassword'
    | 'ChangePassword'
    | 'Profile';
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
