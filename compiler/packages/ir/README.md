# @uih-dsl/ir

Intermediate Representation (IR) generator for UIH DSL.

[![npm version](https://img.shields.io/npm/v/@uih-dsl/ir.svg)](https://www.npmjs.com/package/@uih-dsl/ir)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @uih-dsl/ir
```

## Usage

```typescript
import { tokenize } from '@uih-dsl/tokenizer';
import { parse } from '@uih-dsl/parser';
import { generateIR } from '@uih-dsl/ir';

const source = `
meta {
  title: "My App"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Container {
    H1 {
      "Welcome"
    }
  }
}
`;

const tokens = tokenize(source);
const ast = parse(tokens);
const ir = generateIR(ast);

console.log(ir);
```

## What is IR?

The IR (Intermediate Representation) is a platform-independent data structure that sits between the AST and code generation. It:

- Normalizes the AST structure
- Resolves design tokens
- Validates component usage
- Prepares data for code generation

## IR Structure

```typescript
interface IR {
  meta: {
    title: string;
    route?: string;
    description?: string;
  };

  tokens: Record<string, string>;

  components: ComponentDefinition[];

  tree: IRNode[];
}

interface IRNode {
  type: 'element' | 'text';
  tag?: string;
  props?: Record<string, string>;
  children?: IRNode[];
  text?: string;
}
```

## API

### `generateIR(ast: Program): IR`

Converts an AST into Intermediate Representation.

**Parameters:**
- `ast: Program` - AST from parser

**Returns:** `IR` - Intermediate representation

## Features

### Token Resolution

```typescript
// Input UIH
style {
  color.primary: "#0E5EF7"
  spacing.md: "16px"
}

layout {
  Container {
    padding: "spacing.md"
    H1 {
      color: "color.primary"
      "Hello"
    }
  }
}

// Generated IR resolves tokens
{
  tokens: {
    "color.primary": "#0E5EF7",
    "spacing.md": "16px"
  },
  tree: [{
    type: 'element',
    tag: 'Container',
    props: {
      padding: "16px"  // Resolved from token
    },
    children: [{
      type: 'element',
      tag: 'H1',
      props: {
        color: "#0E5EF7"  // Resolved from token
      },
      children: [{
        type: 'text',
        text: 'Hello'
      }]
    }]
  }]
}
```

### Component Validation

```typescript
// Validates component definitions
components {
  Button {
    variant: "primary"
  }
}

// Ensures components are used correctly
```

### Tree Normalization

The IR normalizes nested structures for easier code generation:

```typescript
// Flattens and structures the component tree
// Resolves parent-child relationships
// Validates nesting rules
```

## Examples

### Access Metadata

```typescript
const ir = generateIR(ast);
console.log(ir.meta.title);  // "My App"
console.log(ir.meta.route);  // "/"
```

### Get Design Tokens

```typescript
const ir = generateIR(ast);
const tokens = ir.tokens;

console.log(tokens['color.primary']);  // "#0E5EF7"
console.log(tokens['spacing.md']);     // "16px"
```

### Traverse IR Tree

```typescript
function traverse(node: IRNode, depth = 0) {
  const indent = '  '.repeat(depth);

  if (node.type === 'element') {
    console.log(`${indent}<${node.tag}>`);
    node.children?.forEach(child => traverse(child, depth + 1));
  } else {
    console.log(`${indent}"${node.text}"`);
  }
}

ir.tree.forEach(node => traverse(node));
```

## TypeScript Support

```typescript
import type {
  IR,
  IRNode,
  ComponentDefinition
} from '@uih-dsl/ir';
```

## Related Packages

- [@uih-dsl/parser](https://www.npmjs.com/package/@uih-dsl/parser) - AST parser
- [@uih-dsl/codegen-react](https://www.npmjs.com/package/@uih-dsl/codegen-react) - React codegen
- [@uih-dsl/codegen-vue](https://www.npmjs.com/package/@uih-dsl/codegen-vue) - Vue codegen
- [@uih-dsl/codegen-svelte](https://www.npmjs.com/package/@uih-dsl/codegen-svelte) - Svelte codegen

## License

MIT
