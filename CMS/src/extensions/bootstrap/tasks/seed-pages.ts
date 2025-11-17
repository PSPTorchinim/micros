// Orchestrator for seeding standard pages

import { getOrCreateConfiguration } from './seed-configuration';
import { seedLoginPage } from './seed-login-page';
import { seedForgotPasswordPage } from './seed-forgot-password-page';
import { seedHomePage } from './seed-home-page';
import { seedAboutPage } from './seed-about-page';
import { seedFooter } from './seed-footer';
import { seedUsersPage } from './seed-users-page';

export default async function seedStandardPages({ strapi }: { strapi: any }) {
  strapi.log.info('[SEED][STANDARD_PAGES] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  strapi.log.info('[SEED][STANDARD_PAGES] 📄 Starting standard pages seeding');
  strapi.log.info('[SEED][STANDARD_PAGES] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Always get or create configuration
    strapi.log.info('[SEED][STANDARD_PAGES] 🔧 Getting/creating configuration...');
    const configId = await getOrCreateConfiguration(strapi);
    strapi.log.info(`[SEED][STANDARD_PAGES] ✅ Configuration ID: ${configId}`);

    // Seed footer (site-wide content)
    strapi.log.info('[SEED][STANDARD_PAGES] 🦶 Seeding footer...');
    await seedFooter(strapi, configId);

    // Seed Users parent page first
    strapi.log.info('[SEED][STANDARD_PAGES] 👥 Seeding Users parent page...');
    const usersPageId = await seedUsersPage(strapi, configId);

    // Always run all page seeders; each handles its own existence check
    strapi.log.info('[SEED][STANDARD_PAGES] 🔐 Seeding Login page...');
    await seedLoginPage(strapi, configId, usersPageId);
    
    strapi.log.info('[SEED][STANDARD_PAGES] 🔑 Seeding Forgot Password page...');
    await seedForgotPasswordPage(strapi, configId, usersPageId);
    
    strapi.log.info('[SEED][STANDARD_PAGES] 🏠 Seeding Home page...');
    await seedHomePage(strapi, configId);
    
    strapi.log.info('[SEED][STANDARD_PAGES] ℹ️  Seeding About page...');
    await seedAboutPage(strapi, configId);

    strapi.log.info('[SEED][STANDARD_PAGES] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    strapi.log.info('[SEED][STANDARD_PAGES] ✅ Standard pages seeding complete!');
    strapi.log.info('[SEED][STANDARD_PAGES] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error: any) {
    strapi.log.error('[SEED][STANDARD_PAGES] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    strapi.log.error(
      `[SEED][STANDARD_PAGES] ❌ Failed to seed standard pages: ${error.message}`,
    );
    strapi.log.error(`[SEED][STANDARD_PAGES] Stack trace: ${error.stack}`);
    strapi.log.error('[SEED][STANDARD_PAGES] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    throw error;
  }
}
