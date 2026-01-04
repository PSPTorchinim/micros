# Profile Page Implementation

## Overview
This implementation adds a user profile page to the system, allowing authenticated users to view their account information.

## Components

### Backend (Strapi CMS)
- **Content Type**: `profile-block` (singleton)
- **Location**: `/CMS/src/api/profile-block/`
- **Schema Fields**:
  - `title`: Display title for the profile page
  - `description`: Description text
  - `emailLabel`: Label for email field
  - `usernameLabel`: Label for username field
  - `customStyles`: Optional JSON for custom styling

### Frontend
- **Component**: `ProfileBlock`
- **Location**: `/Frontends/dj-panel/src/components/molecules/ProfileBlock/`
- **Features**:
  - Displays authenticated user's username and email
  - Shows error message for unauthenticated users
  - Responsive design with theme support

## Setup Instructions

### 1. Configure Strapi
1. Start Strapi CMS: `cd CMS && npm run develop`
2. Log into the admin panel
3. Navigate to Content-Type Builder and verify `profile-block` singleton exists
4. Go to Content Manager → Singles → Profile Block
5. Configure the labels and text:
   - Title: "My Profile"
   - Description: "View and manage your profile information."
   - Email Label: "Email Address"
   - Username Label: "Username"
6. Save and publish

### 2. Create Profile Page
1. In Strapi admin, go to Content Manager → Collection Types → Templates
2. Create a new template:
   - Name: "Profile Template"
   - Template Type: "Profile"
3. Save the template

4. Go to Content Manager → Collection Types → Pages
5. Create a new page:
   - Title: "Profile"
   - Slug: "profile"
   - Menu: Choose appropriate menu (e.g., "Main" or "NotVisible")
   - Auth State: "OnlyAuthenticated" (important!)
   - Template: Select the Profile Template created above
6. Save and publish

### 3. Access the Profile Page
- Users must be logged in to access the profile page
- Navigate to `/profile` (or the slug you configured)
- The page will display the user's username and email

## Architecture

### Template Type Flow
```
Page (with Profile template) 
  → RenderTemplate detects "Profile" template type
  → Fetches profile-block singleton from Strapi
  → Renders ProfileBlock component
  → Component fetches user data from AuthContext
  → Displays user information
```

### Authentication Integration
- Uses existing `AuthContext` and `useAuth` hook
- User data comes from the authentication provider
- Profile page should be configured with `AuthState: OnlyAuthenticated`

## Customization

### Styling
Customize the appearance by:
1. Editing CSS variables in the theme
2. Modifying `/Frontends/dj-panel/src/components/molecules/ProfileBlock/index.css`
3. Using the `customStyles` field in Strapi for page-specific styling

### Adding More Fields
To display additional user fields:
1. Update the `ProfileBlock` component to access more user properties
2. Update the schema to include labels for new fields
3. Update the ProfileBlock component's render logic

## Notes
- The profile block is read-only (displays information only)
- For password changes, use the existing change-password page
- For profile editing, additional endpoints would need to be implemented
- API types will be automatically generated when running `npm run map:api` from the frontend
