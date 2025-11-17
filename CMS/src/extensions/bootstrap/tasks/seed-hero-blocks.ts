// Seed Hero Blocks

const HERO_BLOCK_UID = 'api::hero-block.hero-block';
const CTA_UID = 'api::cta.cta';

export async function seedHeroBlocks(strapi: any) {
  strapi.log.info('[SEED][HERO_BLOCKS] Seeding Hero Blocks...');

  // Check if hero block already exists
  const existingHero = await strapi.db.query(HERO_BLOCK_UID).findOne({
    where: { heading: 'Welcome to DJ Beat Blaster' },
  });

  if (existingHero) {
    strapi.log.info('[SEED][HERO_BLOCKS] Hero block already exists, updating...');
    
    // Find or create CTAs
    let heroSignupCta = await strapi.db.query(CTA_UID).findOne({
      where: { text: 'Get Started Free' },
    });
    if (!heroSignupCta) {
      heroSignupCta = await strapi.entityService.create(CTA_UID, {
        data: {
          text: 'Get Started Free',
          href: '/users/register',
          variant: 'primary',
          publishedAt: new Date().toISOString(),
        },
      });
    }

    let heroLearnCta = await strapi.db.query(CTA_UID).findOne({
      where: { text: 'Learn More' },
    });
    if (!heroLearnCta) {
      heroLearnCta = await strapi.entityService.create(CTA_UID, {
        data: {
          text: 'Learn More',
          href: '/about',
          variant: 'secondary',
          publishedAt: new Date().toISOString(),
        },
      });
    }

    // Update hero block with CTAs
    await strapi.entityService.update(HERO_BLOCK_UID, existingHero.id, {
      data: {
        heading: 'Welcome to DJ Beat Blaster',
        content:
          'Your complete platform for managing DJ gigs, clients, equipment, and music. Streamline your DJ business and focus on what you do best - making people dance!',
        actions: [heroSignupCta.id, heroLearnCta.id],
      },
    });
    strapi.log.info(
      `[SEED][HERO_BLOCKS] Updated Hero Block: Welcome to DJ Beat Blaster (ID: ${existingHero.id})`,
    );
    return;
  }

  // Main Hero Block for Home Page
  const heroSignupCta = await strapi.entityService.create(CTA_UID, {
    data: {
      text: 'Get Started Free',
      href: '/users/register',
      variant: 'primary',
      publishedAt: new Date().toISOString(),
    },
  });

  const heroLearnCta = await strapi.entityService.create(CTA_UID, {
    data: {
      text: 'Learn More',
      href: '/about',
      variant: 'secondary',
      publishedAt: new Date().toISOString(),
    },
  });

  const heroBlock = await strapi.entityService.create(HERO_BLOCK_UID, {
    data: {
      heading: 'Welcome to DJ Beat Blaster',
      content:
        'Your complete platform for managing DJ gigs, clients, equipment, and music. Streamline your DJ business and focus on what you do best - making people dance!',
      actions: [heroSignupCta.id, heroLearnCta.id],
    },
  });
  strapi.log.info(
    `[SEED][HERO_BLOCKS] Created Hero Block: Welcome to DJ Beat Blaster (ID: ${heroBlock.id})`,
  );
}
