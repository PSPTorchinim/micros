// Orchestrator for seeding standard pages

import { getOrCreateConfiguration } from './seed-configuration';
import { seedLoginPage } from './seed-login-page';
import { seedForgotPasswordPage } from './seed-forgot-password-page';
import { seedHomePage } from './seed-home-page';
import { seedAboutPage } from './seed-about-page';
import { seedFooter } from './seed-footer';
import { seedUsersPage } from './seed-users-page';

export default async function seedStandardPages({ strapi }: { strapi: any }) {
  strapi.log.info('[SEED][STANDARD_PAGES] Starting standard pages seeding...');

  try {
    // Always get or create configuration
    const configId = await getOrCreateConfiguration(strapi);

    // Seed footer (site-wide content)
    await seedFooter(strapi, configId);

    // Seed Users parent page first
    const usersPageId = await seedUsersPage(strapi, configId);

    // Always run all page seeders; each handles its own existence check
    await seedLoginPage(strapi, configId, usersPageId);
    await seedForgotPasswordPage(strapi, configId, usersPageId);
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
