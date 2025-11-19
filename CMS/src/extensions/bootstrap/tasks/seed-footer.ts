/**
 * Seed Footer (Single Type)
 * Dependencies: Configuration (will be linked when configuration is created)
 */

import { SeederLogger, getOrCreateSingleType, publishEntity } from './utils/seeder-helpers';

type StrapiInstance = any;

export default async function seedFooter({ strapi }: { strapi: StrapiInstance }) {
  const logger = new SeederLogger('Footer');
  logger.info('Starting Footer seeding...');

  try {
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

    const footer = await getOrCreateSingleType(
      strapi,
      'api::footer.footer',
      footerData,
      logger,
      'Footer'
    );

    // Publish footer if not already published
    if (!footer.publishedAt) {
      await publishEntity(strapi, 'api::footer.footer', footer.id, logger, 'Footer');
    }

    logger.success('Successfully seeded Footer');
    return footer;
  } catch (error) {
    logger.error('Failed to seed Footer', error);
    throw error;
  }
}
