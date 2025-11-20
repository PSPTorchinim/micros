# Migration Guide: Dynamic Content Building

This guide explains how to migrate from the old template type system to the new dynamic content building system.

## What Changed?

### Before (Old System)
- Templates had a `TemplateType` enum field with values: "Standard", "Login", "ForgotPassword"
- Login and Forgot Password blocks were **singleton types** (only one instance allowed)
- Frontend had hardcoded logic to fetch singleton blocks based on template type
- Adding new page types required code changes

### After (New System)
- Templates have **no TemplateType field** - they're defined purely by their Content blocks
- Login and Forgot Password blocks are **collection types** (multiple instances allowed)
- Login Block Ref and Forgot Password Block Ref components added to Template's Content dynamic zone
- Frontend dynamically renders whatever blocks are in the Content array
- Adding new page types requires **no code changes**

## Breaking Changes

### Strapi Schema Changes

1. **Template Schema** (`CMS/src/api/template/content-types/template/schema.json`):
   - **REMOVED**: `TemplateType` field
   - **ADDED**: `login-block-ref.login-block-ref` and `forgot-password-block-ref.forgot-password-block-ref` to Content components

2. **Login Block** (`CMS/src/api/login-block/content-types/login-block/schema.json`):
   - **CHANGED**: `kind: "singleType"` → `kind: "collectionType"`
   - **CHANGED**: `draftAndPublish: false` → `draftAndPublish: true`

3. **Forgot Password Block** (`CMS/src/api/forgot-password-block/content-types/forgot-password-block/schema.json`):
   - **CHANGED**: `kind: "singleType"` → `kind: "collectionType"`
   - **CHANGED**: `draftAndPublish: false` → `draftAndPublish: true`

### Frontend Changes

1. **RenderTemplate.tsx**:
   - **REMOVED**: Hardcoded checks for `templateType === 'Login'` and `templateType === 'ForgotPassword'`
   - **REMOVED**: Calls to `getLoginBlockSingleton()` and `getForgotPasswordBlockSingleton()`
   - **SIMPLIFIED**: All templates now use the same rendering logic based on Content blocks

2. **Type Definitions**:
   - **REMOVED**: `TemplateType` field from `TemplateEntity` interface

3. **Backward Compatibility**:
   - Singleton API methods (`getLoginBlockSingleton`, `getForgotPasswordBlockSingleton`) are **kept** but unused
   - They remain in the codebase for backward compatibility if needed

## Migration Steps for Existing Data

### Automated Migration (Recommended)

Strapi will automatically handle the schema migration when you restart it. However, you need to manually update your existing Templates.

### Manual Migration Steps

If you have existing Login or Forgot Password pages:

#### Step 1: Update Login Pages

1. Log into Strapi admin (`http://localhost:1337/admin`)
2. Go to **Content Manager** → **Template**
3. Find templates that previously had `TemplateType: "Login"`
4. Edit each template:
   - Remove the Template Type field (it no longer exists)
   - In the **Content** section, click **Add component**
   - Select **Login Block Ref**
   - Select your Login Block
   - **Save** and **Publish**

#### Step 2: Update Forgot Password Pages

1. Go to **Content Manager** → **Template**
2. Find templates that previously had `TemplateType: "ForgotPassword"`
3. Edit each template:
   - Remove the Template Type field (it no longer exists)
   - In the **Content** section, click **Add component**
   - Select **Forgot Password Block Ref**
   - Select your Forgot Password Block
   - **Save** and **Publish**

#### Step 3: Verify Pages Work

1. Navigate to your frontend application
2. Test the login page: `http://localhost:3000/#/users/login`
3. Test the forgot password page: `http://localhost:3000/#/users/forgot-password`
4. Ensure they render correctly

### Creating Multiple Login Blocks

Now that Login Block is a collection type, you can create multiple instances:

1. Go to **Content Manager** → **Login Block**
2. Click **Create new entry**
3. Create different variants:
   - "Standard Login" - for the main login page
   - "Admin Login" - with different styling for admin users
   - "Quick Login" - minimalist version for modals
4. Use the appropriate Login Block Ref in different templates

Same applies to Forgot Password Block!

