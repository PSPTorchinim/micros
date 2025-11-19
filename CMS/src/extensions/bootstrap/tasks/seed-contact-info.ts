/**
 * Seed Contact Info entries
 * No dependencies on other content types
 */

import { SeederLogger, batchCreate } from './utils/seeder-helpers';

type StrapiInstance = any;

export default async function seedContactInfo({ strapi }: { strapi: StrapiInstance }) {
  const logger = new SeederLogger('ContactInfo');
  logger.info('Starting Contact Info seeding...');

  const contactInfoData = [
    {
      title: 'Email Us',
      content: 'info@djbeatblaster.com',
      detail: 'We typically respond within 24 hours',
      iconName: 'envelope',
    },
    {
      title: 'Call Us',
      content: '+1 (555) 123-4567',
      detail: 'Monday - Friday, 9AM - 6PM EST',
      iconName: 'phone',
    },
    {
      title: 'Visit Us',
      content: '123 Beat Street, Music City, MC 12345',
      detail: 'By appointment only',
      iconName: 'map-marker',
    },
    {
      title: 'Support',
      content: 'support@djbeatblaster.com',
      detail: '24/7 technical support',
      iconName: 'life-ring',
    },
  ];

  try {
    const contactInfos = await batchCreate(
      strapi,
      'api::contact-info.contact-info',
      contactInfoData,
      'title',
      logger,
      'Contact Info'
    );

    logger.success(`Successfully seeded ${contactInfos.length} Contact Info entries`);
    return contactInfos;
  } catch (error) {
    logger.error('Failed to seed Contact Info', error);
    throw error;
  }
}
