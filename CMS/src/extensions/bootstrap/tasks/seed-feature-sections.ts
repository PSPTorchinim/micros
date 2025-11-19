/**
 * Seed Feature Sections
 * Dependencies: Feature Tabs
 */

import { SeederLogger, createIfNotExists } from './utils/seeder-helpers';

type StrapiInstance = any;

export default async function seedFeatureSections({ strapi }: { strapi: StrapiInstance }) {
  const logger = new SeederLogger('FeatureSections');
  logger.info('Starting Feature Section seeding...');

  try {
    // Get all feature tabs to link to sections
    logger.debug('Fetching Feature Tabs for sections...');
    const featureTabs = await strapi.db.query('api::feature-tab.feature-tab').findMany();

    if (!featureTabs || featureTabs.length === 0) {
      logger.warn('No Feature Tabs found. Please seed Feature Tabs first.');
      return [];
    }

    logger.debug(`Found ${featureTabs.length} Feature Tabs`);

    // Create feature sections
    const featureSectionData = [
      {
        Title: 'DJ Platform Features',
        reversed: false,
        tabs: featureTabs.map((tab: any) => tab.id),
      },
      {
        Title: 'Professional Tools',
        reversed: true,
        tabs: featureTabs.slice(0, 3).map((tab: any) => tab.id), // First 3 tabs
      },
    ];

    const featureSections = [];
    for (const data of featureSectionData) {
      const section = await createIfNotExists(
        strapi,
        'api::feature-section.feature-section',
        'Title',
        data,
        logger,
        'Feature Section'
      );
      featureSections.push(section);
    }

    logger.success(`Successfully seeded ${featureSections.length} Feature Sections`);
    return featureSections;
  } catch (error) {
    logger.error('Failed to seed Feature Sections', error);
    throw error;
  }
}
