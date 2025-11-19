/**
 * Orchestrator for seeding all content types
 * Manages dependencies and execution order
 */

import { SeederLogger } from './utils/seeder-helpers';

type StrapiInstance = any;

export default async function seedContentTypes({ strapi }: { strapi: StrapiInstance }) {
  const logger = new SeederLogger('ContentTypes');
  
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info('Starting Content Types Seeding');
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Phase 1: Seed simple types (no dependencies)
    logger.info('');
    logger.info('Phase 1: Seeding base content types (no dependencies)');
    logger.info('─────────────────────────────────────────────');
    
    // Import and run CTAs
    const seedCTAs = (await import('./seed-ctas')).default;
    await seedCTAs({ strapi });

    // Import and run Feature Tabs
    const seedFeatureTabs = (await import('./seed-feature-tabs')).default;
    await seedFeatureTabs({ strapi });

    // Import and run Contact Info
    const seedContactInfo = (await import('./seed-contact-info')).default;
    await seedContactInfo({ strapi });

    // Import and run Article Blocks
    const seedArticleBlocks = (await import('./seed-article-blocks')).default;
    await seedArticleBlocks({ strapi });

    // Phase 2: Seed types with dependencies
    logger.info('');
    logger.info('Phase 2: Seeding content types with dependencies');
    logger.info('─────────────────────────────────────────────');

    // Import and run Hero Blocks (depends on CTAs)
    const seedHeroBlocks = (await import('./seed-hero-blocks')).default;
    await seedHeroBlocks({ strapi });

    // Import and run Feature Sections (depends on Feature Tabs)
    const seedFeatureSections = (await import('./seed-feature-sections')).default;
    await seedFeatureSections({ strapi });

    // Import and run Contact Sections (depends on Contact Info)
    const seedContactSections = (await import('./seed-contact-sections')).default;
    await seedContactSections({ strapi });

    // Import and run Steps Containers (depends on CTAs)
    const seedStepsContainers = (await import('./seed-steps-containers')).default;
    await seedStepsContainers({ strapi });

    // Phase 3: Seed single types
    logger.info('');
    logger.info('Phase 3: Seeding single-type content');
    logger.info('─────────────────────────────────────────────');

    // Import and run Login Block
    const seedLoginBlock = (await import('./seed-login-block')).default;
    await seedLoginBlock({ strapi });

    // Import and run Forgot Password Block
    const seedForgotPasswordBlock = (await import('./seed-forgot-password-block')).default;
    await seedForgotPasswordBlock({ strapi });

    // Import and run Footer
    const seedFooter = (await import('./seed-footer')).default;
    await seedFooter({ strapi });

    logger.info('');
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.success('All content types seeded successfully');
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    logger.error('Content types seeding failed', error);
    throw error;
  }
}
