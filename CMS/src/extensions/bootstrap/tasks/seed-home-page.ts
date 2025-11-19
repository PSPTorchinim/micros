// Seed Home page - Two-Phase Approach
// Phase 1: Create templates and pages without relations
// Phase 2: Establish relations after all entities exist

const PAGE_UID = 'api::page.page';
const TEMPLATE_UID = 'api::template.template';
const HERO_BLOCK_UID = 'api::hero-block.hero-block';
const FEATURE_SECTION_UID = 'api::feature-section.feature-section';
const STEPS_CONTAINER_UID = 'api::steps-container.steps-container';
const ARTICLE_BLOCK_UID = 'api::article-block.article-block';

export async function seedHomePage(strapi: any, configId: number) {
  console.info('[SEED][HOME] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.info('[SEED][HOME] 🏠 Starting Home page seeding (Two-Phase)...');
  console.info('[SEED][HOME] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // ============================================================================
  // PHASE 1: Fetch dependencies and create entities WITHOUT relations
  // ============================================================================
  console.info('[SEED][HOME] 📦 PHASE 1: Creating entities without relations');

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
  console.info(
    `[SEED][HOME] ✓ Found Feature Section (ID: ${featureSection.id})`,
  );

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
  console.info(
    `[SEED][HOME] ✓ Found Steps Container (ID: ${stepsContainer.id})`,
  );

  // Build template content structure
  console.info(
    '[SEED][HOME] 🔨 Building template content with 4 components...',
  );
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

  console.info('[SEED][HOME] 📋 Template Content structure:');
  templateContent.forEach((item, index) => {
    console.info(`[SEED][HOME]    ${index + 1}. ${item.__component}`);
    const refKey = Object.keys(item).find((key) => key !== '__component');
    if (refKey) {
      console.info(`[SEED][HOME]       → ${refKey}: ${item[refKey]}`);
    }
  });

  // Create or update Home Template
  const existingHomeTemplate = await strapi.db.query(TEMPLATE_UID).findOne({
    where: { Name: 'Home Page Template' },
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
    console.info(
      `[SEED][HOME] ✓ Found existing Home Template (ID: ${existingHomeTemplate.id})`,
    );
    console.info('[SEED][HOME] 🔄 Updating template Content...');
    homeTemplate = await strapi.entityService.update(
      TEMPLATE_UID,
      existingHomeTemplate.id,
      {
        data: {
          Name: 'Home Page Template',
          TemplateType: 'Standard',
          Content: templateContent,
          publishedAt: new Date().toISOString(),
        },
      },
    );
    console.info(
      `[SEED][HOME] ✓ Updated Home Template (ID: ${homeTemplate.id})`,
    );
  }

  // Create or update Home Page WITHOUT template relation
  console.info(
    '[SEED][HOME] 🏠 Creating/updating Home Page (without template relation)...',
  );
  const existingHomePage = await strapi.db.query(PAGE_UID).findOne({
    where: { Slug: '/' },
  });

  let homePageId;
  const homePageData = {
    Title: 'Home',
    Slug: '/',
    configuration: configId,
    Parents: [],
    subpages: [],
    publishedAt: new Date().toISOString(),
  };

  if (!existingHomePage) {
    console.info('[SEED][HOME] ➕ Creating new Home Page...');
    const homePage = await strapi.entityService.create(PAGE_UID, {
      data: homePageData,
    });
    homePageId = homePage.id;
    console.info(
      `[SEED][HOME] ✓ Created Home Page (ID: ${homePage.id}, Slug: /)`,
    );
  } else {
    homePageId = existingHomePage.id;
    console.info(
      `[SEED][HOME] ✓ Found existing Home Page (ID: ${existingHomePage.id})`,
    );
  }

  // ============================================================================
  // PHASE 2: Establish relations after all entities exist
  // ============================================================================
  console.info('');
  console.info('[SEED][HOME] 🔗 PHASE 2: Establishing relations');

  // Set the Page -> Template relation using Strapi's Document Service
  console.info(
    `[SEED][HOME] 🔗 Connecting Page ${homePageId} to Template ${homeTemplate.id}...`,
  );

  try {
    // Use the relation connect syntax for Strapi v5
    await strapi.db.query(PAGE_UID).update({
      where: { id: homePageId },
      data: {
        template: homeTemplate.id,
      },
    });
    console.info('[SEED][HOME] ✓ Relation update executed');
  } catch (error: any) {
    console.error('[SEED][HOME] ❌ Failed to set relation:', error.message);
  }

  // ============================================================================
  // VERIFICATION
  // ============================================================================
  console.info('');
  console.info('[SEED][HOME] 🔍 VERIFICATION: Checking relations');

  // Verify using db.query with proper population
  const verifyPageDB = await strapi.db.query(PAGE_UID).findOne({
    where: { id: homePageId },
    populate: { template: true },
  });

  if (verifyPageDB?.template) {
    console.info(
      `[SEED][HOME] ✅ SUCCESS: Page.template = ${verifyPageDB.template.id}`,
    );

    // Check inverse relation
    const verifyTemplateDB = await strapi.db.query(TEMPLATE_UID).findOne({
      where: { id: homeTemplate.id },
      populate: { page: true },
    });

    if (verifyTemplateDB?.page) {
      console.info(
        `[SEED][HOME] ✅ SUCCESS: Template.page = ${verifyTemplateDB.page.id} (bidirectional confirmed)`,
      );
    } else {
      console.warn(
        '[SEED][HOME] ⚠️  Template.page not set (inverse side may not be managed by Strapi)',
      );
    }
  } else {
    console.error(
      '[SEED][HOME] ❌ FAILED: Page.template relation not established',
    );
    console.error(
      `[SEED][HOME] Debug: Page ID=${homePageId}, Template ID=${homeTemplate.id}`,
    );

    // Try alternative approach: Update using entityService
    console.info(
      '[SEED][HOME] 🔄 Attempting alternative method with entityService...',
    );
    try {
      await strapi.entityService.update(PAGE_UID, homePageId, {
        data: {
          template: homeTemplate.id,
        },
      });

      // Re-verify
      const recheckDB = await strapi.db.query(PAGE_UID).findOne({
        where: { id: homePageId },
        populate: { template: true },
      });

      if (recheckDB?.template) {
        console.info(
          '[SEED][HOME] ✅ SUCCESS: Relation established with entityService',
        );
      } else {
        console.error(
          '[SEED][HOME] ❌ FAILED: Still unable to establish relation',
        );
      }
    } catch (retryError: any) {
      console.error('[SEED][HOME] ❌ Retry failed:', retryError.message);
    }
  }

  // Verify template content
  const finalTemplateCheck = await strapi.entityService.findOne(
    TEMPLATE_UID,
    homeTemplate.id,
    {
      populate: { Content: { populate: '*' } },
    },
  );
  console.info(
    `[SEED][HOME] ✓ Template Content count: ${finalTemplateCheck?.Content?.length || 0}`,
  );

  console.info('[SEED][HOME] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.info('[SEED][HOME] ✅ Home page seeding complete!');
  console.info('[SEED][HOME] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
