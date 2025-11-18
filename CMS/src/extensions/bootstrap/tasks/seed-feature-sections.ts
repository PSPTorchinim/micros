// Seed Feature Sections

const FEATURE_SECTION_UID = 'api::feature-section.feature-section';
const FEATURE_TAB_UID = 'api::feature-tab.feature-tab';

export async function seedFeatureSections(strapi: any) {
  console.info('[SEED][FEATURE_SECTIONS] Seeding Feature Sections...');

  // Create or update feature tabs
  const featureTabsData = [
    {
      title: 'Music Library Management',
      description:
        'Organize your tracks, create playlists, and manage your entire music collection with powerful search and filtering.',
      imgSrc: '/icons/music-library.svg',
      imgAlt: 'Music Library Icon',
    },
    {
      title: 'Event & Gig Scheduling',
      description:
        'Keep track of all your bookings, parties, and events in one centralized calendar with automated reminders.',
      imgSrc: '/icons/calendar.svg',
      imgAlt: 'Calendar Icon',
    },
    {
      title: 'Client Management',
      description:
        'Maintain detailed client profiles, track preferences, and build lasting relationships with your customers.',
      imgSrc: '/icons/clients.svg',
      imgAlt: 'Clients Icon',
    },
    {
      title: 'Equipment Tracking',
      description:
        'Inventory your DJ gear, track maintenance schedules, and manage equipment assignments for events.',
      imgSrc: '/icons/equipment.svg',
      imgAlt: 'Equipment Icon',
    },
    {
      title: 'Contract & Document Management',
      description:
        'Generate professional contracts, invoices, and proposals with customizable templates.',
      imgSrc: '/icons/documents.svg',
      imgAlt: 'Documents Icon',
    },
    {
      title: 'Email Marketing',
      description:
        'Send campaigns, newsletters, and promotional emails to grow your DJ business.',
      imgSrc: '/icons/email.svg',
      imgAlt: 'Email Icon',
    },
  ];

  const featureTabIds = [];
  for (const tabData of featureTabsData) {
    const existing = await strapi.db.query(FEATURE_TAB_UID).findOne({
      where: { title: tabData.title },
    });

    if (!existing) {
      const tab = await strapi.entityService.create(FEATURE_TAB_UID, {
        data: tabData,
      });
      featureTabIds.push(tab.id);
      console.info(
        `[SEED][FEATURE_SECTIONS] Created Feature Tab: ${tabData.title} (ID: ${tab.id})`,
      );
    } else {
      featureTabIds.push(existing.id);
      console.debug(
        `[SEED][FEATURE_SECTIONS] Feature Tab "${tabData.title}" already exists (ID: ${existing.id})`,
      );
    }
  }

  // Main Feature Section for Home Page
  const existingFeatures = await strapi.db.query(FEATURE_SECTION_UID).findMany({
    limit: 1,
  });

  if (existingFeatures.length === 0) {
    const featureSection = await strapi.entityService.create(
      FEATURE_SECTION_UID,
      {
        data: {
          Title: 'Everything You Need to Manage Your DJ Business',
          reversed: false,
          tabs: featureTabIds,
        },
      },
    );
    console.info(
      `[SEED][FEATURE_SECTIONS] Created Feature Section (ID: ${featureSection.id})`,
    );
  } else {
    // Update existing feature section
    await strapi.entityService.update(
      FEATURE_SECTION_UID,
      existingFeatures[0].id,
      {
        data: {
          Title: 'Everything You Need to Manage Your DJ Business',
          reversed: false,
          tabs: featureTabIds,
        },
      },
    );
    console.info(
      `[SEED][FEATURE_SECTIONS] Updated Feature Section (ID: ${existingFeatures[0].id})`,
    );
  }
}
