"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";

const getTutorials = (locale: string) => {
  if (locale === "ko") {
    return [
      {
        id: "getting-started",
        title: "시작하기",
        content: `# UIH DSL 시작하기

## UIH DSL이란?

UIH (Universal Interface Hierarchy) DSL은 AI 친화적인 UI 선언 언어로, React, Vue, Svelte로 컴파일됩니다.

## 왜 UIH DSL인가?

- **모호성 제거** - AI가 문법을 착각할 수 없음
- **결정적** - 한 가지 방법으로만 작성
- **플랫폼 독립적** - 여러 프레임워크로 컴파일
- **간단함** - 배우기 쉽고, 잘못 사용하기 어려움

## 첫 번째 UIH 파일

\`.uih\` 확장자로 파일 생성:

\`\`\`uih
meta {
  title: "My First Page"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div(class:"min-h-screen bg-white") {
    H1(class:"text-4xl font-bold") {
      "Hello, UIH!"
    }
  }
}
\`\`\`

이 코드는 깔끔한 React/Vue/Svelte 코드로 컴파일됩니다!

## 다음 단계

다음 튜토리얼에서 블록과 구조에 대해 배워봅시다.`,
      },
      {
        id: "blocks",
        title: "블록 이해하기",
        content: `# 블록 이해하기

UIH DSL은 **고정된 블록 순서**를 사용합니다. 모든 UIH 파일은 정확히 이 순서를 따라야 합니다:

## 1. Meta 블록 (필수)

\`\`\`uih
meta {
  title: "Page Title"
  route: "/path"
  description: "Optional description"
}
\`\`\`

메타 블록은 페이지 메타데이터를 정의합니다.

## 2. Style 블록 (필수)

\`\`\`uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
  spacing.base: "8px"
}
\`\`\`

dot notation을 사용해 CSS 커스텀 프로퍼티를 정의합니다.

## 3. Components 블록 (선택)

\`\`\`uih
components {
  Button {
    variant: "primary"
    size: "md"
  }
}
\`\`\`

재사용 가능한 컴포넌트 설정을 정의합니다.

## 4. Layout 블록 (필수)

\`\`\`uih
layout {
  Div {
    H1 { "Title" }
    P { "Content" }
  }
}
\`\`\`

UI 트리 구조를 정의합니다.

## 5. Script 블록 (선택)

\`\`\`uih
script {
  onClick: "handleClick"
  onSubmit: "handleSubmit"
}
\`\`\`

이벤트 핸들러를 정의합니다.`,
      },
      {
        id: "layout",
        title: "레이아웃 구축",
        content: `# 레이아웃 구축

layout 블록에서 UI 트리를 구축합니다.

## 기본 구조

\`\`\`uih
layout {
  Div {
    H1 { "Title" }
  }
}
\`\`\`

## 컴포넌트 중첩

\`\`\`uih
layout {
  Container {
    Header {
      Nav {
        A(href:"/") { "Home" }
        A(href:"/about") { "About" }
      }
    }
    Main {
      Article {
        H1 { "Blog Post" }
        P { "Content here..." }
      }
    }
  }
}
\`\`\`

## 속성 추가

괄호를 사용해 속성 추가:

\`\`\`uih
Div(class:"container mx-auto") {
  H1(class:"text-4xl font-bold") {
    "Styled Heading"
  }
}
\`\`\``,
      },
      {
        id: "styling",
        title: "CSS 변수로 스타일링",
        content: `# CSS 변수로 스타일링

UIH DSL은 테마를 위해 CSS 커스텀 프로퍼티(변수)를 사용합니다.

## 스타일 토큰 정의

\`\`\`uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
  spacing.sm: "4px"
  spacing.md: "8px"
}
\`\`\`

## Tailwind와 함께 사용

CSS 변수와 Tailwind를 결합:

\`\`\`uih
layout {
  Div(class:"bg-white p-4") {
    H1(class:"font-bold") {
      "Tailwind로 스타일링"
    }
  }
}
\`\`\``,
      },
      {
        id: "compiling",
        title: "코드로 컴파일",
        content: `# React/Vue/Svelte로 컴파일

## 플레이그라운드 사용

가장 쉬운 방법은 플레이그라운드 사용:

1. [플레이그라운드](/)로 이동
2. 왼쪽 패널에 UIH 코드 작성
3. 타겟 프레임워크 선택 (React/Vue/Svelte)
4. 오른쪽에서 컴파일된 코드 확인

## 프로그래밍 방식으로 사용

### 설치

\`\`\`bash
pnpm add @uih-dsl/tokenizer @uih-dsl/parser @uih-dsl/codegen-react
\`\`\`

### React 컴파일

\`\`\`typescript
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { generate } from "@uih-dsl/codegen-react";

const tokens = tokenize(uihCode);
const { ast } = parse(tokens);
const { code } = generate(ast);
\`\`\``,
      },
    ];
  }

  if (locale === "zh") {
    return [
      {
        id: "getting-started",
        title: "入门",
        content: `# UIH DSL 入门

## 什么是 UIH DSL？

UIH (Universal Interface Hierarchy) DSL 是一种 AI 友好的 UI 声明语言，可以编译为 React、Vue 和 Svelte。

## 为什么选择 UIH DSL？

- **零歧义** - AI 无法误解语法
- **确定性** - 只有一种编写方式
- **平台无关** - 编译为多个框架
- **简单** - 易于学习，难以误用

## 第一个 UIH 文件

创建 \`.uih\` 扩展名的文件:

\`\`\`uih
meta {
  title: "My First Page"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div(class:"min-h-screen bg-white") {
    H1(class:"text-4xl font-bold") {
      "Hello, UIH!"
    }
  }
}
\`\`\`

这段代码将编译为干净的 React/Vue/Svelte 代码！

## 下一步

继续下一个教程，学习块和结构。`,
      },
      {
        id: "blocks",
        title: "理解块",
        content: `# 理解块

UIH DSL 使用**固定的块顺序**。每个 UIH 文件必须严格遵循此顺序：

## 1. Meta 块（必需）

\`\`\`uih
meta {
  title: "Page Title"
  route: "/path"
  description: "Optional description"
}
\`\`\`

Meta 块定义页面元数据。

## 2. Style 块（必需）

\`\`\`uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
  spacing.base: "8px"
}
\`\`\`

使用点表示法定义 CSS 自定义属性。

## 3. Components 块（可选）

\`\`\`uih
components {
  Button {
    variant: "primary"
    size: "md"
  }
}
\`\`\`

定义可重用的组件配置。

## 4. Layout 块（必需）

\`\`\`uih
layout {
  Div {
    H1 { "Title" }
    P { "Content" }
  }
}
\`\`\`

定义 UI 树结构。

## 5. Script 块（可选）

\`\`\`uih
script {
  onClick: "handleClick"
  onSubmit: "handleSubmit"
}
\`\`\`

定义事件处理程序。`,
      },
      {
        id: "layout",
        title: "构建布局",
        content: `# 构建布局

在 layout 块中构建 UI 树。

## 基本结构

\`\`\`uih
layout {
  Div {
    H1 { "Title" }
  }
}
\`\`\`

## 嵌套组件

\`\`\`uih
layout {
  Container {
    Header {
      Nav {
        A(href:"/") { "Home" }
        A(href:"/about") { "About" }
      }
    }
    Main {
      Article {
        H1 { "Blog Post" }
        P { "Content here..." }
      }
    }
  }
}
\`\`\`

## 添加属性

使用括号添加属性：

\`\`\`uih
Div(class:"container mx-auto") {
  H1(class:"text-4xl font-bold") {
    "Styled Heading"
  }
}
\`\`\``,
      },
      {
        id: "styling",
        title: "使用 CSS 变量进行样式设置",
        content: `# 使用 CSS 变量进行样式设置

UIH DSL 使用 CSS 自定义属性（变量）来实现主题化。

## 定义样式标记

\`\`\`uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
  spacing.sm: "4px"
  spacing.md: "8px"
}
\`\`\`

## 与 Tailwind 一起使用

结合 CSS 变量和 Tailwind：

\`\`\`uih
layout {
  Div(class:"bg-white p-4") {
    H1(class:"font-bold") {
      "使用 Tailwind 进行样式设置"
    }
  }
}
\`\`\``,
      },
      {
        id: "compiling",
        title: "编译为代码",
        content: `# 编译为 React/Vue/Svelte

## 使用演练场

最简单的方法是使用演练场：

1. 前往[演练场](/)
2. 在左侧面板编写 UIH 代码
3. 选择目标框架（React/Vue/Svelte）
4. 在右侧查看编译后的代码

## 程序化使用

### 安装

\`\`\`bash
pnpm add @uih-dsl/tokenizer @uih-dsl/parser @uih-dsl/codegen-react
\`\`\`

### React 编译

\`\`\`typescript
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { generate } from "@uih-dsl/codegen-react";

const tokens = tokenize(uihCode);
const { ast } = parse(tokens);
const { code } = generate(ast);
\`\`\``,
      },
    ];
  }

  if (locale === "ja") {
    return [
      {
        id: "getting-started",
        title: "はじめに",
        content: `# UIH DSL はじめに

## UIH DSL とは？

UIH (Universal Interface Hierarchy) DSL は、AI フレンドリーな UI 宣言言語で、React、Vue、Svelte にコンパイルできます。

## なぜ UIH DSL なのか？

- **曖昧性ゼロ** - AI が構文を誤解することがない
- **決定的** - 記述方法は一つだけ
- **プラットフォーム非依存** - 複数のフレームワークにコンパイル可能
- **シンプル** - 学びやすく、誤用しにくい

## 最初の UIH ファイル

\`.uih\` 拡張子でファイルを作成：

\`\`\`uih
meta {
  title: "My First Page"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div(class:"min-h-screen bg-white") {
    H1(class:"text-4xl font-bold") {
      "Hello, UIH!"
    }
  }
}
\`\`\`

このコードは綺麗な React/Vue/Svelte コードにコンパイルされます！

## 次のステップ

次のチュートリアルでブロックと構造について学びましょう。`,
      },
      {
        id: "blocks",
        title: "ブロックの理解",
        content: `# ブロックの理解

UIH DSL は**固定のブロック順序**を使用します。すべての UIH ファイルは正確にこの順序に従う必要があります：

## 1. Meta ブロック（必須）

\`\`\`uih
meta {
  title: "Page Title"
  route: "/path"
  description: "Optional description"
}
\`\`\`

Meta ブロックはページのメタデータを定義します。

## 2. Style ブロック（必須）

\`\`\`uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
  spacing.base: "8px"
}
\`\`\`

ドット記法を使用して CSS カスタムプロパティを定義します。

## 3. Components ブロック（任意）

\`\`\`uih
components {
  Button {
    variant: "primary"
    size: "md"
  }
}
\`\`\`

再利用可能なコンポーネント設定を定義します。

## 4. Layout ブロック（必須）

\`\`\`uih
layout {
  Div {
    H1 { "Title" }
    P { "Content" }
  }
}
\`\`\`

UI ツリー構造を定義します。

## 5. Script ブロック（任意）

\`\`\`uih
script {
  onClick: "handleClick"
  onSubmit: "handleSubmit"
}
\`\`\`

イベントハンドラを定義します。`,
      },
      {
        id: "layout",
        title: "レイアウトの構築",
        content: `# レイアウトの構築

layout ブロックで UI ツリーを構築します。

## 基本構造

\`\`\`uih
layout {
  Div {
    H1 { "Title" }
  }
}
\`\`\`

## コンポーネントのネスト

\`\`\`uih
layout {
  Container {
    Header {
      Nav {
        A(href:"/") { "Home" }
        A(href:"/about") { "About" }
      }
    }
    Main {
      Article {
        H1 { "Blog Post" }
        P { "Content here..." }
      }
    }
  }
}
\`\`\`

## 属性の追加

括弧を使用して属性を追加：

\`\`\`uih
Div(class:"container mx-auto") {
  H1(class:"text-4xl font-bold") {
    "Styled Heading"
  }
}
\`\`\``,
      },
      {
        id: "styling",
        title: "CSS 変数でスタイリング",
        content: `# CSS 変数でスタイリング

UIH DSL はテーマのために CSS カスタムプロパティ（変数）を使用します。

## スタイルトークンの定義

\`\`\`uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
  spacing.sm: "4px"
  spacing.md: "8px"
}
\`\`\`

## Tailwind と併用

CSS 変数と Tailwind を組み合わせ：

\`\`\`uih
layout {
  Div(class:"bg-white p-4") {
    H1(class:"font-bold") {
      "Tailwind でスタイリング"
    }
  }
}
\`\`\``,
      },
      {
        id: "compiling",
        title: "コードへのコンパイル",
        content: `# React/Vue/Svelte へのコンパイル

## プレイグラウンドの使用

最も簡単な方法はプレイグラウンドを使用することです：

1. [プレイグラウンド](/)に移動
2. 左パネルに UIH コードを記述
3. ターゲットフレームワークを選択（React/Vue/Svelte）
4. 右側でコンパイルされたコードを確認

## プログラム的な使用

### インストール

\`\`\`bash
pnpm add @uih-dsl/tokenizer @uih-dsl/parser @uih-dsl/codegen-react
\`\`\`

### React コンパイル

\`\`\`typescript
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { generate } from "@uih-dsl/codegen-react";

const tokens = tokenize(uihCode);
const { ast } = parse(tokens);
const { code } = generate(ast);
\`\`\``,
      },
    ];
  }

  // Default to English
  return [
  {
    id: "getting-started",
    title: "Getting Started",
    content: `# Getting Started with UIH DSL

## What is UIH DSL?

UIH (Universal Interface Hierarchy) DSL is an AI-friendly UI declaration language that compiles to React, Vue, and Svelte.

## Why UIH DSL?

- **Zero ambiguity** - AI cannot hallucinate syntax
- **Deterministic** - One way to do things
- **Platform agnostic** - Compiles to multiple frameworks
- **Simple** - Easy to learn, hard to misuse

## Your First UIH File

Create a file with \`.uih\` extension:

\`\`\`uih
meta {
  title: "My First Page"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div(class:"min-h-screen bg-white") {
    H1(class:"text-4xl font-bold") {
      "Hello, UIH!"
    }
  }
}
\`\`\`

This will compile to clean React/Vue/Svelte code!

## Next Steps

Continue to the next tutorial to learn about blocks and structure.`,
  },
  {
    id: "blocks",
    title: "Understanding Blocks",
    content: `# Understanding Blocks

UIH DSL uses **fixed block order**. Every UIH file must have blocks in this exact order:

## 1. Meta Block (Required)

\`\`\`uih
meta {
  title: "Page Title"
  route: "/path"
  description: "Optional description"
}
\`\`\`

The meta block defines page metadata.

## 2. Style Block (Required)

\`\`\`uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
  spacing.base: "8px"
}
\`\`\`

Define CSS custom properties using dot notation.

## 3. Components Block (Optional)

\`\`\`uih
components {
  Button {
    variant: "primary"
    size: "md"
  }
}
\`\`\`

Define reusable component configurations.

## 4. Layout Block (Required)

\`\`\`uih
layout {
  Div {
    H1 { "Title" }
    P { "Content" }
  }
}
\`\`\`

Define your UI tree structure.

## 5. Script Block (Optional)

\`\`\`uih
script {
  onClick: "handleClick"
  onSubmit: "handleSubmit"
}
\`\`\`

Define event handlers.

## Complete Example

\`\`\`uih
meta {
  title: "Complete Example"
  route: "/example"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Container {
    Header {
      H1 { "Welcome" }
    }
    Main {
      P { "This demonstrates all blocks" }
    }
  }
}
\`\`\``,
  },
  {
    id: "layout",
    title: "Building Layouts",
    content: `# Building Layouts

The layout block is where you build your UI tree.

## Basic Structure

\`\`\`uih
layout {
  Div {
    H1 { "Title" }
  }
}
\`\`\`

## Nesting Components

\`\`\`uih
layout {
  Container {
    Header {
      Nav {
        A(href:"/") { "Home" }
        A(href:"/about") { "About" }
      }
    }
    Main {
      Article {
        H1 { "Blog Post" }
        P { "Content here..." }
      }
    }
    Footer {
      P { "© 2024" }
    }
  }
}
\`\`\`

## Adding Attributes

Use parentheses for attributes:

\`\`\`uih
Div(class:"container mx-auto") {
  H1(class:"text-4xl font-bold") {
    "Styled Heading"
  }
  Img(src:"/logo.png", alt:"Logo")
}
\`\`\`

## Supported Components

### Layout
- Div, Section, Article, Aside
- Header, Footer, Nav, Main

### Text
- H1, H2, H3, H4, H5, H6
- P, Span, Text

### Form
- Form, Input, Textarea
- Button, Label, Select, Option

### List
- Ul, Ol, Li

### Media
- Img, Video, Audio

### Other
- A, Card, CardContent

## Pro Tips

1. **Use semantic HTML** - Header, Main, Footer, Article, Nav
2. **Keep nesting reasonable** - Avoid deep nesting (>5 levels)
3. **Use Tailwind classes** - For styling with \`class\` attribute
4. **Self-closing components** - Img, Input don't need closing braces`,
  },
  {
    id: "styling",
    title: "Styling with CSS Variables",
    content: `# Styling with CSS Variables

UIH DSL uses CSS custom properties (variables) for theming.

## Defining Style Tokens

\`\`\`uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
  color.success: "#10B981"
  color.error: "#EF4444"
  spacing.sm: "4px"
  spacing.md: "8px"
  spacing.lg: "16px"
  font.body: "Inter, sans-serif"
  font.mono: "JetBrains Mono, monospace"
}
\`\`\`

## Accessing in Generated Code

These compile to CSS custom properties:

\`\`\`css
:root {
  --color-primary: #0E5EF7;
  --color-secondary: #8B5CF6;
  --spacing-sm: 4px;
}
\`\`\`

## Using with Tailwind

Combine CSS variables with Tailwind:

\`\`\`uih
layout {
  Div(class:"bg-white p-4") {
    H1(class:"font-bold") {
      "Styled with Tailwind"
    }
  }
}
\`\`\`

## Complete Styling Example

\`\`\`uih
meta {
  title: "Styled Page"
  route: "/styled"
}

style {
  color.primary: "#0E5EF7"
  color.background: "#F9FAFB"
  spacing.base: "8px"
}

layout {
  Div(class:"min-h-screen p-8") {
    Div(class:"max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6") {
      H1(class:"text-3xl font-bold mb-4") {
        "Beautiful Card"
      }
      P(class:"text-gray-600") {
        "This card uses Tailwind utilities for styling."
      }
    }
  }
}
\`\`\``,
  },
  {
    id: "compiling",
    title: "Compiling to Code",
    content: `# Compiling UIH to React/Vue/Svelte

## Using the Playground

The easiest way to see compiled code is using the playground:

1. Go to the [Playground](/)
2. Write your UIH code in the left panel
3. Select your target framework (React/Vue/Svelte)
4. See the compiled code on the right

## Using the Compiler Programmatically

### Installation

\`\`\`bash
pnpm add @uih-dsl/tokenizer @uih-dsl/parser @uih-dsl/ir @uih-dsl/codegen-react
\`\`\`

### React Compilation

\`\`\`typescript
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { createIR } from "@uih-dsl/ir";
import { generate } from "@uih-dsl/codegen-react";

const uihCode = \`meta {
  title: "My Page"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div {
    H1 { "Hello World" }
  }
}\`;

// 1. Tokenize
const tokens = tokenize(uihCode);

// 2. Parse
const { ast, errors } = parse(tokens);

if (errors.length > 0) {
  console.error("Parse errors:", errors);
  process.exit(1);
}

// 3. Create IR
const ir = createIR(ast, errors);

// 4. Generate React code
const { code } = generate(ir);

console.log(code);
\`\`\`

### Vue Compilation

\`\`\`typescript
import { generate } from "@uih-dsl/codegen-vue";

const { code } = generate(ir);
\`\`\`

### Svelte Compilation

\`\`\`typescript
import { generate } from "@uih-dsl/codegen-svelte";

const { code } = generate(ir);
\`\`\`

## Output Examples

### React Output

\`\`\`tsx
export default function Page() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
\`\`\`

### Vue Output

\`\`\`vue
<script setup lang="ts">
</script>

<template>
  <div>
    <h1>Hello World</h1>
  </div>
</template>
\`\`\`

### Svelte Output

\`\`\`svelte
<div>
  <h1>Hello World</h1>
</div>
\`\`\``,
  },
];
};

