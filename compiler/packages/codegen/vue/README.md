# @uih-dsl/codegen-vue

Vue 3 SFC code generator for UIH DSL.

[![npm version](https://img.shields.io/npm/v/@uih-dsl/codegen-vue.svg)](https://www.npmjs.com/package/@uih-dsl/codegen-vue)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @uih-dsl/codegen-vue
```

## Usage

```typescript
import { tokenize } from '@uih-dsl/tokenizer';
import { parse } from '@uih-dsl/parser';
import { generateIR } from '@uih-dsl/ir';
import { generateVue } from '@uih-dsl/codegen-vue';

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
const code = generateVue(ir);

console.log(code);
```

## Generated Output

```vue
<script setup lang="ts">
import { Container, H1 } from '@uih-dsl/runtime-vue';
</script>

<template>
  <Container>
    <H1 color="#0E5EF7">Hello World</H1>
  </Container>
</template>
```

## Features

- ✅ Vue 3 SFC (Single File Components)
- ✅ Composition API with `<script setup>`
- ✅ TypeScript support
- ✅ Nuxt 3 compatible
- ✅ Design token resolution
- ✅ Event handler mapping (v-on)

## API

### `generateVue(ir: IR, options?: CodegenOptions): string`

Generates Vue SFC code from IR.

**Options:**
```typescript
interface CodegenOptions {
  typescript?: boolean;     // Use TypeScript (default: true)
  runtimeImport?: string;   // Custom runtime import path
}
```

## Generated Code Patterns

### Simple Component

```vue
<!-- UIH -->
layout {
  Container {
    "Hello"
  }
}

<!-- Generated -->
<script setup lang="ts">
import { Container } from '@uih-dsl/runtime-vue';
</script>

<template>
  <Container>Hello</Container>
</template>
```

### With Props

```vue
<!-- UIH -->
layout {
  Container {
    padding: "16px"
    "Content"
  }
}

<!-- Generated -->
<script setup lang="ts">
import { Container } from '@uih-dsl/runtime-vue';
</script>

<template>
  <Container padding="16px">Content</Container>
</template>
```

### With Events

```vue
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
<script setup lang="ts">
import { Button } from '@uih-dsl/runtime-vue';

const handleClick = () => {
  // Event handler
};
</script>

<template>
  <Button @click="handleClick">Click me</Button>
</template>
```

## TypeScript Support

Full TypeScript code generation:

```typescript
import type { IR } from '@uih-dsl/ir';
import type { CodegenOptions } from '@uih-dsl/codegen-vue';
```

## Related Packages

- [@uih-dsl/ir](https://www.npmjs.com/package/@uih-dsl/ir) - IR generator
- [@uih-dsl/runtime-vue](https://www.npmjs.com/package/@uih-dsl/runtime-vue) - Vue runtime
- [@uih-dsl/cli](https://www.npmjs.com/package/@uih-dsl/cli) - CLI tool

## License

MIT
