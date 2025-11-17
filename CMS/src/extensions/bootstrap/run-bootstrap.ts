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
    strapi.log.info(`[BOOT] Starting task: ${label}`);
    const task = await loadTask(possiblePaths);
    if (!task) {
      strapi.log.warn(`[BOOT] ❌ Task not found: ${label}`);
      return;
    }
    await task({ strapi, ...args });
    strapi.log.info(`[BOOT] ✅ Task completed: ${label}`);
  } catch (e: any) {
    strapi.log.error(`[BOOT] ❌ Task failed: ${label} - ${e?.message ?? e}`);
    strapi.log.error(`[BOOT] Error stack: ${e?.stack ?? 'No stack trace'}`);
    throw e; // Re-throw to ensure failures are visible
  }
}

// ---- database empty check --------------------------------------------------

/**
 * Check if the database is empty by looking for core content.
 * We check for the existence of pages as the main indicator since pages
 * are seeded last and depend on all other content types.
 */
async function isDatabaseEmpty(strapi: StrapiAny): Promise<boolean> {
  try {
    // Check for pages (seeded last, so if they exist, seeding has completed)
    const pageCount = await strapi.db.query('api::page.page').count();
    
    // Database is considered empty if no pages exist
    const isEmpty = pageCount === 0;
    
    if (isEmpty) {
      strapi.log.info('[BOOT] Database is empty - seeding will be performed');
    } else {
      strapi.log.info(
        `[BOOT] Database contains ${pageCount} page(s) - seeding will be skipped`
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
  reseedContentBlocks: [
    './tasks/reseed-content-blocks',
    './reseed-content-blocks',
  ] as const,
} as const;

// ---- orchestrator ----------------------------------------------------------

export default async function runBootstrap({ strapi }: { strapi: StrapiAny }) {
  strapi.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  strapi.log.info('[BOOT] 🚀 Starting Strapi Bootstrap Process');
  strapi.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Check for force reseed environment variable
  const forceReseed = process.env.FORCE_RESEED_CONTENT === 'true';
  
  if (forceReseed) {
    strapi.log.info('[BOOT] 🔄 FORCE_RESEED_CONTENT detected - running content reseed...');
    strapi.log.info('');
    
    // Always update public role permissions first
    await runTask(
      strapi,
      'set-all-public-permissions',
      TASKS.allPublicPermissions,
    );
    
    // Run reseed task
    await runTask(
      strapi,
      'reseed-content-blocks',
      TASKS.reseedContentBlocks,
    );
    
    strapi.log.info('');
    strapi.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    strapi.log.info('[BOOT] ✅ Force reseed completed successfully');
    strapi.log.info('[BOOT] 💡 Set FORCE_RESEED_CONTENT=false to disable on next restart');
    strapi.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return;
  }
  
  // Check if database is empty
  const dbIsEmpty = await isDatabaseEmpty(strapi);
  
  // Always update public role permissions (important for security and access)
  await runTask(
    strapi,
    'set-all-public-permissions',
    TASKS.allPublicPermissions,
  );

  // Always update content types (they handle their own existence checks)
  // This ensures content blocks are properly configured even in existing databases
  strapi.log.info('');
  strapi.log.info('[BOOT] 🎨 Updating content types (hero blocks, feature sections, etc.)...');
  await runTask(strapi, 'seed-content-types', TASKS.seedContentTypes);

  // Only run full seeding if database is empty
  if (dbIsEmpty) {
    strapi.log.info('');
    strapi.log.info('[BOOT] 📦 Database is empty - running full seeding...');
    strapi.log.info('');

    // 1) Seed DJ articles
    strapi.log.info('[BOOT] 📝 Step 1/2: Seeding articles');
    await runTask(strapi, 'seed-articles', TASKS.seedArticles);

    // 2) Seed standard pages (Login, Forgot Password, Home, About)
    strapi.log.info('');
    strapi.log.info('[BOOT] 📄 Step 2/2: Seeding pages');
    await runTask(strapi, 'seed-pages', TASKS.seedPages);
    
    strapi.log.info('');
    strapi.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    strapi.log.info('[BOOT] ✅ All seeding tasks completed successfully');
    strapi.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } else {
    // Database exists - update page templates to ensure they have correct content
    strapi.log.info('');
    strapi.log.info('[BOOT] 📄 Updating page templates...');
    await runTask(strapi, 'seed-pages', TASKS.seedPages);
    
    strapi.log.info('');
    strapi.log.info('[BOOT] ✅ Content types and page templates updated successfully');
    strapi.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}
