// Seed Article Blocks

const ARTICLE_BLOCK_UID = 'api::article-block.article-block';

export async function seedArticleBlocks(strapi: any) {
  strapi.log.info('[SEED][ARTICLE_BLOCKS] Seeding Article Blocks...');

  // Find or create the main Article Block for Home Page
  let articleBlock = await strapi.db.query(ARTICLE_BLOCK_UID).findOne({
    where: { Title: 'Latest DJ Tips & Guides' },
  });
  if (!articleBlock) {
    articleBlock = await strapi.entityService.create(ARTICLE_BLOCK_UID, {
      data: {
        Title: 'Latest DJ Tips & Guides',
        items: [],
        publishedAt: new Date().toISOString(),
      },
    });
    strapi.log.info(
      `[SEED][ARTICLE_BLOCKS] Created Article Block (ID: ${articleBlock.id})`,
    );
  } else {
    strapi.log.debug(
      `[SEED][ARTICLE_BLOCKS] Article Block already exists (ID: ${articleBlock.id})`,
    );
  }

  // Update the article block to include all articles
  const articles = await strapi.db
    .query('api::article.article')
    .findMany({ select: ['id'] });
  const articleIds = articles.map((a: any) => a.id);
  await strapi.entityService.update(ARTICLE_BLOCK_UID, articleBlock.id, {
    data: { items: articleIds },
  });
  strapi.log.info(
    `[SEED][ARTICLE_BLOCKS] Updated Article Block (ID: ${articleBlock.id}) with articles: [${articleIds.join(', ')}]`,
  );
}
