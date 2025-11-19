/**
 * Seed CTAs (Call-to-Action buttons)
 * No dependencies on other content types
 */

import { SeederLogger, batchCreateAndPublish } from './utils/seeder-helpers';

type StrapiInstance = any;

export default async function seedCTAs({ strapi }: { strapi: StrapiInstance }) {
  const logger = new SeederLogger('CTAs');
  logger.info('Starting CTA seeding...');

  const ctaData = [
    {
      Label: 'Get Started',
      url: '/users/login',
      OpenInNewTab: false,
    },
    {
      Label: 'Learn More',
      url: '/about',
      OpenInNewTab: false,
    },
    {
      Label: 'View Features',
      url: '#features',
      OpenInNewTab: false,
    },
    {
      Label: 'Contact Us',
      url: '/contact',
      OpenInNewTab: false,
    },
    {
      Label: 'Sign Up',
      url: '/users/register',
      OpenInNewTab: false,
    },
    {
      Label: 'Documentation',
      url: '/docs',
      OpenInNewTab: false,
    },
  ];

  try {
    const ctas = await batchCreateAndPublish(
      strapi,
      'api::cta.cta',
      ctaData,
      'Label',
      logger,
      'CTA'
    );

    logger.success(`Successfully seeded ${ctas.length} CTAs`);
    return ctas;
  } catch (error) {
    logger.error('Failed to seed CTAs', error);
    throw error;
  }
}
