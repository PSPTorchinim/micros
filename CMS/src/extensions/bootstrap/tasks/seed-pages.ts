// Orchestrator for seeding standard pages

import { getOrCreateConfiguration } from './seed-configuration';
import { seedLoginPage } from './seed-login-page';
import { seedForgotPasswordPage } from './seed-forgot-password-page';
import { seedHomePage } from './seed-home-page';
import { seedAboutPage } from './seed-about-page';
import { seedFooter } from './seed-footer';
import { seedUsersPage } from './seed-users-page';

export default async function seedStandardPages({ strapi }: { strapi: any }) {
  console.info('[SEED][STANDARD_PAGES] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.info('[SEED][STANDARD_PAGES] 📄 Starting standard pages seeding');
  console.info('[SEED][STANDARD_PAGES] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Always get or create configuration
    console.info('[SEED][STANDARD_PAGES] 🔧 Getting/creating configuration...');
    const configId = await getOrCreateConfiguration(strapi);
    console.info(`[SEED][STANDARD_PAGES] ✅ Configuration ID: ${configId}`);

    // Seed footer (site-wide content)
    console.info('[SEED][STANDARD_PAGES] 🦶 Seeding footer...');
    await seedFooter(strapi, configId);

    // Seed Users parent page first
    console.info('[SEED][STANDARD_PAGES] 👥 Seeding Users parent page...');
    const usersPageId = await seedUsersPage(strapi, configId);

    if (!usersPageId || typeof usersPageId !== 'number') {
      console.error('[SEED][STANDARD_PAGES] ❌ Users Page ID is invalid. Skipping dependent pages (Login, Forgot Password).');
    } else {
      // Only run dependent page seeders if usersPageId is valid
      console.info('[SEED][STANDARD_PAGES] 🔐 Seeding Login page...');
      await seedLoginPage(strapi, configId, usersPageId);

      console.info('[SEED][STANDARD_PAGES] 🔑 Seeding Forgot Password page...');
      await seedForgotPasswordPage(strapi, configId, usersPageId);
    }

    console.info('[SEED][STANDARD_PAGES] 🏠 Seeding Home page...');
    await seedHomePage(strapi, configId);

    console.info('[SEED][STANDARD_PAGES] ℹ️  Seeding About page...');
    await seedAboutPage(strapi, configId);

    console.info('[SEED][STANDARD_PAGES] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.info('[SEED][STANDARD_PAGES] ✅ Standard pages seeding complete!');
    console.info('[SEED][STANDARD_PAGES] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error: any) {
    console.error('[SEED][STANDARD_PAGES] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`[SEED][STANDARD_PAGES] ❌ Failed to seed standard pages: ${error.message}`);
    console.error(`[SEED][STANDARD_PAGES] Stack trace: ${error.stack}`);
    console.error('[SEED][STANDARD_PAGES] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    throw error;
  }
}
