// CMS/src/extensions/bootstrap/tasks/seed-pages.ts
// Seeds pages and templates on first run

type StrapiAny = any;

// ============================================================================
// Template Seeds - Page templates referencing content types
// ============================================================================
const TEMPLATE_SEEDS = [
  {
    Name: 'Home Template',
    TemplateType: 'Standard',
    // Content will reference seeded hero blocks, feature sections, etc.
  },
  {
    Name: 'About Template',
    TemplateType: 'Standard',
  },
  {
    Name: 'Events Template',
    TemplateType: 'Standard',
  },
  {
    Name: 'Contact Template',
    TemplateType: 'Standard',
  },
  {
    Name: 'Login Template',
    TemplateType: 'Login',
  },
  {
    Name: 'Forgot Password Template',
    TemplateType: 'ForgotPassword',
  },
];

// ============================================================================
// Page Seeds - 5+ DJ-oriented pages
// ============================================================================
const PAGE_SEEDS = [
  {
    Title: 'Home',
    Slug: '/',
    Menu: 'Main',
    AuthState: 'All',
    NavigationOrder: 1,
    NavigationAction: 'Link',
    templateName: 'Home Template',
  },
  {
    Title: 'About',
    Slug: '/about',
    Menu: 'Main',
    AuthState: 'All',
    NavigationOrder: 2,
    NavigationAction: 'Link',
    templateName: 'About Template',
  },
  {
    Title: 'Events',
    Slug: '/events',
    Menu: 'Main',
    AuthState: 'All',
    NavigationOrder: 3,
    NavigationAction: 'Link',
    templateName: 'Events Template',
  },
  {
    Title: 'Contact',
    Slug: '/contact',
    Menu: 'Main',
    AuthState: 'All',
    NavigationOrder: 4,
    NavigationAction: 'Link',
    templateName: 'Contact Template',
  },
  {
    Title: 'Login',
    Slug: '/login',
    Menu: 'Login',
    AuthState: 'OnlyUnauthenticated',
    NavigationOrder: 1,
    NavigationAction: 'Link',
    templateName: 'Login Template',
  },
  {
    Title: 'Forgot Password',
    Slug: '/forgot-password',
    Menu: 'NotVisible',
    AuthState: 'OnlyUnauthenticated',
    NavigationOrder: 99,
    NavigationAction: 'Link',
    templateName: 'Forgot Password Template',
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

async function getHeroBlockByHeading(strapi: StrapiAny, heading: string) {
  return strapi.db.query('api::hero-block.hero-block').findOne({
    where: { heading },
  });
}

async function getFeatureSectionByTitle(strapi: StrapiAny, title: string) {
  return strapi.db.query('api::feature-section.feature-section').findOne({
    where: { Title: title },
  });
}

async function getContactSectionByHeading(strapi: StrapiAny, heading: string) {
  return strapi.db.query('api::contact-section.contact-section').findOne({
    where: { heading },
  });
}

async function getStepsContainerByHeading(strapi: StrapiAny, heading: string) {
  return strapi.db.query('api::steps-container.steps-container').findOne({
    where: { heading },
  });
}

async function getArticleBlockByTitle(strapi: StrapiAny, title: string) {
  return strapi.db.query('api::article-block.article-block').findOne({
    where: { Title: title },
  });
}

async function getImageSliderByTitle(strapi: StrapiAny, title: string) {
  return strapi.db.query('api::image-slider.image-slider').findOne({
    where: { Title: title },
  });
}

// ============================================================================
// Build Template Content
// ============================================================================

async function buildHomeTemplateContent(strapi: StrapiAny): Promise<any[]> {
  const content: any[] = [];
  
  // Hero Block
  const heroBlock = await getHeroBlockByHeading(strapi, 'DJ Torchinim - Electronic Music Producer');
  if (heroBlock) {
    content.push({
      __component: 'hero-block-ref.hero-block-ref',
      heroBlock: heroBlock.id,
    });
  }
  
  // Feature Section
  const featureSection = await getFeatureSectionByTitle(strapi, 'Our Services');
  if (featureSection) {
    content.push({
      __component: 'feature-section-ref.feature-section-ref',
      featureSection: featureSection.id,
    });
  }
  
  // Steps Container
  const stepsContainer = await getStepsContainerByHeading(strapi, 'How to Book DJ Torchinim');
  if (stepsContainer) {
    content.push({
      __component: 'steps-container-ref.steps-container-ref',
      stepsContainer: stepsContainer.id,
    });
  }
  
  // Article Block
  const articleBlock = await getArticleBlockByTitle(strapi, 'Latest News');
  if (articleBlock) {
    content.push({
      __component: 'article-block-ref.article-block-ref',
      articleBlock: articleBlock.id,
    });
  }
  
  return content;
}

async function buildAboutTemplateContent(strapi: StrapiAny): Promise<any[]> {
  const content: any[] = [];
  
  // Hero Block for About
  const heroBlock = await getHeroBlockByHeading(strapi, 'Private Events & Club Residencies');
  if (heroBlock) {
    content.push({
      __component: 'hero-block-ref.hero-block-ref',
      heroBlock: heroBlock.id,
    });
  }
  
  // Feature Section
  const featureSection = await getFeatureSectionByTitle(strapi, 'Why Choose DJ Torchinim');
  if (featureSection) {
    content.push({
      __component: 'feature-section-ref.feature-section-ref',
      featureSection: featureSection.id,
    });
  }
  
  // Image Slider
  const imageSlider = await getImageSliderByTitle(strapi, 'Performance Gallery');
  if (imageSlider) {
    content.push({
      __component: 'image-slider-ref.image-slider-ref',
      imageSlider: imageSlider.id,
    });
  }
  
  return content;
}

async function buildEventsTemplateContent(strapi: StrapiAny): Promise<any[]> {
  const content: any[] = [];
  
  // Hero Block
  const heroBlock = await getHeroBlockByHeading(strapi, 'Live at Ibiza Summer Festival 2024');
  if (heroBlock) {
    content.push({
      __component: 'hero-block-ref.hero-block-ref',
      heroBlock: heroBlock.id,
    });
  }
  
  // Feature Section
  const featureSection = await getFeatureSectionByTitle(strapi, 'Past Performances');
  if (featureSection) {
    content.push({
      __component: 'feature-section-ref.feature-section-ref',
      featureSection: featureSection.id,
    });
  }
  
  // Image Slider
  const imageSlider = await getImageSliderByTitle(strapi, 'Festival Highlights');
  if (imageSlider) {
    content.push({
      __component: 'image-slider-ref.image-slider-ref',
      imageSlider: imageSlider.id,
    });
  }
  
  return content;
}

async function buildContactTemplateContent(strapi: StrapiAny): Promise<any[]> {
  const content: any[] = [];
  
  // Contact Section
  const contactSection = await getContactSectionByHeading(strapi, 'Book Your Next Event');
  if (contactSection) {
    content.push({
      __component: 'contact-section-ref.contact-section-ref',
      contactSection: contactSection.id,
    });
  }
  
  return content;
}

// ============================================================================
// Seeding Functions
// ============================================================================

async function seedTemplates(strapi: StrapiAny): Promise<Map<string, any>> {
  console.info('[SEED] Starting template seeding...');
  const templateMap = new Map<string, any>();
  
  for (const templateData of TEMPLATE_SEEDS) {
    const existing = await strapi.db.query('api::template.template').findOne({
      where: { Name: templateData.Name },
    });
    
    if (!existing) {
      // Build content based on template type
      let content: any[] = [];
      
      if (templateData.Name === 'Home Template') {
        content = await buildHomeTemplateContent(strapi);
      } else if (templateData.Name === 'About Template') {
        content = await buildAboutTemplateContent(strapi);
      } else if (templateData.Name === 'Events Template') {
        content = await buildEventsTemplateContent(strapi);
      } else if (templateData.Name === 'Contact Template') {
        content = await buildContactTemplateContent(strapi);
      }
      // Login and Forgot Password templates use built-in blocks, no Content needed
      
      const created = await strapi.db.query('api::template.template').create({
        data: {
          Name: templateData.Name,
          TemplateType: templateData.TemplateType,
          Content: content,
          publishedAt: new Date(),
        },
      });
      console.info(`[SEED] Created Template: ${templateData.Name}`);
      templateMap.set(templateData.Name, created);
    } else {
      console.info(`[SEED] Template already exists: ${templateData.Name}`);
      templateMap.set(templateData.Name, existing);
    }
  }
  
  console.info('[SEED] Template seeding completed.');
  return templateMap;
}

async function seedPages(strapi: StrapiAny, templateMap: Map<string, any>): Promise<any[]> {
  console.info('[SEED] Starting page seeding...');
  
  // Get or create configuration
  let configuration = await strapi.db.query('api::configuration.configuration').findOne({
    where: { Title: 'DJ Torchinim Website' },
  });
  
  if (!configuration) {
    configuration = await strapi.db.query('api::configuration.configuration').create({
      data: {
        Title: 'DJ Torchinim Website',
        publishedAt: new Date(),
      },
    });
    console.info('[SEED] Created default Configuration');
  }
  
  const results: any[] = [];
  
  for (const pageData of PAGE_SEEDS) {
    const existing = await strapi.db.query('api::page.page').findOne({
      where: { Slug: pageData.Slug },
    });
    
    if (!existing) {
      // Get the associated template
      const template = templateMap.get(pageData.templateName);
      
      const created = await strapi.db.query('api::page.page').create({
        data: {
          Title: pageData.Title,
          Slug: pageData.Slug,
          Menu: pageData.Menu,
          AuthState: pageData.AuthState,
          NavigationOrder: pageData.NavigationOrder,
          NavigationAction: pageData.NavigationAction,
          template: template?.id ?? null,
          configuration: configuration.id,
          publishedAt: new Date(),
        },
      });
      console.info(`[SEED] Created Page: ${pageData.Title} (${pageData.Slug})`);
      results.push(created);
    } else {
      console.info(`[SEED] Page already exists: ${pageData.Title} (${pageData.Slug})`);
      results.push(existing);
    }
  }
  
  console.info('[SEED] Page seeding completed.');
  return results;
}

// ============================================================================
// Main Export
// ============================================================================

export default async function seedPagesTask({ strapi }: { strapi: StrapiAny }) {
  // Seed templates first (pages reference templates)
  const templateMap = await seedTemplates(strapi);
  
  // Seed pages with template references
  await seedPages(strapi, templateMap);
}
