// Seeds the parent Articles page for all articles

import { getOrCreateConfiguration } from './seed-configuration';
import { toUrlSlug } from './utils/slugify';

const PAGE_UID = 'api::page.page';

export async function seedArticlesParentPage(strapi: any, configId: number) {
  strapi.log.info('[SEED][ARTICLES_PARENT] Seeding parent Articles page...');

  // Check if the parent Articles page already exists
  const articlesSlug = toUrlSlug('articles');
  const existing = await strapi.db
    .query(PAGE_UID)
    .findOne({ where: { Slug: articlesSlug } });
  if (existing) {
    strapi.log.info(
      '[SEED][ARTICLES_PARENT] Parent Articles page already exists. Skipping.',
    );
    return existing.id;
  }

  // Create the parent Articles page
  const page = await strapi.entityService.create(PAGE_UID, {
    data: {
      Title: 'Articles',
      Slug: articlesSlug,
      configuration: configId,
      publishedAt: new Date().toISOString(),
    },
  });

  strapi.log.info(
    `[SEED][ARTICLES_PARENT] Created parent Articles page (ID: ${page.id})`,
  );
  return page.id;
}
