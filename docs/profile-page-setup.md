# Profile Page Setup Guide

## Issue: "No content to load" Error

If you see "No content to load" (or "Brak treści do wyświetlenia") when accessing the profile page, this means the frontend cannot fetch the profile-block data from Strapi. Follow these steps to fix it:

## Solution Steps

### 1. Ensure Strapi is Running and Content is Created

First, make sure your Strapi CMS is running and the profile-block content type exists:

```bash
cd CMS
npm run develop
```

The seeder should automatically create the profile-block singleton. If not, you can verify in the Strapi admin panel:
- Go to Content Manager → Singles → Profile Block
- If it exists, great! If not, the content type might not be loaded properly.

### 2. **CRITICAL**: Regenerate API Types in Frontend

The frontend needs to regenerate TypeScript API types after adding new content types to Strapi. This is the most common cause of the "No content" error.

**Run this command from the frontend directory:**

```bash
cd Frontends/dj-panel
npm run map:api
```

This command:
- Connects to your running Strapi instance
- Scans all available API endpoints
- Generates TypeScript types and API client methods
- Creates the `profileBlock.getProfileBlock()` method needed by the frontend

**Important**: 
- Strapi must be running when you execute this command
- The command reads from your Strapi API to generate types
- Without this step, the `microservicesClient.strapi.profileBlock` will be undefined

### 3. Verify Profile Block in Strapi Admin

After regenerating types, verify the profile-block has content:

1. Open Strapi admin: http://localhost:1337/admin
2. Go to Content Manager → Singles → Profile Block
3. You should see:
   - Title: "DJ Profile"
   - Description: "View and manage your DJ profile information."
   - Email Label: "Email"
   - Username Label: "DJ Name"
   - Change Password Button Text: "Change Password"
   - Change Password URL: "/change-password"

If the singleton is empty, fill in the fields and save.

### 4. Verify Profile Page Exists

Check that the profile page is created:

1. In Strapi admin, go to Content Manager → Collection Types → Pages
2. Find the "Profile" page with:
   - Slug: `/profile`
   - Menu: "Login"
   - Auth State: "OnlyAuthenticated"
   - Template: Profile Template

3. Make sure it's **published** (not draft)

### 5. Verify Profile Template Exists

Check the template:

1. Go to Content Manager → Collection Types → Templates
2. Find "Profile Template" with:
   - Template Type: "Profile"
3. Make sure it's **published**

### 6. Test the Profile Page

1. Make sure you're logged in to the application
2. Navigate to `/profile`
3. You should now see your profile information with username, email, and a "Change Password" button

## Troubleshooting

### Still seeing "No content to load"?

Check browser console for errors:
- Open Developer Tools (F12)
- Check Console tab for API errors
- Common errors:
  - `profileBlock is undefined` → Run `npm run map:api` again
  - `404 Not Found` → Profile-block content type not created in Strapi
  - `403 Forbidden` → Check Strapi permissions for profile-block API

### API Generation Failed?

If `npm run map:api` fails:
1. Ensure Strapi is running on the correct port
2. Check your `.env` file for correct API URLs
3. Check Strapi console for any errors
4. Verify profile-block content type exists in Strapi

### Profile Block Returns Null?

If the API call succeeds but returns null:
1. The singleton might not have any data
2. Go to Strapi admin → Profile Block and add/save the content
3. Ensure the profile-block API endpoint has proper permissions:
   - Settings → Users & Permissions Plugin → Roles → Public
   - Find `profile-block` and enable `find` permission

## Summary

The key step that solves most "No content" issues is:

```bash
# After adding profile-block to Strapi, regenerate frontend API types:
cd Frontends/dj-panel
npm run map:api
```

This ensures the frontend knows about the new `profileBlock` API endpoint and can properly fetch the profile-block singleton data.
