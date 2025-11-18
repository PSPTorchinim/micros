// Seed Home page

const PAGE_UID = 'api::page.page';
const TEMPLATE_UID = 'api::template.template';
const HERO_BLOCK_UID = 'api::hero-block.hero-block';
const FEATURE_SECTION_UID = 'api::feature-section.feature-section';
const STEPS_CONTAINER_UID = 'api::steps-container.steps-container';
const ARTICLE_BLOCK_UID = 'api::article-block.article-block';

export async function seedHomePage(strapi: any, configId: number) {
  console.info('[SEED][HOME] Seeding Home page...');

  // Get existing Hero Block
  const heroBlock = await strapi.db.query(HERO_BLOCK_UID).findOne({
    where: { heading: 'Welcome to DJ Beat Blaster' },
  });

  if (!heroBlock) {
    console.warn(
      '[SEED][HOME] Hero Block not found. Run seed-content-types first.',
    );
    return;
  }
  console.info(`[SEED][HOME] Found Hero Block (ID: ${heroBlock.id})`);

  // Get existing Article Block
  const articleBlock = await strapi.db.query(ARTICLE_BLOCK_UID).findOne({
    where: { Title: 'Latest DJ Tips & Guides' },
  });

  if (!articleBlock) {
    console.warn(
      '[SEED][HOME] Article Block not found. Run seed-content-types first.',
    );
    return;
  }
  console.info(`[SEED][HOME] Found Article Block (ID: ${articleBlock.id})`);

  // Get existing Feature Section
  const featureSection = await strapi.db.query(FEATURE_SECTION_UID).findOne({
    where: { Title: 'Everything You Need to Manage Your DJ Business' },
  });

  if (!featureSection) {
    console.warn(
      '[SEED][HOME] Feature Section not found. Run seed-content-types first.',
    );
    return;
  }
  console.info(`[SEED][HOME] Found Feature Section (ID: ${featureSection.id})`);

  // Get existing Steps Container
  const stepsContainer = await strapi.db.query(STEPS_CONTAINER_UID).findOne({
    where: { heading: 'Get Started in 3 Simple Steps' },
  });

  if (!stepsContainer) {
    console.warn(
      '[SEED][HOME] Steps Container not found. Run seed-content-types first.',
    );
    return;
  }
  console.info(`[SEED][HOME] Found Steps Container (ID: ${stepsContainer.id})`);

  // Create Home Template with all components
  const existingHomeTemplate = await strapi.db.query(TEMPLATE_UID).findOne({
    where: { Name: 'Home Page Template' },
  });

  const templateContent = [
    {
      __component: 'hero-block-ref.hero-block-ref',
      hero_block: heroBlock.id,
    },
    {
      __component: 'feature-section-ref.feature-section-ref',
      feature_section: featureSection.id,
    },
    {
      __component: 'article-block-ref.article-block-ref',
      block: articleBlock.id,
    },
    {
      __component: 'steps-container-ref.steps-container-ref',
      container: stepsContainer.id,
    },
  ];

  console.info('[SEED][HOME] Template Content to be set:');
  console.info(JSON.stringify(templateContent, null, 2));

  let homeTemplate;
  if (!existingHomeTemplate) {
    homeTemplate = await strapi.entityService.create(TEMPLATE_UID, {
      data: {
        Name: 'Home Page Template',
        TemplateType: 'Standard',
        Content: templateContent,
        publishedAt: new Date().toISOString(),
      },
    });
    console.info(
      `[SEED][HOME] Created Home Template (ID: ${homeTemplate.id})`,
    );
  } else {
    // Update existing template to ensure Content is populated
    homeTemplate = await strapi.entityService.update(
      TEMPLATE_UID,
      existingHomeTemplate.id,
      {
        data: {
          Name: 'Home Page Template',
          TemplateType: 'Standard',
          Content: templateContent,
        },
      },
    );
    console.info(
      `[SEED][HOME] Updated Home Template (ID: ${homeTemplate.id}) with Content`,
    );
  }

  // Verify the template was updated correctly - use entityService for better population
  const verifyTemplate = await strapi.entityService.findOne(
    TEMPLATE_UID,
    homeTemplate.id,
    {
      populate: ['Content'],
    },
  );
  console.info(`[SEED][HOME] Verification - Template Content length: ${verifyTemplate?.Content?.length || 0}`);
  if (verifyTemplate?.Content) {
    console.info('[SEED][HOME] Verification - Content components:');
    verifyTemplate.Content.forEach((item: any, index: number) => {
      console.info(`  [${index}] ${item.__component}`);
    });
  }

  // Create or update Home Page
  const existingHomePage = await strapi.db.query(PAGE_UID).findOne({
    where: { Slug: '/' },
  });

  if (!existingHomePage) {
    const homePage = await strapi.entityService.create(PAGE_UID, {
      data: {
        Title: 'Home',
        Slug: '/',
        configuration: configId,
        template: homeTemplate.id,
        publishedAt: new Date().toISOString(),
      },
    });
    console.info(
      `[SEED][HOME] Created Home Page (ID: ${homePage.id}, Slug: /)`,
    );
  } else {
    await strapi.entityService.update(PAGE_UID, existingHomePage.id, {
      data: {
        Title: 'Home',
        template: homeTemplate.id,
        configuration: configId,
      },
    });
    console.info(
      `[SEED][HOME] Updated existing Home Page (ID: ${existingHomePage.id})`,
    );
  }

  // Final verification - check the page has the template
  const verifyPage = await strapi.entityService.findOne(
    PAGE_UID,
    existingHomePage?.id || (await strapi.db.query(PAGE_UID).findOne({ where: { Slug: '/' } })).id,
    {
      populate: ['template'],
    },
  );
  console.info(`[SEED][HOME] Final verification - Page has template: ${!!verifyPage?.template}`);
  if (verifyPage?.template) {
    console.info(`[SEED][HOME] Final verification - Template ID: ${verifyPage.template.id || verifyPage.template}`);
  }
}
