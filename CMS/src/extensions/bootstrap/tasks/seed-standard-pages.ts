// Automatic seeder for standard pages (Login, Forgot Password)
// This seeder creates essential pages that should exist in all environments

const LOGIN_BLOCK_UID = 'api::login-block.login-block';
const FORGOT_PASSWORD_BLOCK_UID =
  'api::forgot-password-block.forgot-password-block';
const TEMPLATE_UID = 'api::template.template';
const PAGE_UID = 'api::page.page';
const CONFIG_UID = 'api::configuration.configuration';

function now() {
  return new Date().toISOString();
}

export default async function seedStandardPages({ strapi }: { strapi: any }) {
  strapi.log.info('[SEED][STANDARD_PAGES] Starting to seed standard pages...');

  // Get the first configuration or create one if none exists
  let configuration;
  try {
    const configurations = await strapi.entityService.findMany(CONFIG_UID, {
      limit: 1,
    });
    if (configurations && configurations.length > 0) {
      configuration = configurations[0];
    } else {
      // Create a default configuration if none exists
      configuration = await strapi.entityService.create(CONFIG_UID, {
        data: {
          Title: 'Default Configuration',
          description: 'Default configuration for standard pages',
          publishedAt: now(),
        },
      });
    }
  } catch (err: any) {
    strapi.log.warn(
      `[SEED][STANDARD_PAGES] Could not get/create configuration: ${err?.message ?? err}`,
    );
  }

  try {
    // 1. Create or update Login Block (single type)
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Login Block...');
    const loginBlockData = {
      title: 'Login',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      submitButtonText: 'Login',
      forgotPasswordText: 'Forgot your password?',
      resetPasswordLinkText: 'Reset Password',
      emailPlaceholder: 'Enter your email',
      passwordPlaceholder: 'Enter your password',
      customStyles: {},
      redirectPath: '/dashboard',
      forgotPasswordUrl: '/users/forgot-password',
    };

    let loginBlock;
    const existingLoginBlock = await strapi.db
      .query(LOGIN_BLOCK_UID)
      .findOne({});
    if (existingLoginBlock && existingLoginBlock.id) {
      loginBlock = await strapi.entityService.update(
        LOGIN_BLOCK_UID,
        existingLoginBlock.id,
        {
          data: loginBlockData,
        },
      );
      strapi.log.info('[SEED][STANDARD_PAGES] Login Block updated');
    } else {
      loginBlock = await strapi.entityService.create(LOGIN_BLOCK_UID, {
        data: loginBlockData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] Login Block created');
    }

    // 2. Create or update Forgot Password Block (single type)
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Forgot Password Block...');
    const forgotPasswordBlockData = {
      title: 'Forgot Password',
      description: 'Enter your email address to reset your password.',
      emailLabel: 'Email',
      submitButtonText: 'Send Reset Link',
      backToLoginText: 'Remembered your password?',
      loginLinkText: 'Login',
      emailPlaceholder: 'Enter your email',
      successRedirectPath: '/users/login',
      loginUrl: '/users/login',
      customStyles: {},
    };

    let forgotPasswordBlock;
    const existingForgotPasswordBlock = await strapi.db
      .query(FORGOT_PASSWORD_BLOCK_UID)
      .findOne({});
    if (existingForgotPasswordBlock && existingForgotPasswordBlock.id) {
      forgotPasswordBlock = await strapi.entityService.update(
        FORGOT_PASSWORD_BLOCK_UID,
        existingForgotPasswordBlock.id,
        {
          data: forgotPasswordBlockData,
        },
      );
      strapi.log.info('[SEED][STANDARD_PAGES] Forgot Password Block updated');
    } else {
      forgotPasswordBlock = await strapi.entityService.create(
        FORGOT_PASSWORD_BLOCK_UID,
        {
          data: forgotPasswordBlockData,
        },
      );
      strapi.log.info('[SEED][STANDARD_PAGES] Forgot Password Block created');
    }

    // 3. Create Login Template
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Login Template...');
    const loginTemplateData = {
      Name: 'Login Page Template',
      TemplateType: 'Login',
      Content: [],
      publishedAt: now(),
    };

    let loginTemplate;
    const existingLoginTemplate = await strapi.db.query(TEMPLATE_UID).findOne({
      where: { Name: 'Login Page Template' },
    });
    if (existingLoginTemplate && existingLoginTemplate.id) {
      loginTemplate = await strapi.entityService.update(
        TEMPLATE_UID,
        existingLoginTemplate.id,
        {
          data: loginTemplateData,
        },
      );
      strapi.log.info('[SEED][STANDARD_PAGES] Login Template updated');
    } else {
      loginTemplate = await strapi.entityService.create(TEMPLATE_UID, {
        data: loginTemplateData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] Login Template created');
    }

    // 4. Create Forgot Password Template
    strapi.log.info(
      '[SEED][STANDARD_PAGES] Creating Forgot Password Template...',
    );
    const forgotPasswordTemplateData = {
      Name: 'Forgot Password Page Template',
      TemplateType: 'ForgotPassword',
      Content: [],
      publishedAt: now(),
    };

    let forgotPasswordTemplate;
    const existingForgotPasswordTemplate = await strapi.db
      .query(TEMPLATE_UID)
      .findOne({
        where: { Name: 'Forgot Password Page Template' },
      });
    if (existingForgotPasswordTemplate && existingForgotPasswordTemplate.id) {
      forgotPasswordTemplate = await strapi.entityService.update(
        TEMPLATE_UID,
        existingForgotPasswordTemplate.id,
        {
          data: forgotPasswordTemplateData,
        },
      );
      strapi.log.info(
        '[SEED][STANDARD_PAGES] Forgot Password Template updated',
      );
    } else {
      forgotPasswordTemplate = await strapi.entityService.create(TEMPLATE_UID, {
        data: forgotPasswordTemplateData,
      });
      strapi.log.info(
        '[SEED][STANDARD_PAGES] Forgot Password Template created',
      );
    }

    // 5. Create Login Page
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Login Page...');
    const loginPageData = {
      Title: 'Login',
      Slug: '/users/login',
      Visible: true,
      Menu: 'Login',
      NavigationOrder: 1,
      NavigationAction: 'Link',
      configuration:
        configuration?.documentId || configuration?.id
          ? { connect: [configuration.documentId || configuration.id] }
          : undefined,
      template: loginTemplate?.documentId
        ? { connect: [loginTemplate.documentId] }
        : undefined,
      publishedAt: now(),
    };

    const existingLoginPage = await strapi.db.query(PAGE_UID).findOne({
      where: { Slug: '/users/login' },
    });
    if (existingLoginPage && existingLoginPage.id) {
      await strapi.entityService.update(PAGE_UID, existingLoginPage.id, {
        data: loginPageData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] Login Page updated');
    } else {
      await strapi.entityService.create(PAGE_UID, {
        data: loginPageData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] Login Page created');
    }

    // 6. Create Forgot Password Page
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Forgot Password Page...');
    const forgotPasswordPageData = {
      Title: 'Forgot Password',
      Slug: '/users/forgot-password',
      Visible: true,
      Menu: 'Login',
      NavigationOrder: 2,
      NavigationAction: 'Link',
      configuration:
        configuration?.documentId || configuration?.id
          ? { connect: [configuration.documentId || configuration.id] }
          : undefined,
      template: forgotPasswordTemplate?.documentId
        ? { connect: [forgotPasswordTemplate.documentId] }
        : undefined,
      publishedAt: now(),
    };

    const existingForgotPasswordPage = await strapi.db.query(PAGE_UID).findOne({
      where: { Slug: '/users/forgot-password' },
    });
    if (existingForgotPasswordPage && existingForgotPasswordPage.id) {
      await strapi.entityService.update(
        PAGE_UID,
        existingForgotPasswordPage.id,
        {
          data: forgotPasswordPageData,
        },
      );
      strapi.log.info('[SEED][STANDARD_PAGES] Forgot Password Page updated');
    } else {
      await strapi.entityService.create(PAGE_UID, {
        data: forgotPasswordPageData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] Forgot Password Page created');
    }

    strapi.log.info(
      '[SEED][STANDARD_PAGES] Successfully seeded all standard pages',
    );
  } catch (error: any) {
    strapi.log.error(
      `[SEED][STANDARD_PAGES] Error: ${error?.message ?? error}`,
    );
    if (error?.stack) {
      strapi.log.error(error.stack);
    }
    throw error;
  }
}
