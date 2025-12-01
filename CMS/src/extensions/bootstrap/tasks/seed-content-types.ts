// CMS/src/extensions/bootstrap/tasks/seed-content-types.ts
// Seeds content types with DJ-oriented example data on first run

type StrapiAny = any;

// ============================================================================
// CTA (Call to Action) - 5 DJ-oriented examples
// ============================================================================
const CTA_SEEDS = [
  {
    Label: 'Book DJ Torchinim',
    url: '/booking',
    OpenInNewTab: false,
  },
  {
    Label: 'View Upcoming Events',
    url: '/events',
    OpenInNewTab: false,
  },
  {
    Label: 'Listen on SoundCloud',
    url: 'https://soundcloud.com/dj-torchinim',
    OpenInNewTab: true,
  },
  {
    Label: 'Download Press Kit',
    url: '/press-kit',
    OpenInNewTab: false,
  },
  {
    Label: 'Contact for Collaborations',
    url: '/contact',
    OpenInNewTab: false,
  },
];

// ============================================================================
// Hero Block - 5 DJ-oriented examples
// ============================================================================
const HERO_BLOCK_SEEDS = [
  {
    heading: 'DJ Torchinim - Electronic Music Producer',
    content:
      'Bringing high-energy beats and unforgettable experiences to dance floors worldwide. From underground techno to melodic house, crafting sonic journeys that move your soul.',
  },
  {
    heading: 'Live at Ibiza Summer Festival 2024',
    content:
      'Witness an electrifying performance featuring exclusive unreleased tracks and a stunning visual show. Get your tickets now for the ultimate dance music experience.',
  },
  {
    heading: 'New Album: Midnight Sessions',
    content:
      'Dive into 12 tracks of pure electronic bliss. From deep house grooves to peak-time techno bangers, Midnight Sessions takes you on a journey through sound.',
  },
  {
    heading: 'Private Events & Club Residencies',
    content:
      'Looking for the perfect soundtrack for your venue or event? With over 15 years of experience, DJ Torchinim delivers sets tailored to your audience.',
  },
  {
    heading: 'Music Production Masterclass',
    content:
      'Learn the secrets behind professional electronic music production. From sound design to mixing and mastering, unlock your creative potential.',
  },
];

// ============================================================================
// Feature Tab - 5 DJ-oriented examples
// ============================================================================
const FEATURE_TAB_SEEDS = [
  {
    title: 'Club Performances',
    description:
      'High-energy DJ sets at premier nightclubs across Europe and North America. From intimate underground venues to massive festival stages.',
    imgSrc: '/images/feature-club.jpg',
    imgAlt: 'DJ performing at a nightclub',
  },
  {
    title: 'Music Production',
    description:
      'Original tracks and remixes released on top electronic music labels. Crafting sounds that push the boundaries of dance music.',
    imgSrc: '/images/feature-production.jpg',
    imgAlt: 'Music production studio setup',
  },
  {
    title: 'Festival Headlining',
    description:
      'Main stage performances at major electronic music festivals. Delivering unforgettable moments to thousands of passionate fans.',
    imgSrc: '/images/feature-festival.jpg',
    imgAlt: 'DJ performing at a music festival',
  },
  {
    title: 'Private Events',
    description:
      'Exclusive performances for corporate events, weddings, and private parties. Custom-tailored sets for your special occasion.',
    imgSrc: '/images/feature-private.jpg',
    imgAlt: 'Private event DJ setup',
  },
  {
    title: 'Radio Shows',
    description:
      'Weekly radio show featuring the latest releases, exclusive premieres, and guest mixes from industry-leading artists.',
    imgSrc: '/images/feature-radio.jpg',
    imgAlt: 'DJ hosting a radio show',
  },
];

// ============================================================================
// Feature Section - 5 DJ-oriented examples
// ============================================================================
const FEATURE_SECTION_SEEDS = [
  {
    Title: 'Our Services',
    reversed: false,
  },
  {
    Title: 'Why Choose DJ Torchinim',
    reversed: true,
  },
  {
    Title: 'Equipment & Technology',
    reversed: false,
  },
  {
    Title: 'Past Performances',
    reversed: true,
  },
  {
    Title: 'Collaboration Opportunities',
    reversed: false,
  },
];

