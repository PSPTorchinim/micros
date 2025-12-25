# Menu Component

A unified menu component that supports both mobile and desktop navigation patterns with a single codebase.

## Features

- **Unified Codebase**: Single component with `variant` prop for mobile/desktop rendering
- **Authentication Support**: Show/hide menu items based on auth state
- **Permission-based Filtering**: Control menu visibility based on user permissions
- **Nested Dropdowns**: Support for multi-level navigation (both mobile and desktop)
- **Action Handling**: Support for action items (e.g., logout)
- **Menu Categories**: Separate Main and Login menu sections
- **Responsive Design**: Automatically adapts to viewport size via CSS

## Usage

### Basic Usage

```tsx
import { Menu } from '../../components/molecules/Menu';

// Desktop menu
<Menu variant="desktop" links={navigationLinks} />

// Mobile menu
<Menu 
  variant="mobile" 
  links={navigationLinks}
  logoSrc="/logo.png"
  logoAlt="Logo"
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `variant` | `'mobile' \| 'desktop'` | Yes | Menu rendering variant |
| `links` | `Array<NavigationItem>` | No | Array of navigation items |
| `logoSrc` | `string` | No | Logo image source (mobile only) |
| `logoAlt` | `string` | No | Logo alt text (mobile only) |

### Navigation Item Structure

```typescript
interface NavigationItem {
  id: number;
  text: string;
  url?: string;
  NavigationOrder?: number;
  Menu?: 'Main' | 'Login';
  AuthState?: 'All' | 'OnlyAuthenticated' | 'OnlyUnauthenticated';
  NavigationAction?: 'Action';
  permissions?: string[];
  children?: NavigationItem[];
}
```

## Examples

### Simple Menu

```tsx
const links = [
  { id: 1, text: 'Home', url: '/', Menu: 'Main', AuthState: 'All' },
  { id: 2, text: 'About', url: '/about', Menu: 'Main', AuthState: 'All' },
];

<Menu variant="desktop" links={links} />
```

### Menu with Authentication

```tsx
const links = [
  { id: 1, text: 'Home', url: '/', Menu: 'Main', AuthState: 'All' },
  { 
    id: 2, 
    text: 'Login', 
    url: '/login', 
    Menu: 'Login', 
    AuthState: 'OnlyUnauthenticated' 
  },
  { 
    id: 3, 
    text: 'Logout', 
    url: '#', 
    Menu: 'Login', 
    AuthState: 'OnlyAuthenticated',
    NavigationAction: 'Action'
  },
];
```

### Menu with Nested Dropdowns

```tsx
const links = [
  {
    id: 1,
    text: 'Services',
    Menu: 'Main',
    AuthState: 'All',
    children: [
      { id: 11, text: 'Service 1', url: '/services/1' },
      { id: 12, text: 'Service 2', url: '/services/2' },
    ],
  },
];
```

## Behavior Differences

### Desktop Variant
- Horizontal layout
- Hover-based dropdowns
- Dropdown opens on mouse enter
- Nested dropdowns appear to the right

### Mobile Variant
- Vertical layout with burger menu icon
- Click/tap to expand dropdowns
- Nested items indented with border
- Full-screen overlay when open
- Close icon to dismiss menu

## Storybook

The component includes comprehensive Storybook stories:

- `DesktopDefault` - Basic desktop menu
- `DesktopWithLoginLinks` - Desktop with auth links
- `DesktopWithDropdowns` - Desktop with nested menus
- `DesktopWithNestedDropdowns` - Desktop with deeply nested menus
- `MobileDefault` - Basic mobile menu
- `MobileWithLoginLinks` - Mobile with auth links
- `MobileWithDropdowns` - Mobile with nested menus
- `MobileWithNestedDropdowns` - Mobile with deeply nested menus
- `MobileTabletView` - Mobile view on tablet

Run Storybook to see all examples:

```bash
npm run storybook
```

## Migration from Old Components

This component replaces the old `MobileMenu` and `DesktopMenu` components.

### Before
```tsx
import { DesktopMenu } from './menu/desktop-menu';
import { MobileMenu } from './menu/mobile-menu';

<DesktopMenu links={links} />
<MobileMenu links={links} logoSrc={logo} logoAlt={alt} />
```

### After
```tsx
import { Menu } from '../../components/molecules/Menu';

<Menu variant="desktop" links={links} />
<Menu variant="mobile" links={links} logoSrc={logo} logoAlt={alt} />
```

## Styling

The component uses CSS custom properties for theming:

- `--dl-color-theme-text-primary` - Primary text color
- `--dl-color-theme-background` - Background color
- `--dl-color-theme-border` - Border color
- `--dl-color-theme-shadow` - Shadow color
- `--dl-color-primary` - Primary accent color
- `--dl-space-*` - Spacing values
- `--dl-size-*` - Size values

## Accessibility

- Keyboard navigation support
- ARIA attributes for screen readers
- Focus indicators
- Proper semantic HTML
