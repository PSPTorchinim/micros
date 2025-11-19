/**
 * Seed Forgot Password Block (Single Type)
 * No dependencies on other content types
 */

import { SeederLogger, getOrCreateSingleType } from './utils/seeder-helpers';

type StrapiInstance = any;

export default async function seedForgotPasswordBlock({ strapi }: { strapi: StrapiInstance }) {
  const logger = new SeederLogger('ForgotPasswordBlock');
  logger.info('Starting Forgot Password Block seeding...');

  try {
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

    const forgotPasswordBlock = await getOrCreateSingleType(
      strapi,
      'api::forgot-password-block.forgot-password-block',
      forgotPasswordBlockData,
      logger,
      'Forgot Password Block'
    );

    logger.success('Successfully seeded Forgot Password Block');
    return forgotPasswordBlock;
  } catch (error) {
    logger.error('Failed to seed Forgot Password Block', error);
    throw error;
  }
}