// ============================================================================
// Contact Info - 5 DJ-oriented examples
// ============================================================================
const CONTACT_INFO_SEEDS = [
  {
    title: 'Booking Inquiries',
    content: 'booking@djtorchinim.com',
    detail: 'For event bookings and performance requests',
    iconName: 'calendar',
  },
  {
    title: 'Management',
    content: 'management@djtorchinim.com',
    detail: 'For press, interviews, and business inquiries',
    iconName: 'briefcase',
  },
  {
    title: 'Phone',
    content: '+1 (555) 123-4567',
    detail: 'Available Monday to Friday, 10 AM - 6 PM EST',
    iconName: 'phone',
  },
  {
    title: 'Studio Location',
    content: 'Los Angeles, California',
    detail: 'Available for studio sessions by appointment',
    iconName: 'map-pin',
  },
  {
    title: 'Social Media',
    content: '@djtorchinim',
    detail: 'Follow for latest updates and behind-the-scenes',
    iconName: 'share-2',
  },
];

// ============================================================================
// Contact Section - 5 DJ-oriented examples
// ============================================================================
const CONTACT_SECTION_SEEDS = [
  {
    introText: 'Get in Touch',
    heading: 'Book Your Next Event',
    description:
      'Ready to elevate your event with world-class DJ entertainment? Reach out to discuss your vision and let us create an unforgettable experience together.',
  },
  {
    introText: 'Collaborate With Us',
    heading: 'Music Production Partnerships',
    description:
      'Looking for a collaborator on your next track? DJ Torchinim is open to working with producers, vocalists, and labels worldwide.',
  },
  {
    introText: 'Press & Media',
    heading: 'Interview & Press Requests',
    description:
      'For media inquiries, interviews, and feature requests, please contact our management team with details about your publication.',
  },
  {
    introText: 'Learn',
    heading: 'DJ & Production Lessons',
    description:
      'Interested in one-on-one DJ lessons or music production coaching? Get personalized instruction from a professional with years of experience.',
  },
  {
    introText: 'Connect',
    heading: 'Fan Community',
    description:
      'Join our community of music lovers and fellow DJs. Stay updated on new releases, tour dates, and exclusive content.',
  },
];

