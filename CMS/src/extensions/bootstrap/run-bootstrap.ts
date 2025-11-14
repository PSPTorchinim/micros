// CMS/src/extensions/bootstrap/run-bootstrap.ts

type StrapiAny = any;

// ---- helpers ---------------------------------------------------------------

/** Try to import the first existing task from a list of module paths. */
async function loadTask(possiblePaths: readonly string[]) {
  for (const p of possiblePaths) {
    try {
      const mod = await import(p);
      if (mod?.default) return mod.default;
    } catch {
      // ignore and try next path
    }
  }
  return null;
}

/** Run a task with consistent logging. */
async function runTask(
  strapi: StrapiAny,
  label: string,
  possiblePaths: readonly string[],
  args: Record<string, unknown> = {},
) {
  try {
    const task = await loadTask(possiblePaths);
    if (!task) {
      strapi.log.warn(`[BOOT] ${label} not found.`);
      return;
    }
    await task({ strapi, ...args });
    strapi.log.debug(`[BOOT] ${label} done.`);
  } catch (e: any) {
    strapi.log.warn(`[BOOT] ${label} failed: ${e?.message ?? e}`);
  }
}

// ---- database empty check --------------------------------------------------

/**
 * Check if the database is empty by looking for core content.
 * We check for the existence of configuration and pages as indicators.
 */
async function isDatabaseEmpty(strapi: StrapiAny): Promise<boolean> {
  try {
    // Check for configuration (should exist if seeding has run)
    const configCount = await strapi.db.query('api::configuration.configuration').count();
    
    // Check for pages (should exist if seeding has run)
    const pageCount = await strapi.db.query('api::page.page').count();
    
    // Database is considered empty if both counts are 0
    const isEmpty = configCount === 0 && pageCount === 0;
    
    if (isEmpty) {
      strapi.log.info('[BOOT] Database is empty - seeding will be performed');
    } else {
      strapi.log.info(
        `[BOOT] Database contains data (${configCount} config(s), ${pageCount} page(s)) - seeding will be skipped`
      );
    }
    
    return isEmpty;
  } catch (e: any) {
    strapi.log.warn(`[BOOT] Could not check if database is empty: ${e?.message ?? e}`);
    // If we can't check, assume we should proceed with seeding (safe default)
    return true;
  }
}

// ---- task path maps --------------------------------------------------------

const TASKS = {
  allPublicPermissions: [
    './tasks/set-all-public-permissions',
    './set-all-public-permissions',
  ] as const,
  seedContentTypes: [
    './tasks/seed-content-types',
    './seed-content-types',
  ] as const,
  seedPages: ['./tasks/seed-pages', './seed-pages'] as const,
  seedArticles: ['./tasks/seed-articles', './seed-articles'] as const,
} as const;

// ---- orchestrator ----------------------------------------------------------

export default async function runBootstrap({ strapi }: { strapi: StrapiAny }) {
  // Check if database is empty
  const dbIsEmpty = await isDatabaseEmpty(strapi);
  
  // Always update public role permissions (important for security and access)
  await runTask(
    strapi,
    'set-all-public-permissions',
    TASKS.allPublicPermissions,
  );

  // Only run seeding tasks if database is empty
  // This improves startup performance when data already exists
  if (dbIsEmpty) {
    strapi.log.info('[BOOT] Running seeding tasks for empty database...');
    
    // 2) Seed all content types (Hero Blocks, Feature Sections, etc.)
    await runTask(strapi, 'seed-content-types', TASKS.seedContentTypes);

    // 3) Seed DJ articles
    await runTask(strapi, 'seed-articles', TASKS.seedArticles);

    // 4) Seed standard pages (Login, Forgot Password, Home, About)
    await runTask(strapi, 'seed-pages', TASKS.seedPages);
    
    strapi.log.info('[BOOT] Seeding tasks completed successfully');
  } else {
    strapi.log.info('[BOOT] Skipping seeding tasks - database already contains data');
  }
}
