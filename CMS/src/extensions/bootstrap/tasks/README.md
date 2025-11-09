# Bootstrap Tasks

This directory contains bootstrap tasks that run when Strapi starts up. These tasks are executed automatically to set up essential content and configurations.

## File Structure

The seeding tasks are organized into focused, single-purpose files for better maintainability:

### Content Type Seeders

- **`seed-hero-blocks.ts`** - Seeds hero blocks
- **`seed-feature-sections.ts`** - Seeds feature sections
- **`seed-article-blocks.ts`** - Seeds article blocks
- **`seed-steps-containers.ts`** - Seeds steps containers
- **`seed-contact-info.ts`** - Seeds contact info entries
- **`seed-contact-sections.ts`** - Seeds contact sections

### Page Seeders

- **`seed-login-page.ts`** - Seeds the Login page
- **`seed-forgot-password-page.ts`** - Seeds the Forgot Password page
- **`seed-home-page.ts`** - Seeds the Home page (references content blocks)
- **`seed-about-page.ts`** - Seeds the About page (references content blocks)

### Content Seeders

- **`seed-articles.ts`** - Seeds DJ articles
- **`seed-footer.ts`** - Seeds the footer (not currently used)

### Helpers

- **`seed-configuration.ts`** - Helper to get/create default configuration

### Orchestrators

- **`seed-content-types.ts`** - Orchestrates all content type seeding
- **`seed-pages.ts`** - Orchestrates all page seeding tasks

## Available Tasks

### `seed-content-types.ts` (Content Orchestrator)

Coordinates seeding of all reusable content types. These content blocks are created first and then referenced by pages:

1. Seeds Hero Blocks
2. Seeds Feature Sections
3. Seeds Article Blocks
4. Seeds Steps Containers
5. Seeds Contact Info entries
6. Seeds Contact Sections

**Content Types Created:**

- **Hero Block**: "Welcome to DJ Beat Blaster" with CTAs
- **Feature Section**: 6 DJ business features (Music Library, Events, Clients, Equipment, Contracts, Email Marketing)
- **Article Block**: "Latest DJ Tips & Guides" container
- **Steps Container**: "Get Started in 3 Simple Steps"
- **Contact Info**: Email, Phone, Location entries
- **Contact Section**: About page content with contact details

### `seed-pages.ts` (Page Orchestrator)

Main entry point that coordinates seeding of all standard pages. Pages reference pre-seeded content blocks:

1. Gets or creates default configuration
2. Seeds Login page
3. Seeds Forgot Password page
4. Seeds Home page (uses Hero Block, Feature Section, Article Block, Steps Container)
5. Seeds About page (uses Contact Section)

### Individual Page Seeders

#### `seed-login-page.ts`

- Creates Login Block single-type with DJ-themed content ("Welcome Back, DJ!")
- Creates Login Template with `TemplateType: "Login"`
- Creates Login Page at `/users/login`
- Includes links to Forgot Password page

#### `seed-forgot-password-page.ts`

- Creates Forgot Password Block single-type with default values
- Creates Forgot Password Template with `TemplateType: "ForgotPassword"`
- Creates Forgot Password Page at `/users/forgot-password`
- Includes links back to Login page

#### `seed-home-page.ts`

- **References** existing Hero Block ("Welcome to DJ Beat Blaster")
- **References** existing Feature Section (6 DJ business features)
- **References** existing Article Block ("Latest DJ Tips & Guides")
- **References** existing Steps Container ("Get Started in 3 Simple Steps")
- Creates Home Template that combines all these content blocks
- Creates Home Page at `/`

#### `seed-about-page.ts`

- **References** existing Contact Section
- Creates About Template
- Creates About Page at `/about`

**Behavior:**

- Each seeder runs in **all environments** (development, staging, production)
- Creates content if it doesn't exist
- Updates existing content with default values if it already exists
- All pages are linked to the configuration (created if needed)
- All content is DJ-themed as specified in requirements

