// Seed Steps Containers

const STEPS_CONTAINER_UID = 'api::steps-container.steps-container';
const CTA_UID = 'api::cta.cta';

export async function seedStepsContainers(strapi: any) {
  strapi.log.info('[SEED][STEPS_CONTAINERS] Seeding Steps Containers...');

  // Only seed if there are no steps containers in the database
  const count = await strapi.db.query(STEPS_CONTAINER_UID).count();
  if (count > 0) {
    strapi.log.info(
      '[SEED][STEPS_CONTAINERS] Skipping: steps containers already exist.',
    );
    return;
  }

  // Main Steps Container for Home Page
  const step1Cta = await strapi.entityService.create(CTA_UID, {
    data: {
      text: 'Create Account',
      href: '/users/register',
      variant: 'primary',
      publishedAt: new Date().toISOString(),
    },
  });

  const stepsContainer = await strapi.entityService.create(
    STEPS_CONTAINER_UID,
    {
      data: {
        heading: 'Get Started in 3 Simple Steps',
        content:
          'Join thousands of DJs already using DJ Beat Blaster to manage their business',
        action: [
          {
            __component: 'cta-ref.cta-ref',
            cta: step1Cta.id,
          },
        ],
        steps: [],
        publishedAt: new Date().toISOString(),
      },
    },
  );
  strapi.log.info(
    `[SEED][STEPS_CONTAINERS] Created Steps Container (ID: ${stepsContainer.id})`,
  );
}
