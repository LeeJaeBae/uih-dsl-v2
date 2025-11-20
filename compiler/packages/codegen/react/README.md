# @uih-dsl/codegen-react

React/Next.js code generator for UIH DSL.

[![npm version](https://img.shields.io/npm/v/@uih-dsl/codegen-react.svg)](https://www.npmjs.com/package/@uih-dsl/codegen-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @uih-dsl/codegen-react
```

## Usage

```typescript
import { tokenize } from '@uih-dsl/tokenizer';
import { parse } from '@uih-dsl/parser';
import { generateIR } from '@uih-dsl/ir';
import { generateReact } from '@uih-dsl/codegen-react';

const source = `
meta {
  title: "Hello"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Container {
    H1 {
      color: "color.primary"
      "Hello World"
    }
  }
}
`;

const tokens = tokenize(source);
const ast = parse(tokens);
const ir = generateIR(ast);
const code = generateReact(ir);

console.log(code);
```

## Generated Output

```tsx
import { Container, H1 } from '@uih-dsl/runtime-react';

export function Hello() {
  return (
    <Container>
      <H1 color="#0E5EF7">Hello World</H1>
    </Container>
  );
}
```

## Features

- ✅ React 18+ components
- ✅ TypeScript support
- ✅ Next.js 15 App Router compatible
- ✅ Server Components support
- ✅ Design token resolution
- ✅ Event handler mapping

## API

### `generateReact(ir: IR, options?: CodegenOptions): string`

Generates React/TypeScript code from IR.

**Options:**
```typescript
interface CodegenOptions {
  typescript?: boolean;     // Generate TypeScript (default: true)
  exportName?: string;      // Component export name
  runtimeImport?: string;   // Custom runtime import path
}
```

## Generated Code Patterns

### Simple Component

```tsx
// UIH
layout {
  Container {
    "Hello"
  }
}

// Generated
import { Container } from '@uih-dsl/runtime-react';

export function Component() {
  return (
    <Container>Hello</Container>
  );
}
```

### With Props

```tsx
// UIH
layout {
  Container {
    padding: "16px"
    "Content"
  }
}

// Generated
import { Container } from '@uih-dsl/runtime-react';

export function Component() {
  return (
    <Container padding="16px">Content</Container>
  );
}
```

### With Events

```tsx
// UIH
layout {
  Button {
    onClick: "handleClick"
    "Click me"
  }
}

script {
  onClick: "handleClick"
}

// Generated
import { Button } from '@uih-dsl/runtime-react';

export function Component() {
  const handleClick = () => {
    // Event handler
  };

  return (
    <Button onClick={handleClick}>Click me</Button>
  );
}
```

## TypeScript Support

Full TypeScript code generation with proper types:

```typescript
import type { IR } from '@uih-dsl/ir';
import type { CodegenOptions } from '@uih-dsl/codegen-react';
```

## Related Packages

- [@uih-dsl/ir](https://www.npmjs.com/package/@uih-dsl/ir) - IR generator
- [@uih-dsl/runtime-react](https://www.npmjs.com/package/@uih-dsl/runtime-react) - React runtime
- [@uih-dsl/cli](https://www.npmjs.com/package/@uih-dsl/cli) - CLI tool

## License

MIT
