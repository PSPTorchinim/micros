// Seed Hero Blocks

const HERO_BLOCK_UID = 'api::hero-block.hero-block';
const CTA_UID = 'api::cta.cta';

export async function seedHeroBlocks(strapi: any) {
  strapi.log.info('[SEED][HERO_BLOCKS] Seeding Hero Blocks...');

  // Only seed if there are no hero blocks in the database
  const count = await strapi.db.query(HERO_BLOCK_UID).count();
  if (count > 0) {
    strapi.log.info('[SEED][HERO_BLOCKS] Skipping: hero blocks already exist.');
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
