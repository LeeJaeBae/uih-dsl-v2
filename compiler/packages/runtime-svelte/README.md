# @uih-dsl/runtime-svelte

Svelte 5 runtime components for UIH DSL generated code.

[![npm version](https://img.shields.io/npm/v/@uih-dsl/runtime-svelte.svg)](https://www.npmjs.com/package/@uih-dsl/runtime-svelte)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @uih-dsl/runtime-svelte
```

### Peer Dependencies

This package requires Svelte 5.0+:

```bash
npm install svelte@^5.0.0
```

## Usage

### Basic Usage

UIH compiled components automatically import from this runtime:

```svelte
<script lang="ts">
  import { Container, H1, Text, VStack } from '@uih-dsl/runtime-svelte';
</script>

<Container padding="16px">
  <VStack spacing="8px">
    <H1 color="#0E5EF7">Hello World</H1>
    <Text>This is a UIH component</Text>
  </VStack>
</Container>
```

### Available Components

#### Layout Components

**Container**

Main container component with configurable padding, margin, and layout properties.

```svelte
<Container
  padding="16px"
  margin="8px"
  maxWidth="1200px"
  centered
>
  Content
</Container>
```

Props:
- `padding?: string` - Padding (supports design tokens)
- `margin?: string` - Margin (supports design tokens)
- `maxWidth?: string` - Maximum width
- `centered?: boolean` - Center the container
- `class?: string` - Custom CSS class

**VStack**

Vertical stack layout with configurable spacing.

```svelte
<VStack spacing="16px" align="center">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</VStack>
```

Props:
- `spacing?: string` - Space between items
- `align?: 'start' | 'center' | 'end' | 'stretch'` - Alignment
- `class?: string` - Custom CSS class

**HStack**

Horizontal stack layout with configurable spacing.

```svelte
<HStack spacing="8px" align="center">
  <div>Item 1</div>
  <div>Item 2</div>
</HStack>
```

Props:
- `spacing?: string` - Space between items
- `align?: 'start' | 'center' | 'end' | 'stretch'` - Alignment
- `class?: string` - Custom CSS class

**Grid**

Grid layout component.

```svelte
<Grid columns={3} gap="16px">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

Props:
- `columns?: number | string` - Number of columns or template
- `rows?: number | string` - Number of rows or template
- `gap?: string` - Gap between items
- `class?: string` - Custom CSS class

#### Typography Components

**H1 - H6**

Heading components with built-in styling.

```svelte
<H1 color="#333" fontSize="32px">Main Heading</H1>
<H2 color="#555" fontSize="24px">Subheading</H2>
```

Props:
- `color?: string` - Text color
- `fontSize?: string` - Font size
- `fontWeight?: string | number` - Font weight
- `class?: string` - Custom CSS class

**Text**

Generic text component.

```svelte
<Text color="#666" fontSize="16px">
  Paragraph text
</Text>
```

Props:
- `color?: string` - Text color
- `fontSize?: string` - Font size
- `fontWeight?: string | number` - Font weight
- `lineHeight?: string` - Line height
- `class?: string` - Custom CSS class

#### Interactive Components

**Button**

Button component with variant support.

```svelte
<script>
  const handleClick = () => {
    console.log('Clicked');
  };
</script>

<Button
  variant="primary"
  size="medium"
  onclick={handleClick}
>
  Click me
</Button>
```

Props:
- `variant?: 'primary' | 'secondary' | 'outline' | 'ghost'` - Button style variant
- `size?: 'small' | 'medium' | 'large'` - Button size
- `disabled?: boolean` - Disabled state
- `type?: 'button' | 'submit' | 'reset'` - Button type
- `class?: string` - Custom CSS class
- `onclick?: () => void` - Click handler

**Input**

Form input component.

```svelte
<script>
  let value = $state('');
</script>

<Input
  type="text"
  placeholder="Enter your name"
  bind:value
/>
```

Props:
- `type?: string` - Input type
- `placeholder?: string` - Placeholder text
- `value?: string` - Input value
- `disabled?: boolean` - Disabled state
- `class?: string` - Custom CSS class

#### Data Display

**Card**

Card container component.

```svelte
<Card padding="24px" elevation={2}>
  Card content
</Card>
```

Props:
- `padding?: string` - Internal padding
- `elevation?: number` - Shadow elevation (0-5)
- `border?: string` - Border style
- `borderRadius?: string` - Border radius
- `class?: string` - Custom CSS class

**Avatar**

Avatar/profile picture component.

```svelte
<Avatar
  src="https://example.com/avatar.jpg"
  alt="User"
  size="48px"
/>
```

Props:
- `src?: string` - Image source
- `alt?: string` - Alt text
- `size?: string` - Avatar size
- `fallback?: string` - Fallback initials
- `class?: string` - Custom CSS class

**Badge**

Badge/label component.

```svelte
<Badge variant="success">New</Badge>
```

Props:
- `variant?: 'default' | 'success' | 'warning' | 'error'` - Badge variant
- `class?: string` - Custom CSS class

## Design Tokens

The runtime supports design tokens defined in your UIH files:

```svelte
<!-- UIH file defines:
color.primary: "#0E5EF7"
spacing.md: "16px"
-->

<Container padding="spacing.md">
  <H1 color="color.primary">Hello</H1>
</Container>

<!-- Runtime automatically resolves to: -->
<Container padding="16px">
  <H1 color="#0E5EF7">Hello</H1>
</Container>
```

### Custom Token Provider

You can override tokens at runtime using Svelte context:

```svelte
<script>
  import { setContext } from 'svelte';
  import { TOKEN_CONTEXT_KEY } from '@uih-dsl/runtime-svelte';

  const customTokens = {
    'color.primary': '#FF0000',
    'spacing.md': '20px'
  };

  setContext(TOKEN_CONTEXT_KEY, customTokens);
</script>

<YourUIHComponent />
```

## Svelte 5 Runes

Components work seamlessly with Svelte 5 runes:

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);

  function increment() {
    count += 1;
  }
</script>

<Container>
  <Text>Count: {count}</Text>
  <Text>Doubled: {doubled}</Text>
  <Button onclick={increment}>Increment</Button>
</Container>
```

## Reactivity

### State Management

```svelte
<script>
  let inputValue = $state('');

  const handleSubmit = () => {
    console.log('Submitted:', inputValue);
  };
</script>

<Container>
  <Input bind:value={inputValue} placeholder="Enter text" />
  <Button onclick={handleSubmit}>Submit</Button>
</Container>
```

### Derived State

```svelte
<script>
  let items = $state([1, 2, 3, 4, 5]);
  let total = $derived(items.reduce((a, b) => a + b, 0));
</script>

<Container>
  <Text>Total: {total}</Text>
</Container>
```

## Styling

### Default Styles

All components come with sensible default styles that match modern UI patterns.

### Custom Styling

#### CSS Classes

```svelte
<Container class="my-custom-class">
  Content
</Container>

<style>
  .my-custom-class {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
</style>
```

#### Global Styles

```svelte
<Container class="gradient-bg">
  Content
</Container>

<style>
  :global(.gradient-bg) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
  }
</style>
```

#### Tailwind CSS

```svelte
<Container class="bg-blue-500 rounded-lg p-4">
  Content
</Container>
```

## TypeScript Support

Full TypeScript support with exported types:

```svelte
<script lang="ts">
  import type {
    ContainerProps,
    VStackProps,
    ButtonProps,
    InputProps
  } from '@uih-dsl/runtime-svelte';
</script>
```

## Performance

### Tree Shaking

The package is optimized for tree shaking. Only import what you need:

```typescript
// ✅ Good - only imports Button
import { Button } from '@uih-dsl/runtime-svelte';

// ❌ Avoid - imports everything
import * as UIH from '@uih-dsl/runtime-svelte';
```

### Bundle Size

| Component | Gzipped |
|-----------|---------|
| Container | ~0.4 KB |
| VStack/HStack | ~0.5 KB |
| Button | ~1.1 KB |
| Input | ~0.7 KB |
| Card | ~0.3 KB |

## Accessibility

All components follow WAI-ARIA guidelines:

- Semantic HTML elements
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader friendly

Example:

```svelte
<Button
  aria-label="Submit form"
  aria-disabled={isDisabled}
>
  Submit
</Button>
```

## Examples

### Form Layout

```svelte
<script lang="ts">
  import { Container, VStack, Input, Button } from '@uih-dsl/runtime-svelte';

  let email = $state('');
  let password = $state('');

  const handleSubmit = () => {
    console.log('Login:', email, password);
  };
</script>

<Container maxWidth="400px" centered padding="24px">
  <VStack spacing="16px">
    <Input
      type="email"
      placeholder="Email"
      bind:value={email}
    />
    <Input
      type="password"
      placeholder="Password"
      bind:value={password}
    />
    <Button variant="primary" onclick={handleSubmit}>
      Log In
    </Button>
  </VStack>
</Container>
```

### Dashboard Layout

```svelte
<script lang="ts">
  import { Container, Grid, Card, H2, Text } from '@uih-dsl/runtime-svelte';
</script>

<Container padding="24px">
  <Grid columns={3} gap="16px">
    <Card padding="20px" elevation={1}>
      <H2>Users</H2>
      <Text>1,234</Text>
    </Card>
    <Card padding="20px" elevation={1}>
      <H2>Revenue</H2>
      <Text>$56,789</Text>
    </Card>
    <Card padding="20px" elevation={1}>
      <H2>Orders</H2>
      <Text>432</Text>
    </Card>
  </Grid>
</Container>
```

### User Profile

```svelte
<script lang="ts">
  import { Container, HStack, VStack, Avatar, H3, Text, Button } from '@uih-dsl/runtime-svelte';

  const handleEdit = () => {
    console.log('Edit profile');
  };
</script>

<Container padding="24px">
  <HStack spacing="16px" align="start">
    <Avatar
      src="/avatar.jpg"
      alt="User"
      size="64px"
      fallback="JD"
    />
    <VStack spacing="8px">
      <H3>John Doe</H3>
      <Text color="#666">Software Engineer</Text>
      <Button variant="outline" size="small" onclick={handleEdit}>
        Edit Profile
      </Button>
    </VStack>
  </HStack>
</Container>
```

## SvelteKit Integration

### Layout Setup

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import '@uih-dsl/runtime-svelte/styles.css';
</script>

<slot />
```

### Server-Side Rendering

All components work with SvelteKit SSR out of the box:

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { Container, H1 } from '@uih-dsl/runtime-svelte';
</script>

<Container>
  <H1>Server-Rendered Page</H1>
</Container>
```

### Configuration

```typescript
// svelte.config.js
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    alias: {
      '@uih': '@uih-dsl/runtime-svelte'
    }
  }
};

