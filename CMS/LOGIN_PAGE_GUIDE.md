# Login Page Feature - User Guide

This guide explains how to create and configure a dynamic Login Page using the Strapi CMS.

## Overview

The Login Page feature allows you to create customizable login pages through the Strapi CMS. You can configure the text, labels, placeholders, and even apply custom styles without touching the code.

## Creating a Login Page

### Step 1: Create a Login Block

1. Log into your Strapi admin panel (usually at `http://localhost:1337/admin`)
2. Navigate to **Content Manager** → **Login Block**
3. Click **Create new entry**
4. Configure the login block fields:
   - **Title**: The heading text (default: "Login")
   - **Email Label**: Label for the email field (default: "Email")
   - **Password Label**: Label for the password field (default: "Password")
   - **Submit Button Text**: Text on the submit button (default: "Login")
   - **Forgot Password Text**: Text before the reset link (default: "Forgot your password?")
   - **Reset Password Link Text**: Text for the reset link (default: "Reset Password")
   - **Email Placeholder**: Placeholder text in email field (default: "Enter your email")
   - **Password Placeholder**: Placeholder text in password field (default: "Enter your password")
   - **Redirect Path**: Path to redirect after successful login (default: "/dashboard")
   - **Forgot Password URL**: URL for the forgot password link (default: "/users/forgot-password")
   - **Custom Styles**: JSON object for custom CSS styles (optional)
5. Click **Save** and **Publish**

### Step 2: Create a Template with Login Type

1. Navigate to **Content Manager** → **Template**
2. Click **Create new entry**
3. Configure the template:
   - **Name**: Give it a descriptive name (e.g., "Login Page Template")
   - **Template Type**: Select **"Login"**
   - **Content**: Click **Add component** and select **Login Block Ref**
   - Select the Login Block you created in Step 1
4. Click **Save** and **Publish**

### Step 3: Create a Page

1. Navigate to **Content Manager** → **Page**
2. Click **Create new entry**
3. Configure the page:
   - **Title**: The page title (e.g., "Login")
   - **Slug**: URL path for the page (e.g., "login")
   - **Visible**: Check to make the page visible
   - **Menu**: Select "Login" or "Main" depending on where you want it
   - **Navigation Order**: Set the order in the menu
   - **Template**: Select the Login template you created in Step 2
4. Click **Save** and **Publish**

### Step 4: Access the Login Page

Navigate to your frontend application at the slug you configured (e.g., `http://localhost:3000/#/login`)

## Custom Styling

You can apply custom styles through the **Custom Styles** field in the Login Block. This field accepts a JSON object with CSS properties.

### Example:

```json
{
  "backgroundColor": "#f5f5f5",
  "padding": "40px",
  "borderRadius": "12px"
}
```

This will apply these styles to the login block container.

## Features

- ✅ Fully customizable text and labels
- ✅ Configurable redirect path after login
- ✅ Configurable forgot password URL
- ✅ Integration with existing authentication system
- ✅ Consistent styling with the existing UI
- ✅ Responsive design
- ✅ Optional custom styling via JSON
- ✅ Works with the existing navigation system
- ✅ Uses React Router Link for navigation (better performance)

## Authentication

The Login Block uses the existing authentication service:
- On successful login, users are redirected to `/dashboard`
- Credentials are stored in localStorage
- JWT tokens are used for authentication

## Comparison with Hardcoded Login

### Before (Hardcoded)
- Login page at `/users/login` with fixed text
- Required code changes to modify any text or styling
- Not manageable through CMS

### After (Dynamic)
- Login page can be created at any URL
- All text and styling configurable through Strapi
- Multiple login pages with different configurations possible
- No code changes needed for content updates

## Troubleshooting

### Login Block not appearing in Template Content
- Make sure you've published the Login Block in Strapi
- Check that login-block-ref is selected in the Template Content

### Styling not applied
- Verify the Custom Styles JSON is valid
- Check browser console for any errors
- Ensure CSS properties are using camelCase (e.g., `backgroundColor`, not `background-color`)

### Authentication not working
- Verify the IdentityAPI service is running
- Check that JWT configuration is correct
- Look for errors in the browser console

## Technical Details

### Backend (Strapi CMS)
- **Content Type**: `login-block` 
- **Component**: `login-block-ref`
- **Template Type**: `Login` (enum value)

### Frontend
- **Component**: `LoginBlock` in `src/components/content-blocks/LoginBlock/`
- **Renderer**: Handled by `renderBlock.tsx`
- **Mapping**: Configured in `mapStrapiContentToFrontend.ts`

## Future Enhancements

Potential improvements for this feature:
- Add support for social login buttons (Google, Facebook, etc.)
- Add "Remember Me" checkbox configuration
- Support for terms and conditions link
- Add background image configuration
- Support for two-factor authentication
