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

  // Create or update Forgot Password Page WITHOUT template relation
  const existingForgotPage = await strapi.db.query(PAGE_UID).findOne({
    where: { Slug: forgotSlug },
  });

  let forgotPageId;
  const forgotPageData = {
    Title: 'Forgot Password',
    Slug: forgotSlug,
    Menu: 'NotVisible',
    configuration: configId,
    publishedAt: new Date().toISOString(),
  };

  if (!existingForgotPage) {
    const forgotPage = await strapi.entityService.create(PAGE_UID, {
      data: forgotPageData,
    });
    forgotPageId = forgotPage.id;
    console.info(
      `[SEED][FORGOT_PASSWORD] Created Forgot Password Page (ID: ${forgotPage.id}, Slug: /${forgotSlug})`,
    );
  } else {
    forgotPageId = existingForgotPage.id;
    console.info(
      `[SEED][FORGOT_PASSWORD] Updated existing Forgot Password Page (ID: ${existingForgotPage.id})`,
    );
  }

  // ============================================================================
  // PHASE 2: Establish relations
  // ============================================================================
  console.info('[SEED][FORGOT_PASSWORD] 🔗 PHASE 2: Establishing relations');

  // Set template relation first using entityService
  try {
    await strapi.entityService.update(PAGE_UID, forgotPageId, {
      data: {
        template: forgotTemplate.id,
        publishedAt: new Date().toISOString(), // Maintain published status
      },
    });
    console.info(
      `[SEED][FORGOT_PASSWORD] ✓ Connected Page ${forgotPageId} to Template ${forgotTemplate.id}`,
    );
  } catch (error: any) {
    console.error(
      '[SEED][FORGOT_PASSWORD] ❌ Failed to set template:',
      error.message,
    );
  }

  // Set parent-child relationships separately if parent exists
  if (parentPageId && forgotPageId) {
    // First verify parent exists
    const parentPage = await strapi.entityService.findOne(
      PAGE_UID,
      parentPageId,
      { populate: ['subpages'] },
    );

    if (parentPage) {
      // Set Parents on forgot password page
      try {
        await strapi.entityService.update(PAGE_UID, forgotPageId, {
          data: {
            Parents: [parentPageId],
            publishedAt: new Date().toISOString(),
          },
        });
        console.info(
          `[SEED][FORGOT_PASSWORD] ✓ Set parent page: ${parentPageId}`,
        );
      } catch (error: any) {
        console.error(
          '[SEED][FORGOT_PASSWORD] ❌ Failed to set Parents:',
          error.message,
        );
      }

      // Add to parent's subpages
      if (Array.isArray(parentPage.subpages)) {
        const subpages = parentPage.subpages.map((sp: any) => sp.id);
        if (!subpages.includes(forgotPageId)) {
          try {
            await strapi.entityService.update(PAGE_UID, parentPageId, {
              data: { subpages: [...subpages, forgotPageId] },
            });
            console.info(
              `[SEED][FORGOT_PASSWORD] ✓ Added Forgot Password Page (ID: ${forgotPageId}) to parent page's subpages.`,
            );
          } catch (error: any) {
            console.error(
              '[SEED][FORGOT_PASSWORD] ❌ Failed to update parent subpages:',
              error.message,
            );
          }
        }
      }
    } else {
      console.warn(
        `[SEED][FORGOT_PASSWORD] ⚠️  Parent page ${parentPageId} not found, skipping parent-child relations`,
      );
    }
  }
}
