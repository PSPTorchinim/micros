// Seed Home page

const PAGE_UID = 'api::page.page';
const TEMPLATE_UID = 'api::template.template';
const HERO_BLOCK_UID = 'api::hero-block.hero-block';
const FEATURE_SECTION_UID = 'api::feature-section.feature-section';
const STEPS_CONTAINER_UID = 'api::steps-container.steps-container';
const ARTICLE_BLOCK_UID = 'api::article-block.article-block';

export async function seedHomePage(strapi: any, configId: number) {
  console.info('[SEED][HOME] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.info('[SEED][HOME] 🏠 Starting Home page seeding...');
  console.info('[SEED][HOME] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Get existing Hero Block
  console.info('[SEED][HOME] 🔍 Looking for Hero Block...');
  const heroBlock = await strapi.db.query(HERO_BLOCK_UID).findOne({
    where: { heading: 'Welcome to DJ Beat Blaster' },
  });

  if (!heroBlock) {
    console.warn(
      '[SEED][HOME] ⚠️  Hero Block not found. Run seed-content-types first.',
    );
    return;
  }
  console.info(`[SEED][HOME] ✓ Found Hero Block (ID: ${heroBlock.id})`);

  // Get existing Article Block by title (dynamic fetch)
  console.info('[SEED][HOME] 🔍 Looking for Article Block...');
  const articleBlock = await strapi.db.query(ARTICLE_BLOCK_UID).findOne({
    where: { Title: 'Latest DJ Tips & Guides' },
  });

  if (!articleBlock) {
    console.warn(
      '[SEED][HOME] ⚠️  Article Block not found. Run seed-content-types first.',
    );
    return;
  }
  console.info(`[SEED][HOME] ✓ Found Article Block (ID: ${articleBlock.id})`);

  // Get existing Feature Section
  console.info('[SEED][HOME] 🔍 Looking for Feature Section...');
  const featureSection = await strapi.db.query(FEATURE_SECTION_UID).findOne({
    where: { Title: 'Everything You Need to Manage Your DJ Business' },
  });

  if (!featureSection) {
    console.warn(
      '[SEED][HOME] ⚠️  Feature Section not found. Run seed-content-types first.',
    );
    return;
  }
  console.info(`[SEED][HOME] ✓ Found Feature Section (ID: ${featureSection.id})`);

  // Get existing Steps Container
  console.info('[SEED][HOME] 🔍 Looking for Steps Container...');
  const stepsContainer = await strapi.db.query(STEPS_CONTAINER_UID).findOne({
    where: { heading: 'Get Started in 3 Simple Steps' },
  });

  if (!stepsContainer) {
    console.warn(
      '[SEED][HOME] ⚠️  Steps Container not found. Run seed-content-types first.',
    );
    return;
  }
  console.info(`[SEED][HOME] ✓ Found Steps Container (ID: ${stepsContainer.id})`);

  // Create Home Template with all components
  console.info('[SEED][HOME] 🔨 Building template content with 4 components...');
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
      block: articleBlock.id, // Always use the dynamically fetched ID
    },
    {
      __component: 'steps-container-ref.steps-container-ref',
      container: stepsContainer.id,
    },
  ];

  console.info('[SEED][HOME] 📋 Template Content structure:');
  templateContent.forEach((item, index) => {
    console.info(`[SEED][HOME]    ${index + 1}. ${item.__component}`);
    const refKey = Object.keys(item).find(key => key !== '__component');
    if (refKey) {
      console.info(`[SEED][HOME]       → ${refKey}: ${item[refKey]}`);
    }
  });

  let homeTemplate;
  if (!existingHomeTemplate) {
    console.info('[SEED][HOME] ➕ Creating new Home Page Template...');
    homeTemplate = await strapi.entityService.create(TEMPLATE_UID, {
      data: {
        Name: 'Home Page Template',
        TemplateType: 'Standard',
        Content: templateContent,
        publishedAt: new Date().toISOString(),
      },
    });
    console.info(
      `[SEED][HOME] ✓ Created Home Template (ID: ${homeTemplate.id})`,
    );
  } else {
    console.info(`[SEED][HOME] ✓ Found existing Home Template (ID: ${existingHomeTemplate.id})`);
    console.info('[SEED][HOME] 🔄 Updating template Content...');
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
      `[SEED][HOME] ✓ Updated Home Template (ID: ${homeTemplate.id})`,
    );
  }

  // Verify the template was updated correctly - use entityService for better population
  console.info('[SEED][HOME] 🔍 Verifying template Content...');
  const verifyTemplate = await strapi.entityService.findOne(
    TEMPLATE_UID,
    homeTemplate.id,
    {
      populate: ['Content'],
    },
  );
  console.info(`[SEED][HOME] ✓ Template Content count: ${verifyTemplate?.Content?.length || 0}`);
  if (verifyTemplate?.Content && verifyTemplate.Content.length > 0) {
    console.info('[SEED][HOME] ✓ Content components verified:');
    verifyTemplate.Content.forEach((item: any, index: number) => {
      console.info(`[SEED][HOME]    ${index + 1}. ${item.__component}`);
    });
  } else {
    console.warn('[SEED][HOME] ⚠️  WARNING: Template Content is empty after creation/update!');
  }

  // Create or update Home Page
  console.info('[SEED][HOME] 🏠 Creating/updating Home Page...');
  const existingHomePage = await strapi.db.query(PAGE_UID).findOne({
    where: { Slug: '/' },
  });

  let homePageId;
  // Ensure template exists and is published
  const templateCheck = await strapi.db.query(TEMPLATE_UID).findOne({ where: { id: homeTemplate.id } });
  if (!templateCheck) {
    console.error(`[SEED][HOME] ❌ Home Template with ID ${homeTemplate.id} does not exist! Cannot create Home Page.`);
    return;
  }
  if (!templateCheck.publishedAt) {
    await strapi.entityService.update(TEMPLATE_UID, homeTemplate.id, {
      data: { publishedAt: new Date().toISOString() },
    });
    console.info(`[SEED][HOME] Published Home Template (ID: ${homeTemplate.id})`);
  }
  const homePageData = {
    Title: 'Home',
    Slug: '/',
    configuration: configId,
    template: { connect: [homeTemplate.id] },
    Parents: [],
    subpages: [],
    publishedAt: new Date().toISOString(),
  };
  console.info('[SEED][HOME] Home Page creation data:', JSON.stringify(homePageData));
  if (!existingHomePage) {
    console.info('[SEED][HOME] ➕ Creating new Home Page...');
    const homePage = await strapi.entityService.create(PAGE_UID, {
      data: homePageData,
    });
    homePageId = homePage.id;
    console.info(
      `[SEED][HOME] ✅ Created Home Page (ID: ${homePage.id}, Slug: /, Template: ${homeTemplate.id})`,
    );
  } else {
    console.info(`[SEED][HOME] ✓ Found existing Home Page (ID: ${existingHomePage.id})`);
    console.info('[SEED][HOME] 🔄 Updating Home Page...');
    await strapi.entityService.update(PAGE_UID, existingHomePage.id, {
      data: homePageData,
    });
    homePageId = existingHomePage.id;
    console.info(
      `[SEED][HOME] ✅ Updated Home Page (ID: ${existingHomePage.id}, Template: ${homeTemplate.id})`,
    );
  }

  // Final verification - check the page has the template
  // Final verification - the relation is managed by the page side (template.page is mappedBy)
  console.info('[SEED][HOME] 🔍 Final verification of page-template relation...');
  // 3. Verify both directions
  const verifyPage = await strapi.entityService.findOne(PAGE_UID, homePageId, { populate: ['template'] });
  const verifyTemplateRelation = await strapi.entityService.findOne(TEMPLATE_UID, homeTemplate.id, { populate: ['page'] });
  if (verifyPage?.template && verifyTemplateRelation?.page) {
    console.info(`[SEED][HOME] ✅ Bidirectional relation established: Home page.template = ${verifyPage.template.id}, Template.page = ${verifyTemplateRelation.page.id}`);
  } else {
    console.error('[SEED][HOME] ❌ Failed to establish bidirectional relation between Home page and template!');
  }

  // Additional verification - query template directly to confirm Content is saved
  const finalTemplateCheck = await strapi.entityService.findOne(
    TEMPLATE_UID,
    homeTemplate.id,
    {
      populate: { Content: { populate: '*' } },
    },
  );
  console.info(`[SEED][HOME] ✓ Final template Content count: ${finalTemplateCheck?.Content?.length || 0}`);
  if (!finalTemplateCheck?.Content || finalTemplateCheck.Content.length === 0) {
    console.warn('[SEED][HOME] ⚠️  WARNING: Template Content is empty!');
    console.warn('[SEED][HOME] 🔄 Attempting retry with Content...');
    
    // Try to update the template again with Content
    await strapi.entityService.update(TEMPLATE_UID, homeTemplate.id, {
      data: {
        Content: templateContent,
      },
    });
    
    const recheckTemplate = await strapi.entityService.findOne(
      TEMPLATE_UID,
      homeTemplate.id,
      {
        populate: { Content: { populate: '*' } },
      },
    );
    console.info(`[SEED][HOME] ✓ After retry - Content count: ${recheckTemplate?.Content?.length || 0}`);
    if (recheckTemplate?.Content?.length > 0) {
      console.info('[SEED][HOME] ✅ Retry successful! Content saved.');
    } else {
      console.error('[SEED][HOME] ❌ Retry failed - Content still empty!');
    }
  } else {
    console.info('[SEED][HOME] ✅ Template Content verified successfully!');
  }
  
  console.info('[SEED][HOME] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.info('[SEED][HOME] ✅ Home page seeding complete!');
  console.info('[SEED][HOME] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
