# UIH Runtime Specification v1.0

**Status:** Draft
**Version:** 1.0.0
**Last Updated:** 2025-01-19

---

## 1. Runtime Architecture Overview

### 1.1 Execution Pipeline

```
DSL Source → Tokenizer → Parser → AST → IR → Codegen → Framework Code → Runtime
                                                                              ↓
                                                                    Browser/Server Execution
```

### 1.2 Runtime Responsibility

The UIH Runtime is **NOT** a separate runtime library. Instead, it defines:

1. **Code Generation Contracts**: How codegen must produce framework code
2. **Execution Semantics**: How generated code behaves at runtime
3. **Framework Adapters**: Minimal glue code for each framework (React/Vue/Svelte)

### 1.3 Framework-Specific Runtime

| Framework | Runtime Model | Entry Point |
|-----------|---------------|-------------|
| React | Component function + hooks | `export default function Page()` |
| Vue 3 | SFC with `<script setup>` | `<script setup lang="ts">` |
| Svelte 5 | Component with runes | `<script lang="ts">` |

### 1.4 Zero-Runtime Philosophy

**Principle:** UIH generates **static code** wherever possible. Runtime logic is minimized.

- ❌ NO: Heavy runtime library for layout rendering
- ✅ YES: Compile-time code generation
- ❌ NO: Dynamic DSL interpretation at runtime
- ✅ YES: Static JSX/Template generation

---

## 2. Event Handler Runtime Model

### 2.1 Event Mapping Strategy

**DSL Input:**
```uih
script {
  onclick: "handleClick"
  onload: "initPage"
}
```

**IR Representation:**
```typescript
{
  script: [
    { event: "onclick", handler: "handleClick" },
    { event: "onload", handler: "initPage" }
  ]
}
```

**Generated Code (React):**
```typescript
function handleClick() {
  // TODO: Implement onclick handler
}

function initPage() {
  // TODO: Implement onload handler
}
```

### 2.2 Event Handler Injection Rules

#### Rule 1: Function Stubs Only
Codegen generates **empty function stubs**. Developers must fill in implementation.

**Rationale:** LLMs cannot hallucinate business logic.

#### Rule 2: No Automatic Binding
Generated functions are **not automatically bound** to DOM elements.

**Developer Responsibility:**
```tsx
export default function Page() {
  return (
    <div onClick={handleClick}>  {/* Manual binding */}
      Content
    </div>
  );
}
```

#### Rule 3: Event Name Normalization

| DSL Event | React | Vue | Svelte |
|-----------|-------|-----|--------|
| `onclick` | `onClick` | `@click` | `on:click` |
| `onload` | `useEffect(() => {...}, [])` | `onMounted` | `onMount` |
| `onsubmit` | `onSubmit` | `@submit` | `on:submit` |

### 2.3 SSR vs CSR Event Binding

#### Server-Side Rendering (SSR)
- Event handlers are **not executed** on the server
- Function stubs are included in server bundle for hydration
- No event listeners attached during SSR

#### Client-Side Rendering (CSR)
- Event handlers bind after hydration
- React: `onClick={handleClick}` attached post-mount
- Vue: `@click="handleClick"` reactive binding
- Svelte: `on:click={handleClick}` compiled binding

### 2.4 Event Handler Execution Context

**React:**
```typescript
function handleClick(event: React.MouseEvent<HTMLDivElement>) {
  // Access to component scope via closure
  // Access to event object
}
```

**Vue:**
```typescript
const handleClick = (event: MouseEvent) => {
  // Access to reactive state
  // Access to event object
};
```

**Svelte:**
```typescript
function handleClick(event: MouseEvent) {
  // Access to component state via runes
  // Access to event object
}
```

---

## 3. Style Token Runtime Model

### 3.1 CSS Variable Conversion Rules

**DSL Input:**
```uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#FF6B6B"
  spacing.unit: "8"
  font.size.heading: "24"
}
```

**IR Representation:**
```typescript
{
  style: {
    tokens: [
      { path: ["color", "primary"], value: "#0E5EF7" },
      { path: ["color", "secondary"], value: "#FF6B6B" },
      { path: ["spacing", "unit"], value: "8" },
      { path: ["font", "size", "heading"], value: "24" }
    ]
  }
}
```

**Generated CSS:**
```css
:root {
  --color-primary: #0E5EF7;
  --color-secondary: #FF6B6B;
  --spacing-unit: 8;
  --font-size-heading: 24;
}
```

### 3.2 Design Token Namespace Rules

#### Rule 1: Dot Notation → Dash Notation
```
color.primary → --color-primary
font.size.heading → --font-size-heading
```

#### Rule 2: No Unit Inference
Numbers are output **as-is**. No automatic `px`, `rem`, `em` appending.

