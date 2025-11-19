// Seed Users parent page
import { toUrlSlug } from './utils/slugify';

const PAGE_UID = 'api::page.page';
const TEMPLATE_UID = 'api::template.template';

export async function seedUsersPage(strapi: any, configId: number) {
  console.info('[SEED][USERS] Seeding Users parent page...');

  const usersSlug = toUrlSlug('users');

  // Create Users Template
  const existingUsersTemplate = await strapi.db.query(TEMPLATE_UID).findOne({
    where: { name: 'Users Page Template' },
  });

  let usersTemplate;
  if (!existingUsersTemplate) {
    usersTemplate = await strapi.entityService.create(TEMPLATE_UID, {
      data: {
        Name: 'Users Page Template',
        TemplateType: 'Standard',
        Content: [],
        publishedAt: new Date().toISOString(),
      },
    });
    console.info(
      `[SEED][USERS] Created Users Template (ID: ${usersTemplate.id})`,
    );
  } else {
    usersTemplate = existingUsersTemplate;
    console.debug(
      `[SEED][USERS] Users Template already exists (ID: ${usersTemplate.id})`,
    );
  }

  // Create or update Users Page WITHOUT template relation
  const existingUsersPage = await strapi.db.query(PAGE_UID).findOne({
    where: { Slug: usersSlug },
  });

  let usersPage;
  const usersPageData = {
    Title: 'Users',
    Slug: usersSlug,
    Menu: 'NotVisible',
    configuration: configId,
    publishedAt: new Date().toISOString(),
  };

  if (!existingUsersPage) {
    usersPage = await strapi.entityService.create(PAGE_UID, {
      data: usersPageData,
    });
    console.info(
      `[SEED][USERS] Created Users Page (ID: ${usersPage.id}, Slug: /${usersSlug})`,
    );
  } else {
    usersPage = await strapi.entityService.update(
      PAGE_UID,
      existingUsersPage.id,
      {
        data: usersPageData,
      },
    );
    console.info(
      `[SEED][USERS] Updated existing Users Page (ID: ${existingUsersPage.id})`,
    );
  }

  // ============================================================================
  // PHASE 2: Establish relations
  // ============================================================================
  console.info('[SEED][USERS] 🔗 PHASE 2: Establishing relations');

  // Set template relation using entityService
  try {
    await strapi.entityService.update(PAGE_UID, usersPage.id, {
      data: {
        template: usersTemplate.id,
        publishedAt: new Date().toISOString(), // Maintain published status
      },
    });
    console.info(
      `[SEED][USERS] ✓ Connected Page ${usersPage.id} to Template ${usersTemplate.id}`,
    );
  } catch (error: any) {
    console.error('[SEED][USERS] ❌ Failed to set relation:', error.message);
  }

  return usersPage.id;
}
