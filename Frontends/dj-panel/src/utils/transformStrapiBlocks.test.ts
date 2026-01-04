import { transformStrapiBlocks } from './transformStrapiBlocks';

describe('transformStrapiBlocks', () => {
  it('transforms a ref component with populated data', () => {
    const refComponent = {
      __component: 'image-slider-ref.image-slider-ref',
      id: 1,
      slider: {
        id: 123,
        documentId: 'slider-doc-123',
        Title: 'My Slider',
        Images: [],
      },
    };

    const result = transformStrapiBlocks(refComponent);

    expect(result).toEqual({
      __kind: 'image-slider',
      id: 123,
      documentId: 'slider-doc-123',
      Title: 'My Slider',
      Images: [],
    });
  });

  it('transforms an array of ref components', () => {
    const blocks = [
      {
        __component: 'hero-block-ref.hero-block-ref',
        id: 1,
        hero_block: {
          id: 456,
          documentId: 'hero-doc-456',
          Title: 'Hero Title',
        },
      },
      {
        __component: 'cta-ref.cta-ref',
        id: 2,
        cta: {
          id: 789,
          documentId: 'cta-doc-789',
          ButtonText: 'Click Me',
        },
      },
    ];

    const result = transformStrapiBlocks(blocks) as any[];

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      __kind: 'hero-block',
      id: 456,
      documentId: 'hero-doc-456',
      Title: 'Hero Title',
    });
    expect(result[1]).toEqual({
      __kind: 'cta',
      id: 789,
      documentId: 'cta-doc-789',
      ButtonText: 'Click Me',
    });
  });

  it('returns unpopulated ref component as-is', () => {
    const refComponent = {
      __component: 'article-block-ref.article-block-ref',
      id: 1,
      // block field is missing or null
    };

    const result = transformStrapiBlocks(refComponent);

    // Should return as-is when data is not populated
    expect(result).toEqual(refComponent);
  });

  it('handles unknown ref component types', () => {
    const refComponent = {
      __component: 'unknown-ref.unknown-ref',
      id: 1,
      some_field: { data: 'test' },
    };

    const result = transformStrapiBlocks(refComponent);

    // Should return as-is for unknown types
    expect(result).toEqual(refComponent);
  });

  it('passes through non-ref blocks unchanged', () => {
    const block = {
      __kind: 'article',
      id: 1,
      Title: 'Article Title',
      Content: 'Article content',
    };

    const result = transformStrapiBlocks(block);

    expect(result).toEqual(block);
  });

  it('recursively transforms nested ref components', () => {
    const block = {
      __component: 'some-component',
      nested: {
        __component: 'hero-block-ref.hero-block-ref',
        id: 1,
        hero_block: {
          id: 999,
          Title: 'Nested Hero',
        },
      },
    };

    const result = transformStrapiBlocks(block) as any;

    expect(result.nested).toEqual({
      __kind: 'hero-block',
      id: 999,
      Title: 'Nested Hero',
    });
  });

  it('handles arrays within blocks', () => {
    const block = {
      __kind: 'container',
      items: [
        {
          __component: 'cta-ref.cta-ref',
          id: 1,
          cta: {
            id: 111,
            ButtonText: 'Button 1',
          },
        },
        {
          __component: 'cta-ref.cta-ref',
          id: 2,
          cta: {
            id: 222,
            ButtonText: 'Button 2',
          },
        },
      ],
    };

    const result = transformStrapiBlocks(block) as any;

    expect(result.items).toHaveLength(2);
    expect(result.items[0]).toEqual({
      __kind: 'cta',
      id: 111,
      ButtonText: 'Button 1',
    });
    expect(result.items[1]).toEqual({
      __kind: 'cta',
      id: 222,
      ButtonText: 'Button 2',
    });
  });

  it('handles empty arrays', () => {
    const result = transformStrapiBlocks([]);
    expect(result).toEqual([]);
  });

  it('handles null and undefined', () => {
    expect(transformStrapiBlocks(null as any)).toEqual(null);
    expect(transformStrapiBlocks(undefined as any)).toEqual(undefined);
  });
});
