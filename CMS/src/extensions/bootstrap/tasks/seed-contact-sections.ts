/**
 * Seed Contact Sections
 * Dependencies: Contact Info
 */

import { SeederLogger, createIfNotExists } from './utils/seeder-helpers';

type StrapiInstance = any;

export default async function seedContactSections({ strapi }: { strapi: StrapiInstance }) {
  const logger = new SeederLogger('ContactSections');
  logger.info('Starting Contact Section seeding...');

  try {
    // Get all contact info to link to sections
    logger.debug('Fetching Contact Info for sections...');
    const contactInfos = await strapi.db.query('api::contact-info.contact-info').findMany();

    if (!contactInfos || contactInfos.length === 0) {
      logger.warn('No Contact Info found. Please seed Contact Info first.');
      return [];
    }

    logger.debug(`Found ${contactInfos.length} Contact Info entries`);

    // Create contact sections
    const contactSectionData = [
      {
        introText: 'Get in Touch',
        heading: 'Contact Our Team',
        description: 'Have questions about DJ Beat Blaster? Our team is here to help you get started and make the most of our platform.',
        contactInfo: contactInfos.map((info: any) => info.id),
      },
      {
        introText: 'Need Support?',
        heading: 'We\'re Here to Help',
        description: 'Reach out to our support team for technical assistance, feature requests, or general inquiries.',
        contactInfo: contactInfos.filter((info: any) => 
          info.title === 'Support' || info.title === 'Email Us'
        ).map((info: any) => info.id),
      },
    ];

    const contactSections = [];
    for (const data of contactSectionData) {
      const section = await createIfNotExists(
        strapi,
        'api::contact-section.contact-section',
        'heading',
        data,
        logger,
        'Contact Section'
      );
      contactSections.push(section);
    }

    logger.success(`Successfully seeded ${contactSections.length} Contact Sections`);
    return contactSections;
  } catch (error) {
    logger.error('Failed to seed Contact Sections', error);
    throw error;
  }
}
