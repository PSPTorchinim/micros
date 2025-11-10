// Orchestrator for seeding standard pages

import { getOrCreateConfiguration } from './seed-configuration';
import { seedLoginPage } from './seed-login-page';
import { seedForgotPasswordPage } from './seed-forgot-password-page';
import { seedHomePage } from './seed-home-page';
import { seedAboutPage } from './seed-about-page';

export default async function seedStandardPages({ strapi }: { strapi: any }) {
  strapi.log.info('[SEED][STANDARD_PAGES] Starting standard pages seeding...');

  try {
    // Always get or create configuration
    const configId = await getOrCreateConfiguration(strapi);

    // Always run all page seeders; each handles its own existence check
    await seedLoginPage(strapi, configId);
    await seedForgotPasswordPage(strapi, configId);
    await seedHomePage(strapi, configId);
    await seedAboutPage(strapi, configId);

    strapi.log.info('[SEED][STANDARD_PAGES] Standard pages seeding complete!');
  } catch (error: any) {
    strapi.log.error(
      `[SEED][STANDARD_PAGES] Failed to seed standard pages: ${error.message}`,
    );
    throw error;
  }
}
