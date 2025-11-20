# @uih-dsl/runtime-vue

Vue 3 runtime components for UIH DSL generated code.

[![npm version](https://img.shields.io/npm/v/@uih-dsl/runtime-vue.svg)](https://www.npmjs.com/package/@uih-dsl/runtime-vue)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @uih-dsl/runtime-vue
```

### Peer Dependencies

This package requires Vue 3.3+:

```bash
npm install vue@^3.3.0
```

## Usage

### Basic Usage

UIH compiled components automatically import from this runtime:

```vue
<script setup lang="ts">
import { Container, H1, Text, VStack } from '@uih-dsl/runtime-vue';
</script>

<template>
  <Container padding="16px">
    <VStack spacing="8px">
      <H1 color="#0E5EF7">Hello World</H1>
      <Text>This is a UIH component</Text>
    </VStack>
  </Container>
</template>
```

### Available Components

#### Layout Components

**Container**

Main container component with configurable padding, margin, and layout properties.

```vue
<template>
  <Container
    padding="16px"
    margin="8px"
    max-width="1200px"
    centered
  >
    Content
  </Container>
</template>
```

Props:
- `padding?: string` - Padding (supports design tokens)
- `margin?: string` - Margin (supports design tokens)
- `maxWidth?: string` - Maximum width
- `centered?: boolean` - Center the container
- `class?: string` - Custom CSS class

**VStack**

Vertical stack layout with configurable spacing.

```vue
<template>
  <VStack spacing="16px" align="center">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </VStack>
</template>
```

Props:
- `spacing?: string` - Space between items
- `align?: 'start' | 'center' | 'end' | 'stretch'` - Alignment
- `class?: string` - Custom CSS class

**HStack**

Horizontal stack layout with configurable spacing.

```vue
<template>
  <HStack spacing="8px" align="center">
    <div>Item 1</div>
    <div>Item 2</div>
  </HStack>
</template>
```

Props:
- `spacing?: string` - Space between items
- `align?: 'start' | 'center' | 'end' | 'stretch'` - Alignment
- `class?: string` - Custom CSS class

**Grid**

Grid layout component.

```vue
<template>
  <Grid :columns="3" gap="16px">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </Grid>
</template>
```

Props:
- `columns?: number | string` - Number of columns or template
- `rows?: number | string` - Number of rows or template
- `gap?: string` - Gap between items
- `class?: string` - Custom CSS class

#### Typography Components

**H1 - H6**

Heading components with built-in styling.

```vue
<template>
  <H1 color="#333" font-size="32px">Main Heading</H1>
  <H2 color="#555" font-size="24px">Subheading</H2>
</template>
```

Props:
- `color?: string` - Text color
- `fontSize?: string` - Font size
- `fontWeight?: string | number` - Font weight
- `class?: string` - Custom CSS class

**Text**

Generic text component.

```vue
<template>
  <Text color="#666" font-size="16px">
    Paragraph text
  </Text>
</template>
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

```vue
<script setup>
const handleClick = () => {
  console.log('Clicked');
};
</script>

<template>
  <Button
    variant="primary"
    size="medium"
    @click="handleClick"
  >
    Click me
  </Button>
</template>
```

Props:
- `variant?: 'primary' | 'secondary' | 'outline' | 'ghost'` - Button style variant
- `size?: 'small' | 'medium' | 'large'` - Button size
- `disabled?: boolean` - Disabled state
- `type?: 'button' | 'submit' | 'reset'` - Button type
- `class?: string` - Custom CSS class

Events:
- `@click` - Click event

**Input**

Form input component.

```vue
<script setup>
import { ref } from 'vue';

const value = ref('');
</script>

<template>
  <Input
    type="text"
    placeholder="Enter your name"
    v-model="value"
  />
</template>
```

Props:
- `type?: string` - Input type
- `placeholder?: string` - Placeholder text
- `modelValue?: string` - v-model value
- `disabled?: boolean` - Disabled state
- `class?: string` - Custom CSS class

Events:
- `@update:modelValue` - v-model update event

#### Data Display

**Card**

Card container component.

```vue
<template>
  <Card padding="24px" :elevation="2">
    Card content
  </Card>
</template>
```

Props:
- `padding?: string` - Internal padding
- `elevation?: number` - Shadow elevation (0-5)
- `border?: string` - Border style
- `borderRadius?: string` - Border radius
- `class?: string` - Custom CSS class

**Avatar**

Avatar/profile picture component.

```vue
<template>
  <Avatar
    src="https://example.com/avatar.jpg"
    alt="User"
    size="48px"
  />
</template>
```

Props:
- `src?: string` - Image source
- `alt?: string` - Alt text
- `size?: string` - Avatar size
- `fallback?: string` - Fallback initials
- `class?: string` - Custom CSS class

**Badge**

Badge/label component.

```vue
<template>
  <Badge variant="success">New</Badge>
</template>
```

Props:
- `variant?: 'default' | 'success' | 'warning' | 'error'` - Badge variant
- `class?: string` - Custom CSS class

## Design Tokens

The runtime supports design tokens defined in your UIH files:

```vue
<!-- UIH file defines:
color.primary: "#0E5EF7"
spacing.md: "16px"
-->

<template>
  <Container padding="spacing.md">
    <H1 color="color.primary">Hello</H1>
  </Container>
</template>

<!-- Runtime automatically resolves to: -->
<template>
  <Container padding="16px">
    <H1 color="#0E5EF7">Hello</H1>
  </Container>
</template>
```

### Custom Token Provider

You can override tokens at runtime:

```vue
<script setup>
import { provide } from 'vue';
import { TokenProviderKey } from '@uih-dsl/runtime-vue';

const customTokens = {
  'color.primary': '#FF0000',
  'spacing.md': '20px'
};

provide(TokenProviderKey, customTokens);
</script>

<template>
  <YourUIHComponent />
</template>
```

## Composition API

All components work with Vue 3 Composition API:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Container, Button, Input } from '@uih-dsl/runtime-vue';

const inputValue = ref('');

const handleSubmit = () => {
  console.log('Submitted:', inputValue.value);
};
</script>

<template>
  <Container>
    <Input v-model="inputValue" placeholder="Enter text" />
    <Button @click="handleSubmit">Submit</Button>
  </Container>
</template>
```

## Styling

### Default Styles

All components come with sensible default styles that match modern UI patterns.

### Custom Styling

#### CSS Classes

```vue
<template>
  <Container class="my-custom-class">
    Content
  </Container>
</template>

<style scoped>
.my-custom-class {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
```

#### CSS Modules

```vue
<template>
  <Container :class="$style.container">
    Content
  </Container>
</template>

<style module>
.container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
}
</style>
```

#### Tailwind CSS

```vue
<template>
  <Container class="bg-blue-500 rounded-lg p-4">
    Content
  </Container>
</template>
```

## TypeScript Support

Full TypeScript support with exported types:

```vue
<script setup lang="ts">
import type {
  ContainerProps,
  VStackProps,
  ButtonProps,
  InputProps
} from '@uih-dsl/runtime-vue';
</script>
```

## Performance

### Tree Shaking

The package is optimized for tree shaking. Only import what you need:

```typescript
// ✅ Good - only imports Button
import { Button } from '@uih-dsl/runtime-vue';

// ❌ Avoid - imports everything
import * as UIH from '@uih-dsl/runtime-vue';
```

### Bundle Size

| Component | Gzipped |
|-----------|---------|
| Container | ~0.5 KB |
| VStack/HStack | ~0.6 KB |
| Button | ~1.2 KB |
| Input | ~0.8 KB |
| Card | ~0.4 KB |

## Accessibility

All components follow WAI-ARIA guidelines:

- Semantic HTML elements
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader friendly

Example:

```vue
<template>
  <Button
    aria-label="Submit form"
    :aria-disabled="isDisabled"
  >
    Submit
  </Button>
</template>
```

## Examples

### Form Layout

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Container, VStack, Input, Button } from '@uih-dsl/runtime-vue';

const email = ref('');
const password = ref('');

const handleSubmit = () => {
  console.log('Login:', email.value, password.value);
};
</script>

<template>
  <Container max-width="400px" centered padding="24px">
    <VStack spacing="16px">
      <Input
        type="email"
        placeholder="Email"
        v-model="email"
      />
      <Input
        type="password"
        placeholder="Password"
        v-model="password"
      />
      <Button variant="primary" @click="handleSubmit">
        Log In
      </Button>
    </VStack>
  </Container>
</template>
```

### Dashboard Layout

```vue
<script setup lang="ts">
import { Container, Grid, Card, H2, Text } from '@uih-dsl/runtime-vue';
</script>

<template>
  <Container padding="24px">
    <Grid :columns="3" gap="16px">
      <Card padding="20px" :elevation="1">
        <H2>Users</H2>
        <Text>1,234</Text>
      </Card>
      <Card padding="20px" :elevation="1">
        <H2>Revenue</H2>
        <Text>$56,789</Text>
      </Card>
      <Card padding="20px" :elevation="1">
        <H2>Orders</H2>
        <Text>432</Text>
      </Card>
    </Grid>
  </Container>
</template>
```

### User Profile

```vue
<script setup lang="ts">
import { Container, HStack, VStack, Avatar, H3, Text, Button } from '@uih-dsl/runtime-vue';

const handleEdit = () => {
  console.log('Edit profile');
};
</script>

<template>
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
        <Button variant="outline" size="small" @click="handleEdit">
          Edit Profile
        </Button>
      </VStack>
    </HStack>
  </Container>
</template>
```

## Nuxt 3 Integration

### Module Installation

The runtime works seamlessly with Nuxt 3:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [],
  vite: {
    optimizeDeps: {
      include: ['@uih-dsl/runtime-vue']
    }
  }
});
```

### Auto Imports

Configure auto imports:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  imports: {
    dirs: ['components/**']
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ]
});
```

