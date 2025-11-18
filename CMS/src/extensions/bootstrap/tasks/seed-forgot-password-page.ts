// Seed Forgot Password page
import { toUrlSlug } from './utils/slugify';

const PAGE_UID = 'api::page.page';
const TEMPLATE_UID = 'api::template.template';
const FORGOT_PASSWORD_BLOCK_UID =
  'api::forgot-password-block.forgot-password-block';

export async function seedForgotPasswordPage(
  strapi: any,
  configId: number,
  parentPageId?: number,
) {
  console.info('[SEED][FORGOT_PASSWORD] Seeding Forgot Password page...');

  const forgotSlug = toUrlSlug('forgot-password');

  // Create or get Forgot Password Block
  let forgotPasswordBlock = await strapi.db
    .query(FORGOT_PASSWORD_BLOCK_UID)
    .findOne({});
  if (!forgotPasswordBlock) {
    forgotPasswordBlock = await strapi.entityService.create(
      FORGOT_PASSWORD_BLOCK_UID,
      {
        data: {
          title: 'Reset Your Password',
          description:
            "Enter your email address and we'll send you a link to reset your password.",
          emailLabel: 'Email Address',
          submitButtonText: 'Send Reset Link',
          backToLoginText: 'Remembered your password?',
          loginLinkText: 'Back to Login',
          emailPlaceholder: 'Enter your email',
          successRedirectPath: '/users/login',
          loginUrl: '/users/login',
          customStyles: {},
        },
      },
    );
    console.info(
      `[SEED][FORGOT_PASSWORD] Created Forgot Password Block (ID: ${forgotPasswordBlock.id})`,
    );
  }

  // Create Forgot Password Template
  const existingForgotTemplate = await strapi.db.query(TEMPLATE_UID).findOne({
    where: { TemplateType: 'ForgotPassword' },
  });

  let forgotTemplate;
  if (!existingForgotTemplate) {
    forgotTemplate = await strapi.entityService.create(TEMPLATE_UID, {
      data: {
        Name: 'Forgot Password Template',
        TemplateType: 'ForgotPassword',
        Content: [],
        publishedAt: new Date().toISOString(),
      },
    });
    console.info(
      `[SEED][FORGOT_PASSWORD] Created Forgot Password Template (ID: ${forgotTemplate.id})`,
    );
  } else {
    forgotTemplate = existingForgotTemplate;
    console.debug(
      `[SEED][FORGOT_PASSWORD] Forgot Password Template already exists (ID: ${forgotTemplate.id})`,
    );
  }

  // Create or update Forgot Password Page
  const existingForgotPage = await strapi.db.query(PAGE_UID).findOne({
    where: { Slug: forgotSlug },
  });

  let parentExists = false;
  if (parentPageId) {
    // Log parent page data
    const parentPage = await strapi.db.query(PAGE_UID).findOne({ where: { id: parentPageId } });
    if (parentPage) {
      parentExists = true;
      console.info(`[SEED][FORGOT_PASSWORD][PARENT] Will set parent: ID=${parentPageId}, Data=${JSON.stringify(parentPage)}`);
    } else {
      console.warn(`[SEED][FORGOT_PASSWORD][PARENT] Skipping non-existent parent page ID: ${parentPageId}`);
    }
  }
  let forgotPageId;
  if (!existingForgotPage) {
    const forgotPage = await strapi.entityService.create(PAGE_UID, {
      data: {
        Title: 'Forgot Password',
        Slug: forgotSlug,
        Menu: 'NotVisible',
        configuration: configId,
        template: forgotTemplate.id,
        Parents: parentExists ? [parentPageId] : undefined,
        publishedAt: new Date().toISOString(),
      },
    });
    forgotPageId = forgotPage.id;
    console.info(
      `[SEED][FORGOT_PASSWORD] Created Forgot Password Page (ID: ${forgotPage.id}, Slug: /${forgotSlug})`,
    );
  } else {
    await strapi.entityService.update(PAGE_UID, existingForgotPage.id, {
      data: {
        Title: 'Forgot Password',
        template: forgotTemplate.id,
        configuration: configId,
        Parents: parentExists ? [parentPageId] : undefined,
      },
    });
    forgotPageId = existingForgotPage.id;
    console.info(
      `[SEED][FORGOT_PASSWORD] Updated existing Forgot Password Page (ID: ${existingForgotPage.id})`,
    );
  }

  // Ensure parent page's subpages includes this forgot password page
  if (parentPageId && forgotPageId) {
    const parentPage = await strapi.entityService.findOne(PAGE_UID, parentPageId, { populate: ['subpages'] });
    if (parentPage && Array.isArray(parentPage.subpages)) {
      const subpages = parentPage.subpages.map((sp: any) => sp.id);
      if (!subpages.includes(forgotPageId)) {
        await strapi.entityService.update(PAGE_UID, parentPageId, {
          data: { subpages: [...subpages, forgotPageId] },
        });
        console.info(`[SEED][FORGOT_PASSWORD] Added Forgot Password Page (ID: ${forgotPageId}) to parent page's subpages.`);
      }
    } else {
      console.warn(`[SEED][FORGOT_PASSWORD] Skipping subpages update: parent page does not exist or has no subpages array.`);
    }
  }
}
