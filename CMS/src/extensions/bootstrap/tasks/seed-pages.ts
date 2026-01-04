// CMS/src/extensions/bootstrap/tasks/seed-pages.ts
// Seeds pages and templates on first run

type StrapiAny = any;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate a URL-friendly slug from a title
 */
function generateSlug(title: string, prefix: string = ''): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return prefix ? `${prefix}/${slug}` : `/${slug}`;
}

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
    Name: 'Change Password Template',
    TemplateType: 'ChangePassword',
  },
  {
    Name: 'Profile Template',
    TemplateType: 'Profile',
  },
  {
    Name: 'Article Template',
    TemplateType: 'Standard',
  },
  // Note: Individual article templates are created dynamically in seedArticlePages
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
    Title: 'Logout',
    Slug: '#', // No actual page needed for action items
    Menu: 'Login',
    AuthState: 'OnlyAuthenticated',
    NavigationOrder: 2,
    NavigationAction: 'Action',
    templateName: null, // No template needed for action items
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
    Title: 'Change Password',
    Slug: '/change-password',
    Menu: 'NotVisible',
    AuthState: 'OnlyAuthenticated',
    NavigationOrder: 98,
    NavigationAction: 'Link',
    templateName: 'Change Password Template',
  },
  {
    Title: 'Profile',
    Slug: '/profile',
    Menu: 'Login',
    AuthState: 'OnlyAuthenticated',
    NavigationOrder: 3,
    NavigationAction: 'Link',
    templateName: 'Profile Template',
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
// Build Template Content with references to seeded content types
// ============================================================================

async function buildHomeTemplateContent(strapi: StrapiAny): Promise<any[]> {
  const content: any[] = [];

  // Add hero block reference (first one for home page)
  const heroBlocks = await strapi.db
    .query('api::hero-block.hero-block')
    .findMany({});
  const homeHeroBlock = heroBlocks.find((h: any) =>
    h.heading?.includes('Electronic Music Producer'),
  );
  if (homeHeroBlock) {
    content.push({
      __component: 'hero-block-ref.hero-block-ref',
      hero_block: homeHeroBlock.id,
    });
  } else if (heroBlocks.length > 0) {
    content.push({
      __component: 'hero-block-ref.hero-block-ref',
      hero_block: heroBlocks[0].id,
    });
  }

  // Add feature section reference
  const featureSections = await strapi.db
    .query('api::feature-section.feature-section')
    .findMany({});
  if (featureSections.length > 0) {
    content.push({
      __component: 'feature-section-ref.feature-section-ref',
      feature_section: featureSections[0].id,
    });
  }

  return content;
}

async function buildAboutTemplateContent(strapi: StrapiAny): Promise<any[]> {
  const content: any[] = [];

  // Add a hero block for about page (looking for one about club residencies or similar)
  const heroBlocks = await strapi.db
    .query('api::hero-block.hero-block')
    .findMany({});
  const aboutHeroBlock = heroBlocks.find((h: any) =>
    h.heading?.includes('Private Events'),
  );
  if (aboutHeroBlock) {
    content.push({
      __component: 'hero-block-ref.hero-block-ref',
      hero_block: aboutHeroBlock.id,
    });
  } else if (heroBlocks.length > 1) {
    content.push({
      __component: 'hero-block-ref.hero-block-ref',
      hero_block: heroBlocks[1].id,
    });
  }

  return content;
}

async function buildEventsTemplateContent(strapi: StrapiAny): Promise<any[]> {
  const content: any[] = [];

  // Add a hero block for events page (looking for one about live performance)
  const heroBlocks = await strapi.db
    .query('api::hero-block.hero-block')
    .findMany({});
  const eventsHeroBlock = heroBlocks.find((h: any) =>
    h.heading?.includes('Ibiza Summer Festival'),
  );
  if (eventsHeroBlock) {
    content.push({
      __component: 'hero-block-ref.hero-block-ref',
      hero_block: eventsHeroBlock.id,
    });
  } else if (heroBlocks.length > 2) {
    content.push({
      __component: 'hero-block-ref.hero-block-ref',
      hero_block: heroBlocks[2].id,
    });
  }

  return content;
}

async function buildContactTemplateContent(strapi: StrapiAny): Promise<any[]> {
  const content: any[] = [];

  // Add contact section reference
  const contactSections = await strapi.db
    .query('api::contact-section.contact-section')
    .findMany({});
  if (contactSections.length > 0) {
    content.push({
      __component: 'contact-section-ref.contact-section-ref',
      contact_section: contactSections[0].id,
    });
  }

  return content;
}

async function buildArticleTemplateContent(strapi: StrapiAny): Promise<any[]> {
  const content: any[] = [];

  // Add article block reference (using db.query for consistency)
  const articleBlocks = await strapi.db
    .query('api::article-block.article-block')
    .findMany({});
  if (articleBlocks.length > 0) {
    content.push({
      __component: 'article-block-ref.article-block-ref',
      block: articleBlocks[0].id,
    });
  }

  return content;
}

// ============================================================================
// Seeding Functions
// ============================================================================

async function seedTemplates(strapi: StrapiAny): Promise<void> {
  console.info('[SEED] Starting template seeding...');

  for (const templateData of TEMPLATE_SEEDS) {
    // Use Document Service for draftAndPublish: true content types
    const existing = await strapi
      .documents('api::template.template')
      .findFirst({
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
      } else if (templateData.Name === 'Article Template') {
        content = await buildArticleTemplateContent(strapi);
      }
      // Login, Forgot Password, and Change Password templates use built-in blocks, no Content needed
      // Create and publish using Document Service
      await strapi.documents('api::template.template').create({
        data: {
          Name: templateData.Name,
          TemplateType: templateData.TemplateType,
          Content: content,
        },
        status: 'published',
      });
      console.info(
        `[SEED] Created Template: ${templateData.Name} (with ${content.length} content block(s))`,
      );
    } else {
      console.info(`[SEED] Template already exists: ${templateData.Name}`);
    }
  }

  console.info('[SEED] Template seeding completed.');
}

async function seedPages(
  strapi: StrapiAny,
  configurationDocId: string | null,
): Promise<any[]> {
  console.info('[SEED] Starting page seeding...');

  const results: any[] = [];

  // First, get all templates to map names to documentIds
  const templates = await strapi
    .documents('api::template.template')
    .findMany({});
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

      // Add configuration relation if it exists
      if (configurationDocId) {
        pagePayload.configuration = configurationDocId;
      }

      const created = await strapi.documents('api::page.page').create({
        data: pagePayload,
        status: 'published',
      });
      console.info(
        `[SEED] Created Page: ${pageData.Title} (${pageData.Slug}) with template: ${pageData.templateName}`,
      );
      results.push(created);
    } else {
      console.info(
        `[SEED] Page already exists: ${pageData.Title} (${pageData.Slug})`,
      );
      results.push(existing);
    }
  }

  console.info('[SEED] Page seeding completed.');
  return results;
}

