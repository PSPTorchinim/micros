import {
  BLOCK_REGISTRY,
  getBlockConfigByKind,
  getBlockConfigByRefComponent,
  getBlockConfigByLegacyComponent,
  getRefFieldMapping,
  getLegacyComponentMapping,
  getTemplateContentPopulateConfig,
  isValidBlockKind,
} from './block-registry';

describe('Block Registry', () => {
  describe('BLOCK_REGISTRY', () => {
    it('contains all expected block types', () => {
      const kinds = BLOCK_REGISTRY.map((config) => config.kind);
      
      expect(kinds).toContain('hero-block');
      expect(kinds).toContain('image-slider');
      expect(kinds).toContain('article-block');
      expect(kinds).toContain('steps-container');
      expect(kinds).toContain('cta');
      expect(kinds).toContain('feature-section');
      expect(kinds).toContain('contact-section');
      expect(kinds).toContain('feature-tab');
      expect(kinds).toContain('contact-info');
      expect(kinds).toContain('login-block');
      expect(kinds).toContain('forgot-password-block');
    });

    it('has unique kinds', () => {
      const kinds = BLOCK_REGISTRY.map((config) => config.kind);
      const uniqueKinds = new Set(kinds);
      
      expect(uniqueKinds.size).toBe(kinds.length);
    });

    it('has unique ref components', () => {
      const refComponents = BLOCK_REGISTRY.map((config) => config.refComponent);
      const uniqueRefComponents = new Set(refComponents);
      
      expect(uniqueRefComponents.size).toBe(refComponents.length);
    });

    it('has valid configuration for each block', () => {
      BLOCK_REGISTRY.forEach((config) => {
        expect(config.kind).toBeTruthy();
        expect(config.refComponent).toBeTruthy();
        expect(config.refField).toBeTruthy();
        expect(config.strapiType).toBeTruthy();
      });
    });
  });

  describe('getBlockConfigByKind', () => {
    it('returns config for valid kind', () => {
      const config = getBlockConfigByKind('hero-block');
      
      expect(config).toBeDefined();
      expect(config?.kind).toBe('hero-block');
      expect(config?.refComponent).toBe('hero-block-ref.hero-block-ref');
      expect(config?.refField).toBe('hero_block');
    });

    it('returns undefined for invalid kind', () => {
      const config = getBlockConfigByKind('non-existent-block');
      
      expect(config).toBeUndefined();
    });
  });

  describe('getBlockConfigByRefComponent', () => {
    it('returns config for valid ref component', () => {
      const config = getBlockConfigByRefComponent('image-slider-ref.image-slider-ref');
      
      expect(config).toBeDefined();
      expect(config?.kind).toBe('image-slider');
      expect(config?.refField).toBe('slider');
    });

    it('returns undefined for invalid ref component', () => {
      const config = getBlockConfigByRefComponent('invalid-ref.invalid-ref');
      
      expect(config).toBeUndefined();
    });
  });

  describe('getBlockConfigByLegacyComponent', () => {
    it('returns config for valid legacy component', () => {
      const config = getBlockConfigByLegacyComponent('hero.hero-block');
      
      expect(config).toBeDefined();
      expect(config?.kind).toBe('hero-block');
    });

    it('returns undefined for invalid legacy component', () => {
      const config = getBlockConfigByLegacyComponent('invalid.component');
      
      expect(config).toBeUndefined();
    });

    it('returns undefined for blocks without legacy component', () => {
      // Singleton blocks typically don't have legacy components
      const config = getBlockConfigByLegacyComponent('login.login-block');
      
      expect(config).toBeUndefined();
    });
  });

  describe('getRefFieldMapping', () => {
    it('returns mapping of ref components to ref fields', () => {
      const mapping = getRefFieldMapping();
      
      expect(mapping['hero-block-ref.hero-block-ref']).toBe('hero_block');
      expect(mapping['image-slider-ref.image-slider-ref']).toBe('slider');
      expect(mapping['article-block-ref.article-block-ref']).toBe('block');
    });

    it('includes all blocks in the registry', () => {
      const mapping = getRefFieldMapping();
      const mappingSize = Object.keys(mapping).length;
      
      expect(mappingSize).toBe(BLOCK_REGISTRY.length);
    });
  });

  describe('getLegacyComponentMapping', () => {
    it('returns mapping of legacy components to kinds', () => {
      const mapping = getLegacyComponentMapping();
      
      expect(mapping['hero.hero-block']).toBe('hero-block');
      expect(mapping['image-sliders.image-slider']).toBe('image-slider');
      expect(mapping['articles.article-block']).toBe('article-block');
    });

    it('only includes blocks with legacy components', () => {
      const mapping = getLegacyComponentMapping();
      const mappingSize = Object.keys(mapping).length;
      const blocksWithLegacy = BLOCK_REGISTRY.filter((config) => config.legacyComponent);
      
      expect(mappingSize).toBe(blocksWithLegacy.length);
    });
  });

  describe('getTemplateContentPopulateConfig', () => {
    it('generates populate config with Content.on structure', () => {
      const config = getTemplateContentPopulateConfig();
      
      expect(config.Content).toBeDefined();
      expect(config.Content.on).toBeDefined();
    });

    it('includes page configuration', () => {
      const config = getTemplateContentPopulateConfig();
      
      expect(config.page).toBeDefined();
      expect(config.page.fields).toContain('documentId');
      expect(config.page.fields).toContain('Title');
    });

    it('includes populate config for non-singleton blocks', () => {
      const config = getTemplateContentPopulateConfig();
      const on = config.Content.on;
      
      expect(on['hero-block-ref.hero-block-ref']).toBeDefined();
      expect(on['hero-block-ref.hero-block-ref'].populate.hero_block).toBeDefined();
      
      expect(on['image-slider-ref.image-slider-ref']).toBeDefined();
      expect(on['image-slider-ref.image-slider-ref'].populate.slider).toBeDefined();
    });

    it('excludes singleton blocks from populate config', () => {
      const config = getTemplateContentPopulateConfig();
      const on = config.Content.on;
      
      // Singleton blocks should not be in the populate config
      const singletons = BLOCK_REGISTRY.filter((b) => b.isSingleton);
      singletons.forEach((singleton) => {
        expect(on[singleton.refComponent]).toBeUndefined();
      });
    });
  });

  describe('isValidBlockKind', () => {
    it('returns true for valid block kinds', () => {
      expect(isValidBlockKind('hero-block')).toBe(true);
      expect(isValidBlockKind('image-slider')).toBe(true);
      expect(isValidBlockKind('article-block')).toBe(true);
    });

    it('returns false for invalid block kinds', () => {
      expect(isValidBlockKind('invalid-block')).toBe(false);
      expect(isValidBlockKind('')).toBe(false);
    });

    it('returns false for non-string values', () => {
      expect(isValidBlockKind(null)).toBe(false);
      expect(isValidBlockKind(undefined)).toBe(false);
      expect(isValidBlockKind(123)).toBe(false);
      expect(isValidBlockKind({})).toBe(false);
    });
  });

  describe('Registry consistency', () => {
    it('ensures ref component patterns are consistent', () => {
      BLOCK_REGISTRY.forEach((config) => {
        expect(config.refComponent).toMatch(/-ref\.[a-z-]+-ref$/);
      });
    });

    it('ensures ref field names are snake_case', () => {
      BLOCK_REGISTRY.forEach((config) => {
        expect(config.refField).toMatch(/^[a-z_]+$/);
      });
    });

    it('ensures kind uses kebab-case', () => {
      BLOCK_REGISTRY.forEach((config) => {
        expect(config.kind).toMatch(/^[a-z-]+$/);
      });
    });
  });
});
