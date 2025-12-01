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
// Build Template Content (returns empty - relations have issues with strapi.db.query)
// ============================================================================

async function buildHomeTemplateContent(strapi: StrapiAny): Promise<any[]> {
  return [];
}

async function buildAboutTemplateContent(strapi: StrapiAny): Promise<any[]> {
  // Return empty content - relations in dynamic zones have issues with strapi.db.query
  return [];
}

async function buildEventsTemplateContent(strapi: StrapiAny): Promise<any[]> {
  // Return empty content - relations in dynamic zones have issues with strapi.db.query
  return [];
}

async function buildContactTemplateContent(strapi: StrapiAny): Promise<any[]> {
  // Return empty content - relations in dynamic zones have issues with strapi.db.query
  return [];
}

// ============================================================================
// Seeding Functions
// ============================================================================

async function seedTemplates(strapi: StrapiAny): Promise<void> {
  console.info('[SEED] Starting template seeding...');
  
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
      
      await strapi.db.query('api::template.template').create({
        data: {
          Name: templateData.Name,
          TemplateType: templateData.TemplateType,
          Content: content,
          publishedAt: new Date(),
        },
      });
      console.info(`[SEED] Created Template: ${templateData.Name}`);
    } else {
      console.info(`[SEED] Template already exists: ${templateData.Name}`);
    }
  }
  
  console.info('[SEED] Template seeding completed.');
}

async function seedPages(strapi: StrapiAny): Promise<any[]> {
  console.info('[SEED] Starting page seeding...');
  
  const results: any[] = [];
  
  for (const pageData of PAGE_SEEDS) {
    const existing = await strapi.db.query('api::page.page').findOne({
      where: { Slug: pageData.Slug },
    });
    
    if (!existing) {
      // Create page without relations (relations can be set up via Strapi admin)
      const created = await strapi.db.query('api::page.page').create({
        data: {
          Title: pageData.Title,
          Slug: pageData.Slug,
          Menu: pageData.Menu,
          AuthState: pageData.AuthState,
          NavigationOrder: pageData.NavigationOrder,
          NavigationAction: pageData.NavigationAction,
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
  // Seed templates first
  await seedTemplates(strapi);
  
  // Seed pages (relations can be set up via Strapi admin)
  await seedPages(strapi);
}
