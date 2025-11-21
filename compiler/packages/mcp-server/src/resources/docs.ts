import { BUILTIN_COMPONENTS } from "@uih-dsl/runtime-core";

export const docsResources = [
  {
    uri: "uih://docs/grammar",
    name: "UIH Grammar Specification",
    mimeType: "text/markdown",
    content: `
# UIH DSL Grammar

## Structure
meta { ... }
style { ... }
components { ... }
layout { ... }
script { ... }

## Rules
- One intent per line
- No semicolons
- Double quotes for strings
- PascalCase for components
- camelCase for properties
`,
  },
  {
    uri: "uih://docs/components",
    name: "UIH Built-in Components",
    mimeType: "application/json",
    content: JSON.stringify(BUILTIN_COMPONENTS, null, 2),
  },
];