## Migration from Other Libraries

### From Vuetify

```vue
<!-- Vuetify -->
<v-container>
  <v-card>
    <v-card-title>Hello</v-card-title>
  </v-card>
</v-container>

<!-- UIH Runtime -->
<Container>
  <Card>
    <H2>Hello</H2>
  </Card>
</Container>
```

### From Element Plus

```vue
<!-- Element Plus -->
<el-container>
  <el-row :gutter="20">
    <el-col :span="12">Content</el-col>
  </el-row>
</el-container>

<!-- UIH Runtime -->
<Container>
  <Grid :columns="2" gap="20px">
    <div>Content</div>
  </Grid>
</Container>
```

## Troubleshooting

### Styles Not Applying

Ensure you're importing the base styles in your main file:

```typescript
// main.ts
import '@uih-dsl/runtime-vue/styles.css';
```

### TypeScript Errors

Update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@uih-dsl/runtime-vue"]
  }
}
```

### SSR/Nuxt Issues

For Nuxt 3, ensure transpilation:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  build: {
    transpile: ['@uih-dsl/runtime-vue']
  }
});
```

## Related Packages

- [@uih-dsl/cli](https://www.npmjs.com/package/@uih-dsl/cli) - CLI tool
- [@uih-dsl/runtime-core](https://www.npmjs.com/package/@uih-dsl/runtime-core) - Core runtime
- [@uih-dsl/codegen-vue](https://www.npmjs.com/package/@uih-dsl/codegen-vue) - Vue code generator

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../../CONTRIBUTING.md)

## Support

- [Documentation](https://github.com/yourusername/uih-v2)
- [Issue Tracker](https://github.com/yourusername/uih-v2/issues)
