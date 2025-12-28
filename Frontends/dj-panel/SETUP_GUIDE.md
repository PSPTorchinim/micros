# Quick Setup Guide for User Management Pages

This guide will help you quickly set up the Profile, Change Password, and Dashboard pages in your Strapi CMS.

## Prerequisites

1. Strapi CMS is running
2. Identity API service is running and accessible
3. User authentication is configured

## Step-by-Step Setup

### 1. Create Templates in Strapi

First, you need to create three new templates in your Strapi CMS:

#### Template Configuration

Add these template types to your Strapi template model:

- **Profile** - For user profile pages
- **ChangePassword** - For password change pages
- **Dashboard** - For dashboard pages

In Strapi Admin:
1. Navigate to Content-Types Builder
2. Go to "Template" content type
3. Add these values to the `TemplateType` enumeration field if they don't exist

### 2. Create Pages in Strapi

Now create three pages, one for each functionality:

#### Dashboard Page
```
Title: Dashboard
Slug: dashboard
Template: Create new template with TemplateType = "Dashboard"
Menu: Main (or your preferred menu)
AuthState: OnlyAuthenticated
NavigationOrder: (your preference)
```

#### Profile Page
```
Title: Profile
Slug: profile
Template: Create new template with TemplateType = "Profile"
Menu: Main (or your preferred menu)
AuthState: OnlyAuthenticated
NavigationOrder: (your preference)
```

#### Change Password Page
```
Title: Change Password
Slug: change-password
Template: Create new template with TemplateType = "ChangePassword"
Menu: Main (or your preferred menu)
AuthState: OnlyAuthenticated
NavigationOrder: (your preference)
```

### 3. Update Navigation (Optional)

If you want these pages to appear in your navigation menu:

1. Set the `Menu` field to the appropriate menu (e.g., "Main", "User")
2. Set `AuthState` to `OnlyAuthenticated` so they only show for logged-in users
3. Adjust `NavigationOrder` to position them in your menu

### 4. Verify API Endpoints

Ensure your Identity API has these endpoints available:

- `GET /identity/api/v1/Users/Me` - Get current user profile
- `PUT /identity/api/v1/Users/ChangePassword` - Change user password

These should already be available if you're using the Identity API service from this project.

## Testing Your Setup

1. **Login**: First, log in to your application
2. **Navigate to Dashboard**: Go to `/dashboard` in your browser
   - You should see a welcome message with your email
   - Quick links to Profile and Change Password should be visible
3. **Check Profile**: Click the Profile link or go to `/profile`
   - You should see your user ID, email, account status, and roles
4. **Test Password Change**: Click Change Password link or go to `/change-password`
   - Try changing your password
   - Verify validation works (matching passwords, minimum length, etc.)

## Troubleshooting

### Pages Don't Load
- Check that the templates are created with the correct `TemplateType` values
- Verify the pages are published in Strapi
- Check browser console for errors

### API Errors
- Ensure the Identity API service is running
- Check that authentication tokens are being sent correctly
- Verify the API endpoints are accessible

### Styling Issues
- Clear your browser cache
- Rebuild the frontend: `npm run build`
- Check that all CSS files are loaded

## Customization

### Changing Text/Labels

You can customize the text by passing props when using the blocks directly, or by modifying the default values in the component files:

- `ProfileBlock.tsx` - Profile page text
- `ChangePasswordBlock.tsx` - Password change form labels
- `DashboardBlock.tsx` - Dashboard welcome message and stats

### Modifying Styles

Each component has its own CSS file:

- `ProfileBlock.css`
- `ChangePasswordBlock.css`
- `DashboardBlock.css`

All styles use CSS custom properties for easy theming.

### Adding More Stats to Dashboard

Edit `DashboardBlock.tsx` and add new stat cards in the `dashboard-block-stats` section.

### Adding More Quick Links

Edit `DashboardBlock.tsx` and add items to the `quickLinks` array.

## Security Notes

- All password changes are hashed with SHA256 before being sent to the API
- Pages require authentication (users must be logged in)
- API calls use Bearer token authentication
- Input validation is performed on the client side
- Additional validation should be performed on the server side

## Next Steps

After setting up these pages, consider:

1. Adding more user-specific features to the dashboard
2. Creating additional profile fields
3. Adding password strength indicator
4. Implementing email change functionality
5. Adding two-factor authentication

For more detailed information, see `USER_MANAGEMENT_PAGES.md`.
