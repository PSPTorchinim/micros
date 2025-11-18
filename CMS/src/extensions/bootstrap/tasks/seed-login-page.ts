// Seed Login page
import { toUrlSlug } from './utils/slugify';

const PAGE_UID = 'api::page.page';
const TEMPLATE_UID = 'api::template.template';
const LOGIN_BLOCK_UID = 'api::login-block.login-block';

export async function seedLoginPage(
  strapi: any,
  configId: number,
  parentPageId?: number,
) {
  console.info('[SEED][LOGIN] Seeding Login page...');

  const loginSlug = toUrlSlug('login');

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
    console.info(`[SEED][LOGIN] Created Login Block (ID: ${loginBlock.id})`);
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
    console.info(
      `[SEED][LOGIN] Created Login Template (ID: ${loginTemplate.id})`,
    );
  } else {
    loginTemplate = existingLoginTemplate;
    console.debug(
      `[SEED][LOGIN] Login Template already exists (ID: ${loginTemplate.id})`,
    );
  }

  // Create or update Login Page
  const existingLoginPage = await strapi.db.query(PAGE_UID).findOne({
    where: { Slug: loginSlug },
  });

  if (parentPageId) {
    // Log parent page data
    const parentPage = await strapi.db.query(PAGE_UID).findOne({ where: { id: parentPageId } });
    if (parentPage) {
      console.info(`[SEED][LOGIN][PARENT] Will set parent: ID=${parentPageId}, Data=${JSON.stringify(parentPage)}`);
    } else {
      console.warn(`[SEED][LOGIN][PARENT] Skipping non-existent parent page ID: ${parentPageId}`);
    }
  }
  let loginPageId;
  if (!existingLoginPage) {
    const loginPage = await strapi.entityService.create(PAGE_UID, {
      data: {
        Title: 'Login',
        Slug: loginSlug,
        Menu: 'Login',
        AuthState: 'OnlyUnauthenticated',
        configuration: configId,
        template: loginTemplate.id,
        Parents: parentPageId ? [parentPageId] : undefined,
        publishedAt: new Date().toISOString(),
      },
    });
    loginPageId = loginPage.id;
    console.info(
      `[SEED][LOGIN] Created Login Page (ID: ${loginPage.id}, Slug: /${loginSlug})`,
    );
  } else {
    await strapi.entityService.update(PAGE_UID, existingLoginPage.id, {
      data: {
        Title: 'Login',
        Menu: 'Login',
        AuthState: 'OnlyUnauthenticated',
        template: loginTemplate.id,
        configuration: configId,
        Parents: parentPageId ? [parentPageId] : undefined,
      },
    });
    loginPageId = existingLoginPage.id;
    console.info(
      `[SEED][LOGIN] Updated existing Login Page (ID: ${existingLoginPage.id})`,
    );
  }

  // Ensure parent page's subpages includes this login page
  if (parentPageId && loginPageId) {
    const parentPage = await strapi.entityService.findOne(PAGE_UID, parentPageId, { populate: ['subpages'] });
    const subpages = (parentPage.subpages || []).map((sp: any) => sp.id);
    if (!subpages.includes(loginPageId)) {
      await strapi.entityService.update(PAGE_UID, parentPageId, {
        data: { subpages: [...subpages, loginPageId] },
      });
      console.info(`[SEED][LOGIN] Added Login Page (ID: ${loginPageId}) to parent page's subpages.`);
    }
  }
}
