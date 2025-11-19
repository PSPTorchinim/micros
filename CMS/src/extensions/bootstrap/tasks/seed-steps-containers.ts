/**
 * Seed Steps Containers
 * Dependencies: CTAs
 */

import { SeederLogger, createAndPublish } from './utils/seeder-helpers';

type StrapiInstance = any;

export default async function seedStepsContainers({ strapi }: { strapi: StrapiInstance }) {
  const logger = new SeederLogger('StepsContainers');
  logger.info('Starting Steps Container seeding...');

  try {
    // Get CTA for the action button
    logger.debug('Fetching CTAs for steps containers...');
    const getStartedCTA = await strapi.db.query('api::cta.cta').findOne({
      where: { Label: 'Get Started' },
    });

    if (!getStartedCTA) {
      logger.warn('Get Started CTA not found. Please seed CTAs first.');
      return [];
    }

    logger.debug(`Found Get Started CTA (${getStartedCTA.id})`);

    // Create steps containers with inline step components
    const stepsContainerData = [
      {
        heading: 'Get Started in 3 Simple Steps',
        content: 'Begin your journey with DJ Beat Blaster and transform your DJ business today.',
        action: getStartedCTA.id,
        steps: [
          {
            __component: 'steps.step',
            title: 'Create Your Account',
            description: 'Sign up in minutes and set up your DJ profile with your information, branding, and preferences.',
            icon: 'user-plus',
          },
          {
            __component: 'steps.step',
            title: 'Import Your Music',
            description: 'Upload your music library and let our system organize it with intelligent tagging and categorization.',
            icon: 'music',
          },
          {
            __component: 'steps.step',
            title: 'Book Your First Gig',
            description: 'Start managing events, accepting bookings, and taking your DJ business to the next level.',
            icon: 'calendar-check',
          },
        ],
      },
      {
        heading: 'How to Manage Events',
        content: 'Professional event management made simple with our powerful tools.',
        action: getStartedCTA.id,
        steps: [
          {
            __component: 'steps.step',
            title: 'Create Event',
            description: 'Set up event details including date, venue, and requirements.',
            icon: 'calendar-plus',
          },
          {
            __component: 'steps.step',
            title: 'Build Playlist',
            description: 'Curate the perfect setlist from your music library.',
            icon: 'list-music',
          },
          {
            __component: 'steps.step',
            title: 'Execute Flawlessly',
            description: 'Use our tools during the event for seamless performance.',
            icon: 'check-circle',
          },
        ],
      },
    ];

    logger.debug(`Sample data structure: ${JSON.stringify(stepsContainerData[0], null, 2)}`);

    const stepsContainers = [];
    for (const data of stepsContainerData) {
      const container = await createAndPublish(
        strapi,
        'api::steps-container.steps-container',
        'heading',
        data,
        logger,
        'Steps Container'
      );
      stepsContainers.push(container);
    }

    logger.success(`Successfully seeded ${stepsContainers.length} Steps Containers`);
    return stepsContainers;
  } catch (error) {
    logger.error('Failed to seed Steps Containers', error);
    throw error;
  }
}
