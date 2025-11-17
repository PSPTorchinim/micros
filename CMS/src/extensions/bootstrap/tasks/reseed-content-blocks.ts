// Manual reseed script for content blocks
// Run this to update existing content blocks and templates

import { seedHeroBlocks } from './seed-hero-blocks';
import { seedFeatureSections } from './seed-feature-sections';
import { seedArticleBlocks } from './seed-article-blocks';
import { seedStepsContainers } from './seed-steps-containers';
import { getOrCreateConfiguration } from './seed-configuration';
import { seedHomePage } from './seed-home-page';
import { seedAboutPage } from './seed-about-page';

export default async function reseedContentBlocks({ strapi }: { strapi: any }) {
  strapi.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  strapi.log.info('[RESEED] 🔄 Starting manual content blocks reseed...');
  strapi.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Step 1: Update all content blocks
    strapi.log.info('[RESEED] 📦 Step 1/3: Updating content blocks...');
    await seedHeroBlocks(strapi);
    await seedFeatureSections(strapi);
    await seedArticleBlocks(strapi);
    await seedStepsContainers(strapi);
    strapi.log.info('[RESEED] ✅ Content blocks updated');

    // Step 2: Get configuration
    strapi.log.info('');
    strapi.log.info('[RESEED] 🔧 Step 2/3: Getting configuration...');
    const configId = await getOrCreateConfiguration(strapi);
    strapi.log.info(`[RESEED] ✅ Configuration ID: ${configId}`);

    // Step 3: Update page templates
    strapi.log.info('');
    strapi.log.info('[RESEED] 📄 Step 3/3: Updating page templates...');
    await seedHomePage(strapi, configId);
    await seedAboutPage(strapi, configId);
    strapi.log.info('[RESEED] ✅ Page templates updated');

    strapi.log.info('');
    strapi.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    strapi.log.info('[RESEED] ✅ Manual reseed completed successfully!');
    strapi.log.info('[RESEED] 💡 Refresh your frontend to see the changes');
    strapi.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error: any) {
    strapi.log.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    strapi.log.error(`[RESEED] ❌ Failed to reseed: ${error.message}`);
    strapi.log.error(`[RESEED] Stack trace: ${error.stack}`);
    strapi.log.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    throw error;
  }
}
