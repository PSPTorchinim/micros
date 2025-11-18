// Manual reseed script for content blocks
// Run this to update existing content blocks and templates

import { seedHeroBlocks } from './seed-hero-blocks';
import { seedFeatureSections } from './seed-feature-sections';
import { seedArticleBlocks } from './seed-article-blocks';
import { seedStepsContainers } from './seed-steps-containers';
import { seedContactInfo } from './seed-contact-info';
import { seedContactSections } from './seed-contact-sections';
import seedImageSliders from './seed-image-sliders';
import { getOrCreateConfiguration } from './seed-configuration';
import { seedHomePage } from './seed-home-page';
import { seedAboutPage } from './seed-about-page';
import { seedFooter } from './seed-footer';
import { seedLoginPage } from './seed-login-page';
import { seedForgotPasswordPage } from './seed-forgot-password-page';
import { seedUsersPage } from './seed-users-page';
import seedArticles from './seed-articles';

export default async function reseedContentBlocks({ strapi }: { strapi: any }) {
  strapi.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  strapi.log.info('[RESEED] 🔄 Starting manual content blocks reseed...');
  strapi.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Step 1: Update all content blocks
    strapi.log.info('[RESEED] 📦 Step 1/5: Updating content blocks...');
    await seedHeroBlocks(strapi);
    await seedFeatureSections(strapi);
    await seedArticleBlocks(strapi);
    await seedStepsContainers(strapi);
    
    // Seed Contact Info and Contact Sections
    const contactInfoIds = await seedContactInfo(strapi);
    await seedContactSections(strapi, contactInfoIds);
    
    // Seed Image Sliders
    await seedImageSliders({ strapi });
    
    strapi.log.info('[RESEED] ✅ Content blocks updated');

    // Step 2: Get configuration and seed footer
    strapi.log.info('');
    strapi.log.info('[RESEED] 🔧 Step 2/5: Getting configuration and seeding footer...');
    const configId = await getOrCreateConfiguration(strapi);
    await seedFooter(strapi, configId);
    strapi.log.info(`[RESEED] ✅ Configuration ID: ${configId}`);

    // Step 3: Seed articles
    strapi.log.info('');
    strapi.log.info('[RESEED] 📝 Step 3/5: Seeding articles...');
    await seedArticles({ strapi });
    strapi.log.info('[RESEED] ✅ Articles seeded');

    // Step 4: Seed Users parent page
    strapi.log.info('');
    strapi.log.info('[RESEED] 👥 Step 4/5: Seeding Users parent page...');
    const usersPageId = await seedUsersPage(strapi, configId);
    strapi.log.info(`[RESEED] ✅ Users page ID: ${usersPageId}`);

    // Step 5: Update page templates
    strapi.log.info('');
    strapi.log.info('[RESEED] 📄 Step 5/5: Updating page templates...');
    await seedLoginPage(strapi, configId, usersPageId);
    await seedForgotPasswordPage(strapi, configId, usersPageId);
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
