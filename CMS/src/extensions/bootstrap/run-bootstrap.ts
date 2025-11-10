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
  // 1) Public role → enable all public permissions (unified)
  await runTask(
    strapi,
    'set-all-public-permissions',
    TASKS.allPublicPermissions,
  );

  // 2) Seed all content types (Hero Blocks, Feature Sections, etc.)
  await runTask(strapi, 'seed-content-types', TASKS.seedContentTypes);

  // 3) Seed DJ articles
  await runTask(strapi, 'seed-articles', TASKS.seedArticles);

  // 4) Seed standard pages (Login, Forgot Password, Home, About)
  await runTask(strapi, 'seed-pages', TASKS.seedPages);
}
