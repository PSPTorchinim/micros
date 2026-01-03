// CMS/src/extensions/bootstrap/tasks/seed-content-types.ts
// Seeds content types with DJ-oriented example data on first run

type StrapiAny = any;

// ============================================================================
// CTA (Call to Action) - 5 DJ-oriented examples
// ============================================================================
const CTA_SEEDS = [
  {
    Label: 'Book DJ Beat Blaster',
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
    url: 'https://soundcloud.com/djbeatblaster',
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
    heading: 'DJ Beat Blaster - Electronic Music Producer',
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
      'Looking for the perfect soundtrack for your venue or event? With over 15 years of experience, DJ Beat Blaster delivers sets tailored to your audience.',
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
    imgSrc: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    imgAlt: 'DJ performing at a nightclub',
  },
  {
    title: 'Music Production',
    description:
      'Original tracks and remixes released on top electronic music labels. Crafting sounds that push the boundaries of dance music.',
    imgSrc: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    imgAlt: 'Music production studio setup',
  },
  {
    title: 'Festival Headlining',
    description:
      'Main stage performances at major electronic music festivals. Delivering unforgettable moments to thousands of passionate fans.',
    imgSrc: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    imgAlt: 'DJ performing at a music festival',
  },
  {
    title: 'Private Events',
    description:
      'Exclusive performances for corporate events, weddings, and private parties. Custom-tailored sets for your special occasion.',
    imgSrc: 'https://images.unsplash.com/photo-1526178613658-3f1622045544?auto=format&fit=crop&w=800&q=80',
    imgAlt: 'Private event DJ setup',
  },
  {
    title: 'Radio Shows',
    description:
      'Weekly radio show featuring the latest releases, exclusive premieres, and guest mixes from industry-leading artists.',
    imgSrc: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
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
    Title: 'Why Choose DJ Beat Blaster',
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
    content: 'contact@djbeatblaster.com',
    detail: 'For event bookings and performance requests',
    iconName: 'calendar',
  },
  {
    title: 'Management',
    content: 'management@djbeatblaster.com',
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
    content: '@djbeatblaster',
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
      'Looking for a collaborator on your next track? DJ Beat Blaster is open to working with producers, vocalists, and labels worldwide.',
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
    heading: 'How to Book DJ Beat Blaster',
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
          'Sit back and enjoy as DJ Beat Blaster delivers an unforgettable performance.',
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
    Title: 'DJ Beat Blaster Website',
  },
];

// ============================================================================
// Footer - Site footer with DJ-oriented links
// ============================================================================
const FOOTER_SEED = {
  copyright: '© 2024 DJ Beat Blaster. All rights reserved.',
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
    { platform: 'Facebook', url: 'https://facebook.com/djtorchinim', icon: 'facebook', detail: 'DJ Beat Blaster' },
    { platform: 'YouTube', url: 'https://youtube.com/@djtorchinim', icon: 'youtube', detail: 'DJ Beat Blaster' },
    { platform: 'SoundCloud', url: 'https://soundcloud.com/dj-torchinim', icon: 'headphones', detail: 'DJ Beat Blaster' },
  ],
};

// ============================================================================
// Seeding Functions
// ============================================================================

