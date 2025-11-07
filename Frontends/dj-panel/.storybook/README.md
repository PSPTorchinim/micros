# Storybook - Component Documentation

This directory contains Storybook configuration for the DJ Panel React components.

## 🎯 Purpose

Storybook is a frontend workshop for building UI components in isolation. It allows developers to:

- Develop and test React components independently
- View components in different states
- Document component props and usage
- Build a living component library

## 🚀 Running Storybook

### Local Development

```bash
cd Frontends/dj-panel
npm run storybook
```

Then open http://localhost:6006 in your browser.

### Docker

Storybook is included in the Docker Compose setup:

```bash
cd Docker
docker-compose -f dj-panel-composer.yml up storybook
```

Access at: http://localhost:6006

## 📚 Writing Stories

Stories are located alongside their components:

```
src/components/atoms/Button/
├── Button.tsx
├── Button.css
├── Button.stories.tsx  # Stories file
└── index.ts
```

### Example Story

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'filled',
  },
};
```

## 🔧 Configuration

- **`.storybook/main.ts`** - Main Storybook configuration
- **`.storybook/preview.ts`** - Global decorators and parameters

## 📖 Available Components

Currently documented components:

### Atoms
- **Button** - Reusable button component with variants (filled, outline, flat)
- **Input** - Form input component with label and error support
- **ThemeToggle** - Theme switcher component

## 🎨 Features

- **Auto-generated documentation** from TypeScript props
- **Interactive controls** to modify component props
- **Dark/Light theme preview**
- **Responsive viewport testing**

## 📝 Best Practices

1. Write stories for all reusable components
2. Cover different states (default, error, disabled, etc.)
3. Use descriptive story names
4. Include documentation in component comments
5. Add controls for interactive testing

## 🔗 Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [React Storybook Guide](https://storybook.js.org/docs/react/get-started/introduction)
