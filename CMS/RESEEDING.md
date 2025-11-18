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
- Articles are missing from the database
- Configuration is missing
- Image sliders are not populated
- Pages or templates are not created

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

The reseed process now updates ALL content:

1. **Content Blocks:**
   - Hero blocks (with CTAs: "Get Started Free", "Learn More")
   - Feature sections (with Title: "Everything You Need to Manage Your DJ Business")
   - Article blocks (with references to all published articles)
   - Steps containers (with CTA: "Create Account" and 3 step components)
   - Contact info blocks
   - Contact sections
   - Image sliders

2. **Configuration:**
   - Site configuration (created if missing)
   - Footer content

3. **Articles:**
   - All DJ-related articles (5 comprehensive articles)
   - Article parent page
   - Individual article pages and templates

4. **Page Templates:**
   - Home Page Template (with hero, feature section, article block, steps container)
   - About Page Template (with contact section)
   - Login Page Template
   - Forgot Password Page Template
   - Users parent page

5. **CTA Schema:**
   - CTAs now use `Label`, `url`, and `OpenInNewTab` fields
   - Old fields like `text`, `href`, `variant` are no longer used

6. **Steps Container Schema:**
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
   - Go to Content Manager → Article
   - Verify all 5 articles are present
   - Go to Content Manager → Page
   - Verify all pages are created (Home, About, Login, Forgot Password, Users, Articles, and individual article pages)
   - Go to Content Manager → Configuration
   - Verify configuration exists with footer data
   - Go to Content Manager → Image Slider
   - Verify image sliders are populated

2. In Frontend:
   - Visit the home page
   - Verify all sections display correctly
   - Verify CTA buttons work and link correctly
   - Verify steps display with title, description, and numbering
   - Visit /articles to see all articles
   - Click on individual articles to verify they load

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

### Articles Not Seeding

If articles don't appear:

1. Check Strapi logs for article seeding errors
2. Verify the Articles parent page exists
3. Check that article templates are created
4. Ensure database has space for content

### Configuration Not Creating

If configuration is missing:

1. Check for errors in configuration seeding
2. Verify the configuration schema exists
3. Try manual database reset

## Implementation Details

The reseed process:
1. Updates all content blocks with proper relations
2. Creates configuration and footer if missing
3. Seeds all articles with pages and templates
4. Seeds all standard pages (Login, Forgot Password, Home, About, Users)
5. Updates page templates with correct Content configuration
6. Preserves existing data while updating relationships
7. Uses correct field names (Label, url, OpenInNewTab for CTAs)
8. Creates proper Step components for Steps Containers
9. Seeds contact info and sections
10. Seeds image sliders
11. Uses detailed logging for transparency

Files involved:
- `CMS/src/extensions/bootstrap/run-bootstrap.ts` - Main bootstrap orchestrator
- `CMS/src/extensions/bootstrap/tasks/reseed-content-blocks.ts` - Comprehensive reseed task
- `CMS/src/extensions/bootstrap/tasks/seed-*.ts` - Individual seed functions
- `CMS/src/components/steps/step.json` - Step component schema

## What Changed

The reseed task has been expanded to include:
- ✅ Articles seeding (was missing)
- ✅ Configuration seeding (was missing)
- ✅ Image sliders seeding (was missing)
- ✅ All pages seeding (Login, Forgot Password, Users - were missing)
- ✅ Footer seeding (was missing)
- ✅ Contact info and sections seeding (were missing)

Previously, `FORCE_RESEED_CONTENT=true` only reseeded basic content blocks. Now it reseeds everything.