async function seedCTAs(strapi: StrapiAny): Promise<any[]> {
  const results: any[] = [];
  for (const cta of CTA_SEEDS) {
    // Use Document Service for draftAndPublish: true content types
    const existing = await strapi.documents('api::cta.cta').findFirst({
      filters: { Label: cta.Label },
    });
    if (!existing) {
      // Create and publish using Document Service
      const created = await strapi.documents('api::cta.cta').create({
        data: { ...cta },
        status: 'published',
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

// Helper function to add CTA relations to Hero Blocks after creation using Document Service
async function linkHeroBlocksToCTAs(strapi: StrapiAny, heroBlocks: any[], ctas: any[]): Promise<void> {
  console.info('[SEED] Linking Hero Blocks to CTAs...');
  for (let i = 0; i < heroBlocks.length && i < ctas.length; i++) {
    const heroBlock = heroBlocks[i];
    const cta = ctas[i];
    
    // Get the documentId - for db.query created entities, we need to find them again
    const heroBlockWithDocId = await strapi.documents('api::hero-block.hero-block').findFirst({
      filters: { heading: heroBlock.heading },
    });
    
    if (!heroBlockWithDocId) {
      console.warn(`[SEED] Could not find Hero Block with heading: ${heroBlock.heading}`);
      continue;
    }
    
    // Update hero block to add CTA relation using Document Service
    try {
      await strapi.documents('api::hero-block.hero-block').update({
        documentId: heroBlockWithDocId.documentId,
        data: {
          actions: [cta.documentId],
        },
      });
      console.info(`[SEED] Linked Hero Block "${heroBlock.heading}" to CTA "${cta.Label}"`);
    } catch (error) {
      console.warn(`[SEED] Could not link Hero Block to CTA: ${(error as Error).message}`);
    }
  }
}

// Helper function to add FeatureTab relations to FeatureSections after creation using Document Service
async function linkFeatureSectionsToTabs(strapi: StrapiAny, sections: any[], tabs: any[]): Promise<void> {
  console.info('[SEED] Linking Feature Sections to Feature Tabs...');
  for (let i = 0; i < sections.length && i < tabs.length; i++) {
    const section = sections[i];
    const tab = tabs[i];
    
    // Get the documentId - for db.query created entities, we need to find them again
    const sectionWithDocId = await strapi.documents('api::feature-section.feature-section').findFirst({
      filters: { Title: section.Title },
    });
    
    const tabWithDocId = await strapi.documents('api::feature-tab.feature-tab').findFirst({
      filters: { title: tab.title },
    });
    
    if (!sectionWithDocId || !tabWithDocId) {
      console.warn(`[SEED] Could not find Feature Section or Tab for linking`);
      continue;
    }
    
    try {
      await strapi.documents('api::feature-section.feature-section').update({
        documentId: sectionWithDocId.documentId,
        data: {
          tabs: [tabWithDocId.documentId],
        },
      });
      console.info(`[SEED] Linked Feature Section "${section.Title}" to Tab "${tab.title}"`);
    } catch (error) {
      console.warn(`[SEED] Could not link Feature Section to Tab: ${(error as Error).message}`);
    }
  }
}

// Helper function to add ContactInfo relations to ContactSections after creation using Document Service
async function linkContactSectionsToInfos(strapi: StrapiAny, sections: any[], infos: any[]): Promise<void> {
  console.info('[SEED] Linking Contact Sections to Contact Infos...');
  for (let i = 0; i < sections.length && i < infos.length; i++) {
    const section = sections[i];
    const info = infos[i];
    
    // Get the documentId - for db.query created entities, we need to find them again
    const sectionWithDocId = await strapi.documents('api::contact-section.contact-section').findFirst({
      filters: { heading: section.heading },
    });
    
    const infoWithDocId = await strapi.documents('api::contact-info.contact-info').findFirst({
      filters: { title: info.title },
    });
    
    if (!sectionWithDocId || !infoWithDocId) {
      console.warn(`[SEED] Could not find Contact Section or Info for linking`);
      continue;
    }
    
    try {
      await strapi.documents('api::contact-section.contact-section').update({
        documentId: sectionWithDocId.documentId,
        data: {
          contactInfo: [infoWithDocId.documentId],
        },
      });
      console.info(`[SEED] Linked Contact Section "${section.heading}" to Info "${info.title}"`);
    } catch (error) {
      console.warn(`[SEED] Could not link Contact Section to Info: ${(error as Error).message}`);
    }
  }
}

async function seedHeroBlocks(strapi: StrapiAny): Promise<any[]> {
  const results: any[] = [];
  for (let i = 0; i < HERO_BLOCK_SEEDS.length; i++) {
    const hero = HERO_BLOCK_SEEDS[i];
    const existing = await strapi.db.query('api::hero-block.hero-block').findOne({
      where: { heading: hero.heading },
    });
    if (!existing) {
      // Create hero block without CTA relation first
      const heroData: any = {
        ...hero,
        publishedAt: new Date(),
      };
      
      const created = await strapi.db.query('api::hero-block.hero-block').create({
        data: heroData,
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
        data: { ...tab, publishedAt: new Date() },
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

async function seedFeatureSections(strapi: StrapiAny): Promise<any[]> {
  const results: any[] = [];
  for (let i = 0; i < FEATURE_SECTION_SEEDS.length; i++) {
    const section = FEATURE_SECTION_SEEDS[i];
    const existing = await strapi.db.query('api::feature-section.feature-section').findOne({
      where: { Title: section.Title },
    });
    if (!existing) {
      // Create feature section without tab relation first
      const sectionData: any = {
        ...section,
        publishedAt: new Date(),
      };
      
      const created = await strapi.db.query('api::feature-section.feature-section').create({
        data: sectionData,
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
        data: {
          ...info,
          publishedAt: new Date(),
        },
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

async function seedContactSections(strapi: StrapiAny): Promise<any[]> {
  const results: any[] = [];
  for (let i = 0; i < CONTACT_SECTION_SEEDS.length; i++) {
    const section = CONTACT_SECTION_SEEDS[i];
    const existing = await strapi.db.query('api::contact-section.contact-section').findOne({
      where: { heading: section.heading },
    });
    if (!existing) {
      // Create contact section without contactInfo relation first
      const sectionData: any = {
        ...section,
        publishedAt: new Date(),
      };
      
      const created = await strapi.db.query('api::contact-section.contact-section').create({
        data: sectionData,
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
    // Use Document Service for draftAndPublish: true content types
    const existing = await strapi.documents('api::steps-container.steps-container').findFirst({
      filters: { heading: container.heading },
    });
    if (!existing) {
      // Build steps component data
      const stepsData = container.steps.map((step) => ({
        title: step.title,
        description: step.description,
        icon: step.icon,
      }));
      
      // Build the create payload with steps and action
      const createData: any = {
        heading: container.heading,
        content: container.content,
        steps: stepsData,
      };
      
      // Add CTA action relation if available
      if (ctas.length > 0 && ctas[i % ctas.length]) {
        createData.action = ctas[i % ctas.length].documentId;
      }
      
      // Create using Document Service with steps component data
      const created = await strapi.documents('api::steps-container.steps-container').create({
        data: createData,
        status: 'published',
      });
      console.info(`[SEED] Created Steps Container: ${container.heading} (with ${stepsData.length} steps${createData.action ? ' and CTA action' : ''})`);
      results.push(created);
    } else {
      console.info(`[SEED] Steps Container already exists: ${container.heading}`);
      results.push(existing);
    }
  }
  return results;
}

async function seedImageSliders(strapi: StrapiAny, heroBlocks: any[]): Promise<any[]> {
  const results: any[] = [];
  for (let i = 0; i < IMAGE_SLIDER_SEEDS.length; i++) {
    const slider = IMAGE_SLIDER_SEEDS[i];
    // Use Document Service for draftAndPublish: true content types
    const existing = await strapi.documents('api::image-slider.image-slider').findFirst({
      filters: { Title: slider.Title },
    });
    if (!existing) {
      // Build slides array with hero-block-ref components
      const slides: any[] = [];
      
      // Each slider gets a reference to a hero block as a slide
      // Get the hero block with documentId
      const heroBlocksWithDocId = await strapi.documents('api::hero-block.hero-block').findMany({});
      if (heroBlocksWithDocId.length > 0) {
        const heroBlock = heroBlocksWithDocId[i % heroBlocksWithDocId.length];
        slides.push({
          __component: 'hero-block-ref.hero-block-ref',
          hero_block: heroBlock.documentId,
        });
      }
      
      // Create and publish using Document Service
      const created = await strapi.documents('api::image-slider.image-slider').create({
        data: { 
          ...slider,
          Slides: slides,
        },
        status: 'published',
      });
      console.info(`[SEED] Created Image Slider: ${slider.Title} (with ${slides.length} slide(s))`);
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
    // Use Document Service for draftAndPublish: true content types
    const existing = await strapi.documents('api::article-block.article-block').findFirst({
      filters: { Title: block.Title },
    });
    if (!existing) {
      // Create and publish using Document Service
      const created = await strapi.documents('api::article-block.article-block').create({
        data: { ...block },
        status: 'published',
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
    // Use Document Service for draftAndPublish: true content types
    const existing = await strapi.documents('api::configuration.configuration').findFirst({
      filters: { Title: config.Title },
    });
    if (!existing) {
      // Create and publish using Document Service
      const created = await strapi.documents('api::configuration.configuration').create({
        data: { ...config },
        status: 'published',
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

async function seedFooter(strapi: StrapiAny): Promise<any> {
  // Footer is a singleType with draftAndPublish: true
  // Use Document Service for proper handling
  const existing = await strapi.documents('api::footer.footer').findFirst({});
  
  if (!existing) {
    // Create footer with full data including columns and social links
    const created = await strapi.documents('api::footer.footer').create({
      data: {
        copyright: FOOTER_SEED.copyright,
        columns: FOOTER_SEED.columns,
        socialLinks: FOOTER_SEED.socialLinks,
      },
      status: 'published',
    });
    console.info(`[SEED] Created Footer with ${FOOTER_SEED.columns.length} columns and ${FOOTER_SEED.socialLinks.length} social links`);
    return created;
  } else {
    console.info(`[SEED] Footer already exists`);
    return existing;
  }
}

async function seedLoginBlock(strapi: StrapiAny): Promise<any> {
  // Login Block is a singleType with draftAndPublish: false
  // Use db.query for singleTypes without draftAndPublish
  const existingEntries = await strapi.db.query('api::login-block.login-block').findMany({});
  
  if (existingEntries.length === 0) {
    // Create login block with DJ-themed content
    const created = await strapi.db.query('api::login-block.login-block').create({
      data: {
        title: 'Welcome Back, DJ',
        emailLabel: 'Email Address',
        passwordLabel: 'Password',
        submitButtonText: 'Sign In',
        forgotPasswordText: 'Forgot your password?',
        resetPasswordLinkText: 'Reset it here',
        emailPlaceholder: 'your@email.com',
        passwordPlaceholder: 'Enter your password',
        redirectPath: '/',
        forgotPasswordUrl: '/forgot-password',
      },
    });
    console.info(`[SEED] Created Login Block`);
    return created;
  } else {
    console.info(`[SEED] Login Block already exists`);
    return existingEntries[0];
  }
}

async function seedForgotPasswordBlock(strapi: StrapiAny): Promise<any> {
  // Forgot Password Block is a singleType with draftAndPublish: false
  // Use db.query for singleTypes without draftAndPublish
  const existingEntries = await strapi.db.query('api::forgot-password-block.forgot-password-block').findMany({});
  
  if (existingEntries.length === 0) {
    // Create forgot password block with DJ-themed content
    const created = await strapi.db.query('api::forgot-password-block.forgot-password-block').create({
      data: {
        title: 'Reset Your Password',
        description: 'Enter your email address and we\'ll send you a link to reset your password.',
        emailLabel: 'Email Address',
        submitButtonText: 'Send Reset Link',
        backToLoginText: 'Remember your password?',
        loginLinkText: 'Back to Login',
        emailPlaceholder: 'your@email.com',
        successRedirectPath: '/login',
        loginUrl: '/login',
      },
    });
    console.info(`[SEED] Created Forgot Password Block`);
    return created;
  } else {
    console.info(`[SEED] Forgot Password Block already exists`);
    return existingEntries[0];
  }
}

async function seedChangePasswordBlock(strapi: StrapiAny): Promise<any> {
  // Change Password Block is a singleType with draftAndPublish: false
  // Use db.query for singleTypes without draftAndPublish
  const existingEntries = await strapi.db.query('api::change-password-block.change-password-block').findMany({});
  
  if (existingEntries.length === 0) {
    // Create change password block with DJ-themed content
    const created = await strapi.db.query('api::change-password-block.change-password-block').create({
      data: {
        title: 'Change Your Password',
        description: 'Update your password to keep your account secure.',
        oldPasswordLabel: 'Current Password',
        newPasswordLabel: 'New Password',
        confirmPasswordLabel: 'Confirm New Password',
        submitButtonText: 'Change Password',
        oldPasswordPlaceholder: 'Enter your current password',
        newPasswordPlaceholder: 'Enter your new password',
        confirmPasswordPlaceholder: 'Confirm your new password',
        successRedirectPath: '/dashboard',
      },
    });
    console.info(`[SEED] Created Change Password Block`);
    return created;
  } else {
    console.info(`[SEED] Change Password Block already exists`);
    return existingEntries[0];
  }
}

// ============================================================================
// Main Export
// ============================================================================

export default async function seedContentTypes({ strapi }: { strapi: StrapiAny }) {
  console.info('[SEED] Starting content type seeding...');
  
  // Seed CTAs first (needed for Hero Block and Steps Container relations)
  const ctas = await seedCTAs(strapi);
  
  // Seed Hero Blocks (without CTA relations first)
  const heroBlocks = await seedHeroBlocks(strapi);
  
  // Link Hero Blocks to CTAs after creation
  await linkHeroBlocksToCTAs(strapi, heroBlocks, ctas);
  
  // Seed Feature Tabs (needed for Feature Section relations)
  const featureTabs = await seedFeatureTabs(strapi);
  
  // Seed Feature Sections (without tab relations first)
  const featureSections = await seedFeatureSections(strapi);
  
  // Link Feature Sections to Feature Tabs after creation
  await linkFeatureSectionsToTabs(strapi, featureSections, featureTabs);
  
  // Seed Contact Infos (needed for Contact Section relations)
  const contactInfos = await seedContactInfos(strapi);
  
  // Seed Contact Sections (without contactInfo relations first)
  const contactSections = await seedContactSections(strapi);
  
  // Link Contact Sections to Contact Infos after creation
  await linkContactSectionsToInfos(strapi, contactSections, contactInfos);
  
  // Seed Steps Containers with steps and CTA action
  await seedStepsContainers(strapi, ctas);
  
  // Seed Image Sliders (with slides containing references to Hero Blocks)
  await seedImageSliders(strapi, heroBlocks);
  
  // Seed Article Blocks
  await seedArticleBlocks(strapi);
  
  // Seed Configurations
  await seedConfigurations(strapi);
  
  // Seed Footer
  await seedFooter(strapi);
  
  // Seed Login Block (singleType for login page)
  await seedLoginBlock(strapi);
  
  // Seed Forgot Password Block (singleType for forgot password page)
  await seedForgotPasswordBlock(strapi);
  
  // Seed Change Password Block (singleType for change password page)
  await seedChangePasswordBlock(strapi);
  
  console.info('[SEED] Content type seeding completed.');
}
