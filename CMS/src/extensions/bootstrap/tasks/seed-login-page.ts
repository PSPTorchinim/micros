
// Seed Login page
import { toUrlSlug } from './utils/slugify';

const PAGE_UID = 'api::page.page';
const TEMPLATE_UID = 'api::template.template';
const LOGIN_BLOCK_UID = 'api::login-block.login-block';

export async function seedLoginPage(strapi: any, configId: number) {
  strapi.log.info('[SEED][LOGIN] Seeding Login page...');

  // Only seed if there are no login pages in the database
  const loginSlug = toUrlSlug('users/login');
  const count = await strapi.db.query(PAGE_UID).count({ where: { Slug: loginSlug } });
  if (count > 0) {
    strapi.log.info('[SEED][LOGIN] Skipping: login page already exists.');
    return;
  }

  // Create or get Login Block
  let loginBlock = await strapi.db.query(LOGIN_BLOCK_UID).findOne({});
  if (!loginBlock) {
    loginBlock = await strapi.entityService.create(LOGIN_BLOCK_UID, {
      data: {
        title: 'Welcome Back, DJ!',
        emailLabel: 'Email Address',
        passwordLabel: 'Password',
        submitButtonText: 'Login to Dashboard',
        forgotPasswordText: 'Forgot your password?',
        resetPasswordLinkText: 'Reset it here',
        emailPlaceholder: 'Enter your email',
        passwordPlaceholder: 'Enter your password',
        redirectPath: '/dashboard',
        forgotPasswordUrl: '/users/forgot-password',
        customStyles: {},
      },
    });
    strapi.log.info(`[SEED][LOGIN] Created Login Block (ID: ${loginBlock.id})`);
  }

  // Create Login Template
  const existingLoginTemplate = await strapi.db.query(TEMPLATE_UID).findOne({
    where: { TemplateType: 'Login' },
  });

  let loginTemplate;
  if (!existingLoginTemplate) {
    loginTemplate = await strapi.entityService.create(TEMPLATE_UID, {
      data: {
        Name: 'Login Page Template',
        TemplateType: 'Login',
        Content: [],
        publishedAt: new Date().toISOString(),
      },
    });
    strapi.log.info(
      `[SEED][LOGIN] Created Login Template (ID: ${loginTemplate.id})`,
    );
  } else {
    loginTemplate = existingLoginTemplate;
    strapi.log.debug(
      `[SEED][LOGIN] Login Template already exists (ID: ${loginTemplate.id})`,
    );
  }

  // Create or update Login Page
  const existingLoginPage = await strapi.db.query(PAGE_UID).findOne({
    where: { Slug: loginSlug },
  });

  if (!existingLoginPage) {
    const loginPage = await strapi.entityService.create(PAGE_UID, {
      data: {
        Title: 'Login',
        Slug: loginSlug,
        Visible: true,
        configuration: configId,
        template: loginTemplate.id,
        publishedAt: new Date().toISOString(),
      },
    });
    strapi.log.info(
      `[SEED][LOGIN] Created Login Page (ID: ${loginPage.id}, Slug: /${loginSlug})`,
    );
  } else {
    await strapi.entityService.update(PAGE_UID, existingLoginPage.id, {
      data: {
        Title: 'Login',
        template: loginTemplate.id,
        configuration: configId,
      },
    });
    strapi.log.info(
      `[SEED][LOGIN] Updated existing Login Page (ID: ${existingLoginPage.id})`,
    );
  }
}
