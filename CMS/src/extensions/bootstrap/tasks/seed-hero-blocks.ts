// Seed Hero Blocks

const HERO_BLOCK_UID = 'api::hero-block.hero-block';
const CTA_UID = 'api::cta.cta';

export async function seedHeroBlocks(strapi: any) {
  console.info('[SEED][HERO_BLOCKS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.info('[SEED][HERO_BLOCKS] 🎯 Starting Hero Blocks seeding...');
  console.info('[SEED][HERO_BLOCKS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Check if hero block already exists
  console.info('[SEED][HERO_BLOCKS] 🔍 Checking for existing hero block...');
  const existingHero = await strapi.db.query(HERO_BLOCK_UID).findOne({
    where: { heading: 'Welcome to DJ Beat Blaster' },
  });

  if (existingHero) {
    console.info(`[SEED][HERO_BLOCKS] ✓ Found existing hero block (ID: ${existingHero.id})`);
    console.info('[SEED][HERO_BLOCKS] 🔄 Updating existing hero block...');
    
    // Find or create CTAs
    console.info('[SEED][HERO_BLOCKS] 🔍 Looking for "Get Started Free" CTA...');
    let heroSignupCta = await strapi.db.query(CTA_UID).findOne({
      where: { Label: 'Get Started Free' },
    });
    if (!heroSignupCta) {
      console.info('[SEED][HERO_BLOCKS] ➕ Creating "Get Started Free" CTA...');
      heroSignupCta = await strapi.entityService.create(CTA_UID, {
        data: {
          Label: 'Get Started Free',
          url: '/users/register',
          OpenInNewTab: false,
          publishedAt: new Date().toISOString(),
        },
      });
      console.info(`[SEED][HERO_BLOCKS] ✓ Created CTA (ID: ${heroSignupCta.id})`);
    } else {
      console.info(`[SEED][HERO_BLOCKS] ✓ Found existing CTA (ID: ${heroSignupCta.id})`);
    }

    console.info('[SEED][HERO_BLOCKS] 🔍 Looking for "Learn More" CTA...');
    let heroLearnCta = await strapi.db.query(CTA_UID).findOne({
      where: { Label: 'Learn More' },
    });
    if (!heroLearnCta) {
      console.info('[SEED][HERO_BLOCKS] ➕ Creating "Learn More" CTA...');
      heroLearnCta = await strapi.entityService.create(CTA_UID, {
        data: {
          Label: 'Learn More',
          url: '/about',
          OpenInNewTab: false,
          publishedAt: new Date().toISOString(),
        },
      });
      console.info(`[SEED][HERO_BLOCKS] ✓ Created CTA (ID: ${heroLearnCta.id})`);
    } else {
      console.info(`[SEED][HERO_BLOCKS] ✓ Found existing CTA (ID: ${heroLearnCta.id})`);
    }

    // Update hero block with CTAs
    console.info('[SEED][HERO_BLOCKS] 🔄 Updating hero block with actions...');
    await strapi.entityService.update(HERO_BLOCK_UID, existingHero.id, {
      data: {
        heading: 'Welcome to DJ Beat Blaster',
        content:
          'Your complete platform for managing DJ gigs, clients, equipment, and music. Streamline your DJ business and focus on what you do best - making people dance!',
        actions: [heroSignupCta.id, heroLearnCta.id],
        publishedAt: new Date().toISOString(),
      },
    });
    
    // Verify the update
    const verified = await strapi.entityService.findOne(HERO_BLOCK_UID, existingHero.id, {
      populate: { actions: true },
    });
    console.info(`[SEED][HERO_BLOCKS] ✅ Updated Hero Block (ID: ${existingHero.id})`);
    console.info(`[SEED][HERO_BLOCKS] ✅ Actions attached: ${verified.actions?.length || 0} CTAs`);
    console.info(`[SEED][HERO_BLOCKS]    - CTA 1: ${heroSignupCta.Label} (ID: ${heroSignupCta.id})`);
    console.info(`[SEED][HERO_BLOCKS]    - CTA 2: ${heroLearnCta.Label} (ID: ${heroLearnCta.id})`);
    console.info('[SEED][HERO_BLOCKS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return;
  }

  // Main Hero Block for Home Page
  console.info('[SEED][HERO_BLOCKS] ➕ Creating new hero block and CTAs...');
  
  console.info('[SEED][HERO_BLOCKS] 🔨 Creating "Get Started Free" CTA...');
  const heroSignupCta = await strapi.entityService.create(CTA_UID, {
    data: {
      Label: 'Get Started Free',
      url: '/users/register',
      OpenInNewTab: false,
      publishedAt: new Date().toISOString(),
    },
  });
  console.info(`[SEED][HERO_BLOCKS] ✓ Created CTA (ID: ${heroSignupCta.id}, Label: "${heroSignupCta.Label}", URL: ${heroSignupCta.url})`);

  console.info('[SEED][HERO_BLOCKS] 🔨 Creating "Learn More" CTA...');
  const heroLearnCta = await strapi.entityService.create(CTA_UID, {
    data: {
      Label: 'Learn More',
      url: '/about',
      OpenInNewTab: false,
      publishedAt: new Date().toISOString(),
    },
  });
  console.info(`[SEED][HERO_BLOCKS] ✓ Created CTA (ID: ${heroLearnCta.id}, Label: "${heroLearnCta.Label}", URL: ${heroLearnCta.url})`);

  console.info('[SEED][HERO_BLOCKS] 🔨 Creating hero block with actions...');
  const heroBlock = await strapi.entityService.create(HERO_BLOCK_UID, {
    data: {
      heading: 'Welcome to DJ Beat Blaster',
      content:
        'Your complete platform for managing DJ gigs, clients, equipment, and music. Streamline your DJ business and focus on what you do best - making people dance!',
      actions: [heroSignupCta.id, heroLearnCta.id],
      publishedAt: new Date().toISOString(),
    },
  });
  
  // Verify creation
  const verified = await strapi.entityService.findOne(HERO_BLOCK_UID, heroBlock.id, {
    populate: { actions: true },
  });
  
  console.info(`[SEED][HERO_BLOCKS] ✅ Created Hero Block (ID: ${heroBlock.id})`);
  console.info(`[SEED][HERO_BLOCKS] ✅ Heading: "${heroBlock.heading}"`);
  console.info(`[SEED][HERO_BLOCKS] ✅ Actions attached: ${verified.actions?.length || 0} CTAs`);
  console.info(`[SEED][HERO_BLOCKS]    - CTA 1: "${heroSignupCta.Label}" → ${heroSignupCta.url}`);
  console.info(`[SEED][HERO_BLOCKS]    - CTA 2: "${heroLearnCta.Label}" → ${heroLearnCta.url}`);
  console.info(`[SEED][HERO_BLOCKS] ✅ Published: ${heroBlock.publishedAt ? 'Yes' : 'No'}`);
  console.info('[SEED][HERO_BLOCKS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
