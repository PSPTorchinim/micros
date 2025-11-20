# Dynamic Content Building - User Guide

This guide explains how to create and configure dynamic pages using the Strapi CMS with a flexible, code-free approach.

## Overview

The dynamic content building system allows you to create any type of page (login, user profile, landing pages, etc.) through the Strapi CMS without requiring code changes. You can configure text, labels, placeholders, layouts, and styling entirely through the admin interface.

## Key Improvement: No More Template Types!

**BEFORE**: Each new page type (login, forgot password, user profile) required:
- Adding a new enum value to `TemplateType` in the schema
- Creating special singleton content types
- Updating frontend code with hardcoded logic
- Redeploying the application

**NOW**: All pages are built dynamically using content blocks:
- No code changes needed to create new page types
- All content blocks are available in the Template's Content dynamic zone
- Add, remove, and rearrange blocks freely through Strapi admin
- Changes are live immediately without redeployment

## Creating Any Type of Page

### Step 1: Create Content Blocks

Content blocks are reusable components that make up your page. Available blocks include:

1. **Login Block** - For authentication pages
2. **Forgot Password Block** - For password reset pages
3. **Hero Block** - Eye-catching headers with images
4. **Feature Section** - Highlight key features
5. **Article Block** - Rich text content
6. **Contact Section** - Contact forms and information
7. **CTA (Call to Action)** - Action buttons
8. **Image Slider** - Image carousels
9. **Steps Container** - Step-by-step guides
10. **Feature Tab** - Tabbed content
11. **Contact Info** - Contact details display

**To create a content block:**

1. Log into your Strapi admin panel (usually at `http://localhost:1337/admin`)
2. Navigate to **Content Manager** → Select the block type you want (e.g., **Login Block**)
3. Click **Create new entry**
4. Configure the block fields (each block has its own customizable fields)
5. Click **Save** and **Publish**

**Example: Creating a Login Block**

Configure these fields:
- **Title**: "Welcome Back" (or any heading you prefer)
- **Email Label**: "Email Address"
- **Password Label**: "Password"
- **Submit Button Text**: "Sign In"
- **Forgot Password Text**: "Can't access your account?"
- **Reset Password Link Text**: "Reset it here"
- **Email Placeholder**: "you@example.com"
- **Password Placeholder**: "Enter your password"
- **Redirect Path**: "/dashboard"
- **Forgot Password URL**: "/users/forgot-password"
- **Custom Styles**: `{"backgroundColor": "#f5f5f5", "padding": "40px"}` (optional)

### Step 2: Create a Template

Templates are containers that hold content blocks. They define what content appears on a page.

1. Navigate to **Content Manager** → **Template**
2. Click **Create new entry**
3. Configure the template:
   - **Name**: Give it a descriptive name (e.g., "Login Page Template" or "User Profile Template")
   - **Content**: Click **Add component** and select any content block reference you want
     - For a login page: Add **Login Block Ref** → Select your Login Block
     - For a user profile page: Add **Article Block Ref** or custom blocks
     - For a complex page: Add multiple blocks (Hero Block + Feature Section + CTA, etc.)
4. **Arrange blocks**: Drag and drop to reorder blocks as needed
5. Click **Save** and **Publish**

**Important**: You can add as many blocks as you want to a single template. The order in the Content array determines the order on the page.

### Step 3: Create a Page

Pages link templates to URLs and control navigation visibility.

1. Navigate to **Content Manager** → **Page**
2. Click **Create new entry**
3. Configure the page:
   - **Title**: The page title (e.g., "Login" or "My Profile")
   - **Slug**: URL path for the page (e.g., "login" for `/login` or "profile" for `/profile`)
   - **Menu**: Select where the page appears:
     - "Main" - Appears in main navigation
     - "Login" - Appears in login menu
     - "NotVisible" - Doesn't appear in navigation
   - **Auth State**: Control who can see the page:
     - "All" - Everyone can access
     - "OnlyAuthenticated" - Only logged-in users
     - "OnlyUnauthenticated" - Only guests (not logged in)
   - **Navigation Order**: Set the order in the menu (lower numbers appear first)
   - **Template**: Select the Template you created in Step 2
4. Click **Save** and **Publish**

### Step 4: Access Your Page

Navigate to your frontend application at the slug you configured (e.g., `http://localhost:3000/#/login` or `http://localhost:3000/#/profile`)

## Examples of What You Can Build

### 1. Login Page
**Template Content:**
- Login Block Ref

**Result:** A complete login form with email, password, and forgot password link

### 2. Landing Page
**Template Content:**
- Hero Block Ref (eye-catching header)
- Feature Section Ref (3 key features)
- Steps Container Ref (how it works)
- CTA Ref (call-to-action button)

**Result:** A professional landing page

### 3. About Page
**Template Content:**
- Hero Block Ref (company mission)
- Article Block Ref (company story)
- Contact Section Ref (contact form)
- Contact Info Ref (address, phone, email)

**Result:** Complete about/contact page

### 4. User Profile Page
**Template Content:**
- Article Block Ref (user information display)
- Or create a custom "User Profile Block" following the same pattern

**Result:** User profile page showing account details

### 5. Multi-purpose Page
**Template Content:**
- Hero Block Ref
- Article Block Ref
- Feature Tab Ref
- Image Slider Ref
- CTA Ref

