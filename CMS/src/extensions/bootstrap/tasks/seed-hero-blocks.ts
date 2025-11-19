/**
 * Seed Hero Blocks
 * Dependencies: CTAs
 */

import { SeederLogger, createIfNotExists } from './utils/seeder-helpers';

type StrapiInstance = any;

export default async function seedHeroBlocks({ strapi }: { strapi: StrapiInstance }) {
  const logger = new SeederLogger('HeroBlocks');
  logger.info('Starting Hero Block seeding...');

  try {
    // Get CTAs to link to hero blocks
    logger.debug('Fetching CTAs for hero blocks...');
    const getStartedCTA = await strapi.db.query('api::cta.cta').findOne({
      where: { Label: 'Get Started' },
    });
    const learnMoreCTA = await strapi.db.query('api::cta.cta').findOne({
      where: { Label: 'Learn More' },
    });

    if (!getStartedCTA || !learnMoreCTA) {
      logger.warn('Required CTAs not found. Please seed CTAs first.');
      return [];
    }

    logger.debug(`Found CTAs: Get Started (${getStartedCTA.id}), Learn More (${learnMoreCTA.id})`);

    // Create hero blocks with CTA relations
    const heroBlockData = [
      {
        heading: 'Welcome to DJ Beat Blaster',
        content: 'The ultimate platform for professional DJs to manage their business, music library, and events all in one place.',
        actions: [getStartedCTA.id, learnMoreCTA.id],
      },
      {
        heading: 'Elevate Your DJ Business',
        content: 'Powerful tools designed by DJs, for DJs. Streamline your workflow and focus on what matters most - the music.',
        actions: [getStartedCTA.id],
      },
    ];

    const heroBlocks = [];
    for (const data of heroBlockData) {
      const heroBlock = await createIfNotExists(
        strapi,
        'api::hero-block.hero-block',
        'heading',
        data,
        logger,
        'Hero Block'
      );
      heroBlocks.push(heroBlock);
    }

    logger.success(`Successfully seeded ${heroBlocks.length} Hero Blocks`);
    return heroBlocks;
  } catch (error) {
    logger.error('Failed to seed Hero Blocks', error);
    throw error;
  }
}