// Seed individual article pages with dedicated templates
async function seedArticlePages(
  strapi: StrapiAny,
  configurationDocId: string | null,
): Promise<any[]> {
  console.info(
    '[SEED] Starting article pages seeding (with dedicated templates)...',
  );

  const results: any[] = [];

  // Get all articles to create pages for
  const articles = await strapi.documents('api::article.article').findMany({});

  // Get the Articles parent page to set as parent for article pages
  const articlesPage = await strapi.documents('api::page.page').findFirst({
    filters: { Slug: '/articles' },
  });
  const articlesPageDocId = articlesPage?.documentId;

  let orderNum = 100; // Start at 100 for article pages

  for (const article of articles) {
    // Generate slug from article title - just the slug without /articles prefix
    // Frontend calculates the full path using Articles page as parent
    const articleSlug = generateSlug(article.Title);
    const templateName = `${article.Title} Template`;

    // 1. Create a dedicated template for this article
    let articleTemplate = await strapi
      .documents('api::template.template')
      .findFirst({
        filters: { Name: templateName },
      });

    if (!articleTemplate) {
      // Build template content - include article reference directly
      const content: any[] = [];

      // Add article reference directly to the template content
      content.push({
        __component: 'article-ref.article-ref',
        article: article.id,
      });

      articleTemplate = await strapi
        .documents('api::template.template')
        .create({
          data: {
            Name: templateName,
            TemplateType: 'Standard',
            Content: content,
          },
          status: 'published',
        });
      console.info(`[SEED] Created Article Template: ${templateName}`);
    } else {
      console.info(`[SEED] Article Template already exists: ${templateName}`);
    }

    // 2. Create the page for this article
    const existingPage = await strapi.documents('api::page.page').findFirst({
      filters: { Slug: articleSlug },
    });

    if (!existingPage) {
      const pagePayload: any = {
        Title: article.Title,
        Slug: articleSlug,
        Menu: 'Main', // Article pages visible in main menu
        AuthState: 'All',
        NavigationOrder: orderNum++,
        NavigationAction: 'Link',
      };

      // Add template relation (use the dedicated template we just created)
      if (articleTemplate) {
        pagePayload.template = articleTemplate.documentId;
      }

      // Add configuration relation
      if (configurationDocId) {
        pagePayload.configuration = configurationDocId;
      }

      // Add parent relation to Articles page
      if (articlesPageDocId) {
        pagePayload.Parents = [articlesPageDocId];
      }

      const created = await strapi.documents('api::page.page').create({
        data: pagePayload,
        status: 'published',
      });
      console.info(
        `[SEED] Created Article Page: ${article.Title} (${articleSlug}) with template: ${templateName} and parent: Articles`,
      );
      results.push(created);
    } else {
      console.info(
        `[SEED] Article Page already exists: ${article.Title} (${articleSlug})`,
      );
      results.push(existingPage);
    }
  }

  console.info('[SEED] Article pages seeding completed.');
  return results;
}

// Link Configuration to Footer
async function linkConfigurationToFooter(
  strapi: StrapiAny,
): Promise<string | null> {
  console.info('[SEED] Linking Configuration to Footer...');

  // Get the configuration
  const configurations = await strapi
    .documents('api::configuration.configuration')
    .findMany({});
  if (configurations.length === 0) {
    console.warn('[SEED] No configuration found to link');
    return null;
  }
  const configuration = configurations[0];

  // Get the footer
  const footers = await strapi.documents('api::footer.footer').findMany({});
  if (footers.length === 0) {
    console.warn('[SEED] No footer found to link');
    return configuration.documentId;
  }
  const footer = footers[0];

  // Update footer to link to configuration
  try {
    await strapi.documents('api::footer.footer').update({
      documentId: footer.documentId,
      data: {
        configuration: configuration.documentId,
      },
      status: 'published',
    });
    console.info(`[SEED] Linked Footer to Configuration`);
  } catch (error) {
    console.warn(
      `[SEED] Could not link Footer to Configuration: ${(error as Error).message}`,
    );
  }

  return configuration.documentId;
}

// ============================================================================
// Main Export
// ============================================================================

export default async function seedPagesTask({ strapi }: { strapi: StrapiAny }) {
  // Seed templates first
  await seedTemplates(strapi);

  // Link configuration to footer and get config documentId
  const configurationDocId = await linkConfigurationToFooter(strapi);

  // Seed pages with configuration relation
  await seedPages(strapi, configurationDocId);

  // Seed individual article pages
  await seedArticlePages(strapi, configurationDocId);
}