export default config;
```

## Migration from Other Libraries

### From Carbon Components Svelte

```svelte
<!-- Carbon -->
<Grid>
  <Row>
    <Column>
      <Tile>Content</Tile>
    </Column>
  </Row>
</Grid>

<!-- UIH Runtime -->
<Container>
  <Grid columns={1}>
    <Card>Content</Card>
  </Grid>
</Container>
```

### From Svelte Material UI

```svelte
<!-- Svelte Material UI -->
<Card>
  <Content>
    <Title>Hello</Title>
  </Content>
</Card>

<!-- UIH Runtime -->
<Card padding="16px">
  <H2>Hello</H2>
</Card>
```

## Troubleshooting

### Styles Not Applying

Ensure you're importing the base styles in your layout:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import '@uih-dsl/runtime-svelte/styles.css';
</script>
```

### TypeScript Errors

Update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@uih-dsl/runtime-svelte", "svelte"]
  }
}
```

### Vite Configuration

For Vite projects, add to `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    include: ['@uih-dsl/runtime-svelte']
  }
});
```

## Related Packages

- [@uih-dsl/cli](https://www.npmjs.com/package/@uih-dsl/cli) - CLI tool
- [@uih-dsl/runtime-core](https://www.npmjs.com/package/@uih-dsl/runtime-core) - Core runtime
- [@uih-dsl/codegen-svelte](https://www.npmjs.com/package/@uih-dsl/codegen-svelte) - Svelte code generator

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../../CONTRIBUTING.md)

## Support

- [Documentation](https://github.com/yourusername/uih-v2)
- [Issue Tracker](https://github.com/yourusername/uih-v2/issues)
