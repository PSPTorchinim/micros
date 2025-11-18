# Schema Migration Guide

## Overview

This guide documents the schema changes made to align Strapi content types and provides steps for migrating existing data.

## Schema Changes

### 1. CTA (Call to Action) Content Type

**Before:**
```json
{
  "Label": { "type": "string" },
  "url": { "type": "string" },
  "OpenInNewTab": { "type": "boolean", "default": false },
  "article": { "type": "dynamiczone", "components": [...] }
}
```

**After:**
```json
{
  "Label": { "type": "string", "required": true },
  "url": { "type": "string", "required": true },
  "OpenInNewTab": { "type": "boolean", "default": false }
}
```

**Changes:**
- ✅ Removed `article` dynamic zone (was semantically incorrect - CTAs should just link to URLs)
- ✅ Made `Label` and `url` required fields
- ✅ Seeders updated to use correct field names (`Label`, `url`, `OpenInNewTab`)

**Impact:**
- Existing CTAs will keep their `Label`, `url`, and `OpenInNewTab` values
- The `article` field will be removed (it was not used in production)
- All seeders now create CTAs with required fields populated

### 2. Steps Container Content Type

**Before:**
```json
{
  "heading": { "type": "string" },
  "content": { "type": "text" },
  "action": { "type": "dynamiczone", "components": [...] },
  "steps": { "type": "dynamiczone", "components": [...] }
}
```

**After:**
```json
{
  "heading": { "type": "string", "required": true },
  "content": { "type": "text" },
  "action": { "type": "relation", "relation": "oneToOne", "target": "api::cta.cta" },
  "steps": { "type": "component", "repeatable": true, "component": "steps.step" }
}
```

**New Component: `steps.step`**
```json
{
  "title": { "type": "string", "required": true },
  "description": { "type": "text", "required": true },
  "icon": { "type": "string" }
}
```

**Changes:**
- ✅ Created new `steps.step` component with proper fields
- ✅ Changed `action` from dynamic zone to direct relation to CTA
- ✅ Changed `steps` from dynamic zone to repeatable component
- ✅ Made `heading` required

**Impact:**
- Existing steps containers need to be updated
- The `action` field will change from dynamic zone to direct CTA relation
- The `steps` field will use the new Step component structure
- Frontend updated to handle new structure

## Migration Steps

### Option 1: Fresh Database (Recommended for Development)

If you're in development and can afford to lose existing data:

1. **Backup important data** (if any)

2. **Stop Strapi**
   ```bash
   # Stop the running Strapi instance
   ```

3. **Clear the database**
   ```bash
   # For SQLite (development)
   cd CMS
   rm .tmp/data.db
   
   # For PostgreSQL (production)
   # Use your database management tool to clear relevant tables
   ```

4. **Start Strapi**
   ```bash
   cd CMS
   npm run develop
   ```

5. **Verify seeding**
   - Check Strapi logs for successful seeding messages
   - Login to Strapi Admin and verify content

### Option 2: Manual Migration (For Production)

If you need to preserve existing data:

1. **Backup database**
   ```bash
   # Create a full database backup
   ```

2. **Update Strapi schemas**
   - The schema files have already been updated
   - Strapi will detect changes on next startup

3. **Start Strapi**
   ```bash
   cd CMS
   npm run develop
   ```

4. **Manual fixes** (if needed)
   - Open Strapi Admin
   - For each Steps Container:
     - Replace dynamic zone `action` with direct CTA relation
     - Replace dynamic zone `steps` with Step components
   
   - For each CTA:
     - Verify `Label` and `url` are populated
     - Remove any `article` dynamic zone content

## Frontend Updates

### Regenerate TypeScript Types

After Strapi starts with new schemas:

```bash
cd Frontends/dj-panel

# Ensure Strapi is running
# Then regenerate types
npm run map:strapi
```

This will regenerate `/Frontends/dj-panel/src/models/strapi/strapiMap.ts` with updated type definitions.

### Component Changes

The following components were updated to match new schemas:

1. **StepsContainerBlock** (`/Frontends/dj-panel/src/components/content-blocks/StepsContainerBlock/index.tsx`)
   - Updated to handle `action` as direct CTA relation
   - Updated to handle `steps` as component array with `title`, `description`, `icon`

2. **HeroBlock** and **CTABlock** - Already correct, no changes needed

## Verification

### Backend (Strapi)

1. **Check Strapi Admin**
   - Navigate to Content Manager → CTA
   - Verify CTAs have `Label` and `url` populated
   - Confirm no `article` field exists

2. **Check Steps Container**
   - Navigate to Content Manager → Steps Container
   - Verify `action` is a direct relation to a CTA
   - Verify `steps` contains Step components with title/description/icon

3. **Check Templates**
   - Navigate to Content Manager → Template
   - Open "Home Page Template"
   - Verify all content blocks load correctly

### Frontend

1. **Build Frontend**
   ```bash
   cd Frontends/dj-panel
   npm run build
   ```

2. **Test Pages**
   - Visit home page (`/`)
   - Verify Hero block displays with CTAs
   - Verify Steps Container displays steps correctly
   - Verify all CTA buttons work

3. **Check Console**
   - Open browser DevTools
   - Check for any TypeScript or runtime errors
   - Verify API calls return expected data

## Rollback Plan

If issues occur:

1. **Stop services**

2. **Restore database backup**

3. **Revert schema changes**
   ```bash
   git revert <commit-hash>
   ```

4. **Restart services**

## Files Modified

### Backend (CMS)
- `CMS/src/api/cta/content-types/cta/schema.json`
- `CMS/src/api/steps-container/content-types/steps-container/schema.json`
- `CMS/src/components/steps/step.json` (new)
- `CMS/src/extensions/bootstrap/tasks/seed-hero-blocks.ts`
- `CMS/src/extensions/bootstrap/tasks/seed-steps-containers.ts`

### Frontend
- `Frontends/dj-panel/src/components/content-blocks/StepsContainerBlock/index.tsx`
- `Frontends/dj-panel/src/models/strapi/strapiMap.ts` (auto-generated, needs regeneration)

## Support

If you encounter issues:

1. Check Strapi logs for detailed error messages
2. Verify environment variables are correct
3. Ensure database has proper permissions
4. Check the GitHub issue for updates and discussion