**Customization:**
After the seeder runs, you can customize the content through the Strapi admin panel:

- Navigate to **Content Manager** and select the content type you want to edit
- Modify the text, labels, placeholders, or custom styles
- Save and publish your changes

### `seed-articles.ts`

Seeds 5 comprehensive articles about DJing topics. These articles are available for display in article blocks and have individual pages under `/articles/{article-slug}`.

**Articles created:**

1. **Essential DJ Equipment for Beginners**
   - Comprehensive guide to essential DJ gear
   - Covers controllers, headphones, speakers, laptops, and software
   - Includes budget considerations and getting started tips

2. **Beatmatching Basics: Master the Fundamental Skill**
   - In-depth tutorial on beatmatching techniques
   - Traditional method vs. sync button discussion
   - Practice exercises and common mistakes

3. **Creating the Perfect DJ Set: Song Selection and Flow**
   - Energy management and song selection principles
   - Set structure and mixing techniques
   - Harmonic mixing and phrase matching

4. **EQ Techniques Every DJ Should Master**
   - Complete guide to DJ EQ techniques
   - Bass swap, high-pass filters, and frequency management
   - Genre-specific tips and practice exercises

5. **Building Your Music Library: Organization and Discovery**
   - Library organization systems and best practices
   - Music discovery sources and testing processes
   - Backup strategies and metadata management

**Behavior:**

- Runs in **all environments** (development, staging, production)
- Creates articles if they don't exist (checks by Title)
- Skips articles that already exist to avoid duplicates
- All articles are published with proper locale settings
- Articles include cover images, summaries, and full rich-text content

### `seed-footer.ts`

Seeds the footer single-type with default content including:

- Copyright text
- Link columns (Company, Quick Links)
- Social media links

**Note:** This task is defined but not currently called in the bootstrap orchestrator. To enable it, add it to the TASKS object in `run-bootstrap.ts` and call it in the `runBootstrap` function.

## Task Execution Order

1. `set-all-public-permissions` - Sets up public access permissions
2. `seed-content-types` - Seeds all reusable content blocks:
   - Calls `seedHeroBlocks`
   - Calls `seedFeatureSections`
   - Calls `seedArticleBlocks`
   - Calls `seedStepsContainers`
   - Calls `seedContactInfo`
   - Calls `seedContactSections`
3. `seed-articles` - Seeds 5 comprehensive DJing articles
4. `seed-pages` - Seeds pages that reference the content blocks:
   - Calls `getOrCreateConfiguration` helper
   - Calls `seedLoginPage`
   - Calls `seedForgotPasswordPage`
   - Calls `seedHomePage` (references Hero Block, Feature Section, Article Block, Steps Container)
   - Calls `seedAboutPage` (references Contact Section)

**Key Principle**: Content types are seeded first, then articles, then pages that reference the content. This allows content blocks to be reusable across multiple pages.

## Environment Variables

- `NODE_ENV`: Controls which tasks run (development, production, etc.)

All seeding tasks run in all environments to ensure consistent content across deployments.

## Adding New Bootstrap Tasks

To add a new bootstrap task:

1. Create a new file in this directory (e.g., `seed-my-task.ts`)
2. Export a default async function with signature: `({ strapi }) => Promise<void>`
3. Add the task to the `TASKS` object in `run-bootstrap.ts`
4. Add the task execution in the `runBootstrap` function

Example:

```typescript
// seed-my-task.ts
export default async function seedMyTask({ strapi }: { strapi: any }) {
  strapi.log.info('[SEED][MY_TASK] Starting...');
  // Your seeding logic here
  strapi.log.info('[SEED][MY_TASK] Done!');
}
```

```typescript
// run-bootstrap.ts
const TASKS = {
  // ... existing tasks
  myTask: ['./tasks/seed-my-task', './seed-my-task'] as const,
} as const;

export default async function runBootstrap({ strapi }: { strapi: StrapiAny }) {
  // ... existing tasks
  await runTask(strapi, 'seed-my-task', TASKS.myTask);
}
```
