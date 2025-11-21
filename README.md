# UIH DSL

**Universal Interface Hierarchy Domain Specific Language**
An AI-friendly UI declaration language designed for LLMs to generate UI code without ambiguity.

[![npm version](https://img.shields.io/npm/v/@uih-dsl/cli.svg)](https://www.npmjs.com/package/@uih-dsl/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Why UIH?

When AI generates UI code, it often makes mistakes due to:
- Ambiguous syntax (multiple ways to express the same thing)
- Optional punctuation and formatting choices
- Complex nested structures that are hard to track
- Framework-specific quirks and edge cases

**UIH DSL solves this by:**
- ✅ **One intent per line** - No ambiguity
- ✅ **Strict, predictable grammar** - LLMs can't make syntax errors
- ✅ **Fixed block structure** - Always `meta → style → components → layout → script`
- ✅ **Framework-agnostic IR** - Generate React, Vue, or Svelte from the same source

## Features

- 🎯 **LLM-Optimized Syntax** - Designed specifically for AI code generation
- 🚀 **Multi-Framework Support** - Compile to React, Vue 3, or Svelte 5
- 📦 **Complete Toolchain** - Tokenizer, Parser, IR, Codegen, Runtime
- 🔒 **Type-Safe** - Full TypeScript support throughout
- 🎨 **Built-in Styling** - Integrated style system with design tokens
- ⚡ **Fast Compilation** - Efficient AST-based code generation

## Quick Start

### Installation

```bash
npm install -g @uih-dsl/cli
```

### Your First UIH File

Create `hello.uih`:

```uih
meta {
  title: "Hello World"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
  spacing.md: "16px"
}

layout {
  Container {
    padding: "spacing.md"
    H1 {
      color: "color.primary"
      "Hello, UIH!"
    }
  }
}
```

### Compile to React

```bash
uih compile hello.uih --target react --output ./src/components/Hello.tsx
```

### Compile to Vue

```bash
uih compile hello.uih --target vue --output ./src/components/Hello.vue
```

### Compile to Svelte

```bash
uih compile hello.uih --target svelte --output ./src/components/Hello.svelte
```

## Example

UIH DSL:

```uih
meta {
  title: "User Card"
  route: "/user"
}

style {
  color.text: "#333333"
  color.border: "#E0E0E0"
  spacing.sm: "8px"
  spacing.md: "16px"
}

components {
  UserCard {
    variant: "default"
  }
}

layout {
  Container {
    padding: "spacing.md"
    border: "1px solid color.border"
    Card {
      Avatar {
        size: "48px"
      }
      VStack {
        spacing: "spacing.sm"
        H3 {
          color: "color.text"
          "John Doe"
        }
        Text {
          "Software Engineer"
        }
      }
    }
  }
}

script {
  onClick: "handleCardClick"
}
```

Generated React code (simplified):

```tsx
import { Container, Card, Avatar, VStack, H3, Text } from '@uih-dsl/runtime-react';

export function UserCard() {
  const handleCardClick = () => {
    // Event handler logic
  };

  return (
    <Container
      padding="16px"
      border="1px solid #E0E0E0"
    >
      <Card onClick={handleCardClick}>
        <Avatar size="48px" />
        <VStack spacing="8px">
          <H3 color="#333333">John Doe</H3>
          <Text>Software Engineer</Text>
        </VStack>
      </Card>
    </Container>
  );
}
```

## Architecture

UIH DSL follows a traditional compiler architecture:

```
┌─────────────┐
│  .uih file  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Tokenizer  │  Break into tokens
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Parser    │  Build Abstract Syntax Tree (AST)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ IR Generator│  Platform-independent representation
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Codegen    │  Generate framework-specific code
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ React / Vue │  Final output
│  / Svelte   │
└─────────────┘
```

## Packages

### Compiler Toolchain

| Package | Version | Description |
|---------|---------|-------------|
| [@uih-dsl/cli](https://www.npmjs.com/package/@uih-dsl/cli) | ![npm](https://img.shields.io/npm/v/@uih-dsl/cli) | Command-line interface |
| [@uih-dsl/tokenizer](https://www.npmjs.com/package/@uih-dsl/tokenizer) | ![npm](https://img.shields.io/npm/v/@uih-dsl/tokenizer) | Lexical analysis |
| [@uih-dsl/parser](https://www.npmjs.com/package/@uih-dsl/parser) | ![npm](https://img.shields.io/npm/v/@uih-dsl/parser) | AST generation |
| [@uih-dsl/ir](https://www.npmjs.com/package/@uih-dsl/ir) | ![npm](https://img.shields.io/npm/v/@uih-dsl/ir) | Intermediate representation |
| [@uih-dsl/codegen-react](https://www.npmjs.com/package/@uih-dsl/codegen-react) | ![npm](https://img.shields.io/npm/v/@uih-dsl/codegen-react) | React code generator |
| [@uih-dsl/codegen-vue](https://www.npmjs.com/package/@uih-dsl/codegen-vue) | ![npm](https://img.shields.io/npm/v/@uih-dsl/codegen-vue) | Vue 3 code generator |
| [@uih-dsl/codegen-svelte](https://www.npmjs.com/package/@uih-dsl/codegen-svelte) | ![npm](https://img.shields.io/npm/v/@uih-dsl/codegen-svelte) | Svelte 5 code generator |

### Runtime Libraries

| Package | Version | Description |
|---------|---------|-------------|
| [@uih-dsl/runtime-core](https://www.npmjs.com/package/@uih-dsl/runtime-core) | ![npm](https://img.shields.io/npm/v/@uih-dsl/runtime-core) | Framework-agnostic runtime |
| [@uih-dsl/runtime-react](https://www.npmjs.com/package/@uih-dsl/runtime-react) | ![npm](https://img.shields.io/npm/v/@uih-dsl/runtime-react) | React runtime components |
| [@uih-dsl/runtime-vue](https://www.npmjs.com/package/@uih-dsl/runtime-vue) | ![npm](https://img.shields.io/npm/v/@uih-dsl/runtime-vue) | Vue 3 runtime components |
| [@uih-dsl/runtime-svelte](https://www.npmjs.com/package/@uih-dsl/runtime-svelte) | ![npm](https://img.shields.io/npm/v/@uih-dsl/runtime-svelte) | Svelte 5 runtime components |

## Documentation

- [Grammar Specification](./docs/uih-dsl-parser-bnf-grammar.md)
- [Design Philosophy](./docs/uih-dsl-philosophy.md)
- [AST Schema](./docs/uih-dsl-ast-schema.md)
- [IR Specification](./docs/uih-dsl-ir-specification.md)
- [Codegen Rules](./docs/uih-dsl-codegen-rules.md)

## Playground

Try UIH DSL in your browser: [uih.thebespoke.team](https://uih.thebespoke.team)

## Use Cases

- **AI-Powered UI Generation** - Let LLMs generate UI without syntax errors
- **Design System Implementation** - Enforce consistent component usage
- **Multi-Framework Projects** - Maintain one source, deploy to multiple frameworks
- **Rapid Prototyping** - Simple syntax for quick UI mockups
- **Component Libraries** - Define reusable UI patterns once

## Design Principles

### LLM-Friendly Rules

1. **One intent per line** - No semicolons, no optional syntax
2. **Double quotes only** - No confusion between `'` and `"`
3. **Fixed block order** - Always `meta → style → components → layout → script`
4. **No comments** - Eliminates ambiguity (comments belong in generated code)
5. **Explicit over implicit** - Everything must be declared
6. **Dot notation for hierarchy** - `color.primary` instead of nested objects

### Grammar Constraints

- **Allowed characters**: `a-z`, `0-9`, `-`, `_`, space, newline (LF only), `{}`, `:`, `"`
- **Indentation**: Exactly 2 spaces (no tabs)
- **Nesting**: Only allowed in `layout` block
- **Case sensitivity**: All identifiers are lowercase

## Roadmap

- [ ] VSCode extension with syntax highlighting
- [ ] Online playground with live preview
- [ ] Component library templates
- [ ] Angular code generator
- [ ] Validation and linting tools
- [ ] Migration tools from JSX/Vue/Svelte

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting PRs.

### Development

```bash
# Clone the repository
git clone https://github.com/yourusername/uih-v2.git
cd uih-v2

# Install dependencies
pnpm install

# Build all packages
pnpm -r build

# Run tests
pnpm -r test
```

## License

MIT License - see [LICENSE](LICENSE) file for details

## Credits

Created by the UIH DSL Team

---

**Why "UIH"?**
Universal Interface Hierarchy - A universal language for declaring UI hierarchies that works across all modern frameworks.
