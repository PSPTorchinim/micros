# Atomic Design Pattern - Component Structure

This directory contains the frontend components organized following the Atomic Design methodology.

## Overview

The Atomic Design pattern helps create a consistent and scalable component architecture by organizing UI components into a hierarchy of increasing complexity:

1. **Atoms**: Basic building blocks (buttons, inputs, labels, etc.)
2. **Molecules**: Simple combinations of atoms (forms, cards, etc.)
3. **Organisms**: Complex UI sections made of molecules and atoms (headers, footers, navigation, etc.)
4. **Templates**: Page-level layouts (not yet implemented)
5. **Pages**: Specific instances of templates with real content (not yet implemented)

## Directory Structure

```
src/components/
├── atoms/          # Basic building blocks
├── molecules/      # Simple component groups
├── organisms/      # Complex UI sections
└── [other files]   # Routing, rendering, etc.
```

## Atoms

Atoms are the most basic building blocks of the UI. They are the smallest components that can't be broken down further without losing their meaning.

### Available Atoms

- **Badge**: Status indicators and labels
  - Variants: primary, secondary, success, error, warning, info
  - Sizes: small, medium, large
  - Usage: `<Badge variant="success">Active</Badge>`

- **Button**: Clickable action triggers
  - Variants: filled, outline, flat
  - Sizes: small, medium, large
  - Props: fullWidth, disabled
  - Usage: `<Button variant="filled" size="medium">Click me</Button>`

- **Card**: Container for content
  - Variants: elevated, outlined, filled
  - Padding: none, small, medium, large
  - Props: hoverable
  - Usage: `<Card variant="elevated" hoverable>Content</Card>`

- **Divider**: Visual separator
  - Orientations: horizontal, vertical
  - Variants: solid, dashed, dotted
  - Spacing: small, medium, large
  - Usage: `<Divider variant="dashed" />`

- **Icon**: Icon wrapper component
  - Sizes: small, medium, large, xlarge
  - Colors: primary, secondary, muted, error, success, inherit
  - Usage: `<Icon size="large" color="primary"><AiFillHeart /></Icon>`

- **Input**: Text input field
  - Props: label, error, fullWidth
  - Usage: `<Input label="Email" error="Invalid email" />`

- **Link**: Navigation link
  - Variants: default, primary, secondary, muted
  - Underline: none, hover, always
  - Props: to, href, external
  - Usage: `<Link variant="primary" to="/home">Home</Link>`

- **Modal**: Overlay dialog component
  - Usage: See Modal documentation

- **Skeleton**: Loading placeholder
  - Usage: See Skeleton documentation

- **Text**: Typography component
  - Variants: h1, h2, h3, h4, h5, h6, body, caption, small
  - Weights: normal, medium, semibold, bold
  - Alignment: left, center, right, justify
  - Colors: primary, secondary, muted, error, success
  - Props: as (custom element type)
  - Usage: `<Text variant="h1" weight="bold">Title</Text>`

- **ThemeToggle**: Theme switcher component
  - Usage: `<ThemeToggle />`

## Molecules

Molecules are simple groups of atoms functioning together as a unit. They are relatively simple UI components composed of smaller atoms.

### Available Molecules

- **ArticleBlock**: Article content display
- **CTABlock**: Call-to-action section
- **ChangePasswordBlock**: Password change form
- **CompanyBlock**: Company information display
- **ContactBlock**: Contact section
- **ContactInfoBlock**: Contact information display
- **CreateCompanyModal**: Company creation modal
- **ErrorPage**: Error display page
- **FeatureBlock**: Feature showcase
- **FeatureTabBlock**: Tabbed features
- **ForgotPasswordBlock**: Password reset request
- **ForgotPasswordForm**: Password reset form
- **HeroBlock**: Hero section
- **ImageSliderBlock**: Image carousel
- **LoginBlock**: Login section
- **LoginForm**: Login form
- **ProfileBlock**: User profile display
- **RolesManagementBlock**: Role management interface
- **StepsContainerBlock**: Multi-step process container

## Organisms

Organisms are complex UI components composed of groups of molecules and/or atoms. They form distinct sections of an interface.

### Available Organisms

- **Header**: Site navigation header
- **Footer**: Site footer with links
- **Menu**: Navigation menu with dropdown support

## Usage Guidelines

### Creating New Components

1. **Identify the component level**: Determine if your component is an atom, molecule, or organism based on its complexity.

2. **Create the component directory**:
   ```bash
   mkdir src/components/atoms/NewComponent
   ```

3. **Create required files**:
   - `NewComponent.tsx` - Component implementation
   - `NewComponent.css` - Component styles
   - `NewComponent.stories.tsx` - Storybook stories
   - `NewComponent.test.tsx` - Unit tests
   - `index.ts` - Export file

4. **Follow naming conventions**:
   - Use PascalCase for component names
   - Use kebab-case for CSS class names with BEM-like structure
   - Prefix atom classes with `atom-`, molecules with `molecule-`, etc.

5. **Update exports**:
   - Add export in `src/components/atoms/index.ts` (or appropriate level)

### Best Practices

1. **Keep atoms small and focused**: Each atom should do one thing well
2. **Make components reusable**: Use props for customization instead of creating variants
3. **Maintain consistency**: Use design tokens and existing patterns
4. **Document thoroughly**: Include Storybook stories for all variants
5. **Test comprehensively**: Write unit tests for all components
6. **Use TypeScript**: Define clear prop interfaces
7. **Accessibility**: Ensure components are keyboard navigable and screen reader friendly

### Example Component Structure

```tsx
// NewComponent.tsx
import React from 'react';
import './NewComponent.css';

export interface NewComponentProps {
  variant?: 'default' | 'primary';
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
}

export const NewComponent: React.FC<NewComponentProps> = ({
  variant = 'default',
  size = 'medium',
  children,
  ...props
}) => {
  const classes = [
    'atom-newcomponent',
    `atom-newcomponent--${variant}`,
    `atom-newcomponent--${size}`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
```

## Development

### Running Storybook

View all components in Storybook:

```bash
npm run storybook
```

### Running Tests

Test all components:

```bash
npm test
```

Test specific component:

```bash
npm test -- Button.test.tsx
```

### Linting

Check code quality:

```bash
npm run lint
```

Auto-fix issues:

```bash
npm run lint:fix
```

## Resources

- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)
- [Storybook Documentation](https://storybook.js.org/)
- [React Testing Library](https://testing-library.com/react)
