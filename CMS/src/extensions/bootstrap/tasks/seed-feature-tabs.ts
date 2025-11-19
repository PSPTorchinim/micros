/**
 * Seed Feature Tabs
 * No dependencies on other content types
 */

import { SeederLogger, batchCreate } from './utils/seeder-helpers';

type StrapiInstance = any;

export default async function seedFeatureTabs({ strapi }: { strapi: StrapiInstance }) {
  const logger = new SeederLogger('FeatureTabs');
  logger.info('Starting Feature Tab seeding...');

  const featureTabData = [
    {
      title: 'Music Library',
      description: 'Organize and manage your entire music collection with advanced tagging and search capabilities.',
      imgSrc: '/images/features/music-library.jpg',
      imgAlt: 'Music Library Interface',
    },
    {
      title: 'Event Management',
      description: 'Schedule gigs, track bookings, and manage your calendar all in one place.',
      imgSrc: '/images/features/events.jpg',
      imgAlt: 'Event Management Dashboard',
    },
    {
      title: 'Client Portal',
      description: 'Give your clients access to song requests, event details, and real-time updates.',
      imgSrc: '/images/features/client-portal.jpg',
      imgAlt: 'Client Portal Interface',
    },
    {
      title: 'Equipment Tracking',
      description: 'Keep track of your DJ equipment, maintenance schedules, and inventory.',
      imgSrc: '/images/features/equipment.jpg',
      imgAlt: 'Equipment Tracking System',
    },
    {
      title: 'Contract Management',
      description: 'Create, send, and manage contracts with built-in digital signatures.',
      imgSrc: '/images/features/contracts.jpg',
      imgAlt: 'Contract Management Tool',
    },
    {
      title: 'Email Marketing',
      description: 'Stay connected with clients through automated email campaigns and newsletters.',
      imgSrc: '/images/features/marketing.jpg',
      imgAlt: 'Email Marketing Dashboard',
    },
  ];

  try {
    const tabs = await batchCreate(
      strapi,
      'api::feature-tab.feature-tab',
      featureTabData,
      'title',
      logger,
      'Feature Tab'
    );

    logger.success(`Successfully seeded ${tabs.length} Feature Tabs`);
    return tabs;
  } catch (error) {
    logger.error('Failed to seed Feature Tabs', error);
    throw error;
  }
}
