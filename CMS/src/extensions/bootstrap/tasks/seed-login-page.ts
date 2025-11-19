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

  // Create or update Login Page WITHOUT relations (template, Parents)
  const existingLoginPage = await strapi.db.query(PAGE_UID).findOne({
    where: { Slug: loginSlug },
  });

  let loginPageId;
  const loginPageData = {
    Title: 'Login',
    Slug: loginSlug,
    Menu: 'Login',
    AuthState: 'OnlyUnauthenticated',
    configuration: configId,
    publishedAt: new Date().toISOString(),
  };

  if (!existingLoginPage) {
    const loginPage = await strapi.entityService.create(PAGE_UID, {
      data: loginPageData,
    });
    loginPageId = loginPage.id;
    console.info(
      `[SEED][LOGIN] Created Login Page (ID: ${loginPage.id}, Slug: /${loginSlug})`,
    );
  } else {
    loginPageId = existingLoginPage.id;
    console.info(
      `[SEED][LOGIN] Updated existing Login Page (ID: ${existingLoginPage.id})`,
    );
  }

  // ============================================================================
  // PHASE 2: Establish relations
  // ============================================================================
  console.info('[SEED][LOGIN] 🔗 PHASE 2: Establishing relations');

  // Set template and Parents relations
  try {
    await strapi.db.query(PAGE_UID).update({
      where: { id: loginPageId },
      data: {
        template: loginTemplate.id,
        Parents: parentPageId ? [parentPageId] : [],
      },
    });
    console.info(
      `[SEED][LOGIN] ✓ Connected Page ${loginPageId} to Template ${loginTemplate.id}`,
    );
    if (parentPageId) {
      console.info(`[SEED][LOGIN] ✓ Set parent page: ${parentPageId}`);
    }
  } catch (error: any) {
    console.error('[SEED][LOGIN] ❌ Failed to set relations:', error.message);
  }

  // Ensure parent page's subpages includes this login page
  if (parentPageId && loginPageId) {
    const parentPage = await strapi.entityService.findOne(
      PAGE_UID,
      parentPageId,
      { populate: ['subpages'] },
    );
    const subpages = (parentPage.subpages || []).map((sp: any) => sp.id);
    if (!subpages.includes(loginPageId)) {
      await strapi.entityService.update(PAGE_UID, parentPageId, {
        data: { subpages: [...subpages, loginPageId] },
      });
      console.info(
        `[SEED][LOGIN] Added Login Page (ID: ${loginPageId}) to parent page's subpages.`,
      );
    }
  }
}