**Rationale:** Explicit units prevent ambiguity.

```css
--spacing-unit: 8;  /* Not 8px */
```

Usage:
```css
.button {
  padding: calc(var(--spacing-unit) * 1px);
}
```

#### Rule 3: Alphabetical Ordering
CSS variables are sorted **alphabetically** for determinism.

### 3.3 Theming Strategy

#### Static Theming (Compile-Time)
```uih
style {
  color.primary: "#0E5EF7"  /* Blue theme */
}
```

```css
:root {
  --color-primary: #0E5EF7;
}
```

#### Dynamic Theming (Runtime)
Developers override CSS variables at runtime:

```typescript
document.documentElement.style.setProperty('--color-primary', '#FF6B6B');
```

**React Example:**
```tsx
useEffect(() => {
  if (isDarkMode) {
    document.documentElement.style.setProperty('--color-primary', '#1a1a1a');
  }
}, [isDarkMode]);
```

### 3.4 Scoped Styles

| Framework | Scope Strategy |
|-----------|----------------|
| React | Global `:root` (no scoping) |
| Vue | `<style scoped>` with `:root` |
| Svelte | `<style>` with `:global(:root)` |

---

## 4. Component Registry & Rendering

### 4.1 Built-in Component Registry

**Supported HTML Tags:**
```
Div, Span, P, H1, H2, H3, H4, H5, H6,
Button, Input, Textarea, Select, Option,
Ul, Ol, Li, Table, Tr, Td, Th,
Form, Label, Img, A, Nav, Header, Footer, Main, Section, Article,
Hr, Br
```

**Mapping Rules:**
```
DSL: Div → React: <Div> → HTML: <div>
DSL: Button → React: <Button> → HTML: <button>
DSL: H1 → React: <H1> → HTML: <h1>
```

### 4.2 Custom Component Registry

**DSL Input:**
```uih
components {
  Card {
    variant: "outlined"
  }
  Button {
    size: "medium"
  }
}

layout {
  Card {
    Button {
      "Click Me"
    }
  }
}
```

**IR Representation:**
```typescript
{
  components: ["Card", "Button"],
  layout: [
    {
      type: "Component",
      tag: "Card",
      attrs: [],
      children: [
        {
          type: "Component",
          tag: "Button",
          attrs: [],
          children: [
            { type: "Text", value: "Click Me" }
          ]
        }
      ]
    }
  ]
}
```

**Generated Code (React):**
```tsx
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function Page() {
  return (
    <Card>
      <Button>
        {"Click Me"}
      </Button>
    </Card>
  );
}
```

### 4.3 Dynamic Imports / Tree-Shaking Rules

#### Rule 1: Static Imports Only
All components are imported at **module top-level**.

**Rationale:** Tree-shaking works better with static imports.

```tsx
// ✅ Good
import { Card } from "@/components/Card";

// ❌ Bad
const Card = await import("@/components/Card");
```

#### Rule 2: Component Path Resolution

| Framework | Import Path Convention |
|-----------|------------------------|
| React | `@/components/{ComponentName}` |
| Vue | `@/components/{ComponentName}.vue` |
| Svelte | `$lib/components/{ComponentName}.svelte` |

#### Rule 3: Unused Component Elimination
If `components` block declares a component but `layout` doesn't use it, **do not import**.

**DSL:**
```uih
components {
  Card {}
  Button {}
}

layout {
  Card {
    "No Button used here"
  }
}
```

**Generated (React):**
```tsx
import { Card } from "@/components/Card";
// Button NOT imported (unused)

export default function Page() {
  return (
    <Card>
      {"No Button used here"}
    </Card>
  );
}
```

### 4.4 Missing Component Fallback

**Runtime Behavior:**

| Framework | Missing Component Error |
|-----------|-------------------------|
| React | `Error: Element type is invalid` |
| Vue | `[Vue warn]: Failed to resolve component: Card` |
| Svelte | Compile-time error |

**Best Practice:** Developers must ensure all components exist before compilation.

---

## 5. Layout Execution Model

### 5.1 IR Tree → JSX Tree Algorithm

**Algorithm:**
```
function generateJSX(nodes: IRNode[]): string {
  return nodes.map(node => {
    if (node.type === "Text") {
      return `{"${escapeJSX(node.value)}"}`
    } else {
      const tag = node.tag
      const attrs = node.attrs.map(a => `${a.key}="${a.value}"`).join(" ")
      const children = generateJSX(node.children)

      if (children.length === 0) {
        return `<${tag} ${attrs} />`
      } else {
        return `<${tag} ${attrs}>\n${children}\n</${tag}>`
      }
    }
  }).join("\n")
}
```

