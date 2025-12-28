# User Management Pages

This document describes the three new user management pages added to the dj-panel frontend.

## Overview

Three new page blocks have been added to enable user management functionality:

1. **ProfileBlock** - Display user profile information
2. **ChangePasswordBlock** - Change user password
3. **DashboardBlock** - User dashboard with stats and quick links

## Usage in Strapi CMS

These components are designed to work with the CMS-driven architecture. To create pages using these blocks:

### Creating Pages in Strapi

1. **Dashboard Page**:
   - Create a new Page in Strapi CMS
   - Set the Slug to `/dashboard`
   - Create a Template with TemplateType: `Dashboard`
   - The page will automatically render the DashboardBlock

2. **Profile Page**:
   - Create a new Page in Strapi CMS
   - Set the Slug to `/profile`
   - Create a Template with TemplateType: `Profile`
   - The page will automatically render the ProfileBlock

3. **Change Password Page**:
   - Create a new Page in Strapi CMS
   - Set the Slug to `/change-password`
   - Create a Template with TemplateType: `ChangePassword`
   - The page will automatically render the ChangePasswordBlock

### Template Types

Add these template types to your Strapi template enumeration:

- `Profile` - For profile pages
- `ChangePassword` - For password change pages
- `Dashboard` - For dashboard pages

## Component Details

### ProfileBlock

Displays the current user's profile information including:
- User ID
- Email address
- Account status (Active/Inactive)
- Assigned roles

**Features**:
- Fetches fresh user data from the API
- Falls back to context user on error
- Displays loading skeleton while fetching

**Props**:
```typescript
interface ProfileBlockProps {
  title?: string;              // Default: "My Profile"
  customStyles?: React.CSSProperties;
}
```

### ChangePasswordBlock

Allows users to change their password with validation.

**Features**:
- Validates password requirements (minimum 6 characters)
- Ensures new password is different from old password
- Confirms password match
- Hashes passwords before sending to API
- Shows success/error messages

**Props**:
```typescript
interface ChangePasswordBlockProps {
  title?: string;                      // Default: "Change Password"
  oldPasswordLabel?: string;           // Default: "Current Password"
  newPasswordLabel?: string;           // Default: "New Password"
  confirmPasswordLabel?: string;       // Default: "Confirm New Password"
  submitButtonText?: string;           // Default: "Change Password"
  oldPasswordPlaceholder?: string;
  newPasswordPlaceholder?: string;
  confirmPasswordPlaceholder?: string;
  customStyles?: React.CSSProperties;
}
```

### DashboardBlock

Provides a dashboard view with user information and quick navigation.

**Features**:
- Displays user stats (email, account status, role count)
- Quick links to Profile and Change Password pages
- Personalized welcome message
- Responsive grid layout

**Props**:
```typescript
interface DashboardBlockProps {
  title?: string;          // Default: "Dashboard"
  welcomeMessage?: string; // Default: "Welcome to your dashboard"
  customStyles?: React.CSSProperties;
}
```

## API Integration

### UsersService Methods

Two new methods were added to `UsersService`:

#### GetMe()
```typescript
public static async GetMe(): Promise<LoginResponseDTOResponse>
```
Fetches the current user's profile information from the `/identity/api/v1/Users/Me` endpoint.

#### ChangePassword()
```typescript
public static async ChangePassword(
  oldPassword: string,
  newPassword: string,
): Promise<BooleanResponse>
```
Changes the user's password. Both passwords are hashed using SHA256 before being sent to the API at `/identity/api/v1/Users/ChangePassword`.

## Styling

All components follow the existing design system:

- Use CSS custom properties for theming (`--dl-color-theme-*`, `--dl-space-*`, etc.)
- Consistent with other form components (LoginBlock, ForgotPasswordBlock)
- Responsive design with mobile breakpoints
- Card-based layouts with shadows and rounded corners

## Authentication

All three components require authentication:
- They use the `useAuth` hook to access user information
- ProfileBlock and ChangePasswordBlock make authenticated API calls
- Users must be logged in to access these pages

## Navigation

The DashboardBlock includes quick links that navigate to:
- `/profile` - Profile page
- `/change-password` - Change Password page

Ensure these routes are created in your Strapi CMS for proper navigation.

## Example Usage

While these components are primarily used through the CMS, they can also be used directly in React code:

```tsx
import { ProfileBlock, ChangePasswordBlock, DashboardBlock } from './components/molecules';

// Direct usage (not typical for this architecture)
function MyPage() {
  return (
    <div>
      <DashboardBlock 
        title="My Dashboard" 
        welcomeMessage="Hello" 
      />
    </div>
  );
}
```

## Testing

To test these pages:

1. Ensure you have a running instance of the IdentityAPI service
2. Create a user account and log in
3. Navigate to the pages via the CMS or direct URLs
4. Verify:
   - Profile page displays user information correctly
   - Change Password form validates inputs and updates password
   - Dashboard displays stats and links work

## Security

- All passwords are hashed using SHA256 before being sent to the API
- API endpoints require authentication (Bearer token)
- Password validation enforces minimum security requirements
- No sensitive data is logged to console
