// Seed Article Blocks

const ARTICLE_BLOCK_UID = 'api::article-block.article-block';

export async function seedArticleBlocks(strapi: any) {
  console.info('[SEED][ARTICLE_BLOCKS] Seeding Article Blocks...');

  // Find or create the main Article Block for Home Page
  let articleBlock = await strapi.db.query(ARTICLE_BLOCK_UID).findOne({
    where: { Title: 'Latest DJ Tips & Guides' },
  });
  
  // Get all published articles
  const articles = await strapi.db
    .query('api::article.article')
    .findMany({ 
      select: ['id'],
      where: { publishedAt: { $notNull: true } }
    });
  const articleIds = articles.map((a: any) => a.id);

  if (!articleBlock) {
    articleBlock = await strapi.entityService.create(ARTICLE_BLOCK_UID, {
      data: {
        Title: 'Latest DJ Tips & Guides',
        articles: articleIds,
        publishedAt: new Date().toISOString(),
      },
    });
    console.info(
      `[SEED][ARTICLE_BLOCKS] Created Article Block (ID: ${articleBlock.id}) with ${articleIds.length} articles`,
    );
  } else {
    // Update existing article block with articles
    await strapi.entityService.update(ARTICLE_BLOCK_UID, articleBlock.id, {
      data: { 
        articles: articleIds,
      },
    });
    console.info(
      `[SEED][ARTICLE_BLOCKS] Updated Article Block (ID: ${articleBlock.id}) with ${articleIds.length} articles: [${articleIds.join(', ')}]`,
    );
  }
}