## New Capabilities

### 1. Flexible Page Composition

You can now mix and match blocks in any combination:

```
Template: "User Dashboard"
Content:
  - Hero Block Ref (welcome banner)
  - Article Block Ref (user info)
  - Feature Section Ref (available features)
  - CTA Ref (upgrade prompt)
```

### 2. Multi-Block Pages

Create pages with multiple content sections without code:

```
Template: "Login with Info"
Content:
  - Hero Block Ref (branding header)
  - Login Block Ref (login form)
  - Feature Tab Ref (why sign up)
  - Contact Info Ref (need help?)
```

### 3. No Code New Page Types

Create a user profile page:

```
Template: "User Profile"
Content:
  - Hero Block Ref (profile header)
  - Article Block Ref (user bio)
  - Contact Info Ref (contact details)
```

Create a pricing page:

```
Template: "Pricing"
Content:
  - Hero Block Ref (pricing header)
  - Feature Section Ref (plan features)
  - CTA Ref (sign up button)
```

## Rollback Plan

If you need to rollback to the old system:

### Backend Rollback

1. Revert schema changes:
   ```bash
   git checkout fc0aca3 -- CMS/src/api/template/content-types/template/schema.json
   git checkout fc0aca3 -- CMS/src/api/login-block/content-types/login-block/schema.json
   git checkout fc0aca3 -- CMS/src/api/forgot-password-block/content-types/forgot-password-block/schema.json
   ```

2. Remove ref components:
   ```bash
   rm -rf CMS/src/components/login-block-ref
   rm -rf CMS/src/components/forgot-password-block-ref
   ```

3. Restart Strapi

### Frontend Rollback

1. Revert frontend changes:
   ```bash
   git checkout fc0aca3 -- Frontends/dj-panel/src/components/RenderTemplate.tsx
   git checkout fc0aca3 -- Frontends/dj-panel/src/types/content-blocks.ts
   git checkout fc0aca3 -- Frontends/dj-panel/src/utils/mapStrapiContentToFrontend.ts
   git checkout fc0aca3 -- Frontends/dj-panel/src/services/strapi-api.ts
   ```

2. Rebuild frontend:
   ```bash
   cd Frontends/dj-panel
   npm run build
   ```

## Testing Checklist

After migration, verify:

- [ ] Existing pages load correctly (home, about)
- [ ] Login page works at `/users/login`
- [ ] Forgot password page works at `/users/forgot-password`
- [ ] Can create new Login Block instances
- [ ] Can create new Forgot Password Block instances
- [ ] Can add Login Block Ref to templates
- [ ] Can add Forgot Password Block Ref to templates
- [ ] Can create new page types without code changes
- [ ] Can mix multiple blocks in a single template
- [ ] Authentication flow still works correctly
- [ ] Password reset flow still works correctly

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check Strapi logs for backend errors
3. Verify all blocks are published in Strapi
4. Ensure Templates have the correct block references
5. Refer to [DYNAMIC_CONTENT_GUIDE.md](DYNAMIC_CONTENT_GUIDE.md) for usage examples

## Benefits Summary

✅ **Flexibility**: Create any page type through admin interface  
✅ **Speed**: No code changes or deployments needed  
✅ **Reusability**: Multiple instances of any block type  
✅ **Maintainability**: Less hardcoded logic in frontend  
✅ **Scalability**: Easy to add new block types  
✅ **Consistency**: Same pattern for all page types  

## Technical Details

### Why This Approach?

1. **Separation of Concerns**: Content structure (blocks) is separate from presentation (frontend)
2. **Open/Closed Principle**: System is open for extension (new blocks) but closed for modification (no code changes)
3. **Single Responsibility**: Each block has one purpose, templates compose them
4. **DRY Principle**: No duplicate code for different template types

### Architecture Benefits

- **Loose Coupling**: Frontend doesn't know about specific template types
- **High Cohesion**: Each block is self-contained
- **Extensibility**: Adding blocks doesn't affect existing code
- **Testability**: Each block can be tested independently

---

**Last Updated**: 2025-11-20  
**Migration Version**: 1.0 → 2.0  
**Breaking Change Level**: Medium (requires manual template updates)