// ============================================================================
// Steps Container - 5 DJ-oriented examples
// ============================================================================
const STEPS_CONTAINER_SEEDS = [
  {
    heading: 'How to Book DJ Torchinim',
    content:
      'Follow these simple steps to secure a memorable performance for your event.',
    steps: [
      {
        title: 'Submit Your Inquiry',
        description:
          'Fill out our booking form with event details, date, venue, and your vision for the night.',
        icon: 'clipboard',
      },
      {
        title: 'Receive a Quote',
        description:
          'Our team will review your request and provide a customized quote within 48 hours.',
        icon: 'file-text',
      },
      {
        title: 'Confirm & Deposit',
        description:
          'Secure your date with a signed contract and deposit to lock in your booking.',
        icon: 'check-circle',
      },
      {
        title: 'Pre-Event Planning',
        description:
          'We will coordinate technical requirements, set times, and any special requests.',
        icon: 'settings',
      },
      {
        title: 'Show Time',
        description:
          'Sit back and enjoy as DJ Torchinim delivers an unforgettable performance.',
        icon: 'music',
      },
    ],
  },
  {
    heading: 'Creating Your Custom Setlist',
    content:
      'We work with you to craft the perfect musical journey for your event.',
    steps: [
      {
        title: 'Share Your Preferences',
        description:
          'Tell us about your music taste, crowd demographic, and event atmosphere.',
        icon: 'heart',
      },
      {
        title: 'Genre Selection',
        description:
          'Choose from house, techno, EDM, hip-hop, or a custom blend of styles.',
        icon: 'list',
      },
      {
        title: 'Special Requests',
        description:
          'Request specific songs, dedications, or special moments throughout the night.',
        icon: 'star',
      },
    ],
  },
  {
    heading: 'Music Production Process',
    content:
      'A glimpse into how we create original tracks from concept to release.',
    steps: [
      {
        title: 'Concept & Inspiration',
        description:
          'Every track begins with an idea - a melody, rhythm, or emotion we want to capture.',
        icon: 'lightbulb',
      },
      {
        title: 'Sound Design',
        description:
          'Crafting unique sounds and textures using synthesizers and samplers.',
        icon: 'sliders',
      },
      {
        title: 'Arrangement',
        description:
          'Building the track structure with intros, breakdowns, drops, and outros.',
        icon: 'layout',
      },
      {
        title: 'Mixing & Mastering',
        description:
          'Polishing the final product for optimal sound quality on any system.',
        icon: 'volume-2',
      },
    ],
  },
  {
    heading: 'Event Setup & Technical Requirements',
    content: 'What we need to deliver the best possible performance.',
    steps: [
      {
        title: 'Sound System Check',
        description:
          'Professional PA system with adequate coverage for your venue size.',
        icon: 'speaker',
      },
      {
        title: 'DJ Booth Setup',
        description:
          'Elevated booth with power, table space, and proper lighting.',
        icon: 'monitor',
      },
      {
        title: 'Sound Check',
        description:
          'We arrive early to test equipment and optimize sound for your space.',
        icon: 'mic',
      },
    ],
  },
  {
    heading: 'Join Our DJ Academy',
    content:
      'Learn to DJ from a professional with our comprehensive training program.',
    steps: [
      {
        title: 'Equipment Basics',
        description:
          'Understanding turntables, CDJs, controllers, and DJ software.',
        icon: 'disc',
      },
      {
        title: 'Beatmatching & Mixing',
        description:
          'Master the fundamentals of seamless track transitions.',
        icon: 'repeat',
      },
      {
        title: 'Reading the Crowd',
        description:
          'Learn to select tracks that keep the energy flowing all night.',
        icon: 'users',
      },
      {
        title: 'Building Your Brand',
        description:
          'Create your DJ identity, online presence, and get your first gigs.',
        icon: 'award',
      },
    ],
  },
];

// ============================================================================
// Image Slider - 5 DJ-oriented examples
// ============================================================================
const IMAGE_SLIDER_SEEDS = [
  {
    Title: 'Performance Gallery',
    reversed: false,
    AutoPlay: true,
    IntervalMs: 5000,
  },
  {
    Title: 'Festival Highlights',
    reversed: true,
    AutoPlay: true,
    IntervalMs: 4000,
  },
  {
    Title: 'Studio Sessions',
    reversed: false,
    AutoPlay: false,
    IntervalMs: 6000,
  },
  {
    Title: 'Club Nights',
    reversed: true,
    AutoPlay: true,
    IntervalMs: 5000,
  },
  {
    Title: 'Behind the Scenes',
    reversed: false,
    AutoPlay: true,
    IntervalMs: 4500,
  },
];

// ============================================================================
// Article Block - 5 DJ-oriented examples
// ============================================================================
const ARTICLE_BLOCK_SEEDS = [
  {
    Title: 'Latest News',
  },
  {
    Title: 'Music Releases',
  },
  {
    Title: 'Tour Updates',
  },
  {
    Title: 'Industry Insights',
  },
  {
    Title: 'Featured Stories',
  },
];

// ============================================================================
// Configuration - Main site configuration
// ============================================================================
const CONFIGURATION_SEEDS = [
  {
    Title: 'DJ Torchinim Website',
  },
];