### 5.2 Text Node Rendering

**DSL:**
```uih
layout {
  Div {
    "Hello World"
  }
}
```

**React Output:**
```tsx
<Div>
  {"Hello World"}
</Div>
```

**Rationale:** Explicit `{" "}` prevents whitespace collapse issues.

### 5.3 Attribute Binding

**DSL:**
```uih
layout {
  Div(class:"container", id:"main") {
    "Content"
  }
}
```

**React Output:**
```tsx
<Div class="container" id="main">
  {"Content"}
</Div>
```

**Vue Output:**
```vue
<template>
  <div class="container" id="main">
    Content
  </div>
</template>
```

### 5.4 Hydration Boundary Strategy

#### Root Hydration (Default)
Entire component hydrates as one unit.

**React:**
```tsx
// SSR: renderToString(<Page />)
// CSR: hydrateRoot(document.getElementById('root'), <Page />)
```

#### Nested Hydration (Not Supported in v1.0)
Future: Per-component hydration boundaries.

#### Per-Component Hydration (Future)
```uih
components {
  LazyCard {
    hydrate: "client-only"
  }
}
```

---

## 6. Script Execution Layer

### 6.1 Sandboxing Rules

**UIH v1.0 does NOT provide sandboxing.**

Event handlers execute in **normal JavaScript context**.

**Security Model:**
- Trust developer-written handlers
- No eval() usage
- No dynamic code execution

### 6.2 Function Isolation

Each handler function is **isolated** by JavaScript function scope.

```tsx
function handleClick() {
  // Isolated scope
}

function handleSubmit() {
  // Different isolated scope
}
```

### 6.3 Context Injection

#### React Context Access
```tsx
function handleClick() {
  // Access via closure
  const user = useContext(UserContext); // ❌ Cannot use hooks here
}
```

**Solution:** Define handlers inside component:
```tsx
export default function Page() {
  const user = useContext(UserContext);

  const handleClick = () => {
    console.log(user); // ✅ Access via closure
  };

  return <div onClick={handleClick}>Click</div>;
}
```

#### Vue Reactive State Access
```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

const handleClick = () => {
  count.value++; // ✅ Reactive state access
};
</script>
```

#### Svelte Runes Access
```svelte
<script lang="ts">
let count = $state(0);

function handleClick() {
  count++; // ✅ Runes state mutation
}
</script>
```

---

## 7. Hydration & Lifecycle

### 7.1 Root Hydration

#### React Hydration
```tsx
// Server (SSR)
const html = ReactDOMServer.renderToString(<Page />);

// Client (Hydration)
const root = ReactDOM.hydrateRoot(
  document.getElementById('root')!,
  <Page />
);
```

#### Vue Hydration
```typescript
// Server (SSR)
const html = await renderToString(App);

// Client (Hydration)
createSSRApp(App).mount('#app');
```

#### Svelte Hydration
```typescript
// Server (SSR)
const { html } = App.render();

// Client (Hydration)
new App({ target: document.getElementById('app'), hydrate: true });
```

### 7.2 Client-Only Components

**Not supported in v1.0.**

Future DSL syntax:
```uih
components {
  ClientMap {
    hydrate: "client-only"
  }
}
```

### 7.3 Window Events

**DSL:**
```uih
script {
  onload: "initPage"
}
```

**React Implementation:**
```tsx
function initPage() {
  // TODO: Implement onload handler
}

export default function Page() {
  useEffect(() => {
    initPage();
  }, []); // Runs once on mount

  return <div>Content</div>;
}
```

**Vue Implementation:**
```vue
<script setup lang="ts">
import { onMounted } from 'vue';

const initPage = () => {
  // TODO: Implement onload handler
};

onMounted(() => {
  initPage();
});
</script>
```

**Svelte Implementation:**
```svelte
<script lang="ts">
import { onMount } from 'svelte';

function initPage() {
  // TODO: Implement onload handler
}

onMount(() => {
  initPage();
});
</script>
```

---

## 8. Error Handling & Diagnostics

### 8.1 Runtime Error Shape

**Interface:**
```typescript
interface UIHRuntimeError {
  type: "MISSING_COMPONENT" | "EVENT_HANDLER_ERROR" | "HYDRATION_MISMATCH";
  message: string;
  componentName?: string;
  handlerName?: string;
  line?: number;
  column?: number;
}
```

### 8.2 Event Execution Error Handling

**Generated Code (React):**
```tsx
function handleClick() {
  try {
    // TODO: Implement onclick handler
  } catch (error) {
    console.error('[UIH Runtime Error]', error);
    // Optionally report to error tracking service
  }
}
```

**Not implemented in v1.0** (developers add manually).

### 8.3 Missing Component Fallback

