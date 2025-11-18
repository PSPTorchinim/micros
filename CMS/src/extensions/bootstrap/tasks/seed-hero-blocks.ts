// Seed Hero Blocks

const HERO_BLOCK_UID = 'api::hero-block.hero-block';
const CTA_UID = 'api::cta.cta';

export async function seedHeroBlocks(strapi: any) {
  console.info('[SEED][HERO_BLOCKS] Seeding Hero Blocks...');

  // Check if hero block already exists
  const existingHero = await strapi.db.query(HERO_BLOCK_UID).findOne({
    where: { heading: 'Welcome to DJ Beat Blaster' },
  });

  if (existingHero) {
    console.info('[SEED][HERO_BLOCKS] Hero block already exists, updating...');
    
    // Find or create CTAs
    let heroSignupCta = await strapi.db.query(CTA_UID).findOne({
      where: { Label: 'Get Started Free' },
    });
    if (!heroSignupCta) {
      heroSignupCta = await strapi.entityService.create(CTA_UID, {
        data: {
          Label: 'Get Started Free',
          url: '/users/register',
          OpenInNewTab: false,
          publishedAt: new Date().toISOString(),
        },
      });
    }

    let heroLearnCta = await strapi.db.query(CTA_UID).findOne({
      where: { Label: 'Learn More' },
    });
    if (!heroLearnCta) {
      heroLearnCta = await strapi.entityService.create(CTA_UID, {
        data: {
          Label: 'Learn More',
          url: '/about',
          OpenInNewTab: false,
          publishedAt: new Date().toISOString(),
        },
      });
    }

    // Update hero block with CTAs
    await strapi.entityService.update(HERO_BLOCK_UID, existingHero.id, {
      data: {
        heading: 'Welcome to DJ Beat Blaster',
        content:
          'Your complete platform for managing DJ gigs, clients, equipment, and music. Streamline your DJ business and focus on what you do best - making people dance!'
        // actions will be set by updating CTAs below
      },
    });
    // Update CTAs to point to this hero block (one-to-many relation)
    await strapi.entityService.update(CTA_UID, heroSignupCta.id, {
      data: { hero_block: existingHero.id }
    });
    await strapi.entityService.update(CTA_UID, heroLearnCta.id, {
      data: { hero_block: existingHero.id }
    });
    console.info(
      `[SEED][HERO_BLOCKS] Updated Hero Block: Welcome to DJ Beat Blaster (ID: ${existingHero.id}) and attached CTAs`,
    );
    return;
  }

  // Main Hero Block for Home Page
  const heroSignupCta = await strapi.entityService.create(CTA_UID, {
    data: {
      Label: 'Get Started Free',
      url: '/users/register',
      OpenInNewTab: false,
      publishedAt: new Date().toISOString(),
    },
  });

  const heroLearnCta = await strapi.entityService.create(CTA_UID, {
    data: {
      Label: 'Learn More',
      url: '/about',
      OpenInNewTab: false,
      publishedAt: new Date().toISOString(),
    },
  });

  const heroBlock = await strapi.entityService.create(HERO_BLOCK_UID, {
    data: {
      heading: 'Welcome to DJ Beat Blaster',
      content:
        'Your complete platform for managing DJ gigs, clients, equipment, and music. Streamline your DJ business and focus on what you do best - making people dance!',
      publishedAt: new Date().toISOString(),
    },
  });
  // Update CTAs to point to this hero block (one-to-many relation)
  await strapi.entityService.update(CTA_UID, heroSignupCta.id, {
    data: { hero_block: heroBlock.id }
  });
  await strapi.entityService.update(CTA_UID, heroLearnCta.id, {
    data: { hero_block: heroBlock.id }
  });
  console.info(
    `[SEED][HERO_BLOCKS] Created Hero Block: Welcome to DJ Beat Blaster (ID: ${heroBlock.id}) and attached CTAs`,
  );
}
