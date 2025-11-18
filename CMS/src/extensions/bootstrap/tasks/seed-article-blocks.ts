// Seed Article Blocks

const ARTICLE_BLOCK_UID = 'api::article-block.article-block';

export async function seedArticleBlocks(strapi: any) {
  console.info('[SEED][ARTICLE_BLOCKS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.info('[SEED][ARTICLE_BLOCKS] 📰 Starting Article Blocks seeding...');
  console.info('[SEED][ARTICLE_BLOCKS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Find or create the main Article Block for Home Page
  console.info('[SEED][ARTICLE_BLOCKS] 🔍 Checking for existing article block...');
  let articleBlock = await strapi.db.query(ARTICLE_BLOCK_UID).findOne({
    where: { Title: 'Latest DJ Tips & Guides' },
  });
  
  // Get all published articles
  console.info('[SEED][ARTICLE_BLOCKS] 🔍 Fetching all published articles...');
  const articles = await strapi.db
    .query('api::article.article')
    .findMany({ 
      select: ['id', 'Title'],
      where: { publishedAt: { $notNull: true } }
    });
  const articleIds = articles.map((a: any) => a.id);
  // Strapi expects array of objects: [{ id: 2 }, ...]
  const articleIdObjects = articleIds.map((id: number) => ({ id }));
  console.info(`[SEED][ARTICLE_BLOCKS] ✓ Found ${articleIds.length} published articles`);
  articles.forEach((article: any, index: number) => {
    console.info(`[SEED][ARTICLE_BLOCKS]    ${index + 1}. "${article.Title}" (ID: ${article.id})`);
  });

  if (!articleBlock) {
    console.info('[SEED][ARTICLE_BLOCKS] ➕ Creating new article block...');
    articleBlock = await strapi.entityService.create(ARTICLE_BLOCK_UID, {
      data: {
        Title: 'Latest DJ Tips & Guides',
        publishedAt: new Date().toISOString(),
      },
    });
    console.info(`[SEED][ARTICLE_BLOCKS] ✅ Created Article Block (ID: ${articleBlock.id})`);
    console.info(`[SEED][ARTICLE_BLOCKS] ✅ Title: "${articleBlock.Title}"`);
  } else {
    console.info(`[SEED][ARTICLE_BLOCKS] ✓ Found existing article block (ID: ${articleBlock.id})`);
  }

  // Always update the articles relation to ensure all articles are attached
  console.info('[SEED][ARTICLE_BLOCKS] 🔄 Attaching all published articles to the block...');
  await strapi.entityService.update(ARTICLE_BLOCK_UID, articleBlock.id, {
    data: {
      articles: {
        set: articleIdObjects,
      },
      publishedAt: new Date().toISOString(),
    },
  });

  // Re-query the article block by title for verification
  const verified = await strapi.db.query(ARTICLE_BLOCK_UID).findOne({
    where: { Title: 'Latest DJ Tips & Guides' },
    populate: { articles: { fields: ['id', 'Title'] } },
  });

  console.info(`[SEED][ARTICLE_BLOCKS] ✅ Updated Article Block (ID: ${articleBlock.id})`);
  console.info(`[SEED][ARTICLE_BLOCKS] 🔍 Verifying articles attachment...`);
  if (!verified) {
    console.warn(`[SEED][ARTICLE_BLOCKS] ⚠️  Could not verify updated article block (ID: ${articleBlock.id}) - entity not found after update.`);
    console.info('[SEED][ARTICLE_BLOCKS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return;
  }
  const attachedCount = verified.articles?.length || 0;
  console.info(`[SEED][ARTICLE_BLOCKS] ✅ Articles attached: ${attachedCount}`);
  if (attachedCount > 0) {
    verified.articles.forEach((article: any, index: number) => {
      console.info(`[SEED][ARTICLE_BLOCKS]    ${index + 1}. "${article.Title}" (ID: ${article.id})`);
    });
  }
  if (attachedCount !== articleIds.length) {
    console.warn(`[SEED][ARTICLE_BLOCKS] ⚠️  WARNING: Expected ${articleIds.length} articles but found ${attachedCount}`);
    console.info(`[SEED][ARTICLE_BLOCKS] ⚠️  Expected articles: [${articleIds.join(', ')}]`);
  }
  console.info(`[SEED][ARTICLE_BLOCKS] ✅ Published: ${articleBlock.publishedAt ? 'Yes' : 'No'}`);
  console.info('[SEED][ARTICLE_BLOCKS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
