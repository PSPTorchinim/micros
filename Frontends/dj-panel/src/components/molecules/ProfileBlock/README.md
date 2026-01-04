# ProfileBlock Component

## Overview
The ProfileBlock component displays the authenticated user's profile information in a clean, card-based layout.

## Features
- Displays user's username and email
- Integrates with the application's authentication context
- Responsive design with mobile support
- Theme-aware styling using CSS variables
- Shows error message for unauthenticated users
- Handles missing user data gracefully (displays "N/A")

## Usage

### Basic Usage
```tsx
import { ProfileBlock } from './components/molecules/ProfileBlock';

<ProfileBlock />
```

### With Custom Props
```tsx
<ProfileBlock
  title="My Account"
  description="View your account details"
  usernameLabel="User Name"
  emailLabel="Email Address"
  customStyles={{ maxWidth: '800px' }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Profile"` | Title displayed at the top of the block |
| `description` | `string` | `"View and manage your profile information."` | Description text below the title |
| `usernameLabel` | `string` | `"Username"` | Label for the username field |
| `emailLabel` | `string` | `"Email"` | Label for the email field |
| `customStyles` | `Record<string, unknown>` | `{}` | Custom inline styles for the container |

## Component Structure

```
profile-block-container
└── profile-block-content
    ├── profile-block-title
    ├── profile-block-description
    └── profile-block-info (or profile-block-error if not authenticated)
        ├── profile-block-field
        │   ├── profile-block-label (Username)
        │   └── profile-block-value (user.username)
        └── profile-block-field
            ├── profile-block-label (Email)
            └── profile-block-value (user.email)
```

## Styling

### CSS Classes
- `.profile-block-container` - Outer container with centering
- `.profile-block-content` - Card wrapper with shadow and padding
- `.profile-block-title` - Main heading
- `.profile-block-description` - Subtitle text
- `.profile-block-info` - Container for user fields
- `.profile-block-field` - Individual field container
- `.profile-block-label` - Field label (uppercase, small)
- `.profile-block-value` - Field value text
- `.profile-block-error` - Error message styling

### CSS Variables Used
- `--dl-space-space-fourunits` - Container padding
- `--dl-space-space-threeunits` - Card padding
- `--dl-space-space-oneandhalfunits` - Gap between elements
- `--dl-space-space-unit` - Field spacing
- `--dl-space-space-halfunit` - Small gaps
- `--dl-radius-radius-cardradius` - Card border radius
- `--dl-radius-radius-radius4` - Field border radius
- `--dl-color-theme-background` - Card background
- `--dl-color-theme-shadow` - Box shadow
- `--dl-color-theme-text-primary` - Primary text color
- `--dl-color-theme-text-secondary` - Secondary text color
- `--dl-color-theme-neutral-light` - Field background

### Responsive Breakpoints
- Mobile (`max-width: 767px`): Reduced padding and full-width card

## Authentication Integration

The component uses the `useAuth()` hook to access user data:

```tsx
const { user } = useAuth();
```

The `user` object is expected to have the following structure:
```typescript
interface GetUserDTO {
  id?: string;
  username?: string;
  email?: string;
  // ... other fields
}
```

## Error States

### Unauthenticated User
When `user` is `null` or `undefined`, displays:
```
"No user information available. Please log in."
```

### Missing User Fields
When `user.username` or `user.email` are missing, displays:
```
"N/A"
```

## Testing

Run tests with:
```bash
npm test ProfileBlock
```

Test coverage includes:
- Default rendering with authenticated user
- Custom props rendering
- Unauthenticated state
- Missing user data handling
- Custom styles application

## Integration with Strapi

This component is rendered when a page uses the "Profile" template type. The template fetches configuration from the `profile-block` singleton in Strapi, which includes:
- Custom title and description
- Custom field labels
- Custom styles (JSON)

See `/docs/profile-page.md` for full setup instructions.

## Accessibility

- Semantic HTML structure (`<label>`, `<p>`)
- Descriptive labels for all fields
- Color contrast meets WCAG AA standards
- Error messages are clearly visible

## Future Enhancements

Potential additions (not in current scope):
- Edit mode with form inputs
- Profile picture upload
- Additional user fields (phone, address, etc.)
- Save/cancel buttons for editing
- Integration with user update API
