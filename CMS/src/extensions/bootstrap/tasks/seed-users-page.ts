// Seed Users parent page
import { toUrlSlug } from './utils/slugify';

const PAGE_UID = 'api::page.page';
const TEMPLATE_UID = 'api::template.template';

export async function seedUsersPage(strapi: any, configId: number) {
  strapi.log.info('[SEED][USERS] Seeding Users parent page...');

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
    strapi.log.info(
      `[SEED][USERS] Created Users Template (ID: ${usersTemplate.id})`,
    );
  } else {
    usersTemplate = existingUsersTemplate;
    strapi.log.debug(
      `[SEED][USERS] Users Template already exists (ID: ${usersTemplate.id})`,
    );
  }

  // Create or update Users Page
  const existingUsersPage = await strapi.db.query(PAGE_UID).findOne({
    where: { Slug: usersSlug },
  });

  let usersPage;
  if (!existingUsersPage) {
    usersPage = await strapi.entityService.create(PAGE_UID, {
      data: {
        Title: 'Users',
        Slug: usersSlug,
        Menu: 'NotVisible', // Users page is not directly visible in navigation
        configuration: configId,
        template: usersTemplate.id,
        publishedAt: new Date().toISOString(),
      },
    });
    strapi.log.info(
      `[SEED][USERS] Created Users Page (ID: ${usersPage.id}, Slug: /${usersSlug})`,
    );
  } else {
    usersPage = await strapi.entityService.update(
      PAGE_UID,
      existingUsersPage.id,
      {
        data: {
          Title: 'Users',
          Menu: 'Main',
          template: usersTemplate.id,
          configuration: configId,
        },
      },
    );
    strapi.log.info(
      `[SEED][USERS] Updated existing Users Page (ID: ${existingUsersPage.id})`,
    );
  }

  return usersPage.id;
}
