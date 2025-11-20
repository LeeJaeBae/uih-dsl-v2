# @uih-dsl/codegen-svelte

Svelte 5 code generator for UIH DSL.

[![npm version](https://img.shields.io/npm/v/@uih-dsl/codegen-svelte.svg)](https://www.npmjs.com/package/@uih-dsl/codegen-svelte)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @uih-dsl/codegen-svelte
```

## Usage

```typescript
import { tokenize } from '@uih-dsl/tokenizer';
import { parse } from '@uih-dsl/parser';
import { generateIR } from '@uih-dsl/ir';
import { generateSvelte } from '@uih-dsl/codegen-svelte';

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
const code = generateSvelte(ir);

console.log(code);
```

## Generated Output

```svelte
<script lang="ts">
  import { Container, H1 } from '@uih-dsl/runtime-svelte';
</script>

<Container>
  <H1 color="#0E5EF7">Hello World</H1>
</Container>
```

## Features

- ✅ Svelte 5 components
- ✅ Runes support ($state, $derived)
- ✅ TypeScript support
- ✅ SvelteKit compatible
- ✅ Design token resolution
- ✅ Event handler mapping

## API

### `generateSvelte(ir: IR, options?: CodegenOptions): string`

Generates Svelte code from IR.

**Options:**
```typescript
interface CodegenOptions {
  typescript?: boolean;     // Use TypeScript (default: true)
  runtimeImport?: string;   // Custom runtime import path
}
```

## Generated Code Patterns

### Simple Component

```svelte
<!-- UIH -->
layout {
  Container {
    "Hello"
  }
}

<!-- Generated -->
<script lang="ts">
  import { Container } from '@uih-dsl/runtime-svelte';
</script>

<Container>Hello</Container>
```

### With Props

```svelte
<!-- UIH -->
layout {
  Container {
    padding: "16px"
    "Content"
  }
}

<!-- Generated -->
<script lang="ts">
  import { Container } from '@uih-dsl/runtime-svelte';
</script>

<Container padding="16px">Content</Container>
```

### With Events

```svelte
<!-- UIH -->
layout {
  Button {
    onClick: "handleClick"
    "Click me"
  }
}

script {
  onClick: "handleClick"
}

<!-- Generated -->
<script lang="ts">
  import { Button } from '@uih-dsl/runtime-svelte';

  const handleClick = () => {
    // Event handler
  };
</script>

<Button onclick={handleClick}>Click me</Button>
```

## TypeScript Support

Full TypeScript code generation:

```typescript
import type { IR } from '@uih-dsl/ir';
import type { CodegenOptions } from '@uih-dsl/codegen-svelte';
```

## Related Packages

- [@uih-dsl/ir](https://www.npmjs.com/package/@uih-dsl/ir) - IR generator
- [@uih-dsl/runtime-svelte](https://www.npmjs.com/package/@uih-dsl/runtime-svelte) - Svelte runtime
- [@uih-dsl/cli](https://www.npmjs.com/package/@uih-dsl/cli) - CLI tool

## License

MIT
