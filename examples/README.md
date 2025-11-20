# UIH DSL Examples

This directory contains practical examples of UIH DSL usage.

## Quick Start

Try any example:

```bash
# Compile to React
uih compile examples/hello-world.uih --target react --output ./output/HelloWorld.tsx

# Compile to Vue
uih compile examples/button.uih --target vue --output ./output/Button.vue

# Compile to Svelte
uih compile examples/form.uih --target svelte --output ./output/Form.svelte
```

## Examples

### 1. Hello World (`hello-world.uih`)

Simplest possible UIH component.

**Features:**
- Basic meta block
- Simple styling
- Single layout component

### 2. Button (`button.uih`)

Interactive button with variants.

**Features:**
- Component configuration
- Multiple style tokens
- Event handlers

### 3. Form (`form.uih`)

Login form with validation.

**Features:**
- Form inputs
- Vertical stack layout
- Submit handler

### 4. Dashboard (`dashboard.uih`)

Multi-card dashboard layout.

**Features:**
- Grid layout
- Multiple cards
- Design tokens

### 5. User Profile (`user-profile.uih`)

User profile card with avatar.

**Features:**
- Horizontal stack
- Avatar component
- Nested layout

## File Structure

```
examples/
├── README.md           # This file
├── hello-world.uih    # Basic example
├── button.uih         # Button component
├── form.uih           # Form layout
├── dashboard.uih      # Dashboard with cards
└── user-profile.uih   # Profile card
```

## Learning Path

1. **Start with `hello-world.uih`** - Understand basic structure
2. **Try `button.uih`** - Learn about components and events
3. **Build `form.uih`** - Practice layout and inputs
4. **Explore `dashboard.uih`** - Master grid layouts
5. **Study `user-profile.uih`** - Combine everything

## Compiling Examples

### Single Example

```bash
uih compile examples/hello-world.uih --target react --output ./HelloWorld.tsx
```

### All Examples

```bash
# React
for file in examples/*.uih; do
  name=$(basename "$file" .uih)
  uih compile "$file" --target react --output "./output/react/${name}.tsx"
done

# Vue
for file in examples/*.uih; do
  name=$(basename "$file" .uih)
  uih compile "$file" --target vue --output "./output/vue/${name}.vue"
done

# Svelte
for file in examples/*.uih; do
  name=$(basename "$file" .uih)
  uih compile "$file" --target svelte --output "./output/svelte/${name}.svelte"
done
```

## Using Generated Components

### React

```tsx
import { HelloWorld } from './HelloWorld';

function App() {
  return <HelloWorld />;
}
```

### Vue

```vue
<script setup>
import HelloWorld from './HelloWorld.vue';
</script>

<template>
  <HelloWorld />
</template>
```

### Svelte

```svelte
<script>
  import HelloWorld from './HelloWorld.svelte';
</script>

<HelloWorld />
```

## Modifying Examples

Feel free to modify these examples to learn:

1. Change colors in the `style` block
2. Add new components to `layout`
3. Modify spacing and sizing
4. Add event handlers in `script` block

## More Examples

Looking for more examples? Check out:

- [Playground](https://playground.uih-dsl.dev) - Interactive examples
- [Documentation](../docs/) - Detailed guides
- [Component Gallery](./components/) - Reusable patterns

## Contributing Examples

Have a great example? Submit a PR!

Requirements:
- Clear, well-commented UIH code
- Demonstrates a specific pattern
- Works across all frameworks
- Includes description in this README