// ============================================================================
// Footer - Site footer with DJ-oriented links
// ============================================================================
const FOOTER_SEED = {
  copyright: '© 2024 DJ Torchinim. All rights reserved.',
  columns: [
    {
      title: 'Music',
      links: [
        { label: 'Releases', url: '/releases', newTab: false },
        { label: 'SoundCloud', url: 'https://soundcloud.com/dj-torchinim', newTab: true },
        { label: 'Spotify', url: 'https://open.spotify.com/artist/djtorchinim', newTab: true },
        { label: 'Beatport', url: 'https://beatport.com/artist/dj-torchinim', newTab: true },
      ],
    },
    {
      title: 'Events',
      links: [
        { label: 'Upcoming Shows', url: '/events', newTab: false },
        { label: 'Past Performances', url: '/events/archive', newTab: false },
        { label: 'Book Now', url: '/booking', newTab: false },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'About', url: '/about', newTab: false },
        { label: 'Contact', url: '/contact', newTab: false },
        { label: 'Press Kit', url: '/press-kit', newTab: false },
      ],
    },
  ],
  socialLinks: [
    { platform: 'Instagram', url: 'https://instagram.com/djtorchinim', icon: 'instagram', detail: '@djtorchinim' },
    { platform: 'Twitter', url: 'https://twitter.com/djtorchinim', icon: 'twitter', detail: '@djtorchinim' },
    { platform: 'Facebook', url: 'https://facebook.com/djtorchinim', icon: 'facebook', detail: 'DJ Torchinim' },
    { platform: 'YouTube', url: 'https://youtube.com/@djtorchinim', icon: 'youtube', detail: 'DJ Torchinim' },
    { platform: 'SoundCloud', url: 'https://soundcloud.com/dj-torchinim', icon: 'headphones', detail: 'DJ Torchinim' },
  ],
};

// ============================================================================
// Seeding Functions
// ============================================================================

async function seedCTAs(strapi: StrapiAny): Promise<any[]> {
  const results: any[] = [];
  for (const cta of CTA_SEEDS) {
    const existing = await strapi.db.query('api::cta.cta').findOne({
      where: { Label: cta.Label },
    });
    if (!existing) {
      const created = await strapi.db.query('api::cta.cta').create({
        data: { ...cta, publishedAt: new Date() },
      });
      console.info(`[SEED] Created CTA: ${cta.Label}`);
      results.push(created);
    } else {
      console.info(`[SEED] CTA already exists: ${cta.Label}`);
      results.push(existing);
    }
  }
  return results;
}

async function seedHeroBlocks(strapi: StrapiAny, ctas: any[]): Promise<any[]> {
  const results: any[] = [];
  for (let i = 0; i < HERO_BLOCK_SEEDS.length; i++) {
    const hero = HERO_BLOCK_SEEDS[i];
    const existing = await strapi.db.query('api::hero-block.hero-block').findOne({
      where: { heading: hero.heading },
    });
    if (!existing) {
      // Assign a CTA action to each hero block (use documentId for Strapi 5 relations)
      const actionsToConnect = ctas.length > i ? [ctas[i].documentId] : [];
      const created = await strapi.db.query('api::hero-block.hero-block').create({
        data: {
          ...hero,
          actions: actionsToConnect,
        },
      });
      console.info(`[SEED] Created Hero Block: ${hero.heading}`);
      results.push(created);
    } else {
      console.info(`[SEED] Hero Block already exists: ${hero.heading}`);
      results.push(existing);
    }
  }
  return results;
}

async function seedFeatureTabs(strapi: StrapiAny): Promise<any[]> {
  const results: any[] = [];
  for (const tab of FEATURE_TAB_SEEDS) {
    const existing = await strapi.db.query('api::feature-tab.feature-tab').findOne({
      where: { title: tab.title },
    });
    if (!existing) {
      const created = await strapi.db.query('api::feature-tab.feature-tab').create({
        data: tab,
      });
      console.info(`[SEED] Created Feature Tab: ${tab.title}`);
      results.push(created);
    } else {
      console.info(`[SEED] Feature Tab already exists: ${tab.title}`);
      results.push(existing);
    }
  }
  return results;
}

