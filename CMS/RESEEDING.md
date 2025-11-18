# Content Reseeding Guide

This guide explains how to reseed content blocks and templates when they need to be updated.

## When to Reseed

You should reseed content blocks and templates when:
- Hero block CTAs are missing or incorrect
- Feature section has no Title
- Article block has no article references
- Steps container has no CTA or steps
- Home or About page templates show empty content
- After schema migrations (see SCHEMA_MIGRATION.md)

## How to Reseed

### Option 1: Using Environment Variable (Recommended)

1. Set the environment variable:
   ```bash
   export FORCE_RESEED_CONTENT=true
   ```

2. Restart Strapi:
   ```bash
   npm run develop
   # or
   npm run start
   ```

3. Check the logs - you should see:
   ```
   [BOOT] 🔄 FORCE_RESEED_CONTENT detected - running content reseed...
   [RESEED] 🔄 Starting manual content blocks reseed...
   ```

4. After successful reseed, disable the flag:
   ```bash
   export FORCE_RESEED_CONTENT=false
   ```
   Or remove it from your environment/`.env` file.

### Option 2: Manual Database Reset (For Development Only)

**⚠️ WARNING: This will delete ALL data!**

1. Stop Strapi
2. Delete the database file (for SQLite):
   ```bash
   rm .tmp/data.db
   ```
3. Restart Strapi - it will reseed everything from scratch

## What Gets Reseeded

The reseed process updates:

1. **Content Blocks:**
   - Hero blocks (with CTAs: "Get Started Free", "Learn More")
   - Feature sections (with Title: "Everything You Need to Manage Your DJ Business")
   - Article blocks (with references to all published articles)
   - Steps containers (with CTA: "Create Account" and 3 step components)

2. **Page Templates:**
   - Home Page Template (with hero, feature section, article block, steps container)
   - About Page Template (with contact section)

3. **CTA Schema:**
   - CTAs now use `Label`, `url`, and `OpenInNewTab` fields
   - Old fields like `text`, `href`, `variant` are no longer used

4. **Steps Container Schema:**
   - Steps are now proper Step components with `title`, `description`, and `icon`
   - Action is now a direct relation to a CTA (not a dynamic zone)

## Verification

After reseeding, verify the changes:

1. In Strapi Admin:
   - Go to Content Manager → Template → Home Page Template
   - Check that Content field has 4 blocks
   - Go to Content Manager → CTA
   - Verify CTAs have `Label` and `url` populated
   - Go to Content Manager → Steps Container
   - Verify steps are populated with Step components

2. In Frontend:
   - Visit the home page
   - Verify all sections display correctly
   - Verify CTA buttons work and link correctly
   - Verify steps display with title, description, and numbering

3. Check Strapi logs for confirmation:
   ```
   [RESEED] ✅ Manual reseed completed successfully!
   [RESEED] 💡 Refresh your frontend to see the changes
   ```

## Troubleshooting

### Content Still Not Showing

If content still doesn't appear after reseeding:

1. Check Strapi logs for errors during reseed
2. Verify the content blocks exist in Strapi Admin
3. Clear browser cache and refresh frontend
4. Check browser console for API errors
5. Regenerate frontend types: `cd Frontends/dj-panel && npm run map:strapi`

### Reseed Doesn't Run

If `FORCE_RESEED_CONTENT=true` doesn't trigger reseed:

1. Verify the environment variable is set correctly
2. Check it's in the correct `.env` file
3. Restart Strapi completely (stop and start, not just reload)
4. Check Strapi startup logs

### Schema Migration Issues

If you encounter schema-related errors:

1. See `SCHEMA_MIGRATION.md` for detailed migration steps
2. Verify all schema files are updated correctly
3. Consider a fresh database if in development
4. Check that frontend types are regenerated after Strapi starts

## Implementation Details

The reseed process:
1. Updates all content blocks with proper relations
2. Updates page templates with correct Content configuration
3. Preserves existing data while updating relationships
4. Uses correct field names (Label, url, OpenInNewTab for CTAs)
5. Creates proper Step components for Steps Containers
6. Uses detailed logging for transparency

Files involved:
- `CMS/src/extensions/bootstrap/run-bootstrap.ts` - Main bootstrap orchestrator
- `CMS/src/extensions/bootstrap/tasks/reseed-content-blocks.ts` - Reseed task
- `CMS/src/extensions/bootstrap/tasks/seed-*.ts` - Individual seed functions
- `CMS/src/components/steps/step.json` - Step component schema
