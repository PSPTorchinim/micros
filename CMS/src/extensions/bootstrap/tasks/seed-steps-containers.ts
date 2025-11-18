// Seed Steps Containers

const STEPS_CONTAINER_UID = 'api::steps-container.steps-container';
const CTA_UID = 'api::cta.cta';

export async function seedStepsContainers(strapi: any) {
  console.info('[SEED][STEPS_CONTAINERS] Seeding Steps Containers...');

  // Check if steps container already exists
  const existingSteps = await strapi.db.query(STEPS_CONTAINER_UID).findOne({
    where: { heading: 'Get Started in 3 Simple Steps' },
  });

  if (existingSteps) {
    console.info('[SEED][STEPS_CONTAINERS] Steps container exists, updating...');
    
    // Find or create CTA
    let actionCta = await strapi.db.query(CTA_UID).findOne({
      where: { Label: 'Create Account' },
    });
    if (!actionCta) {
      actionCta = await strapi.entityService.create(CTA_UID, {
        data: {
          Label: 'Create Account',
          url: '/users/register',
          OpenInNewTab: false,
          publishedAt: new Date().toISOString(),
        },
      });
    }

    // Update steps container with CTA and proper steps
    await strapi.entityService.update(STEPS_CONTAINER_UID, existingSteps.id, {
      data: {
        heading: 'Get Started in 3 Simple Steps',
        content:
          'Join thousands of DJs already using DJ Beat Blaster to manage their business',
        action: actionCta.id,
        steps: [
          {
            title: 'Sign Up',
            description: 'Create your free account in under 60 seconds',
            icon: 'user-plus',
          },
          {
            title: 'Set Up Your Profile',
            description: 'Add your services, equipment, and availability',
            icon: 'settings',
          },
          {
            title: 'Start Managing',
            description: 'Book gigs, manage clients, and grow your business',
            icon: 'calendar-check',
          },
        ],
      },
    });
    console.info(
      `[SEED][STEPS_CONTAINERS] Updated Steps Container (ID: ${existingSteps.id})`,
    );
    return;
  }

  // Create CTA for action
  const actionCta = await strapi.entityService.create(CTA_UID, {
    data: {
      Label: 'Create Account',
      url: '/users/register',
      OpenInNewTab: false,
      publishedAt: new Date().toISOString(),
    },
  });

  // Main Steps Container for Home Page
  const stepsContainer = await strapi.entityService.create(
    STEPS_CONTAINER_UID,
    {
      data: {
        heading: 'Get Started in 3 Simple Steps',
        content:
          'Join thousands of DJs already using DJ Beat Blaster to manage their business',
        action: actionCta.id,
        steps: [
          {
            title: 'Sign Up',
            description: 'Create your free account in under 60 seconds',
            icon: 'user-plus',
          },
          {
            title: 'Set Up Your Profile',
            description: 'Add your services, equipment, and availability',
            icon: 'settings',
          },
          {
            title: 'Start Managing',
            description: 'Book gigs, manage clients, and grow your business',
            icon: 'calendar-check',
          },
        ],
        publishedAt: new Date().toISOString(),
      },
    },
  );
  console.info(
    `[SEED][STEPS_CONTAINERS] Created Steps Container (ID: ${stepsContainer.id})`,
  );
}
