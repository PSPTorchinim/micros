/**
 * Seed Pages with Templates
 * Dependencies: Configuration, Templates, and all content types
 */

import { SeederLogger, createAndPublish, createComponent } from './utils/seeder-helpers';

type StrapiInstance = any;

export default async function seedPages({ strapi }: { strapi: StrapiInstance }) {
  const logger = new SeederLogger('Pages');
  
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info('Starting Page Seeding');
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Step 1: Get or create configuration
    logger.info('');
    logger.info('Step 1: Setting up configuration');
    logger.info('─────────────────────────────────────────────');
    
    let configuration = await strapi.db.query('api::configuration.configuration').findOne({
      where: { Title: 'DJ Beat Blaster Main Site' },
    });

    if (!configuration) {
      logger.info('Creating configuration...');
      configuration = await strapi.db.query('api::configuration.configuration').create({
        data: {
          Title: 'DJ Beat Blaster Main Site',
          publishedAt: new Date(),
        },
      });
      logger.success(`Created configuration (id: ${configuration.id})`);
    } else {
      logger.debug(`Configuration already exists (id: ${configuration.id})`);
    }

    // Link footer to configuration if not already linked
    const footer = await strapi.db.query('api::footer.footer').findMany({ limit: 1 });
    if (footer && footer.length > 0 && !footer[0].configuration) {
      logger.info('Linking footer to configuration...');
      await strapi.db.query('api::footer.footer').update({
        where: { id: footer[0].id },
        data: { configuration: configuration.id },
      });
      logger.success('Footer linked to configuration');
    }

    // Step 2: Fetch all required content for pages
    logger.info('');
    logger.info('Step 2: Fetching content blocks for pages');
    logger.info('─────────────────────────────────────────────');

    const heroBlock = await strapi.db.query('api::hero-block.hero-block').findOne({
      where: { heading: 'Welcome to DJ Beat Blaster' },
    });
    const featureSection = await strapi.db.query('api::feature-section.feature-section').findOne({
      where: { Title: 'DJ Platform Features' },
    });
    const articleBlock = await strapi.db.query('api::article-block.article-block').findOne({
      where: { Title: 'Latest DJ Tips & Guides' },
    });
    const stepsContainer = await strapi.db.query('api::steps-container.steps-container').findOne({
      where: { heading: 'Get Started in 3 Simple Steps' },
    });
    const contactSection = await strapi.db.query('api::contact-section.contact-section').findOne({
      where: { heading: 'Contact Our Team' },
    });

    if (heroBlock) logger.debug(`Found Hero Block (id: ${heroBlock.id})`);
    if (featureSection) logger.debug(`Found Feature Section (id: ${featureSection.id})`);
    if (articleBlock) logger.debug(`Found Article Block (id: ${articleBlock.id})`);
    if (stepsContainer) logger.debug(`Found Steps Container (id: ${stepsContainer.id})`);
    if (contactSection) logger.debug(`Found Contact Section (id: ${contactSection.id})`);

    // Step 3: Create Login Page with Template
    logger.info('');
    logger.info('Step 3: Creating Login Page');
    logger.info('─────────────────────────────────────────────');

    const loginPage = await createAndPublish(
      strapi,
      'api::page.page',
      'Slug',
      {
        Title: 'Login',
        Slug: '/users/login',
        Menu: 'Login',
        AuthState: 'OnlyUnauthenticated',
        NavigationOrder: 1,
        NavigationAction: 'Link',
        configuration: configuration.id,
      },
      logger,
      'Login Page'
    );

    // Create Login Template
    const loginTemplate = await createAndPublish(
      strapi,
      'api::template.template',
      'Name',
      {
        Name: 'Login Template',
        TemplateType: 'Login',
        Content: [], // Login page has no dynamic content components
        page: loginPage.id,
      },
      logger,
      'Login Template'
    );

    // Link template to page
    await strapi.db.query('api::page.page').update({
      where: { id: loginPage.id },
      data: { template: loginTemplate.id },
    });
    logger.success('Login page linked to template');

    // Step 4: Create Forgot Password Page with Template
    logger.info('');
    logger.info('Step 4: Creating Forgot Password Page');
    logger.info('─────────────────────────────────────────────');

    const forgotPasswordPage = await createAndPublish(
      strapi,
      'api::page.page',
      'Slug',
      {
        Title: 'Forgot Password',
        Slug: '/users/forgot-password',
        Menu: 'NotVisible',
        AuthState: 'OnlyUnauthenticated',
        NavigationOrder: 2,
        NavigationAction: 'Link',
        configuration: configuration.id,
      },
      logger,
      'Forgot Password Page'
    );

    const forgotPasswordTemplate = await createAndPublish(
      strapi,
      'api::template.template',
      'Name',
      {
        Name: 'Forgot Password Template',
        TemplateType: 'ForgotPassword',
        Content: [],
        page: forgotPasswordPage.id,
      },
      logger,
      'Forgot Password Template'
    );

    await strapi.db.query('api::page.page').update({
      where: { id: forgotPasswordPage.id },
      data: { template: forgotPasswordTemplate.id },
    });
    logger.success('Forgot Password page linked to template');

    // Step 5: Create Home Page with Template
    logger.info('');
    logger.info('Step 5: Creating Home Page');
    logger.info('─────────────────────────────────────────────');

    const homePage = await createAndPublish(
      strapi,
      'api::page.page',
      'Slug',
      {
        Title: 'Home',
        Slug: '/',
        Menu: 'Main',
        AuthState: 'All',
        NavigationOrder: 1,
        NavigationAction: 'Link',
        configuration: configuration.id,
      },
      logger,
      'Home Page'
    );

    // Build template content for home page with dynamic zone components
    const homeContent = [];
    if (heroBlock) {
      homeContent.push({
        __component: 'hero-block-ref.hero-block-ref',
        hero_block: heroBlock.id,
      });
      logger.debug('Added Hero Block to home template');
    }
    if (featureSection) {
      homeContent.push({
        __component: 'feature-section-ref.feature-section-ref',
        feature_section: featureSection.id,
      });
      logger.debug('Added Feature Section to home template');
    }
    if (articleBlock) {
      homeContent.push({
        __component: 'article-block-ref.article-block-ref',
        block: articleBlock.id,
      });
      logger.debug('Added Article Block to home template');
    }
    if (stepsContainer) {
      homeContent.push({
        __component: 'steps-container-ref.steps-container-ref',
        steps_container: stepsContainer.id,
      });
      logger.debug('Added Steps Container to home template');
    }

    // Create template using Document Service API for dynamic zone support
    logger.info('Creating Home Template...');
    try {
      // Check if template already exists
      const existingTemplate = await strapi.db.query('api::template.template').findOne({
        where: { Name: 'Home Template' },
      });

      let homeTemplate;
      if (existingTemplate) {
        logger.debug(`Home Template already exists (id: ${existingTemplate.id})`);
        homeTemplate = existingTemplate;
      } else {
        homeTemplate = await strapi.documents('api::template.template').create({
          data: {
            Name: 'Home Template',
            TemplateType: 'Standard',
            Content: homeContent,
            page: homePage.id,
          },
        });

        // Publish the template
        if (homeTemplate && homeTemplate.documentId) {
          await strapi.documents('api::template.template').publish({
            documentId: homeTemplate.documentId,
          });
          logger.success(`Created and published Home Template (id: ${homeTemplate.id}) with ${homeContent.length} content blocks`);
        }
      }

      // Link template to page
      await strapi.db.query('api::page.page').update({
        where: { id: homePage.id },
        data: { template: homeTemplate.id },
      });
      logger.success('Home page linked to template with content blocks');
    } catch (error: any) {
      logger.error('Failed to create Home Template with dynamic zones', error);
      logger.warn('Creating Home Template with empty content as fallback');
      
      // Fallback: create template without content
      const fallbackTemplate = await createAndPublish(
        strapi,
        'api::template.template',
        'Name',
        {
          Name: 'Home Template',
          TemplateType: 'Standard',
          Content: [],
          page: homePage.id,
        },
        logger,
        'Home Template (fallback)'
      );

      await strapi.db.query('api::page.page').update({
        where: { id: homePage.id },
        data: { template: fallbackTemplate.id },
      });
      logger.success('Home page linked to template (empty fallback)');
    }

    // Step 6: Create About Page with Template
    logger.info('');
    logger.info('Step 6: Creating About Page');
    logger.info('─────────────────────────────────────────────');

    const aboutPage = await createAndPublish(
      strapi,
      'api::page.page',
      'Slug',
      {
        Title: 'About',
        Slug: '/about',
        Menu: 'Main',
        AuthState: 'All',
        NavigationOrder: 2,
        NavigationAction: 'Link',
        configuration: configuration.id,
      },
      logger,
      'About Page'
    );

    // Build template content for about page with dynamic zone components
    const aboutContent = [];
    if (contactSection) {
      aboutContent.push({
        __component: 'contact-section-ref.contact-section-ref',
        contact_section: contactSection.id,
      });
      logger.debug('Added Contact Section to about template');
    }

    // Create template using Document Service API for dynamic zone support
    logger.info('Creating About Template...');
    try {
      // Check if template already exists
      const existingTemplate = await strapi.db.query('api::template.template').findOne({
        where: { Name: 'About Template' },
      });

      let aboutTemplate;
      if (existingTemplate) {
        logger.debug(`About Template already exists (id: ${existingTemplate.id})`);
        aboutTemplate = existingTemplate;
      } else {
        aboutTemplate = await strapi.documents('api::template.template').create({
          data: {
            Name: 'About Template',
            TemplateType: 'Standard',
            Content: aboutContent,
            page: aboutPage.id,
          },
        });

        // Publish the template
        if (aboutTemplate && aboutTemplate.documentId) {
          await strapi.documents('api::template.template').publish({
            documentId: aboutTemplate.documentId,
          });
          logger.success(`Created and published About Template (id: ${aboutTemplate.id}) with ${aboutContent.length} content blocks`);
        }
      }

      // Link template to page
      await strapi.db.query('api::page.page').update({
        where: { id: aboutPage.id },
        data: { template: aboutTemplate.id },
      });
      logger.success('About page linked to template with content blocks');
    } catch (error: any) {
      logger.error('Failed to create About Template with dynamic zones', error);
      logger.warn('Creating About Template with empty content as fallback');
      
      // Fallback: create template without content
      const fallbackTemplate = await createAndPublish(
        strapi,
        'api::template.template',
        'Name',
        {
          Name: 'About Template',
          TemplateType: 'Standard',
          Content: [],
          page: aboutPage.id,
        },
        logger,
        'About Template (fallback)'
      );

      await strapi.db.query('api::page.page').update({
        where: { id: aboutPage.id },
        data: { template: fallbackTemplate.id },
      });
      logger.success('About page linked to template (empty fallback)');
    }


    logger.info('');
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.success('All pages seeded successfully');
    logger.info('Pages created: Login, Forgot Password, Home, About');
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    logger.error('Page seeding failed', error);
    throw error;
  }
}
