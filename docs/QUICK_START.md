# Quick Start Guide

Get started with UIH DSL in less than 5 minutes.

## Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Basic understanding of UI components
- (Optional) React, Vue, or Svelte project setup

## Installation

### Global CLI Installation

```bash
npm install -g @uih-dsl/cli
```

Or use with npx:

```bash
npx @uih-dsl/cli compile your-file.uih
```

### Project-Specific Installation

For React projects:

```bash
npm install @uih-dsl/cli @uih-dsl/runtime-react
```

For Vue projects:

```bash
npm install @uih-dsl/cli @uih-dsl/runtime-vue
```

For Svelte projects:

```bash
npm install @uih-dsl/cli @uih-dsl/runtime-svelte
```

## Your First UIH File

### Step 1: Create a UIH file

Create `hello-world.uih`:

```uih
meta {
  title: "Hello World"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
  color.text: "#333333"
  spacing.md: "16px"
}

layout {
  Container {
    padding: "spacing.md"
    H1 {
      color: "color.primary"
      "Hello, UIH!"
    }
    Text {
      color: "color.text"
      "Your first UIH component is working!"
    }
  }
}
```

### Step 2: Compile to Your Framework

#### For React

```bash
uih compile hello-world.uih --target react --output ./src/components/HelloWorld.tsx
```

Generated output (`HelloWorld.tsx`):

```tsx
import { Container, H1, Text } from '@uih-dsl/runtime-react';

export function HelloWorld() {
  return (
    <Container padding="16px">
      <H1 color="#0E5EF7">Hello, UIH!</H1>
      <Text color="#333333">Your first UIH component is working!</Text>
    </Container>
  );
}
```

#### For Vue

```bash
uih compile hello-world.uih --target vue --output ./src/components/HelloWorld.vue
```

Generated output (`HelloWorld.vue`):

```vue
<script setup lang="ts">
import { Container, H1, Text } from '@uih-dsl/runtime-vue';
</script>

<template>
  <Container padding="16px">
    <H1 color="#0E5EF7">Hello, UIH!</H1>
    <Text color="#333333">Your first UIH component is working!</Text>
  </Container>
</template>
```

#### For Svelte

```bash
uih compile hello-world.uih --target svelte --output ./src/components/HelloWorld.svelte
```

Generated output (`HelloWorld.svelte`):

```svelte
<script lang="ts">
  import { Container, H1, Text } from '@uih-dsl/runtime-svelte';
</script>

<Container padding="16px">
  <H1 color="#0E5EF7">Hello, UIH!</H1>
  <Text color="#333333">Your first UIH component is working!</Text>
</Container>
```

### Step 3: Use the Component

Import and use your generated component:

**React:**
```tsx
import { HelloWorld } from './components/HelloWorld';

function App() {
  return <HelloWorld />;
}
```

**Vue:**
```vue
<script setup>
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
  <HelloWorld />
</template>
```

**Svelte:**
```svelte
<script>
  import HelloWorld from './components/HelloWorld.svelte';
</script>

<HelloWorld />
```

## Understanding UIH Structure

Every UIH file has a fixed block structure:

### 1. Meta Block (Required)

Defines metadata about your component:

```uih
meta {
  title: "Component Name"
  route: "/path"
  description: "Optional description"
}
```

### 2. Style Block (Required)

Defines design tokens and style variables:

```uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#6B7280"
  spacing.xs: "4px"
  spacing.sm: "8px"
  spacing.md: "16px"
  spacing.lg: "24px"
  fontSize.body: "16px"
  fontSize.heading: "24px"
}
```

### 3. Components Block (Optional)

Declares reusable component configurations:

```uih
components {
  Button {
    variant: "primary"
    size: "medium"
  }
  Card {
    elevation: "2"
  }
}
```

### 4. Layout Block (Required)

Defines the UI hierarchy:

