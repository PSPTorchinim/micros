# Bootstrap Tasks

This directory contains bootstrap tasks that run when Strapi starts up. These tasks are executed automatically to set up essential content and configurations.

## Available Tasks

### `seed-standard-pages.ts`

Automatically creates standard pages that should exist in all environments:

- **Login Page** (`/users/login`)
  - Creates Login Block single-type with default values
  - Creates Login Template with `TemplateType: "Login"`
  - Creates Login Page with proper configuration

- **Forgot Password Page** (`/users/forgot-password`)
  - Creates Forgot Password Block single-type with default values
  - Creates Forgot Password Template with `TemplateType: "ForgotPassword"`
  - Creates Forgot Password Page with proper configuration

- **Home Page** (`/`)
  - Creates Hero Block with welcome message
  - Creates Feature Section with business management features
  - Creates Steps Container with getting started guide
  - Creates Home Template with `TemplateType: "Standard"`
  - Creates Home Page as main landing page

- **About Page** (`/about`)
  - Creates Contact Section with company information
  - Creates Contact Info with contact details
  - Creates About Template with `TemplateType: "Standard"`
  - Creates About Page with company description

- **User Profile Page** (`/profile`)
  - Creates Profile Template with `TemplateType: "Standard"`
  - Creates Profile Page that displays user data from IdentityAPI
  - Available after user login
  - Shows user email, roles, permissions, and account status

**Behavior:**
- Runs in **all environments** (development, staging, production)
- Creates pages if they don't exist
- Updates existing pages with default values if they already exist
- Links pages to the first available configuration or creates a default one

**Customization:**
After the seeder runs, you can customize the content through the Strapi admin panel:
- Navigate to **Content Manager** and select the content type you want to edit
- Modify the text, labels, placeholders, or custom styles
- Save and publish your changes
- Note: User Profile page content is fetched dynamically from IdentityAPI, so customization is limited to the page metadata

### `seed-dev.ts`

Seeds development data for all content types. This task:
- Only runs in **development** environment when `SEED_DEV=true` (default)
- Cleans existing data
- Creates 5 sample entries for each content type
- Includes realistic data for testing and development

### `seed-footer.ts`

Seeds the footer single-type with default content including:
- Copyright text
- Link columns (Company, Quick Links)
- Social media links

## Task Execution Order

1. `set-all-public-permissions` - Sets up public access permissions
2. `seed-standard-pages` - Creates essential pages (runs in all environments)
3. `seed-dev` - Seeds development data (only in development)

## Environment Variables

- `NODE_ENV`: Controls which tasks run (development, production, etc.)
- `SEED_DEV`: Controls whether development data is seeded (default: `true`)

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
