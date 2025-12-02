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
  {
    Name: 'Article Template',
    TemplateType: 'Standard',
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
  {
    Title: 'Articles',
    Slug: '/articles',
    Menu: 'Main',
    AuthState: 'All',
    NavigationOrder: 5,
    NavigationAction: 'Link',
    templateName: 'Article Template',
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
    // Use Document Service for draftAndPublish: true content types
    const existing = await strapi.documents('api::template.template').findFirst({
      filters: { Name: templateData.Name },
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
      // Create and publish using Document Service
      await strapi.documents('api::template.template').create({
        data: {
          Name: templateData.Name,
          TemplateType: templateData.TemplateType,
          Content: content,
        },
        status: 'published',
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
  
  // First, get all templates to map names to documentIds
  const templates = await strapi.documents('api::template.template').findMany({});
  const templateMap = new Map<string, string>();
  for (const template of templates) {
    templateMap.set(template.Name, template.documentId);
  }
  
  for (const pageData of PAGE_SEEDS) {
    // Use Document Service for draftAndPublish: true content types
    const existing = await strapi.documents('api::page.page').findFirst({
      filters: { Slug: pageData.Slug },
    });
    
    if (!existing) {
      // Get the template documentId for this page
      const templateDocId = templateMap.get(pageData.templateName);
      
      // Create page with template relation using Document Service
      const pagePayload: any = {
        Title: pageData.Title,
        Slug: pageData.Slug,
        Menu: pageData.Menu,
        AuthState: pageData.AuthState,
        NavigationOrder: pageData.NavigationOrder,
        NavigationAction: pageData.NavigationAction,
      };
      
      // Add template relation if template exists
      if (templateDocId) {
        pagePayload.template = templateDocId;
      }
      
      const created = await strapi.documents('api::page.page').create({
        data: pagePayload,
        status: 'published',
      });
      console.info(`[SEED] Created Page: ${pageData.Title} (${pageData.Slug}) with template: ${pageData.templateName}`);
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
