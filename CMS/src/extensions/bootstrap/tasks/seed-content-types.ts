// Orchestrator for seeding all content types

import { seedHeroBlocks } from './seed-hero-blocks';
import { seedFeatureSections } from './seed-feature-sections';
import { seedArticleBlocks } from './seed-article-blocks';
import { seedStepsContainers } from './seed-steps-containers';
import { seedContactInfo } from './seed-contact-info';
import { seedContactSections } from './seed-contact-sections';
import seedImageSliders from './seed-image-sliders';

export default async function seedContentTypes({ strapi }: { strapi: any }) {
  strapi.log.info('[SEED][CONTENT_TYPES] Starting content types seeding...');

  try {
    // Always run all seeders; each handles its own existence check
    await seedHeroBlocks(strapi);
    await seedFeatureSections(strapi);
    await seedArticleBlocks(strapi);
    await seedStepsContainers(strapi);

    // Seed Contact Info and Contact Sections (Contact Info needed first)
    const contactInfoIds = await seedContactInfo(strapi);
    await seedContactSections(strapi, contactInfoIds);

    // Seed Image Sliders (after hero blocks are created)
    await seedImageSliders({ strapi });

    strapi.log.info('[SEED][CONTENT_TYPES] Content types seeding complete!');
  } catch (error: any) {
    strapi.log.error(
      `[SEED][CONTENT_TYPES] Failed to seed content types: ${error.message}`,
    );
    throw error;
  }
}
