export const docs = {
  philosophy: {
    title: "Philosophy",
    content: `# UIH DSL Philosophy

> **Universal Interface Hierarchy Domain Specific Language**
> A UI Declaration Language Where AI Never Makes Mistakes

---

## Core Concept

UIH DSL is a domain-specific language designed with **Determinism** and **Clarity** as top priorities. It eliminates all ambiguity that can occur when LLMs (Large Language Models) generate UI structures, ensuring always accurate and predictable results.

---

## Why UIH DSL?

### Problems with Existing Languages

General programming languages (JavaScript, TypeScript, etc.) offer high freedom of expression. While this is an advantage for human developers, it causes the following problems for AI:

| Problem | Description | Example |
|---------|-------------|---------|
| **Syntactic Ambiguity** | Same meaning can be expressed in multiple ways | \`var\`, \`let\`, \`const\` |
| **Quote Mixing** | Single and double quotes mixed | \`'text'\` vs \`"text"\` |
| **Optional Syntax** | Semicolons, parentheses can be omitted | \`return x\` vs \`return (x)\` |
| **Comment Misidentification** | Risk of interpreting comments as code | \`// TODO: implement\` |

### UIH DSL Solution

UIH DSL follows the **Single Source of Truth** principle:

\`\`\`uih
meta {
  title: "Clear Structure"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div(class:"container") {
    H1 { "Only One Way Exists" }
    P { "Clear Declaration Without Ambiguity" }
  }
}
\`\`\`

---

## Design Principles

### 1. Determinism

**"No Alternatives"**

- ✅ Only **one** syntax exists
- ✅ Same input always produces **same output**
- ❌ No alternative syntax
- ❌ No syntactic sugar

### 2. Explicitness

**"One Meaning Per Line"**

- ✅ All declarations are **explicit**
- ✅ No implicit conversions
- ✅ **Explicit structure** instead of type inference

### 3. Fixed Structure

**"Order is Absolute"**

Blocks must be written in this order:

\`\`\`uih
meta { }
style { }
components { }
layout { }
script { }
\`\`\`

### 4. Limited Character Set

**"Use Only What's Allowed"**

✅ Allowed: \`a-z\`, \`0-9\`, \`-\`, \`_\`, \`{}\`, \`:\`, \`"\`
❌ Forbidden: \`'\`, \`;\`, \\\`, \`\\t\`, \`//\`, \`/* */\`

---

## Conclusion

UIH DSL is the **UI declaration language for the AI era**.

Designed for an era where **AI generates UI**, not humans, achieving zero ambiguity, zero mistakes, and 100% predictability.`,
  },
  foundation: {
    title: "Basic Syntax",
    content: `# UIH DSL Basic Syntax

> Just 5 rules to master everything.

---

## 1. Indentation

### Rule: Exactly 2 spaces

\`\`\`uih
layout {
  Div {
    Header {
      H1 { "Title" }
    }
  }
}
\`\`\`

| Allowed | Forbidden | Reason |
|---------|-----------|--------|
| 2 spaces | Tab (\\t) | Parser doesn't recognize tabs |
| 2 spaces | 4 spaces | Rule violation |
| 2 spaces | Mixed | Breaks consistency |

---

## 2. Block Order

### Rule: Order cannot be changed

\`\`\`uih
meta {
  title: "Page Title"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div { "Content" }
}
\`\`\`

### Block Details

| Order | Block | Required | Purpose |
|-------|-------|----------|---------|
| **1** | \`meta\` | ✅ Required | Page metadata |
| **2** | \`style\` | ✅ Required | CSS variables |
| **3** | \`components\` | ⚪ Optional | Component settings |
| **4** | \`layout\` | ✅ Required | UI tree structure |
| **5** | \`script\` | ⚪ Optional | Event handlers |

---

## 3. Character Restrictions

### Rule: Only allowed characters

#### ✅ Allowed Characters

| Category | Characters | Usage |
|----------|------------|-------|
| Lowercase | \`a-z\` | Identifiers, keywords |
| Numbers | \`0-9\` | Part of identifier (not first) |
| Hyphen | \`-\` | Identifier connector |
| Underscore | \`_\` | Identifier connector |
| Braces | \`{}\` | Block delimiter |
| Colon | \`:\` | Property separator |
| Quotes | \`"\` | String literal only |
| Parentheses | \`()\` | Attribute declaration only |

#### ❌ Forbidden Characters

| Character | Reason |
|-----------|--------|
| \`'\` (single quote) | Unify string expression |
| \`;\` (semicolon) | Unnecessary syntax |
| \\\` (backtick) | Prevent template literals |
| \`\\t\` (tab) | Indentation consistency |
| \`//\` \`/**/\` | No comments allowed |

---

## 4. Naming Convention

### Rule: lowercase + dot notation

\`\`\`uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
  spacing.sm: "4px"
}
\`\`\`

Compiles to:
\`\`\`css
:root {
  --color-primary: #0E5EF7;
  --color-secondary: #8B5CF6;
  --spacing-sm: 4px;
}
\`\`\`

---

## 5. No Comments

### Rule: Comments are not allowed

UIH DSL **does not support comments**. This is an intentional design.

#### Why No Comments

1. **Prevent AI confusion**: Eliminate risk of misinterpreting comments as code
2. **Clarity**: Code itself is clear, comments unnecessary
3. **Consistency**: Block comment style debates

**Alternative**: Write documentation in separate files.

---

## Complete Example

\`\`\`uih
meta {
  title: "UIH DSL Guide"
  route: "/guide"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div(class:"min-h-screen bg-white") {
    Header(class:"bg-blue-600 text-white p-6") {
      H1(class:"text-3xl font-bold") {
        "UIH DSL Guide"
      }
    }
    Main(class:"max-w-4xl mx-auto p-8") {
      Section {
        H2(class:"text-2xl font-semibold mb-4") {
          "Basic Syntax"
        }
        P(class:"text-gray-600") {
          "Just 5 rules to master UIH DSL."
        }
      }
    }
  }
}
\`\`\`

This code automatically converts to **React, Vue, Svelte**!`,
  },
  syntax: {
    title: "Components",
    content: `# Component Reference

> All HTML components supported by UIH DSL

---

## Component Categories

UIH DSL provides components based on **semantic HTML5**. All components convert to HTML tags.

| Category | Count | Purpose |
|----------|-------|---------|
| Layout | 8 | Page structure |
| Text | 8 | Text display |
| Forms | 6 | User input |
| Lists | 3 | List display |
| Media | 3 | Images, videos |
| Others | 3 | Links, cards, etc. |

---

## 1. Layout Components

Define **structural elements** of the page.

\`\`\`uih
layout {
  Div(class:"container") {
    Header(class:"bg-white shadow") {
      Nav { "Navigation" }
    }
    Main(class:"py-8") {
      Section {
        Article { "Content" }
      }
    }
    Footer(class:"bg-gray-100") {
      "Footer"
    }
  }
}
\`\`\`

### Components

| Component | HTML | Purpose |
|-----------|------|---------|
| \`Div\` | \`<div>\` | General container |
| \`Section\` | \`<section>\` | Semantic section |
| \`Article\` | \`<article>\` | Independent content |
| \`Header\` | \`<header>\` | Header area |
| \`Footer\` | \`<footer>\` | Footer area |
| \`Nav\` | \`<nav>\` | Navigation |
| \`Main\` | \`<main>\` | Main content |
| \`Aside\` | \`<aside>\` | Sidebar |

---

## 2. Text Components

**Display** and **emphasize** text.

\`\`\`uih
layout {
  Article {
    H1(class:"text-4xl font-bold") { "Main Title" }
    H2(class:"text-3xl") { "Subtitle" }
    P(class:"text-base") { "Paragraph text." }
  }
}
\`\`\`

---

## 3. Form Components

Receive user **input**.

\`\`\`uih
layout {
  Form(class:"max-w-md") {
    Div(class:"mb-4") {
      Label { "Name" }
      Input(type:"text", placeholder:"John")
    }
    Button(type:"submit") { "Submit" }
  }
}
\`\`\`

---

## 4. List Components

**Enumerate** items.

\`\`\`uih
layout {
  Ul(class:"list-disc") {
    Li { "Item 1" }
    Li { "Item 2" }
    Li { "Item 3" }
  }
}
\`\`\`

---

## Complete Page Example

\`\`\`uih
meta {
  title: "Blog"
  route: "/blog"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div(class:"min-h-screen") {
    Header(class:"bg-white shadow") {
      Nav {
        A(href:"/") { "Home" }
        A(href:"/blog") { "Blog" }
      }
    }
    Main(class:"container mx-auto p-8") {
      Article(class:"bg-white rounded shadow p-6") {
        H1(class:"text-3xl font-bold mb-4") {
          "UIH DSL Introduction"
        }
        P { "A UI declaration language where AI never makes mistakes." }
      }
    }
  }
}
\`\`\``,
  },
  codegen: {
    title: "Code Generation",
    content: `# Code Generation (Codegen)

> UIH DSL → Automatic conversion to React, Vue, Svelte

---

## Supported Frameworks

| Framework | Version | Output Format | Status |
|-----------|---------|---------------|--------|
| **React** | 19+ | JSX / TSX | ✅ Full support |
| **Vue** | 3+ | SFC | ✅ Full support |
| **Svelte** | 4/5 | Svelte file | ✅ Full support |

---

## Conversion Pipeline

\`\`\`
UIH Source Code
      ↓
   Tokenizer
      ↓
   Parser
      ↓
     AST
      ↓
   IR Generator
      ↓
    Codegen
      ↓
  ┌──────┬──────┬──────┐
  ↓      ↓      ↓      ↓
React   Vue  Svelte  ...
\`\`\`

---

## React Code Generation

### UIH Input

\`\`\`uih
meta {
  title: "React Example"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div(class:"p-8") {
    H1 { "UIH DSL Playground" }
    P { "AI-friendly UI declaration language" }
  }
}
\`\`\`

### React Output (TSX)

\`\`\`tsx
export default function Page() {
  return (
    <div className="p-8">
      <h1>UIH DSL Playground</h1>
      <p>AI-friendly UI declaration language</p>
    </div>
  );
}
\`\`\`

### Features

- ✅ Next.js 15+ App Router compatible
- ✅ Automatic \`class\` → \`className\` conversion
- ✅ TypeScript support
- ✅ Server Components by default

---

## Vue Code Generation

### Vue Output (SFC)

\`\`\`vue
<script setup lang="ts">
</script>

<template>
  <div class="p-8">
    <h1>UIH DSL Playground</h1>
    <p>AI-friendly UI declaration language</p>
  </div>
</template>
\`\`\`

### Features

- ✅ Vue 3 Composition API
- ✅ \`<script setup>\` format
- ✅ TypeScript support
- ✅ Scoped CSS

---

## Svelte Code Generation

### Svelte Output

\`\`\`svelte
<div class="p-8">
  <h1>UIH DSL Playground</h1>
  <p>AI-friendly UI declaration language</p>
</div>
\`\`\`

### Features

- ✅ Svelte 4/5 compatible
- ✅ Concise syntax
- ✅ Automatic reactivity
- ✅ Compile-time optimization

---

## CSS Variables

### UIH Style Block

\`\`\`uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
}
\`\`\`

### Generated CSS

\`\`\`css
:root {
  --color-primary: #0E5EF7;
  --color-secondary: #8B5CF6;
}
\`\`\`

All frameworks use **identical CSS variables**.

---

## Comparison Table

| Feature | React | Vue | Svelte |
|---------|-------|-----|--------|
| Component Format | JSX | SFC | Svelte |
| Style Scope | External CSS | Scoped | Scoped |
| Reactivity | useState | ref/reactive | Automatic |
| TypeScript | Built-in | Built-in | Built-in |
| File Size | Medium | Medium | Small |

---

## Try in Playground

1. Go to [Playground](/)
2. Write UIH code in left panel
3. Select **React / Vue / Svelte** at the top
4. Check generated code in right panel
5. See **live preview** at the bottom

**Try it now!** → [Open Playground](/)`,
  },
};
