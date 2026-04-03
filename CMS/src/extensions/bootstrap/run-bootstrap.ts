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
    console.info(`[BOOT] Starting task: ${label}`);
    const task = await loadTask(possiblePaths);
    if (!task) {
      console.warn(`[BOOT] ❌ Task not found: ${label}`);
      return;
    }
    await task({ strapi, ...args });
    console.info(`[BOOT] ✅ Task completed: ${label}`);
  } catch (e: any) {
    console.error(`[BOOT] ❌ Task failed: ${label} - ${e?.message ?? e}`);
    console.error(`[BOOT] Error stack: ${e?.stack ?? 'No stack trace'}`);
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
      console.info('[BOOT] Database is empty - seeding will be performed');
    } else {
      console.info(
        `[BOOT] Database contains ${pageCount} page(s) - seeding will be skipped`
      );
    }
    
    return isEmpty;
  } catch (e: any) {
    console.warn(`[BOOT] Could not check if database is empty: ${e?.message ?? e}`);
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
  console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.info('[BOOT] 🚀 Starting Strapi Bootstrap Process');
  console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Check if database is empty
  const dbIsEmpty = await isDatabaseEmpty(strapi);
  
  // Always update public role permissions (important for security and access)
  await runTask(
    strapi,
    'set-all-public-permissions',
    TASKS.allPublicPermissions,
  );

  // Always seed content types so that any newly added block is automatically
  // seeded with example data on the next startup. Each seeding function is
  // idempotent – it checks for existing records before creating, so running
  // this on every boot is safe.
  console.info('');
  console.info('[BOOT] 🎨 Seeding content types (runs on every startup to pick up new blocks)');
  await runTask(strapi, 'seed-content-types', TASKS.seedContentTypes);

  // Only seed articles and pages on the very first run (when the database is
  // empty), as these are large data sets that don't need to be re-checked on
  // every startup.
  if (dbIsEmpty) {
    console.info('');
    console.info('[BOOT] 📦 Running first-run seeding tasks (articles and pages)...');
    console.info('');

    // 1) Seed DJ articles
    console.info('[BOOT] 📝 Step 1/2: Seeding articles');
    await runTask(strapi, 'seed-articles', TASKS.seedArticles);

    // 2) Seed standard pages (Login, Forgot Password, Home, About)
    console.info('');
    console.info('[BOOT] 📄 Step 2/2: Seeding pages (depends on content-types and articles)');
    await runTask(strapi, 'seed-pages', TASKS.seedPages);
    
    console.info('');
    console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.info('[BOOT] ✅ All seeding tasks completed successfully');
    console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } else {
    console.info('');
    console.info('[BOOT] ⏭️  Skipping articles and pages seeding - database already contains data');
    console.info('[BOOT] 💡 Content types have been checked and any new blocks have been seeded');
    console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}