export default function TutorialPage() {
  const [selectedTutorial, setSelectedTutorial] = useState(0);
  const t = useTranslations("tutorial");
  const locale = useLocale();
  const tutorials = getTutorials(locale);

  return (
    <div className="flex h-screen bg-white pt-14">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {t("sidebarTitle")}
          </h2>
          <nav className="space-y-1">
            {tutorials.map((tutorial, index) => (
              <button
                key={tutorial.id}
                onClick={() => setSelectedTutorial(index)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTutorial === index
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  <span>{tutorial.title}</span>
                </div>
              </button>
            ))}
          </nav>

          <div className="mt-8 p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-xs text-blue-700 font-medium mb-2">{t("tryYourself")}</p>
            <Link
              href="/"
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              {t("goToPlayground")}
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <article className="prose prose-slate max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {tutorials[selectedTutorial].content}
            </ReactMarkdown>
          </article>

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6">
            <div>
              {selectedTutorial > 0 && (
                <button
                  onClick={() => setSelectedTutorial(selectedTutorial - 1)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {t("previous")}: {tutorials[selectedTutorial - 1].title}
                </button>
              )}
            </div>
            <div>
              {selectedTutorial < tutorials.length - 1 && (
                <button
                  onClick={() => setSelectedTutorial(selectedTutorial + 1)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {t("next")}: {tutorials[selectedTutorial + 1].title}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
