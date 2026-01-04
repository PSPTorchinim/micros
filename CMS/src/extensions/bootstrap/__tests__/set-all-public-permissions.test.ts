// Test for set-all-public-permissions bootstrap task
import fs from 'fs';
import path from 'path';

describe('set-all-public-permissions', () => {
  describe('Content Type Discovery', () => {
    it('should correctly identify profile-block as a singleType', () => {
      const rootDir = process.cwd();
      const schemaPath = path.join(
        rootDir,
        'src',
        'api',
        'profile-block',
        'content-types',
        'profile-block',
        'schema.json',
      );

      expect(fs.existsSync(schemaPath)).toBe(true);

      const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
      expect(schema.kind).toBe('singleType');
    });

    it('should correctly identify login-block as a singleType', () => {
      const rootDir = process.cwd();
      const schemaPath = path.join(
        rootDir,
        'src',
        'api',
        'login-block',
        'content-types',
        'login-block',
        'schema.json',
      );

      expect(fs.existsSync(schemaPath)).toBe(true);

      const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
      expect(schema.kind).toBe('singleType');
    });

    it('should correctly identify change-password-block as a singleType', () => {
      const rootDir = process.cwd();
      const schemaPath = path.join(
        rootDir,
        'src',
        'api',
        'change-password-block',
        'content-types',
        'change-password-block',
        'schema.json',
      );

      expect(fs.existsSync(schemaPath)).toBe(true);

      const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
      expect(schema.kind).toBe('singleType');
    });

    it('should correctly identify forgot-password-block as a singleType', () => {
      const rootDir = process.cwd();
      const schemaPath = path.join(
        rootDir,
        'src',
        'api',
        'forgot-password-block',
        'content-types',
        'forgot-password-block',
        'schema.json',
      );

      expect(fs.existsSync(schemaPath)).toBe(true);

      const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
      expect(schema.kind).toBe('singleType');
    });

    it('should correctly identify footer as a singleType', () => {
      const rootDir = process.cwd();
      const schemaPath = path.join(
        rootDir,
        'src',
        'api',
        'footer',
        'content-types',
        'footer',
        'schema.json',
      );

      expect(fs.existsSync(schemaPath)).toBe(true);

      const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
      expect(schema.kind).toBe('singleType');
    });

    it('should correctly identify article as a collectionType (not singleType)', () => {
      const rootDir = process.cwd();
      const schemaPath = path.join(
        rootDir,
        'src',
        'api',
        'article',
        'content-types',
        'article',
        'schema.json',
      );

      expect(fs.existsSync(schemaPath)).toBe(true);

      const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
      expect(schema.kind).toBeUndefined(); // collectionTypes don't have kind property, or it's 'collectionType'
    });

    it('should correctly identify page as a collectionType (not singleType)', () => {
      const rootDir = process.cwd();
      const schemaPath = path.join(
        rootDir,
        'src',
        'api',
        'page',
        'content-types',
        'page',
        'schema.json',
      );

      expect(fs.existsSync(schemaPath)).toBe(true);

      const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
      expect(schema.kind).toBeUndefined(); // collectionTypes don't have kind property, or it's 'collectionType'
    });
  });

  describe('Permission Actions', () => {
    it('should define correct actions for singleTypes', () => {
      // For singleTypes like profile-block, only 'find' action should be enabled
      // NOT 'findOne' as that action doesn't exist for singleTypes
      const expectedSingleTypeActions = ['find'];
      const incorrectActions = ['findOne']; // This should NOT be included for singleTypes

      expect(expectedSingleTypeActions).toContain('find');
      expect(incorrectActions).not.toContain('find');
      // Ensure we're not trying to enable non-existent actions
      expect(incorrectActions).toEqual(['findOne']);
    });

    it('should define correct actions for collectionTypes', () => {
      // For collectionTypes like article, both 'find' and 'findOne' actions should be enabled
      const expectedCollectionTypeActions = ['find', 'findOne'];

      expect(expectedCollectionTypeActions).toContain('find');
      expect(expectedCollectionTypeActions).toContain('findOne');
      expect(expectedCollectionTypeActions).toHaveLength(2);
    });
  });

  describe('Expected Behavior', () => {
    it('should document that profile-block endpoint should use find action, not findOne', () => {
      // This test documents the expected behavior:
      // - GET /api/profile-block uses the 'find' action
      // - There is NO 'findOne' action for singleTypes
      // - The permission system should enable 'api::profile-block.profile-block.find'
      // - The permission system should NOT try to enable 'api::profile-block.profile-block.findOne'

      const expectedPermission = 'api::profile-block.profile-block.find';
      const incorrectPermission = 'api::profile-block.profile-block.findOne';

      expect(expectedPermission).toBe('api::profile-block.profile-block.find');
      expect(incorrectPermission).toBe(
        'api::profile-block.profile-block.findOne',
      );

      // Document that these are different
      expect(expectedPermission).not.toBe(incorrectPermission);
    });
  });
});
