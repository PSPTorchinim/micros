import { getDocId } from './mapStrapiContentToFrontend';

describe('getDocId Utility', () => {
  it('returns undefined for null or undefined input', () => {
    expect(getDocId(null)).toBeUndefined();
    expect(getDocId(undefined)).toBeUndefined();
  });

  it('extracts documentId from object with documentId property', () => {
    const input = { documentId: 'doc-123' };
    expect(getDocId(input)).toBe('doc-123');
  });

  it('returns input when it is a string', () => {
    expect(getDocId('doc-456')).toBe('doc-456');
  });

  it('extracts id when it is a string property', () => {
    const input = { id: 'id-789' };
    expect(getDocId(input)).toBe('id-789');
  });

  it('ignores numeric id when looking for documentId', () => {
    const input = { id: 123 };
    expect(getDocId(input)).toBeUndefined();
  });

  it('extracts documentId from nested data.attributes', () => {
    const input = {
      data: {
        attributes: {
          documentId: 'nested-doc-123',
        },
      },
    };
    expect(getDocId(input)).toBe('nested-doc-123');
  });

  it('extracts id from nested data.id when it is a string', () => {
    const input = {
      data: {
        id: 'nested-id-456',
      },
    };
    expect(getDocId(input)).toBe('nested-id-456');
  });

  it('prioritizes documentId over other properties', () => {
    const input = {
      documentId: 'priority-doc',
      id: 'fallback-id',
      data: {
        id: 'nested-id',
      },
    };
    expect(getDocId(input)).toBe('priority-doc');
  });

  it('returns undefined for empty object', () => {
    expect(getDocId({})).toBeUndefined();
  });

  it('returns undefined for object with only numeric id', () => {
    const input = {
      data: {
        id: 123,
      },
    };
    expect(getDocId(input)).toBeUndefined();
  });

  it('handles complex nested structures', () => {
    const input = {
      someOtherProp: 'value',
      nested: {
        deeply: {
          value: 'test',
        },
      },
      data: {
        attributes: {
          documentId: 'deep-doc-id',
          title: 'Test Title',
        },
      },
    };
    expect(getDocId(input)).toBe('deep-doc-id');
  });
});
