# Menu Component

A unified, responsive menu component that automatically adapts between mobile and desktop navigation patterns based on viewport size using CSS media queries.

## Features

- **Truly Responsive**: Automatically switches between mobile and desktop modes via CSS media queries (no prop needed)
- **Single Codebase**: One component that renders both mobile and desktop markup
- **Authentication Support**: Show/hide menu items based on auth state
- **Permission-based Filtering**: Control menu visibility based on user permissions
- **Nested Dropdowns**: Support for multi-level navigation (both mobile and desktop)
- **Action Handling**: Support for action items (e.g., logout)
- **Menu Categories**: Separate Main and Login menu sections

## Usage

### Basic Usage

```tsx
import { Menu } from '../../components/molecules/Menu';

<Menu 
  links={navigationLinks}
  logoSrc="/logo.png"
  logoAlt="Logo"
/>
```

The component automatically displays:
- **Desktop view** (viewport > 767px): Horizontal menu with hover dropdowns
- **Mobile view** (viewport ≤ 767px): Burger menu icon with slide-out navigation

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `links` | `Array<MenuNavigationItem>` | No | Array of navigation items |
| `logoSrc` | `string` | No | Logo image source (shown in mobile menu) |
| `logoAlt` | `string` | No | Logo alt text |

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

<Menu 
  links={links} 
  logoSrc="/logo.png"
  logoAlt="My App"
/>
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

The component renders both mobile and desktop markup, but CSS media queries control which is visible:

### Desktop View (viewport > 767px)
- Horizontal layout
- Hover-based dropdowns
- Dropdown opens on mouse enter
- Nested dropdowns appear to the right
- Burger menu hidden

### Mobile View (viewport ≤ 767px)
- Burger menu icon visible
- Click/tap to open full-screen menu
- Click/tap to expand dropdowns
- Nested items indented with border
- Full-screen overlay when open
- Close icon to dismiss menu
- Desktop menu hidden

## Storybook

The component includes comprehensive Storybook stories that demonstrate responsive behavior:

- `Default` - Basic menu (resize viewport to see responsive behavior)
- `WithLoginLinks` - Menu with authentication links
- `WithDropdowns` - Menu with nested dropdowns
- `WithNestedDropdowns` - Menu with deeply nested dropdowns
- `MobileViewDefault` - Mobile viewport simulation
- `MobileViewWithLoginLinks` - Mobile view with auth links
- `MobileViewWithDropdowns` - Mobile view with nested menus
- `MobileViewWithNestedDropdowns` - Mobile view with deeply nested menus
- `TabletView` - Tablet viewport simulation

Run Storybook to see all examples:

```bash
npm run storybook
```

## Migration from Old Components

This component replaces the old `MobileMenu` and `DesktopMenu` components and no longer requires a `variant` prop.

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

<Menu links={links} logoSrc={logo} logoAlt={alt} />
```

The component automatically adapts based on viewport size via CSS media queries.

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