**React Error Boundary:**
```tsx
class UIHErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (error.message.includes('Element type is invalid')) {
      console.error('[UIH] Missing component:', errorInfo);
    }
  }

  render() {
    return this.props.children;
  }
}
```

**Vue Error Handler:**
```typescript
app.config.errorHandler = (err, instance, info) => {
  if (info === 'component render') {
    console.error('[UIH] Component render error:', err);
  }
};
```

**Svelte (Compile-time Only):**
Svelte catches missing components at **compile time**, not runtime.

### 8.4 Hydration Mismatch Diagnostics

**React:**
```
Warning: Text content did not match. Server: "Hello" Client: "Hi"
```

**Vue:**
```
[Vue warn]: Hydration node mismatch
```

**Svelte:**
```
(!) Plugin svelte: Hydration failed because the initial UI does not match
```

**Cause:** Server-rendered HTML differs from client-rendered HTML.

**Solution:** Ensure deterministic rendering (no random values, no Date.now()).

---

## 9. Versioning & Compatibility

### 9.1 DSL Version → Runtime Impact

| DSL Version | Runtime Changes |
|-------------|-----------------|
| v1.0 | Initial runtime model (this spec) |
| v1.1 | Add `client-only` component support |
| v2.0 | Breaking: New IR schema requires runtime updates |

### 9.2 IR Changes → Runtime Versioning

**Backward Compatibility Rule:**
- **Minor IR changes** (new optional fields) → Runtime backward compatible
- **Major IR changes** (renamed fields, removed nodes) → Runtime BREAKING

**Example:**

**v1.0 IR:**
```typescript
{ type: "Component", tag: "Div", attrs: [], children: [] }
```

**v2.0 IR (Breaking):**
```typescript
{ nodeType: "Element", name: "Div", props: {}, childNodes: [] }
```

Runtime must detect IR version:
```typescript
if (ir.version === "1.0") {
  // Use old runtime
} else if (ir.version === "2.0") {
  // Use new runtime
}
```

### 9.3 Framework Version Compatibility

| UIH Version | React | Vue | Svelte |
|-------------|-------|-----|--------|
| v1.0 | 18+ | 3.3+ | 5+ |
| v1.1 | 18+ | 3.4+ | 5+ |
| v2.0 | 19+ | 3.5+ | 6+ |

### 9.4 Runtime Library Versioning

**Package Naming:**
```
@uih-dsl/runtime-react@1.0.0
@uih-dsl/runtime-vue@1.0.0
@uih-dsl/runtime-svelte@1.0.0
```

**Minimal Runtime (Current):**
No runtime library needed for v1.0. Pure code generation.

**Future Runtime (v2.0+):**
```typescript
import { UIHRuntime } from '@uih-dsl/runtime-react';

const runtime = new UIHRuntime({ version: '2.0', features: ['hydration'] });
```

---

## Appendix A: Framework-Specific Runtime Comparison

| Feature | React | Vue | Svelte |
|---------|-------|-----|--------|
| Event Binding | `onClick={fn}` | `@click="fn"` | `on:click={fn}` |
| Style Scope | Global `:root` | `<style scoped>` | `:global(:root)` |
| Hydration | `hydrateRoot()` | `createSSRApp()` | `hydrate: true` |
| Lifecycle | `useEffect()` | `onMounted()` | `onMount()` |
| State | `useState()` | `ref()` | `$state()` |
| Context | `useContext()` | `provide/inject` | Context API |

---

## Appendix B: Performance Characteristics

### Bundle Size Impact

| Framework | Base Size | UIH Runtime Overhead |
|-----------|-----------|---------------------|
| React | ~45KB | +0KB (no runtime) |
| Vue | ~35KB | +0KB (no runtime) |
| Svelte | ~2KB | +0KB (no runtime) |

### Rendering Performance

**Metric:** Time to Interactive (TTI)

| Scenario | React | Vue | Svelte |
|----------|-------|-----|--------|
| Simple Page (10 components) | ~50ms | ~40ms | ~30ms |
| Complex Page (100 components) | ~200ms | ~150ms | ~100ms |

**Note:** Performance depends on **developer-written handlers**, not UIH runtime.

---

## Appendix C: Future Runtime Features (v2.0+)

### 1. Client-Only Components
```uih
components {
  ClientMap {
    hydrate: "client-only"
  }
}
```

### 2. Partial Hydration
```uih
layout {
  Div(hydrate:"interactive") {
    Button { "Click" }
  }
}
```

### 3. Streaming SSR
```uih
meta {
  streaming: true
}
```

### 4. Error Boundaries
```uih
layout {
  ErrorBoundary(fallback:"Error occurred") {
    RiskyComponent {}
  }
}
```

---

**End of Specification**
