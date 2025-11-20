# @uih-dsl/parser

AST parser for UIH DSL that converts tokens into Abstract Syntax Trees.

[![npm version](https://img.shields.io/npm/v/@uih-dsl/parser.svg)](https://www.npmjs.com/package/@uih-dsl/parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @uih-dsl/parser
```

## Usage

```typescript
import { tokenize } from '@uih-dsl/tokenizer';
import { parse } from '@uih-dsl/parser';

const source = `
meta {
  title: "My App"
  route: "/"
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

console.log(ast.meta.properties); // { title: "My App", route: "/" }
```

## API

### `parse(tokens: Token[]): Program`

Parses an array of tokens into an Abstract Syntax Tree.

**Returns:** `Program` - Root AST node

**Throws:** `ParserError` - On syntax errors

## AST Structure

### Program

Root node of the AST:

```typescript
interface Program {
  type: 'Program';
  meta: MetaNode;
  style: StyleNode;
  components?: ComponentsNode;
  layout: LayoutNode;
  script?: ScriptNode;
  location: SourceLocation;
}
```

### Block Nodes

**MetaNode:**
```typescript
interface MetaNode {
  type: 'MetaBlock';
  properties: Record<string, string>;
  location: SourceLocation;
}
```

**StyleNode:**
```typescript
interface StyleNode {
  type: 'StyleBlock';
  properties: Record<string, string>;
  location: SourceLocation;
}
```

**LayoutNode:**
```typescript
interface LayoutNode {
  type: 'LayoutBlock';
  children: ElementNode[];
  location: SourceLocation;
}
```

**ElementNode:**
```typescript
interface ElementNode {
  type: 'Element';
  tag: string;
  attributes?: Record<string, string>;
  children?: (ElementNode | TextNode)[];
  location: SourceLocation;
}
```

## Grammar Rules

The parser enforces strict block ordering:

1. **meta** (required)
2. **style** (required)
3. **components** (optional)
4. **layout** (required)
5. **script** (optional)

## Examples

### Extract Metadata

```typescript
const ast = parse(tokens);
console.log(ast.meta.properties.title); // "My App"
console.log(ast.meta.properties.route); // "/"
```

### Traverse Layout Tree

```typescript
function traverse(node: ElementNode, depth = 0) {
  const indent = '  '.repeat(depth);
  console.log(`${indent}<${node.tag}>`);

  node.children?.forEach(child => {
    if (child.type === 'Element') {
      traverse(child, depth + 1);
    } else if (child.type === 'Text') {
      console.log(`${indent}  "${child.value}"`);
    }
  });
}

traverse(ast.layout.children[0]);
```

### Get All Components

```typescript
function getAllTags(node: ElementNode): string[] {
  const tags = [node.tag];
  node.children?.forEach(child => {
    if (child.type === 'Element') {
      tags.push(...getAllTags(child));
    }
  });
  return tags;
}

const tags = ast.layout.children.flatMap(getAllTags);
console.log([...new Set(tags)]); // Unique component names
```

## Error Handling

```typescript
try {
  const ast = parse(tokens);
} catch (error) {
  if (error instanceof ParserError) {
    console.error(`Parse Error at line ${error.line}:${error.column}`);
    console.error(error.message);
  }
}
```

## TypeScript Support

```typescript
import type {
  Program,
  MetaNode,
  StyleNode,
  LayoutNode,
  ElementNode,
  TextNode
} from '@uih-dsl/parser';
```

## Related Packages

- [@uih-dsl/tokenizer](https://www.npmjs.com/package/@uih-dsl/tokenizer) - Tokenizer
- [@uih-dsl/ir](https://www.npmjs.com/package/@uih-dsl/ir) - IR generator
- [@uih-dsl/cli](https://www.npmjs.com/package/@uih-dsl/cli) - CLI tool

## License

MIT
