"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslations, useLocale } from "next-intl";

const getApiDocs = (locale: string) => {
  if (locale === "ko") {
    return {
      tokenizer: {
        title: "Tokenizer",
        content: `# Tokenizer API

## 설치

\`\`\`bash
pnpm add @uih-dsl/tokenizer
\`\`\`

## 사용법

\`\`\`typescript
import { tokenize } from "@uih-dsl/tokenizer";

const tokens = tokenize(uihCode);
\`\`\`

## API 레퍼런스

### \`tokenize(source: string): Token[]\`

UIH DSL 소스 코드를 토큰으로 변환합니다.

**파라미터:**
- \`source\` (string) - UIH DSL 소스 코드

**반환값:**
- \`Token[]\` - 토큰 배열

**Token 인터페이스:**
\`\`\`typescript
interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

type TokenType =
  | "IDENTIFIER"
  | "STRING"
  | "LBRACE"
  | "RBRACE"
  | "LPAREN"
  | "RPAREN"
  | "COLON"
  | "COMMA"
  | "NEWLINE"
  | "EOF"
  | "ERROR";
\`\`\``,
      },
      parser: {
        title: "Parser",
        content: `# Parser API

## 설치

\`\`\`bash
pnpm add @uih-dsl/parser
\`\`\`

## 사용법

\`\`\`typescript
import { parse } from "@uih-dsl/parser";
import { tokenize } from "@uih-dsl/tokenizer";

const tokens = tokenize(uihCode);
const { ast, errors } = parse(tokens);
\`\`\`

## API 레퍼런스

### \`parse(tokens: Token[]): ParseResult\`

토큰을 Abstract Syntax Tree (AST)로 파싱합니다.

**파라미터:**
- \`tokens\` (Token[]) - 토크나이저의 토큰 배열

**반환값:**
- \`ParseResult\` - AST와 에러를 포함한 파싱 결과

**ParseResult 인터페이스:**
\`\`\`typescript
interface ParseResult {
  ast: Program | null;
  errors: ParseError[];
}

interface Program {
  type: "Program";
  meta: MetaNode;
  style: StyleNode;
  components?: ComponentsNode;
  layout: LayoutNode;
  script?: ScriptNode;
}
\`\`\``,
      },
      ir: {
        title: "IR",
        content: `# IR (Intermediate Representation) API

## 설치

\`\`\`bash
pnpm add @uih-dsl/ir
\`\`\`

## 사용법

\`\`\`typescript
import { createIR } from "@uih-dsl/ir";

const ir = createIR(ast, errors);
\`\`\`

## API 레퍼런스

### \`createIR(ast: Program, errors: ParseError[]): UIHIR\`

AST를 플랫폼 독립적인 IR로 변환합니다.

**파라미터:**
- \`ast\` (Program) - 파서의 Abstract Syntax Tree
- \`errors\` (ParseError[]) - 파싱 에러

**반환값:**
- \`UIHIR\` - 중간 표현

**UIHIR 인터페이스:**
\`\`\`typescript
interface UIHIR {
  meta: {
    title: string;
    route: string;
    description?: string;
  };
  style: {
    tokens: StyleToken[];
  };
  layout: IRNode[];
  errors: IRError[];
}
\`\`\``,
      },
      codegen: {
        title: "Codegen",
        content: `# Codegen API

## 설치

\`\`\`bash
# React
pnpm add @uih-dsl/codegen-react

# Vue
pnpm add @uih-dsl/codegen-vue

# Svelte
pnpm add @uih-dsl/codegen-svelte
\`\`\`

## 사용법

### React
\`\`\`typescript
import { generate } from "@uih-dsl/codegen-react";

const { code } = generate(ir);
\`\`\`

### Vue
\`\`\`typescript
import { generate } from "@uih-dsl/codegen-vue";

const { code } = generate(ir);
\`\`\`

### Svelte
\`\`\`typescript
import { generate } from "@uih-dsl/codegen-svelte";

const { code } = generate(ir);
\`\`\`

## API 레퍼런스

### \`generate(ir: UIHIR, options?: CodegenOptions): CodegenOutput\`

IR에서 프레임워크별 코드를 생성합니다.

**파라미터:**
- \`ir\` (UIHIR) - 중간 표현
- \`options\` (CodegenOptions) - 선택적 코드 생성 옵션

**반환값:**
- \`CodegenOutput\` - 생성된 코드와 메타데이터`,
      },
    };
  }

  if (locale === "zh") {
    return {
      tokenizer: {
        title: "Tokenizer",
        content: `# Tokenizer API

## 安装

\`\`\`bash
pnpm add @uih-dsl/tokenizer
\`\`\`

## 使用方法

\`\`\`typescript
import { tokenize } from "@uih-dsl/tokenizer";

const tokens = tokenize(uihCode);
\`\`\`

## API 参考

### \`tokenize(source: string): Token[]\`

将 UIH DSL 源代码转换为标记。

**参数:**
- \`source\` (string) - UIH DSL 源代码

**返回值:**
- \`Token[]\` - 标记数组

**Token 接口:**
\`\`\`typescript
interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

type TokenType =
  | "IDENTIFIER"
  | "STRING"
  | "LBRACE"
  | "RBRACE"
  | "LPAREN"
  | "RPAREN"
  | "COLON"
  | "COMMA"
  | "NEWLINE"
  | "EOF"
  | "ERROR";
\`\`\``,
      },
      parser: {
        title: "Parser",
        content: `# Parser API

## 安装

\`\`\`bash
pnpm add @uih-dsl/parser
\`\`\`

## 使用方法

\`\`\`typescript
import { parse } from "@uih-dsl/parser";
import { tokenize } from "@uih-dsl/tokenizer";

const tokens = tokenize(uihCode);
const { ast, errors } = parse(tokens);
\`\`\`

## API 参考

### \`parse(tokens: Token[]): ParseResult\`

将标记解析为抽象语法树（AST）。

**参数:**
- \`tokens\` (Token[]) - 来自分词器的标记数组

**返回值:**
- \`ParseResult\` - 包含 AST 和错误的解析结果

**ParseResult 接口:**
\`\`\`typescript
interface ParseResult {
  ast: Program | null;
  errors: ParseError[];
}

interface Program {
  type: "Program";
  meta: MetaNode;
  style: StyleNode;
  components?: ComponentsNode;
  layout: LayoutNode;
  script?: ScriptNode;
}
\`\`\``,
      },
      ir: {
        title: "IR",
        content: `# IR (中间表示) API

## 安装

\`\`\`bash
pnpm add @uih-dsl/ir
\`\`\`

## 使用方法

\`\`\`typescript
import { createIR } from "@uih-dsl/ir";

const ir = createIR(ast, errors);
\`\`\`

## API 参考

### \`createIR(ast: Program, errors: ParseError[]): UIHIR\`

将 AST 转换为平台无关的 IR。

**参数:**
- \`ast\` (Program) - 来自解析器的抽象语法树
- \`errors\` (ParseError[]) - 解析错误

**返回值:**
- \`UIHIR\` - 中间表示

**UIHIR 接口:**
\`\`\`typescript
interface UIHIR {
  meta: {
    title: string;
    route: string;
    description?: string;
  };
  style: {
    tokens: StyleToken[];
  };
  layout: IRNode[];
  errors: IRError[];
}
\`\`\``,
      },
      codegen: {
        title: "Codegen",
        content: `# Codegen API

## 安装

\`\`\`bash
# React
pnpm add @uih-dsl/codegen-react

# Vue
pnpm add @uih-dsl/codegen-vue

# Svelte
pnpm add @uih-dsl/codegen-svelte
\`\`\`

## 使用方法

### React
\`\`\`typescript
import { generate } from "@uih-dsl/codegen-react";

const { code } = generate(ir);
\`\`\`

### Vue
\`\`\`typescript
import { generate } from "@uih-dsl/codegen-vue";

const { code } = generate(ir);
\`\`\`

### Svelte
\`\`\`typescript
import { generate } from "@uih-dsl/codegen-svelte";

const { code } = generate(ir);
\`\`\`

## API 参考

### \`generate(ir: UIHIR, options?: CodegenOptions): CodegenOutput\`

从 IR 生成特定框架的代码。

**参数:**
- \`ir\` (UIHIR) - 中间表示
- \`options\` (CodegenOptions) - 可选的代码生成选项

**返回值:**
- \`CodegenOutput\` - 生成的代码和元数据`,
      },
    };
  }

  if (locale === "ja") {
    return {
      tokenizer: {
        title: "Tokenizer",
        content: `# Tokenizer API

## インストール

\`\`\`bash
pnpm add @uih-dsl/tokenizer
\`\`\`

## 使用方法

\`\`\`typescript
import { tokenize } from "@uih-dsl/tokenizer";

const tokens = tokenize(uihCode);
\`\`\`

## API リファレンス

### \`tokenize(source: string): Token[]\`

UIH DSL ソースコードをトークンに変換します。

**パラメータ:**
- \`source\` (string) - UIH DSL ソースコード

**戻り値:**
- \`Token[]\` - トークン配列

**Token インターフェース:**
\`\`\`typescript
interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

type TokenType =
  | "IDENTIFIER"
  | "STRING"
  | "LBRACE"
  | "RBRACE"
  | "LPAREN"
  | "RPAREN"
  | "COLON"
  | "COMMA"
  | "NEWLINE"
  | "EOF"
  | "ERROR";
\`\`\``,
      },
      parser: {
        title: "Parser",
        content: `# Parser API

## インストール

\`\`\`bash
pnpm add @uih-dsl/parser
\`\`\`

## 使用方法

\`\`\`typescript
import { parse } from "@uih-dsl/parser";
import { tokenize } from "@uih-dsl/tokenizer";

const tokens = tokenize(uihCode);
const { ast, errors } = parse(tokens);
\`\`\`

## API リファレンス

### \`parse(tokens: Token[]): ParseResult\`

トークンを抽象構文木（AST）にパースします。

**パラメータ:**
- \`tokens\` (Token[]) - トークナイザからのトークン配列

**戻り値:**
- \`ParseResult\` - AST とエラーを含むパース結果

**ParseResult インターフェース:**
\`\`\`typescript
interface ParseResult {
  ast: Program | null;
  errors: ParseError[];
}

interface Program {
  type: "Program";
  meta: MetaNode;
  style: StyleNode;
  components?: ComponentsNode;
  layout: LayoutNode;
  script?: ScriptNode;
}
\`\`\``,
      },
      ir: {
        title: "IR",
        content: `# IR (中間表現) API

## インストール

\`\`\`bash
pnpm add @uih-dsl/ir
\`\`\`

## 使用方法

\`\`\`typescript
import { createIR } from "@uih-dsl/ir";

const ir = createIR(ast, errors);
\`\`\`

## API リファレンス

### \`createIR(ast: Program, errors: ParseError[]): UIHIR\`

AST をプラットフォーム非依存の IR に変換します。

**パラメータ:**
- \`ast\` (Program) - パーサからの抽象構文木
- \`errors\` (ParseError[]) - パースエラー

**戻り値:**
- \`UIHIR\` - 中間表現

**UIHIR インターフェース:**
\`\`\`typescript
interface UIHIR {
  meta: {
    title: string;
    route: string;
    description?: string;
  };
  style: {
    tokens: StyleToken[];
  };
  layout: IRNode[];
  errors: IRError[];
}
\`\`\``,
      },
      codegen: {
        title: "Codegen",
        content: `# Codegen API

## インストール

\`\`\`bash
# React
pnpm add @uih-dsl/codegen-react

# Vue
pnpm add @uih-dsl/codegen-vue

# Svelte
pnpm add @uih-dsl/codegen-svelte
\`\`\`

## 使用方法

### React
\`\`\`typescript
import { generate } from "@uih-dsl/codegen-react";

const { code } = generate(ir);
\`\`\`

### Vue
\`\`\`typescript
import { generate } from "@uih-dsl/codegen-vue";

const { code } = generate(ir);
\`\`\`

### Svelte
\`\`\`typescript
import { generate } from "@uih-dsl/codegen-svelte";

const { code } = generate(ir);
\`\`\`

## API リファレンス

### \`generate(ir: UIHIR, options?: CodegenOptions): CodegenOutput\`

IR からフレームワーク固有のコードを生成します。

**パラメータ:**
- \`ir\` (UIHIR) - 中間表現
- \`options\` (CodegenOptions) - 任意のコード生成オプション

**戻り値:**
- \`CodegenOutput\` - 生成されたコードとメタデータ`,
      },
    };
  }

  // Default to English
  return {
  tokenizer: {
    title: "Tokenizer",
    content: `# Tokenizer API

## Installation

\`\`\`bash
pnpm add @uih-dsl/tokenizer
\`\`\`

## Usage

\`\`\`typescript
import { tokenize } from "@uih-dsl/tokenizer";

const tokens = tokenize(uihCode);
\`\`\`

## API Reference

### \`tokenize(source: string): Token[]\`

Converts UIH DSL source code into tokens.

**Parameters:**
- \`source\` (string) - UIH DSL source code

**Returns:**
- \`Token[]\` - Array of tokens

**Token Interface:**
\`\`\`typescript
interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

type TokenType =
  | "IDENTIFIER"
  | "STRING"
  | "LBRACE"
  | "RBRACE"
  | "LPAREN"
  | "RPAREN"
  | "COLON"
  | "COMMA"
  | "NEWLINE"
  | "EOF"
  | "ERROR";
\`\`\`

## Example

\`\`\`typescript
const uihCode = \`meta {
  title: "My Page"
}\`;

const tokens = tokenize(uihCode);

console.log(tokens);
// [
//   { type: "IDENTIFIER", value: "meta", line: 1, column: 1 },
//   { type: "LBRACE", value: "{", line: 1, column: 6 },
//   { type: "NEWLINE", value: "\\n", line: 1, column: 7 },
//   { type: "IDENTIFIER", value: "title", line: 2, column: 3 },
//   { type: "COLON", value: ":", line: 2, column: 8 },
//   { type: "STRING", value: "My Page", line: 2, column: 10 },
//   ...
// ]
\`\`\``,
  },
  parser: {
    title: "Parser",
    content: `# Parser API

## Installation

\`\`\`bash
pnpm add @uih-dsl/parser
\`\`\`

## Usage

\`\`\`typescript
import { parse } from "@uih-dsl/parser";
import { tokenize } from "@uih-dsl/tokenizer";

const tokens = tokenize(uihCode);
const { ast, errors } = parse(tokens);
\`\`\`

## API Reference

### \`parse(tokens: Token[]): ParseResult\`

Parses tokens into Abstract Syntax Tree (AST).

**Parameters:**
- \`tokens\` (Token[]) - Array of tokens from tokenizer

**Returns:**
- \`ParseResult\` - Parse result with AST and errors

**ParseResult Interface:**
\`\`\`typescript
interface ParseResult {
  ast: Program | null;
  errors: ParseError[];
}

interface ParseError {
  message: string;
  line: number;
  column: number;
}

interface Program {
  type: "Program";
  meta: MetaNode;
  style: StyleNode;
  components?: ComponentsNode;
  layout: LayoutNode;
  script?: ScriptNode;
}
\`\`\`

## Example

\`\`\`typescript
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

const tokens = tokenize(uihCode);
const { ast, errors } = parse(tokens);

if (errors.length > 0) {
  console.error("Parse errors:", errors);
} else {
  console.log("AST:", ast);
}
\`\`\``,
  },
  ir: {
    title: "IR",
    content: `# IR (Intermediate Representation) API

## Installation

\`\`\`bash
pnpm add @uih-dsl/ir
\`\`\`

## Usage

\`\`\`typescript
import { createIR } from "@uih-dsl/ir";

const ir = createIR(ast, errors);
\`\`\`

## API Reference

### \`createIR(ast: Program, errors: ParseError[]): UIHIR\`

Converts AST into platform-independent IR.

**Parameters:**
- \`ast\` (Program) - Abstract Syntax Tree from parser
- \`errors\` (ParseError[]) - Parse errors

**Returns:**
- \`UIHIR\` - Intermediate Representation

**UIHIR Interface:**
\`\`\`typescript
interface UIHIR {
  meta: {
    title: string;
    route: string;
    description?: string;
  };
  style: {
    tokens: StyleToken[];
  };
  layout: IRNode[];
  errors: IRError[];
}

interface IRNode {
  type: "Component" | "Text";
  tag?: string;
  attrs?: Array<{ key: string; value: string }>;
  children?: IRNode[];
  value?: string;
}
\`\`\`

## Example

\`\`\`typescript
const ir = createIR(ast, []);

console.log(ir.meta.title); // "My Page"
console.log(ir.layout); // [{ type: "Component", tag: "Div", ... }]
\`\`\``,
  },
  codegen: {
    title: "Codegen",
    content: `# Codegen API

## Installation

\`\`\`bash
# React
pnpm add @uih-dsl/codegen-react

# Vue
pnpm add @uih-dsl/codegen-vue

# Svelte
pnpm add @uih-dsl/codegen-svelte
\`\`\`

## Usage

### React
\`\`\`typescript
import { generate } from "@uih-dsl/codegen-react";

const { code } = generate(ir);
\`\`\`

### Vue
\`\`\`typescript
import { generate } from "@uih-dsl/codegen-vue";

const { code } = generate(ir);
\`\`\`

### Svelte
\`\`\`typescript
import { generate } from "@uih-dsl/codegen-svelte";

const { code } = generate(ir);
\`\`\`

## API Reference

### \`generate(ir: UIHIR, options?: CodegenOptions): CodegenOutput\`

Generates framework-specific code from IR.

**Parameters:**
- \`ir\` (UIHIR) - Intermediate Representation
- \`options\` (CodegenOptions) - Optional codegen options

**Returns:**
- \`CodegenOutput\` - Generated code and metadata

**CodegenOutput Interface:**
\`\`\`typescript
interface CodegenOutput {
  code: string;
  style: string | null;
  meta: string | null;
  events: EventHandler[] | null;
}

interface CodegenOptions {
  componentName?: string;
  includeComments?: boolean;
  indentSize?: number;
}
\`\`\`

## Example

\`\`\`typescript
const { code } = generate(ir, {
  componentName: "MyPage",
  includeComments: true,
  indentSize: 2
});

console.log(code);
// export default function MyPage() {
//   return (
//     <div>
//       <h1>Hello World</h1>
//     </div>
//   );
// }
\`\`\``,
  },
};
};

export default function APIReferencePage() {
  const locale = useLocale();
  const apiDocs = getApiDocs(locale);
  const [selectedAPI, setSelectedAPI] = useState<keyof typeof apiDocs>("tokenizer");
  const t = useTranslations("apiReference");

  return (
    <div className="flex h-screen bg-white pt-14">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {t("sidebarTitle")}
          </h2>
          <nav className="space-y-1">
            {Object.entries(apiDocs).map(([key, doc]) => (
              <button
                key={key}
                onClick={() => setSelectedAPI(key as keyof typeof apiDocs)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedAPI === key
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {doc.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <article className="prose prose-slate max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {apiDocs[selectedAPI].content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
