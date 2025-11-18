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
        publishedAt: new Date().toISOString(),
      },
    });
    // Attach articles to this block (one-to-many relation)
    for (const articleId of articleIds) {
      await strapi.entityService.update('api::article.article', articleId, {
        data: { article_block: articleBlock.id }
      });
    }
    console.info(
      `[SEED][ARTICLE_BLOCKS] Created Article Block (ID: ${articleBlock.id}) and attached ${articleIds.length} articles`,
    );
  } else {
    // Only update if the articles have changed
    const currentArticleIds = (articleBlock.articles || []).map((a: any) => a.id).sort();
    const newArticleIds = [...articleIds].sort();
    const isDifferent = currentArticleIds.length !== newArticleIds.length || currentArticleIds.some((id: any, i: number) => id !== newArticleIds[i]);
    if (isDifferent) {
      // Detach all current articles
      for (const articleId of currentArticleIds) {
        await strapi.entityService.update('api::article.article', articleId, {
          data: { article_block: null }
        });
      }
      // Attach new articles
      for (const articleId of newArticleIds) {
        await strapi.entityService.update('api::article.article', articleId, {
          data: { article_block: articleBlock.id }
        });
      }
      console.info(
        `[SEED][ARTICLE_BLOCKS] Updated Article Block (ID: ${articleBlock.id}) and attached ${articleIds.length} articles: [${articleIds.join(', ')}]`,
      );
    } else {
      console.info(
        `[SEED][ARTICLE_BLOCKS] No update needed for Article Block (ID: ${articleBlock.id}), articles unchanged.`
      );
    }
  }
}
