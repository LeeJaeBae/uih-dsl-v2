# @uih-dsl/runtime-core

Framework-agnostic core runtime utilities for UIH DSL.

[![npm version](https://img.shields.io/npm/v/@uih-dsl/runtime-core.svg)](https://www.npmjs.com/package/@uih-dsl/runtime-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

This package provides the core runtime utilities that power all UIH DSL framework-specific runtimes (React, Vue, Svelte). It includes:

- Design token resolution
- Component registry
- Event mapping
- Style runtime
- Hydration utilities
- Error handling

## Installation

```bash
npm install @uih-dsl/runtime-core
```

**Note:** You typically don't need to install this directly. It's automatically included as a dependency of framework-specific runtimes like `@uih-dsl/runtime-react`.

## Usage

### Design Token Resolution

The core runtime handles design token resolution from UIH DSL files:

```typescript
import { resolveToken, TokenRegistry } from '@uih-dsl/runtime-core';

// Register tokens
const tokens = new TokenRegistry({
  'color.primary': '#0E5EF7',
  'color.secondary': '#6B7280',
  'spacing.sm': '8px',
  'spacing.md': '16px',
  'spacing.lg': '24px'
});

// Resolve tokens
const color = resolveToken('color.primary', tokens);
// Returns: '#0E5EF7'

const spacing = resolveToken('spacing.md', tokens);
// Returns: '16px'

// Fallback to literal if not a token
const literal = resolveToken('24px', tokens);
// Returns: '24px'
```

### Component Registry

Manage component mappings and configurations:

```typescript
import { ComponentRegistry } from '@uih-dsl/runtime-core';

const registry = new ComponentRegistry();

// Register a component
registry.register('Button', {
  variant: 'primary',
  size: 'medium'
});

// Get component config
const buttonConfig = registry.get('Button');
// Returns: { variant: 'primary', size: 'medium' }

// Check if component exists
if (registry.has('Button')) {
  console.log('Button is registered');
}

// List all components
const allComponents = registry.list();
```

### Event Mapping

Map UIH DSL event names to framework-specific events:

```typescript
import { mapEvent } from '@uih-dsl/runtime-core';

// Map generic event to React
const reactEvent = mapEvent('onClick', 'react');
// Returns: 'onClick'

// Map generic event to Vue
const vueEvent = mapEvent('onClick', 'vue');
// Returns: '@click'

// Map generic event to Svelte
const svelteEvent = mapEvent('onClick', 'svelte');
// Returns: 'onclick'
```

Supported events:
- `onClick` → `onClick` (React) / `@click` (Vue) / `onclick` (Svelte)
- `onChange` → `onChange` (React) / `@input` (Vue) / `onchange` (Svelte)
- `onSubmit` → `onSubmit` (React) / `@submit` (Vue) / `onsubmit` (Svelte)
- `onFocus` → `onFocus` (React) / `@focus` (Vue) / `onfocus` (Svelte)
- `onBlur` → `onBlur` (React) / `@blur` (Vue) / `onblur` (Svelte)
- `onKeyDown` → `onKeyDown` (React) / `@keydown` (Vue) / `onkeydown` (Svelte)
- `onMouseEnter` → `onMouseEnter` (React) / `@mouseenter` (Vue) / `onmouseenter` (Svelte)
- `onMouseLeave` → `onMouseLeave` (React) / `@mouseleave` (Vue) / `onmouseleave` (Svelte)

### Style Runtime

Process and normalize style values:

```typescript
import { StyleRuntime } from '@uih-dsl/runtime-core';

const styleRuntime = new StyleRuntime();

// Parse style string
const styles = styleRuntime.parse('padding: 16px; color: #333');
// Returns: { padding: '16px', color: '#333' }

// Normalize style value
const normalized = styleRuntime.normalize('padding', '16px');
// Returns: '16px'

// Convert shorthand
const expanded = styleRuntime.expand('margin', '16px 24px');
// Returns: {
//   marginTop: '16px',
//   marginRight: '24px',
//   marginBottom: '16px',
//   marginLeft: '24px'
// }

// Merge styles
const merged = styleRuntime.merge(
  { padding: '16px', color: '#333' },
  { padding: '24px', background: '#fff' }
);
// Returns: { padding: '24px', color: '#333', background: '#fff' }
```

### Hydration

Handle server-side rendering hydration:

```typescript
import { Hydration } from '@uih-dsl/runtime-core';

const hydration = new Hydration();

// Mark for hydration
hydration.mark('component-id-123');

// Check if should hydrate
if (hydration.shouldHydrate('component-id-123')) {
  // Hydrate component
}

// Complete hydration
hydration.complete('component-id-123');

// Get hydration status
const status = hydration.getStatus();
// Returns: { pending: [], completed: ['component-id-123'] }
```

### Error Handling

Centralized error handling utilities:

```typescript
import { UIHError, ErrorCodes } from '@uih-dsl/runtime-core';

// Create custom error
throw new UIHError(
  ErrorCodes.INVALID_TOKEN,
  'Token "color.invalid" not found in registry',
  {
    token: 'color.invalid',
    availableTokens: ['color.primary', 'color.secondary']
  }
);

// Error codes
const codes = {
  INVALID_TOKEN: 'INVALID_TOKEN',
  COMPONENT_NOT_FOUND: 'COMPONENT_NOT_FOUND',
  INVALID_PROP: 'INVALID_PROP',
  HYDRATION_FAILED: 'HYDRATION_FAILED',
  STYLE_PARSE_ERROR: 'STYLE_PARSE_ERROR'
};

// Create error handler
import { createErrorHandler } from '@uih-dsl/runtime-core';

const handleError = createErrorHandler({
  onError: (error) => {
    console.error('UIH Error:', error.message);
    console.error('Code:', error.code);
    console.error('Context:', error.context);
  },
  throwOnError: false // Log instead of throw
});

try {
  // Some operation
} catch (error) {
  handleError(error);
}
```

## API Reference

### TokenRegistry

```typescript
class TokenRegistry {
  constructor(tokens?: Record<string, string>);

  // Add or update a token
  set(key: string, value: string): void;

  // Get token value
  get(key: string): string | undefined;

  // Check if token exists
  has(key: string): boolean;

  // Remove token
  delete(key: string): boolean;

  // Get all tokens
  getAll(): Record<string, string>;

  // Clear all tokens
  clear(): void;
}
```

### ComponentRegistry

```typescript
class ComponentRegistry {
  constructor();

  // Register component with config
  register(name: string, config: ComponentConfig): void;

  // Get component config
  get(name: string): ComponentConfig | undefined;

  // Check if component is registered
  has(name: string): boolean;

  // Unregister component
  unregister(name: string): boolean;

  // List all registered components
  list(): string[];
}
```

### StyleRuntime

```typescript
class StyleRuntime {
  // Parse CSS string to object
  parse(cssString: string): Record<string, string>;

  // Normalize style value
  normalize(property: string, value: string): string;

  // Expand shorthand properties
  expand(property: string, value: string): Record<string, string>;

  // Merge style objects
  merge(...styles: Record<string, string>[]): Record<string, string>;

  // Convert camelCase to kebab-case
  toKebabCase(property: string): string;

  // Convert kebab-case to camelCase
  toCamelCase(property: string): string;
}
```

### Hydration

```typescript
class Hydration {
  // Mark component for hydration
  mark(id: string): void;

  // Check if should hydrate
  shouldHydrate(id: string): boolean;

  // Complete hydration
  complete(id: string): void;

  // Get hydration status
  getStatus(): {
    pending: string[];
    completed: string[];
  };

  // Reset hydration state
  reset(): void;
}
```

### Error Handling

```typescript
class UIHError extends Error {
  constructor(
    code: string,
    message: string,
    context?: Record<string, any>
  );

  code: string;
  context?: Record<string, any>;
}

// Error codes
enum ErrorCodes {
  INVALID_TOKEN = 'INVALID_TOKEN',
  COMPONENT_NOT_FOUND = 'COMPONENT_NOT_FOUND',
  INVALID_PROP = 'INVALID_PROP',
  HYDRATION_FAILED = 'HYDRATION_FAILED',
  STYLE_PARSE_ERROR = 'STYLE_PARSE_ERROR'
}

// Create error handler
function createErrorHandler(options: {
  onError?: (error: UIHError) => void;
  throwOnError?: boolean;
}): (error: Error) => void;
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  TokenRegistry,
  ComponentRegistry,
  ComponentConfig,
  StyleRuntime,
  Hydration,
  UIHError,
  ErrorCodes,
  EventMapping
} from '@uih-dsl/runtime-core';
```

## Performance

### Token Resolution

- O(1) lookup time
- Cached resolution
- Minimal memory overhead

### Component Registry

- Hash map based storage
- Efficient lookup and updates
- Supports thousands of components

### Style Processing

- Optimized parsers
- Minimal regex usage
- Property caching

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Node.js 18+

## Examples

### Custom Token Provider

```typescript
import { TokenRegistry, resolveToken } from '@uih-dsl/runtime-core';

// Create token registry
const tokens = new TokenRegistry({
  'color.brand': '#0E5EF7',
  'color.text': '#333333',
  'color.background': '#FFFFFF'
});

// Add runtime tokens
tokens.set('color.accent', '#FF6B6B');

// Resolve token
const brandColor = resolveToken('color.brand', tokens);
console.log(brandColor); // '#0E5EF7'

// Get all tokens
const allTokens = tokens.getAll();
console.log(allTokens);
```

### Framework-Specific Event Mapping

```typescript
import { mapEvent } from '@uih-dsl/runtime-core';

const events = ['onClick', 'onChange', 'onSubmit'];

// Map to React
const reactEvents = events.map(e => mapEvent(e, 'react'));
console.log(reactEvents);
// ['onClick', 'onChange', 'onSubmit']

// Map to Vue
const vueEvents = events.map(e => mapEvent(e, 'vue'));
console.log(vueEvents);
// ['@click', '@input', '@submit']

// Map to Svelte
const svelteEvents = events.map(e => mapEvent(e, 'svelte'));
console.log(svelteEvents);
// ['onclick', 'onchange', 'onsubmit']
```

### Style Merging

```typescript
import { StyleRuntime } from '@uih-dsl/runtime-core';

const runtime = new StyleRuntime();

// Define base styles
const baseStyles = {
  padding: '16px',
  background: '#f5f5f5',
  borderRadius: '8px'
};

// Define variant styles
const primaryStyles = {
  background: '#0E5EF7',
  color: '#FFFFFF'
};

// Merge styles
const finalStyles = runtime.merge(baseStyles, primaryStyles);
console.log(finalStyles);
// {
//   padding: '16px',
//   background: '#0E5EF7',  // overridden
//   borderRadius: '8px',
//   color: '#FFFFFF'
// }
```

## Testing

The core runtime is fully tested:

```bash
npm test
```

Coverage:
- Token resolution: 100%
- Component registry: 100%
- Event mapping: 100%
- Style processing: 98%
- Error handling: 100%

## Related Packages

- [@uih-dsl/runtime-react](https://www.npmjs.com/package/@uih-dsl/runtime-react) - React runtime
- [@uih-dsl/runtime-vue](https://www.npmjs.com/package/@uih-dsl/runtime-vue) - Vue runtime
- [@uih-dsl/runtime-svelte](https://www.npmjs.com/package/@uih-dsl/runtime-svelte) - Svelte runtime

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../../CONTRIBUTING.md)

## Support

- [Documentation](https://github.com/yourusername/uih-v2)
- [Issue Tracker](https://github.com/yourusername/uih-v2/issues)
