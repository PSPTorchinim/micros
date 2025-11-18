// Seed Steps Containers

const STEPS_CONTAINER_UID = 'api::steps-container.steps-container';
const CTA_UID = 'api::cta.cta';

export async function seedStepsContainers(strapi: any) {
  console.info('[SEED][STEPS_CONTAINERS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.info('[SEED][STEPS_CONTAINERS] 🪜  Starting Steps Containers seeding...');
  console.info('[SEED][STEPS_CONTAINERS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Check if steps container already exists
  console.info('[SEED][STEPS_CONTAINERS] 🔍 Checking for existing steps container...');
  const existingSteps = await strapi.db.query(STEPS_CONTAINER_UID).findOne({
    where: { heading: 'Get Started in 3 Simple Steps' },
  });

  if (existingSteps) {
    console.info(`[SEED][STEPS_CONTAINERS] ✓ Found existing steps container (ID: ${existingSteps.id})`);
    console.info('[SEED][STEPS_CONTAINERS] 🔄 Updating existing steps container...');
    
    // Find or create CTA
    console.info('[SEED][STEPS_CONTAINERS] 🔍 Looking for "Create Account" CTA...');
    let actionCta = await strapi.db.query(CTA_UID).findOne({
      where: { Label: 'Create Account' },
    });
    if (!actionCta) {
      console.info('[SEED][STEPS_CONTAINERS] ➕ Creating "Create Account" CTA...');
      actionCta = await strapi.entityService.create(CTA_UID, {
        data: {
          Label: 'Create Account',
          url: '/users/register',
          OpenInNewTab: false,
          publishedAt: new Date().toISOString(),
        },
      });
      console.info(`[SEED][STEPS_CONTAINERS] ✓ Created CTA (ID: ${actionCta.id})`);
    } else {
      console.info(`[SEED][STEPS_CONTAINERS] ✓ Found existing CTA (ID: ${actionCta.id})`);
    }

    // Update steps container with CTA and proper steps
    console.info('[SEED][STEPS_CONTAINERS] 🔄 Updating steps container with action and steps...');
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
    
    // Verify update
    const verified = await strapi.entityService.findOne(STEPS_CONTAINER_UID, existingSteps.id, {
      populate: { action: true, steps: true },
    });
    
    console.info(`[SEED][STEPS_CONTAINERS] ✅ Updated Steps Container (ID: ${existingSteps.id})`);
    console.info(`[SEED][STEPS_CONTAINERS] ✅ Heading: "${verified.heading}"`);
    console.info(`[SEED][STEPS_CONTAINERS] ✅ Action attached: ${verified.action ? `"${verified.action.Label}"` : 'None'}`);
    console.info(`[SEED][STEPS_CONTAINERS] ✅ Steps count: ${verified.steps?.length || 0}`);
    verified.steps?.forEach((step: any, index: number) => {
      console.info(`[SEED][STEPS_CONTAINERS]    ${index + 1}. ${step.title} (icon: ${step.icon})`);
    });
    console.info('[SEED][STEPS_CONTAINERS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return;
  }

  // Create CTA for action
  console.info('[SEED][STEPS_CONTAINERS] ➕ Creating new steps container...');
  console.info('[SEED][STEPS_CONTAINERS] 🔨 Creating "Create Account" CTA...');
  const actionCta = await strapi.entityService.create(CTA_UID, {
    data: {
      Label: 'Create Account',
      url: '/users/register',
      OpenInNewTab: false,
      publishedAt: new Date().toISOString(),
    },
  });
  console.info(`[SEED][STEPS_CONTAINERS] ✓ Created CTA (ID: ${actionCta.id})`);

  // Main Steps Container for Home Page
  console.info('[SEED][STEPS_CONTAINERS] 🔨 Creating steps container with 3 steps...');
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
  
  // Verify creation
  const verified = await strapi.entityService.findOne(STEPS_CONTAINER_UID, stepsContainer.id, {
    populate: { action: true, steps: true },
  });
  
  console.info(`[SEED][STEPS_CONTAINERS] ✅ Created Steps Container (ID: ${stepsContainer.id})`);
  console.info(`[SEED][STEPS_CONTAINERS] ✅ Heading: "${verified.heading}"`);
  if (verified.action) {
    console.info(`[SEED][STEPS_CONTAINERS] ✅ Action attached: "${verified.action.Label}" → ${verified.action.url}`);
  } else {
    console.info(`[SEED][STEPS_CONTAINERS] ✅ Action attached: None`);
  }
  console.info(`[SEED][STEPS_CONTAINERS] ✅ Steps count: ${verified.steps?.length || 0}`);
  verified.steps?.forEach((step: any, index: number) => {
    console.info(`[SEED][STEPS_CONTAINERS]    ${index + 1}. "${step.title}" (icon: ${step.icon})`);
    console.info(`[SEED][STEPS_CONTAINERS]       ${step.description}`);
  });
  console.info(`[SEED][STEPS_CONTAINERS] ✅ Published: ${stepsContainer.publishedAt ? 'Yes' : 'No'}`);
  console.info('[SEED][STEPS_CONTAINERS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