async function seedFeatureSections(strapi: StrapiAny, tabs: any[]): Promise<any[]> {
  const results: any[] = [];
  for (let i = 0; i < FEATURE_SECTION_SEEDS.length; i++) {
    const section = FEATURE_SECTION_SEEDS[i];
    const existing = await strapi.db.query('api::feature-section.feature-section').findOne({
      where: { Title: section.Title },
    });
    if (!existing) {
      // Assign a tab to each feature section (use documentId for Strapi 5 relations)
      const tabsToConnect = tabs.length > i ? [tabs[i].documentId] : [];
      const created = await strapi.db.query('api::feature-section.feature-section').create({
        data: {
          ...section,
          tabs: tabsToConnect,
        },
      });
      console.info(`[SEED] Created Feature Section: ${section.Title}`);
      results.push(created);
    } else {
      console.info(`[SEED] Feature Section already exists: ${section.Title}`);
      results.push(existing);
    }
  }
  return results;
}

async function seedContactInfos(strapi: StrapiAny): Promise<any[]> {
  const results: any[] = [];
  for (const info of CONTACT_INFO_SEEDS) {
    const existing = await strapi.db.query('api::contact-info.contact-info').findOne({
      where: { title: info.title },
    });
    if (!existing) {
      const created = await strapi.db.query('api::contact-info.contact-info').create({
        data: info,
      });
      console.info(`[SEED] Created Contact Info: ${info.title}`);
      results.push(created);
    } else {
      console.info(`[SEED] Contact Info already exists: ${info.title}`);
      results.push(existing);
    }
  }
  return results;
}

async function seedContactSections(strapi: StrapiAny, contactInfos: any[]): Promise<any[]> {
  const results: any[] = [];
  for (let i = 0; i < CONTACT_SECTION_SEEDS.length; i++) {
    const section = CONTACT_SECTION_SEEDS[i];
    const existing = await strapi.db.query('api::contact-section.contact-section').findOne({
      where: { heading: section.heading },
    });
    if (!existing) {
      // Assign contact info to the first contact section (use documentId for Strapi 5 relations)
      const contactInfoToConnect = i === 0 ? contactInfos.map((ci) => ci.documentId) : [];
      const created = await strapi.db.query('api::contact-section.contact-section').create({
        data: {
          ...section,
          contactInfo: contactInfoToConnect,
        },
      });
      console.info(`[SEED] Created Contact Section: ${section.heading}`);
      results.push(created);
    } else {
      console.info(`[SEED] Contact Section already exists: ${section.heading}`);
      results.push(existing);
    }
  }
  return results;
}

async function seedStepsContainers(strapi: StrapiAny, ctas: any[]): Promise<any[]> {
  const results: any[] = [];
  for (let i = 0; i < STEPS_CONTAINER_SEEDS.length; i++) {
    const container = STEPS_CONTAINER_SEEDS[i];
    const existing = await strapi.db.query('api::steps-container.steps-container').findOne({
      where: { heading: container.heading },
    });
    if (!existing) {
      // Map steps to the component format
      const stepsData = container.steps.map((step) => ({
        __component: 'steps.step',
        title: step.title,
        description: step.description,
        icon: step.icon,
      }));
      // Assign a CTA action (use documentId for Strapi 5 relations)
      const actionToConnect = ctas.length > i ? ctas[i].documentId : null;
      const created = await strapi.db.query('api::steps-container.steps-container').create({
        data: {
          heading: container.heading,
          content: container.content,
          steps: stepsData,
          action: actionToConnect,
          publishedAt: new Date(),
        },
      });
      console.info(`[SEED] Created Steps Container: ${container.heading}`);
      results.push(created);
    } else {
      console.info(`[SEED] Steps Container already exists: ${container.heading}`);
      results.push(existing);
    }
  }
  return results;
}

async function seedImageSliders(strapi: StrapiAny): Promise<any[]> {
  const results: any[] = [];
  for (const slider of IMAGE_SLIDER_SEEDS) {
    const existing = await strapi.db.query('api::image-slider.image-slider').findOne({
      where: { Title: slider.Title },
    });
    if (!existing) {
      const created = await strapi.db.query('api::image-slider.image-slider').create({
        data: { ...slider, publishedAt: new Date() },
      });
      console.info(`[SEED] Created Image Slider: ${slider.Title}`);
      results.push(created);
    } else {
      console.info(`[SEED] Image Slider already exists: ${slider.Title}`);
      results.push(existing);
    }
  }
  return results;
}

