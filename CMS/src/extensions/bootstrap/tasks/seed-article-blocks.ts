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
  console.info(`[SEED][ARTICLE_BLOCKS] ✓ Found ${articleIds.length} published articles`);
  articles.forEach((article: any, index: number) => {
    console.info(`[SEED][ARTICLE_BLOCKS]    ${index + 1}. "${article.Title}" (ID: ${article.id})`);
  });

  if (!articleBlock) {
    console.info('[SEED][ARTICLE_BLOCKS] ➕ Creating new article block...');
    articleBlock = await strapi.entityService.create(ARTICLE_BLOCK_UID, {
      data: {
        Title: 'Latest DJ Tips & Guides',
        articles: {
          connect: articleIds,
        },
        publishedAt: new Date().toISOString(),
      },
    });
    
    console.info(`[SEED][ARTICLE_BLOCKS] ✅ Created Article Block (ID: ${articleBlock.id})`);
    console.info(`[SEED][ARTICLE_BLOCKS] ✅ Title: "${articleBlock.Title}"`);
    
    // Verify creation
    const verified = await strapi.entityService.findOne(ARTICLE_BLOCK_UID, articleBlock.id, {
      populate: { articles: { fields: ['id', 'Title'] } },
    });
    
    console.info(`[SEED][ARTICLE_BLOCKS] 🔍 Verifying articles attachment...`);
    console.info(`[SEED][ARTICLE_BLOCKS] ✅ Articles attached: ${verified.articles?.length || 0}`);
    if (verified.articles && verified.articles.length > 0) {
      verified.articles.forEach((article: any, index: number) => {
        console.info(`[SEED][ARTICLE_BLOCKS]    ${index + 1}. "${article.Title}" (ID: ${article.id})`);
      });
    } else {
      console.info(`[SEED][ARTICLE_BLOCKS] ⚠️  Expected ${articleIds.length} articles: [${articleIds.join(', ')}]`);
    }
    console.info(`[SEED][ARTICLE_BLOCKS] ✅ Published: ${articleBlock.publishedAt ? 'Yes' : 'No'}`);
  } else {
    console.info(`[SEED][ARTICLE_BLOCKS] ✓ Found existing article block (ID: ${articleBlock.id})`);
    console.info('[SEED][ARTICLE_BLOCKS] 🔄 Updating with articles...');
    
    // Update existing article block with articles
    await strapi.entityService.update(ARTICLE_BLOCK_UID, articleBlock.id, {
      data: { 
        articles: {
          set: articleIds,
        },
        publishedAt: new Date().toISOString(),
      },
    });
    
    // Verify update
    const verified = await strapi.entityService.findOne(ARTICLE_BLOCK_UID, articleBlock.id, {
      populate: { articles: { fields: ['id', 'Title'] } },
    });
    
    console.info(`[SEED][ARTICLE_BLOCKS] ✅ Updated Article Block (ID: ${articleBlock.id})`);
    console.info(`[SEED][ARTICLE_BLOCKS] 🔍 Verifying articles attachment...`);
    console.info(`[SEED][ARTICLE_BLOCKS] ✅ Articles attached: ${verified.articles?.length || 0}`);
    if (verified.articles && verified.articles.length > 0) {
      verified.articles.forEach((article: any, index: number) => {
        console.info(`[SEED][ARTICLE_BLOCKS]    ${index + 1}. "${article.Title}" (ID: ${article.id})`);
      });
    }
    if (verified.articles?.length !== articleIds.length) {
      console.warn(`[SEED][ARTICLE_BLOCKS] ⚠️  WARNING: Expected ${articleIds.length} articles but found ${verified.articles?.length}`);
    }
  }
  console.info('[SEED][ARTICLE_BLOCKS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
