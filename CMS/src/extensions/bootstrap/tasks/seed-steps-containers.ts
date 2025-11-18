// Seed Steps Containers

const STEPS_CONTAINER_UID = 'api::steps-container.steps-container';
const CTA_UID = 'api::cta.cta';

export async function seedStepsContainers(strapi: any) {
  strapi.log.info('[SEED][STEPS_CONTAINERS] Seeding Steps Containers...');

  // Check if steps container already exists
  const existingSteps = await strapi.db.query(STEPS_CONTAINER_UID).findOne({
    where: { heading: 'Get Started in 3 Simple Steps' },
  });

  if (existingSteps) {
    strapi.log.info('[SEED][STEPS_CONTAINERS] Steps container exists, updating...');
    
    // Find or create CTA
    let step1Cta = await strapi.db.query(CTA_UID).findOne({
      where: { text: 'Create Account' },
    });
    if (!step1Cta) {
      step1Cta = await strapi.entityService.create(CTA_UID, {
        data: {
          text: 'Create Account',
          href: '/users/register',
          variant: 'primary',
          publishedAt: new Date().toISOString(),
        },
      });
    }

    // Update steps container with CTA
    await strapi.entityService.update(STEPS_CONTAINER_UID, existingSteps.id, {
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
      },
    });
    strapi.log.info(
      `[SEED][STEPS_CONTAINERS] Updated Steps Container (ID: ${existingSteps.id})`,
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