async function seedArticleBlocks(strapi: StrapiAny): Promise<any[]> {
  const results: any[] = [];
  for (const block of ARTICLE_BLOCK_SEEDS) {
    const existing = await strapi.db.query('api::article-block.article-block').findOne({
      where: { Title: block.Title },
    });
    if (!existing) {
      const created = await strapi.db.query('api::article-block.article-block').create({
        data: { ...block, publishedAt: new Date() },
      });
      console.info(`[SEED] Created Article Block: ${block.Title}`);
      results.push(created);
    } else {
      console.info(`[SEED] Article Block already exists: ${block.Title}`);
      results.push(existing);
    }
  }
  return results;
}

async function seedConfigurations(strapi: StrapiAny): Promise<any[]> {
  const results: any[] = [];
  for (const config of CONFIGURATION_SEEDS) {
    const existing = await strapi.db.query('api::configuration.configuration').findOne({
      where: { Title: config.Title },
    });
    if (!existing) {
      const created = await strapi.db.query('api::configuration.configuration').create({
        data: { ...config, publishedAt: new Date() },
      });
      console.info(`[SEED] Created Configuration: ${config.Title}`);
      results.push(created);
    } else {
      console.info(`[SEED] Configuration already exists: ${config.Title}`);
      results.push(existing);
    }
  }
  return results;
}

async function seedFooter(strapi: StrapiAny, configurations: any[]): Promise<any> {
  const existing = await strapi.db.query('api::footer.footer').findOne({
    where: { copyright: FOOTER_SEED.copyright },
  });
  
  if (!existing) {
    // Map columns to component format
    const columnsData = FOOTER_SEED.columns.map((col) => ({
      __component: 'footer.link-column',
      title: col.title,
      links: col.links.map((link) => ({
        __component: 'footer.link',
        label: link.label,
        url: link.url,
        newTab: link.newTab,
      })),
    }));
    
    // Map social links to component format
    const socialLinksData = FOOTER_SEED.socialLinks.map((social) => ({
      __component: 'footer.social-link',
      platform: social.platform,
      url: social.url,
      icon: social.icon,
      detail: social.detail,
    }));
    
    const created = await strapi.db.query('api::footer.footer').create({
      data: {
        copyright: FOOTER_SEED.copyright,
        columns: columnsData,
        socialLinks: socialLinksData,
        configuration: configurations.length > 0 ? configurations[0].documentId : null,
        publishedAt: new Date(),
      },
    });
    console.info(`[SEED] Created Footer`);
    return created;
  } else {
    console.info(`[SEED] Footer already exists`);
    return existing;
  }
}

// ============================================================================
// Main Export
// ============================================================================

export default async function seedContentTypes({ strapi }: { strapi: StrapiAny }) {
  console.info('[SEED] Starting content type seeding...');
  
  // Seed CTAs first (they are referenced by other content types)
  const ctas = await seedCTAs(strapi);
  
  // Seed Hero Blocks (uses CTAs)
  await seedHeroBlocks(strapi, ctas);
  
  // Seed Feature Tabs
  const featureTabs = await seedFeatureTabs(strapi);
  
  // Seed Feature Sections (uses Feature Tabs)
  await seedFeatureSections(strapi, featureTabs);
  
  // Seed Contact Infos
  const contactInfos = await seedContactInfos(strapi);
  
  // Seed Contact Sections (uses Contact Infos)
  await seedContactSections(strapi, contactInfos);
  
  // Seed Steps Containers (uses CTAs)
  await seedStepsContainers(strapi, ctas);
  
  // Seed Image Sliders
  await seedImageSliders(strapi);
  
  // Seed Article Blocks
  await seedArticleBlocks(strapi);
  
  // Seed Configurations
  const configurations = await seedConfigurations(strapi);
  
  // Seed Footer (uses Configuration)
  await seedFooter(strapi, configurations);
  
  console.info('[SEED] Content type seeding completed.');
}
