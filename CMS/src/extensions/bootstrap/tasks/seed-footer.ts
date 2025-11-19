/**
 * Seed Footer (Single Type)
 * Dependencies: Configuration (will be linked when configuration is created)
 */

import { SeederLogger, publishEntity } from './utils/seeder-helpers';

type StrapiInstance = any;

export default async function seedFooter({ strapi }: { strapi: StrapiInstance }) {
  const logger = new SeederLogger('Footer');
  logger.info('Starting Footer seeding...');

  try {
    // Check if footer already exists
    logger.debug('Checking for existing Footer...');
    const existing = await strapi.db.query('api::footer.footer').findMany({ limit: 1 });
    
    if (existing && existing.length > 0) {
      logger.debug(`Footer already exists (id: ${existing[0].id})`);
      return existing[0];
    }

    const footerData = {
      copyright: '© 2024 DJ Beat Blaster. All rights reserved.',
      columns: [
        {
          __component: 'footer.link-column',
          title: 'Product',
          links: [
            { __component: 'footer.link', label: 'Features', url: '/features' },
            { __component: 'footer.link', label: 'Pricing', url: '/pricing' },
            { __component: 'footer.link', label: 'Documentation', url: '/docs' },
          ],
        },
        {
          __component: 'footer.link-column',
          title: 'Company',
          links: [
            { __component: 'footer.link', label: 'About', url: '/about' },
            { __component: 'footer.link', label: 'Blog', url: '/blog' },
            { __component: 'footer.link', label: 'Contact', url: '/contact' },
          ],
        },
        {
          __component: 'footer.link-column',
          title: 'Legal',
          links: [
            { __component: 'footer.link', label: 'Privacy Policy', url: '/privacy' },
            { __component: 'footer.link', label: 'Terms of Service', url: '/terms' },
            { __component: 'footer.link', label: 'Cookie Policy', url: '/cookies' },
          ],
        },
      ],
      socialLinks: [
        {
          __component: 'footer.social-link',
          platform: 'Facebook',
          url: 'https://facebook.com/djbeatblaster',
          icon: 'facebook',
        },
        {
          __component: 'footer.social-link',
          platform: 'Twitter',
          url: 'https://twitter.com/djbeatblaster',
          icon: 'twitter',
        },
        {
          __component: 'footer.social-link',
          platform: 'Instagram',
          url: 'https://instagram.com/djbeatblaster',
          icon: 'instagram',
        },
        {
          __component: 'footer.social-link',
          platform: 'LinkedIn',
          url: 'https://linkedin.com/company/djbeatblaster',
          icon: 'linkedin',
        },
      ],
    };

    // Create using Document Service API for better component handling
    logger.info('Creating Footer...');
    const footer = await strapi.documents('api::footer.footer').create({
      data: footerData,
    });

    // Publish footer if created successfully
    if (footer && footer.documentId) {
      await strapi.documents('api::footer.footer').publish({
        documentId: footer.documentId,
      });
      logger.success(`Created and published Footer (id: ${footer.id})`);
    }

    logger.success('Successfully seeded Footer');
    return footer;
  } catch (error) {
    logger.error('Failed to seed Footer', error);
    throw error;
  }
}
