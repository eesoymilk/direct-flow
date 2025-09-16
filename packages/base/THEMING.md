# Design System & Theming Guide

This document explains the integrated theming system that provides consistent styling across both Nuxt UI and PrimeVue components.

## Overview

Our design system uses a dual-library approach:

- **Nuxt UI**: Primary UI component library with Tailwind CSS integration
- **PrimeVue**: Secondary UI library for specialized components
- **Unified Theme**: Custom theming that ensures visual consistency

## Theme Architecture

### 1. Nuxt UI Theming

Located in `app.config.ts`:

```typescript
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',        // Maps to our brand colors
      secondary: 'slate',     // Neutral colors
      success: 'green',       // Success states
      info: 'blue',          // Information states
      warning: 'amber',       // Warning states
      error: 'red',          // Error states
      neutral: 'slate'       // General neutral colors
    }
  }
})
```

### 2. PrimeVue Custom Theme

Located in `theme/direct-flow.ts`:

The custom theme extends the Aura preset with:

- **Primitive Tokens**: Base color definitions matching Nuxt UI
- **Semantic Tokens**: Contextual color mappings
- **Component Tokens**: Component-specific styling

### 3. Shared Design Tokens

Located in `tailwind.css`:

```css
@theme {
  /* Brand colors that override blue system-wide */
  --color-blue-50: oklch(0.97 0.02 240);
  --color-blue-600: oklch(0.57 0.13 240);
  /* ... full spectrum */
}
```

## Usage Patterns

### Using Nuxt UI Components

```vue
<template>
  <!-- Standard Nuxt UI usage -->
  <UButton color="primary">Primary Button</UButton>
  <UCard class="p-6">
    <UInput placeholder="Enter text..." />
  </UCard>
</template>
```

### Using PrimeVue Components

```vue
<template>
  <!-- PrimeVue components automatically use the custom theme -->
  <Button label="Primary Button" />
  <Card>
    <template #content>
      <InputText placeholder="Enter text..." />
    </template>
  </Card>
</template>

<script setup>
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
</script>
```

### Design System Composable

For consistent styling across components:

```vue
<script setup>
const { colors, getButtonClasses } = useDesignSystem()

const buttonClass = getButtonClasses('primary', 'md')
</script>
```

## Color System

### Primary Colors (Brand)

- `blue-50` to `blue-950`: Navy blue brand colors in OKLCH format
- Maps to both `primary` in Nuxt UI and `blue` in PrimeVue

### Semantic Colors

- **Success**: Green spectrum for positive actions
- **Error**: Red spectrum for destructive actions
- **Warning**: Amber spectrum for caution states
- **Info**: Blue spectrum for informational content
- **Neutral**: Slate spectrum for general UI elements

## Component Consistency

### Buttons

Both libraries use:
- `rounded-lg` border radius
- Consistent padding scales
- Same color mapping
- Identical hover/focus states

### Cards

Unified styling:
- `rounded-lg` corners
- `shadow-sm` elevation
- `p-6` internal padding
- Consistent border colors

### Form Inputs

Shared characteristics:
- `rounded-lg` border radius
- Same focus ring styling
- Consistent border colors
- Matching placeholder colors

## Best Practices

### 1. Color Usage

```vue
<!-- ✅ Good: Use semantic colors -->
<UButton color="primary">Submit</UButton>
<Button severity="success">Save</Button>

<!-- ❌ Avoid: Direct color classes -->
<div class="bg-blue-600">...</div>
```

### 2. Component Selection

- Use **Nuxt UI** for: Forms, layouts, navigation, general UI
- Use **PrimeVue** for: Data tables, calendars, specialized widgets

### 3. Custom Styling

```vue
<!-- ✅ Good: Use design tokens -->
<div class="bg-primary-50 text-primary-900">...</div>

<!-- ✅ Good: Use ui prop for component customization -->
<UCard :ui="{ body: { padding: 'p-8' } }">...</UCard>
```

## Dark Mode

Both libraries support dark mode through:

- CSS variables that automatically adjust
- `.dark` class toggle
- Consistent dark mode color mappings

## File Structure

```
packages/base/
├── app.config.ts              # Nuxt UI configuration
├── theme/
│   └── direct-flow.ts         # PrimeVue custom theme
├── app/assets/css/
│   └── tailwind.css          # Design tokens & overrides
├── composables/
│   └── useDesignSystem.ts    # Shared utilities
└── components/
    ├── ThemeDemo.vue         # Theme demonstration
    └── Ui/                   # Custom component overrides
        ├── Button.vue
        └── Card.vue
```

## Integration Notes

- PrimeVue components automatically inherit the custom theme
- Nuxt UI components use the app.config color mappings
- Both systems share the same underlying color palette
- CSS layers ensure proper style precedence
- TypeScript support maintained across both libraries

## Demo Component

See `ThemeDemo.vue` for a comprehensive example showing:
- Color palette display
- Side-by-side component comparison
- Mixed forms using both libraries
- Consistent styling patterns