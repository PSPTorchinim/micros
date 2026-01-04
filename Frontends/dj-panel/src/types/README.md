# Content Blocks Type System

## Overview

The content blocks type system has been designed to be **generic and extensible**, allowing new Strapi content types to be added without requiring changes to type definitions.

## How It Works

### Core Concept

Instead of defining specific interfaces for each content block type, we use a single generic `ContentBlock` interface:

```typescript
export interface ContentBlock {
  __kind: string;           // Identifies the block type (e.g., 'hero-block', 'article-block')
  __component?: string;     // Strapi component identifier (e.g., 'hero.hero-block')
  [key: string]: unknown;   // All other properties from Strapi
}
```

This approach provides:
- **Flexibility**: Any Strapi content type can be represented
- **Minimal maintenance**: No type updates needed when adding new blocks
- **Type safety**: TypeScript still validates the structure
- **Developer experience**: Clear documentation through comments

## Adding a New Content Block Type

When you need to add a new content type from Strapi, follow these steps:

### 1. Create the Molecule Component

Create a new component in `src/components/molecules/` for your new block type.

**Example**: Creating a `TestimonialBlock`:

```tsx
// src/components/molecules/TestimonialBlock/index.tsx
import React from 'react';

interface TestimonialBlockProps {
  author?: string;
  quote?: string;
  rating?: number;
  [key: string]: unknown;
}

export const TestimonialBlock: React.FC<TestimonialBlockProps> = ({
  author = 'Anonymous',
  quote = '',
  rating = 5,
  ...props
}) => {
  return (
    <div className="testimonial-block">
      <blockquote>{quote}</blockquote>
      <p className="author">— {author}</p>
      <div className="rating">{'⭐'.repeat(rating)}</div>
    </div>
  );
};
```

### 2. Add Rendering Logic

Add a case to the switch statement in `src/components/renderBlock.tsx`:

```tsx
// src/components/renderBlock.tsx
import { TestimonialBlock } from './molecules';

export function renderBlock(block: ContentBlock, index: number): React.ReactElement {
  const kind: string | undefined = block.__kind;

  switch (kind) {
    // ... existing cases ...
    
    case 'testimonial':
      return <TestimonialBlock key={index} {...block} />;
    
    // ... rest of the switch ...
  }
}
```

### 3. (Optional) Add Reference Component Support

If your content type uses Strapi reference components (ending in `-ref`), add the mapping in `src/components/RefBlockRenderer.tsx`:

```tsx
// src/components/RefBlockRenderer.tsx
export const FIELD_BY_REF: Record<string, string> = {
  // ... existing mappings ...
  'testimonial-ref.testimonial-ref': 'testimonial',
};
```

And add the fetching logic in the `RefBlockRenderer` component:

```tsx
// In the resolveRef async function
switch (base) {
  // ... existing cases ...
  case 'testimonial':
    data = await StrapiService.getTestimonialByDocumentId(docId);
    break;
}
```

### 4. That's It!

**No changes needed to `content-blocks.ts`** - the generic type system automatically handles your new block type.

## Reference Components

Reference components are Strapi components that reference other content by ID. The system handles them transparently:

1. `RefBlockRenderer` detects ref components (ending in `-ref`)
2. Checks if data is already populated from Strapi
3. If not, fetches the referenced content asynchronously
4. Passes resolved data to `renderBlock` for rendering

## Migration from Old System

The previous system used explicit interfaces for each block type:

```typescript
// OLD APPROACH (removed)
export interface HeroBlockContentBlock extends BaseContentBlock, Partial<HeroBlock> {
  __kind: 'hero-block';
}

export type ContentBlock = 
  | HeroBlockContentBlock 
  | ArticleBlockContentBlock 
  | /* ... many more types */;
```

**Problems with old approach**:
- Required updating `content-blocks.ts` for every new Strapi type
- Large union type became unwieldy
- Tight coupling between Strapi schema and frontend types
- Maintenance burden

**New approach benefits**:
- Single generic interface handles all types
- No updates needed to type files
- Loose coupling - frontend only needs `__kind` identifier
- Focus on component implementation, not type definitions

## Best Practices

1. **Component Props**: Define explicit prop interfaces in molecule components for better documentation
2. **Default Values**: Always provide sensible defaults in components
3. **Type Assertions**: Use type assertions in `renderBlock.tsx` when you need specific properties
4. **Testing**: Write tests for new molecule components
5. **Documentation**: Document expected Strapi fields in component comments

## Example: Complete Flow

```
Strapi CMS
    ↓ (API Response)
{
  __component: "testimonials.testimonial",
  id: 123,
  author: "John Doe",
  quote: "Great product!",
  rating: 5
}
    ↓ (Transformed by RefBlockRenderer or RenderTemplate)
{
  __kind: "testimonial",
  author: "John Doe",
  quote: "Great product!",
  rating: 5
}
    ↓ (Rendered by renderBlock)
<TestimonialBlock 
  author="John Doe" 
  quote="Great product!" 
  rating={5} 
/>
```

## Troubleshooting

**Q: My new block shows as "Unsupported block"**  
A: Check that the `__kind` value matches the case in `renderBlock.tsx`

**Q: TypeScript complains about missing properties**  
A: Use type assertions in `renderBlock.tsx`: `block as ContentBlock & { yourProp: string }`

**Q: Reference component not loading**  
A: Verify the ref mapping in `FIELD_BY_REF` and the service method exist

## Related Files

- `src/types/content-blocks.ts` - Type definitions
- `src/components/renderBlock.tsx` - Block rendering logic
- `src/components/RenderTemplate.tsx` - Template rendering logic
- `src/components/RefBlockRenderer.tsx` - Reference component resolution
- `src/components/molecules/` - Individual block components
