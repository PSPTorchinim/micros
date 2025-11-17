// Seed Home page

const PAGE_UID = 'api::page.page';
const TEMPLATE_UID = 'api::template.template';
const HERO_BLOCK_UID = 'api::hero-block.hero-block';
const FEATURE_SECTION_UID = 'api::feature-section.feature-section';
const STEPS_CONTAINER_UID = 'api::steps-container.steps-container';
const ARTICLE_BLOCK_UID = 'api::article-block.article-block';

export async function seedHomePage(strapi: any, configId: number) {
  strapi.log.info('[SEED][HOME] Seeding Home page...');

  // Get existing Hero Block
  const heroBlock = await strapi.db.query(HERO_BLOCK_UID).findOne({
    where: { heading: 'Welcome to DJ Beat Blaster' },
  });

  if (!heroBlock) {
    strapi.log.warn(
      '[SEED][HOME] Hero Block not found. Run seed-content-types first.',
    );
    return;
  }

  // Get existing Article Block
  const articleBlock = await strapi.db.query(ARTICLE_BLOCK_UID).findOne({
    where: { Title: 'Latest DJ Tips & Guides' },
  });

  if (!articleBlock) {
    strapi.log.warn(
      '[SEED][HOME] Article Block not found. Run seed-content-types first.',
    );
    return;
  }

  // Get existing Feature Section - just get the first one since it doesn't have unique fields
  const featureSections = await strapi.db.query(FEATURE_SECTION_UID).findMany({
    limit: 1,
  });

  if (featureSections.length === 0) {
    strapi.log.warn(
      '[SEED][HOME] Feature Section not found. Run seed-content-types first.',
    );
    return;
  }
  const featureSection = featureSections[0];

  // Get existing Steps Container
  const stepsContainer = await strapi.db.query(STEPS_CONTAINER_UID).findOne({
    where: { heading: 'Get Started in 3 Simple Steps' },
  });

  if (!stepsContainer) {
    strapi.log.warn(
      '[SEED][HOME] Steps Container not found. Run seed-content-types first.',
    );
    return;
  }

  // Create Home Template with all components
  const existingHomeTemplate = await strapi.db.query(TEMPLATE_UID).findOne({
    where: { Name: 'Home Page Template' },
  });

  let homeTemplate;
  if (!existingHomeTemplate) {
    homeTemplate = await strapi.entityService.create(TEMPLATE_UID, {
      data: {
        Name: 'Home Page Template',
        TemplateType: 'Standard',
        Content: [
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
        ],
        publishedAt: new Date().toISOString(),
      },
    });
    strapi.log.info(
      `[SEED][HOME] Created Home Template (ID: ${homeTemplate.id})`,
    );
  } else {
    homeTemplate = existingHomeTemplate;
    strapi.log.debug(
      `[SEED][HOME] Home Template already exists (ID: ${homeTemplate.id})`,
    );
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
    strapi.log.info(
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
    strapi.log.info(
      `[SEED][HOME] Updated existing Home Page (ID: ${existingHomePage.id})`,
    );
  }
}