```uih
layout {
  Container {
    padding: "spacing.md"
    Header {
      H1 {
        "Page Title"
      }
    }
    Main {
      Card {
        padding: "spacing.lg"
        Text {
          "Card content"
        }
      }
    }
  }
}
```

### 5. Script Block (Optional)

Defines event handlers and logic:

```uih
script {
  onClick: "handleClick"
  onSubmit: "handleSubmit"
  onLoad: "handleLoad"
}
```

## Next Steps

### Interactive Component Example

Create `user-profile.uih`:

```uih
meta {
  title: "User Profile"
  route: "/profile"
}

style {
  color.primary: "#0E5EF7"
  color.text: "#333333"
  color.textSecondary: "#6B7280"
  color.border: "#E0E0E0"
  spacing.sm: "8px"
  spacing.md: "16px"
  spacing.lg: "24px"
  borderRadius.md: "8px"
}

components {
  ProfileCard {
    variant: "elevated"
  }
}

layout {
  Container {
    padding: "spacing.lg"
    ProfileCard {
      border: "1px solid color.border"
      borderRadius: "borderRadius.md"
      padding: "spacing.lg"
      HStack {
        spacing: "spacing.md"
        Avatar {
          size: "64px"
          src: "https://via.placeholder.com/64"
        }
        VStack {
          spacing: "spacing.sm"
          H2 {
            color: "color.text"
            "John Doe"
          }
          Text {
            color: "color.textSecondary"
            "Software Engineer"
          }
          Button {
            variant: "primary"
            "Edit Profile"
          }
        }
      }
    }
  }
}

script {
  onClick: "handleEditProfile"
}
```

Compile it:

```bash
uih compile user-profile.uih --target react --output ./src/components/UserProfile.tsx
```

### Learning Resources

- [Grammar Specification](./uih-dsl-parser-bnf-grammar.md) - Complete syntax reference
- [Design Philosophy](./uih-dsl-philosophy.md) - Why UIH is designed this way
- [Examples](../examples/) - More real-world examples
- [API Reference](./API.md) - Runtime component APIs

### CLI Options

```bash
uih compile <input> [options]

Options:
  --target, -t      Target framework (react|vue|svelte)
  --output, -o      Output file path
  --watch, -w       Watch for file changes
  --format, -f      Output format (typescript|javascript)
  --help, -h        Show help
  --version, -v     Show version
```

### Common Patterns

#### Conditional Rendering

```uih
layout {
  Container {
    if: "isLoggedIn"
    Dashboard {
      "Welcome back!"
    }
  }
}
```

#### Lists

```uih
layout {
  Container {
    List {
      for: "user in users"
      ListItem {
        key: "user.id"
        Text {
          "user.name"
        }
      }
    }
  }
}
```

#### Forms

```uih
layout {
  Form {
    onSubmit: "handleSubmit"
    VStack {
      spacing: "spacing.md"
      Input {
        type: "text"
        placeholder: "Enter your name"
        name: "username"
      }
      Input {
        type: "email"
        placeholder: "Enter your email"
        name: "email"
      }
      Button {
        type: "submit"
        "Submit"
      }
    }
  }
}
```

## Troubleshooting

### Common Errors

**Error: "Unexpected token"**
- Check indentation (must be exactly 2 spaces)
- Ensure all strings use double quotes `"`
- Verify block order: meta → style → components → layout → script

**Error: "Missing required block"**
- `meta`, `style`, and `layout` blocks are mandatory
- Check block names are lowercase

**Error: "Invalid property"**
- Property names must be lowercase
- Use dot notation for nested properties: `color.primary`

### Getting Help

- [GitHub Issues](https://github.com/yourusername/uih-v2/issues)
- [Documentation](../README.md)
- [Examples](../examples/)

## What's Next?

- Explore the [component library](../examples/components/)
- Learn about [advanced features](./ADVANCED.md)
- Contribute to [UIH DSL](../CONTRIBUTING.md)

Happy coding! 🎉
