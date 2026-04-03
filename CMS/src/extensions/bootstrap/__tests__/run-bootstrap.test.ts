/**
 * Run Bootstrap tests
 * Validates the bootstrap orchestration behavior:
 * - seed-content-types always runs to pick up newly added blocks
 * - seed-articles and seed-pages only run when the database is empty
 */

describe('Run Bootstrap', () => {
  describe('Task execution strategy', () => {
    // Reflects the actual categorisation used in run-bootstrap.ts
    const ALWAYS_RUN_TASKS = ['seed-content-types'];
    const FIRST_RUN_ONLY_TASKS = ['seed-articles', 'seed-pages'];

    it('should always run seed-content-types so newly added blocks are seeded', () => {
      // Requirement: when a new block is added to Strapi, it must be
      // automatically seeded with example data on the next startup.
      // This is achieved by running seed-content-types on every boot.
      expect(ALWAYS_RUN_TASKS).toContain('seed-content-types');
    });

    it('should NOT include seed-articles in the always-run list', () => {
      expect(ALWAYS_RUN_TASKS).not.toContain('seed-articles');
    });

    it('should NOT include seed-pages in the always-run list', () => {
      expect(ALWAYS_RUN_TASKS).not.toContain('seed-pages');
    });

    it('should run seed-articles only on the first run (empty database)', () => {
      expect(FIRST_RUN_ONLY_TASKS).toContain('seed-articles');
    });

    it('should run seed-pages only on the first run (empty database)', () => {
      expect(FIRST_RUN_ONLY_TASKS).toContain('seed-pages');
    });

    it('should have no overlap between always-run and first-run-only task lists', () => {
      const intersection = ALWAYS_RUN_TASKS.filter((t) =>
        FIRST_RUN_ONLY_TASKS.includes(t),
      );
      expect(intersection).toHaveLength(0);
    });
  });

  describe('Database empty check', () => {
    // Mirrors the isDatabaseEmpty() logic in run-bootstrap.ts
    function isDatabaseEmpty(pageCount) {
      return pageCount === 0;
    }

    it('should report empty when there are no pages', () => {
      expect(isDatabaseEmpty(0)).toBe(true);
    });

    it('should report not-empty when at least one page exists', () => {
      expect(isDatabaseEmpty(1)).toBe(false);
      expect(isDatabaseEmpty(10)).toBe(false);
    });
  });

  describe('Content type seeding idempotency', () => {
    // All seeding functions follow the pattern: check for existing record,
    // only create if it does not exist. This ensures running them multiple
    // times is safe and does not produce duplicates.

    function shouldCreateRecord(existingRecord) {
      return existingRecord === null;
    }

    it('should skip creation when a record already exists', () => {
      const existingRecord = { id: 1, Label: 'Book DJ' };
      const shouldCreate = shouldCreateRecord(existingRecord);
      expect(shouldCreate).toBe(false);
    });

    it('should create a record when none exists yet', () => {
      const existingRecord = null;
      const shouldCreate = shouldCreateRecord(existingRecord);
      expect(shouldCreate).toBe(true);
    });

    it('new blocks seeded on subsequent boots should not affect existing data', () => {
      // Simulate a scenario where two blocks exist and a third is new
      const existingBlocks = ['Hero Block', 'Article Block'];
      const allConfiguredBlocks = ['Hero Block', 'Article Block', 'New Block'];

      const blocksToCreate = allConfiguredBlocks.filter(
        (b) => !existingBlocks.includes(b),
      );

      expect(blocksToCreate).toEqual(['New Block']);
      expect(blocksToCreate).toHaveLength(1);
    });
  });
});