**Result:** Rich, multi-section page with various content types

## Custom Styling

You can apply custom styles through the **Custom Styles** field available in many blocks (e.g., Login Block, Forgot Password Block). This field accepts a JSON object with CSS properties.

### Example:

```json
{
  "backgroundColor": "#f5f5f5",
  "padding": "40px",
  "borderRadius": "12px",
  "boxShadow": "0 2px 8px rgba(0,0,0,0.1)"
}
```

This will apply these styles to the block container.

## Features

- ✅ Fully customizable text and labels for all blocks
- ✅ Flexible page composition with multiple content blocks
- ✅ No code changes needed to create new page types
- ✅ Consistent styling with the existing UI
- ✅ Responsive design
- ✅ Optional custom styling via JSON
- ✅ Works with the existing navigation system
- ✅ Access control via Auth State settings
- ✅ React Router Link for navigation (better performance)

## Creating New Content Block Types

To add a completely new type of content block (e.g., "User Profile Block", "Pricing Table Block"):

### Backend (Strapi)

1. **Create the content type** in `CMS/src/api/`:
   ```bash
   mkdir -p CMS/src/api/your-block/content-types/your-block
   ```

2. **Create the schema** `schema.json`:
   ```json
   {
     "kind": "collectionType",
     "collectionName": "your_blocks",
     "info": {
       "singularName": "your-block",
       "pluralName": "your-blocks",
       "displayName": "Your Block"
     },
     "options": { "draftAndPublish": true },
     "attributes": {
       "title": { "type": "string" },
       "content": { "type": "richtext" }
     }
   }
   ```

3. **Create a ref component** in `CMS/src/components/your-block-ref/`:
   ```json
   {
     "collectionName": "components_your_block_ref_your_block_refs",
     "info": { "displayName": "YourBlockRef" },
     "attributes": {
       "your_block": {
         "type": "relation",
         "relation": "oneToOne",
         "target": "api::your-block.your-block"
       }
     }
   }
   ```

4. **Add the ref to Template schema** in `CMS/src/api/template/content-types/template/schema.json`:
   Add `"your-block-ref.your-block-ref"` to the `components` array in the `Content` dynamic zone.

### Frontend

1. **Create the React component** in `Frontends/dj-panel/src/components/content-blocks/YourBlock/`:
   ```tsx
   export const YourBlock: React.FC<any> = (props) => {
     return (
       <div>
         <h2>{props.title}</h2>
         <div dangerouslySetInnerHTML={{ __html: props.content }} />
       </div>
     );
   };
   ```

2. **Register in renderBlock** (`Frontends/dj-panel/src/components/renderBlock.tsx`):
   ```tsx
   case 'your-block':
     return <YourBlock key={index} {...block} />;
   ```

3. **Add to mapping** (`Frontends/dj-panel/src/utils/mapStrapiContentToFrontend.ts`):
   - Add to `FIELD_BY_REF`: `'your-block-ref.your-block-ref': 'your_block'`
   - Add cases in both documentId and numeric id switch statements

4. **Add API methods** (`Frontends/dj-panel/src/services/strapi-api.ts`):
   ```tsx
   async getYourBlockByDocumentId(id: string) { ... }
   async getYourBlockById(id: number) { ... }
   ```

That's it! Your new block type will be available to use in any template without requiring changes to the core template system.

## Troubleshooting

### Content not appearing
- Make sure all content blocks are published in Strapi
- Check that the correct block references are selected in the Template
- Verify the Template is assigned to the Page

### Styling not applied
- Verify the Custom Styles JSON is valid
- Check browser console for any errors
- Ensure CSS properties are using camelCase (e.g., `backgroundColor`, not `background-color`)

### Authentication not working
- Verify the IdentityAPI service is running
- Check that JWT configuration is correct
- Look for errors in the browser console

### Page not found
- Check that the Page is published in Strapi
- Verify the slug matches the URL you're visiting
- Ensure the Page has a Template assigned

## Technical Details

### Backend (Strapi CMS)
- **Content Types**: All blocks are `collectionType` (can have multiple instances)
- **Components**: Ref components link templates to content blocks
- **Dynamic Zone**: The `Content` field in Templates accepts any registered block ref
- **No Template Types**: Templates are defined purely by their content blocks

### Frontend
- **Components**: Each block type has a React component in `src/components/content-blocks/`
- **Renderer**: `renderBlock.tsx` maps block kinds to React components
- **Mapping**: `mapStrapiContentToFrontend.ts` resolves ref components to actual content
- **Dynamic**: All rendering is based on the Content array, no hardcoded template logic

## Migration from Old System

If you have existing pages using the old `TemplateType` system:

1. **Login pages**: Create a Login Block, add it to a Template via Login Block Ref
2. **Forgot Password pages**: Create a Forgot Password Block, add it to a Template via Forgot Password Block Ref
3. **Standard pages**: No changes needed, they already use the Content dynamic zone

The system is backward compatible - existing pages will continue to work. The old singleton methods are kept for backward compatibility but are no longer required for new pages.

## Future Enhancements

Potential improvements for this feature:
- Visual page builder in Strapi admin
- Block templates/presets for quick page creation
- Block preview in admin panel
- More pre-built block types (pricing tables, testimonials, etc.)
- Block versioning and A/B testing
- Drag-and-drop page reordering
