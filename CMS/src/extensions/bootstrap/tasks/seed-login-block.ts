/**
 * Seed Login Block (Single Type)
 * No dependencies on other content types
 */

import { SeederLogger, getOrCreateSingleType } from './utils/seeder-helpers';

type StrapiInstance = any;

export default async function seedLoginBlock({ strapi }: { strapi: StrapiInstance }) {
  const logger = new SeederLogger('LoginBlock');
  logger.info('Starting Login Block seeding...');

  try {
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

    const loginBlock = await getOrCreateSingleType(
      strapi,
      'api::login-block.login-block',
      loginBlockData,
      logger,
      'Login Block'
    );

    logger.success('Successfully seeded Login Block');
    return loginBlock;
  } catch (error) {
    logger.error('Failed to seed Login Block', error);
    throw error;
  }
}
