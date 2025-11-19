/**
 * Seed Article Blocks
 * No dependencies on other content types (articles are linked separately)
 */

import { SeederLogger, createAndPublish } from './utils/seeder-helpers';

type StrapiInstance = any;

export default async function seedArticleBlocks({ strapi }: { strapi: StrapiInstance }) {
  const logger = new SeederLogger('ArticleBlocks');
  logger.info('Starting Article Block seeding...');

  try {
    // Create article blocks (articles will be linked later)
    const articleBlockData = [
      {
        Title: 'Latest DJ Tips & Guides',
      },
      {
        Title: 'Featured Articles',
      },
      {
        Title: 'Industry News',
      },
    ];

    const articleBlocks = [];
    for (const data of articleBlockData) {
      const block = await createAndPublish(
        strapi,
        'api::article-block.article-block',
        'Title',
        data,
        logger,
        'Article Block'
      );
      articleBlocks.push(block);
    }

    logger.success(`Successfully seeded ${articleBlocks.length} Article Blocks`);
    return articleBlocks;
  } catch (error) {
    logger.error('Failed to seed Article Blocks', error);
    throw error;
  }
}
