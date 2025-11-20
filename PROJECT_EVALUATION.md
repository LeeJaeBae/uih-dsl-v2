# UIH DSL v2 - 프로젝트 평가 자료

## 프로젝트 개요

**UIH DSL (Universal Interface Hierarchy Domain Specific Language)** v2는 AI가 실수 없이 UI를 선언할 수 있도록 설계된 도메인 특화 언어입니다.

### 핵심 특징

- **결정론적 문법**: 모호성을 완전히 제거하여 LLM이 정확한 UI 코드 생성 가능
- **엄격한 제약**: 탭, CRLF, 세미콜론, 작은따옴표 등 금지로 단일 표준 강제
- **다중 타겟 지원**: React, Vue, Svelte 코드 생성
- **에러 수집**: throw 없이 모든 에러를 수집하여 부분 AST 생성

## 아키텍처

```
UIH Source Code
     ↓
┌─────────────┐
│  Tokenizer  │ - 문자 단위 스캔, FSM 기반
└─────────────┘
     ↓
┌─────────────┐
│   Parser    │ - 에러 수집, 부분 AST 생성
└─────────────┘
     ↓
┌─────────────┐
│     IR      │ - 플랫폼 독립적 중간 표현
└─────────────┘
     ↓
┌─────────────┐
│  Codegen    │ - React/Vue/Svelte JSX/SFC 생성
└─────────────┘
     ↓
Target Code (React/Vue/Svelte)
```

### 패키지 구조

```
compiler/packages/
├── tokenizer/        # 토크나이저 (FSM 기반)
├── parser/           # 파서 (에러 수집 방식)
├── ir/              # 중간 표현 (IR)
├── codegen/
│   ├── react/       # React JSX 생성기
│   ├── vue/         # Vue SFC 생성기
│   └── svelte/      # Svelte 생성기
├── runtime/
│   ├── core/        # 공통 런타임
│   ├── react/       # React 런타임
│   ├── vue/         # Vue 런타임
│   └── svelte/      # Svelte 런타임
└── cli/             # CLI 도구
```

---

## 1. Tokenizer (토크나이저)

### 핵심 설계 원칙

- **FSM(Finite State Machine) 기반**: 모드 스택으로 컨텍스트 관리
- **결정론적 스캔**: 정규식 중복 없이 단일 패스 검증
- **엄격한 검증**: 금지 문자 즉시 탐지

### 주요 코드

```typescript
// compiler/packages/tokenizer/src/tokenizer.ts

export class Tokenizer {
  private input: string;
  private index: number = 0;
  private line: number = 1;
  private column: number = 1;
  private tokens: Token[] = [];

  // FSM 모드 스택
  private mode: TokenizerMode = TokenizerMode.NORMAL;
  private modeStack: TokenizerMode[] = [];

  constructor(input: string) {
    // CRLF, 탭 검증
    if (input.includes("\r\n")) {
      throw new Error("CRLF line endings not allowed. Use LF (\\n) only.");
    }
    if (input.includes("\t")) {
      throw new Error("Tab characters not allowed. Use spaces for indentation.");
    }
    this.input = input;
  }

  public tokenize(): Token[] {
    while (this.index < this.input.length) {
      this.skipWhitespace();
      if (this.index >= this.input.length) break;

      const token = this.nextToken();
      if (token) this.tokens.push(token);
    }

    this.tokens.push(
      this.createToken(TokenType.EOF, "", this.getPosition(), this.getPosition())
    );

    return this.tokens;
  }

  private nextToken(): Token | null {
    const startPos = this.getPosition();
    const char = this.peek();

    // 금지 문자 검사 (문자열 외부에서만)
    if (this.mode !== TokenizerMode.STRING_LITERAL && this.isForbiddenChar(char)) {
      throw this.createError(`Forbidden character '${char}'`, startPos);
    }

    // 개행
    if (char === "\n") {
      this.advance();
      this.line++;
      this.column = 1;
      return this.createToken(TokenType.NEWLINE, "\n", startPos, this.getPosition());
    }

    // 심볼
    if (char === "{") return this.createToken(TokenType.LBRACE, "{", ...);
    if (char === "}") return this.createToken(TokenType.RBRACE, "}", ...);
    if (char === "(") {
      this.pushMode(TokenizerMode.ATTRIBUTES);
      return this.createToken(TokenType.LPAREN, "(", ...);
    }
    if (char === ")") {
      this.popMode();
      return this.createToken(TokenType.RPAREN, ")", ...);
    }

    // 문자열
    if (char === '"') return this.readString();

    // 숫자
    if (this.isDigit(char)) return this.readNumber();

    // Identifier 또는 TagName
    if (this.isLetter(char)) return this.readIdentifierOrTagName();

    throw this.createError(`Unexpected character '${char}'`, startPos);
  }

  // 문자열 파싱 (Strategy A: \" 만 허용)
  private readString(): Token {
    const startPos = this.getPosition();
    let value = "";

    this.pushMode(TokenizerMode.STRING_LITERAL);
    this.advance(); // 여는 따옴표 건너뛰기

    while (this.index < this.input.length && this.peek() !== '"') {
      if (this.peek() === "\\") {
        this.advance();
        const nextChar = this.peek();

        if (nextChar === '"') {
          value += '"';
          this.advance();
        } else {
          this.popMode();
          throw this.createError(
            `Invalid escape sequence '\\${nextChar}' - only \\" is allowed`,
            this.getPosition()
          );
        }
      } else if (this.peek() === "\n") {
        this.popMode();
        throw this.createError("Unterminated string (newline not allowed)", this.getPosition());
      } else {
        value += this.peek();
        this.advance();
      }
    }

    if (this.index >= this.input.length) {
      this.popMode();
      throw this.createError("Unterminated string (EOF)", startPos);
    }

    this.advance(); // 닫는 따옴표 건너뛰기
    this.popMode();

    return this.createToken(TokenType.STRING, value, startPos, this.getPosition());
  }

  // FSM 기반 Identifier/TagName 파싱
  private readIdentifierOrTagName(): Token {
    const startPos = this.getPosition();
    let value = "";

    const firstChar = this.peek();
    const isTagName = this.isUpperCase(firstChar);

    if (isTagName) {
      // TagName: [A-Z][a-zA-Z0-9]*
      value += firstChar;
      this.advance();

      while (this.index < this.input.length) {
        const char = this.peek();
        if (this.isLetter(char) || this.isDigit(char)) {
          value += char;
          this.advance();
        } else if (char === "_") {
          throw this.createError("TagName cannot contain underscores", this.getPosition());
        } else {
          break;
        }
      }

      return this.createToken(TokenType.TAGNAME, value, startPos, this.getPosition());
    } else {
      // Identifier: [a-z][a-z0-9.]*
      if (!this.isLowerCase(firstChar)) {
        throw this.createError("Identifier must start with lowercase letter", startPos);
      }

      value += firstChar;
      this.advance();

      let lastWasDot = false;

      while (this.index < this.input.length) {
        const char = this.peek();

        if (this.isLowerCase(char) || this.isDigit(char)) {
          value += char;
          lastWasDot = false;
          this.advance();
        } else if (char === ".") {
          if (lastWasDot) {
            throw this.createError("Identifier cannot contain consecutive dots", this.getPosition());
          }
          value += char;
          lastWasDot = true;
          this.advance();
        } else {
          break;
        }
      }

      if (value.endsWith(".")) {
        throw this.createError("Identifier cannot end with a dot", this.getPosition());
      }

      // Boolean 키워드 확인
      if (value === "true" || value === "false") {
        return this.createToken(TokenType.BOOLEAN, value, startPos, this.getPosition());
      }

      return this.createToken(
        TokenType.IDENTIFIER,
        value,
        startPos,
        this.getPosition(),
        value === "layout" // isPotentialLayoutStart 플래그
      );
    }
  }

  // 금지 문자 검사
  private isForbiddenChar(char: string): boolean {
    const forbidden = [
      ";", "'", "`", "@", "#", "$", "%", "^", "&", "*",
      "=", "+", "|", "\\", "<", ">", "?", "~"
    ];
    return forbidden.includes(char);
  }
}
```

### 토큰 타입 정의

```typescript
// compiler/packages/tokenizer/src/types.ts

export enum TokenType {
  // Identifiers and names
  IDENTIFIER = "IDENTIFIER",  // meta, title, color.primary
  TAGNAME = "TAGNAME",        // Div, Header, H1

  // Literals
  STRING = "STRING",          // "value"
  NUMBER = "NUMBER",          // 12, 0.5
  BOOLEAN = "BOOLEAN",        // true, false

  // Symbols
  LBRACE = "LBRACE",          // {
  RBRACE = "RBRACE",          // }
  LPAREN = "LPAREN",          // (
  RPAREN = "RPAREN",          // )
  COLON = "COLON",            // :
  COMMA = "COMMA",            // ,

  // Whitespace
  NEWLINE = "NEWLINE",        // \n

  // Special
  EOF = "EOF",                // End of file
}

export enum TokenizerMode {
  NORMAL = "NORMAL",
  ATTRIBUTES = "ATTRIBUTES",
  STRING_LITERAL = "STRING_LITERAL",
}

export interface Token {
  type: TokenType;
  value: string;
  range: Range;
  modeAtToken: TokenizerMode;
  rawIndex: number;
  isPotentialLayoutStart?: boolean;
}
```

---

## 2. Parser (파서)

### 핵심 설계 원칙

- **에러 수집**: throw 사용 안 함, 모든 에러를 배열에 수집
- **에러 복구**: NEWLINE, RBRACE, EOF에서 복구
- **부분 AST**: 에러가 있어도 최대한 AST 생성

### 주요 코드

```typescript
// compiler/packages/parser/src/parser.ts

export interface ParserError {
  message: string;
  line: number;
  column: number;
}

export interface ParseResult {
  ast: ASTRoot | null;
  errors: ParserError[];
}

export class Parser {
  private tokens: Token[];
  private current: number = 0;
  private errors: ParserError[] = [];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public parseFile(): ParseResult {
    this.errors = [];
    this.current = 0;

    this.skipNewlines();

    // 블록 파싱 (에러 수집 방식)
    const meta = this.parseBlock("meta") as MetaNode | null;
    const style = this.parseBlock("style") as StyleNode | null;
    const components = this.parseBlock("components") as ComponentsNode | null;
    const layout = this.parseBlock("layout") as LayoutNode | null;
    const script = this.parseBlock("script") as ScriptNode | null;

    // layout은 필수
    if (!layout) {
      this.recordError("Layout block is required", this.peek().range.start);
    }

    // 기본값 제공
    const finalMeta: MetaNode = meta || { type: "Meta", properties: [] };
    const finalStyle: StyleNode = style || { type: "Style", properties: [] };

    const ast: ASTRoot | null = layout ? {
      type: "Program",
      meta: finalMeta,
      style: finalStyle,
      components,
      layout,
      script,
    } : null;

    return { ast, errors: this.errors };
  }

  private parseBlock(expectedBlockName: string): MetaNode | StyleNode | ComponentsNode | LayoutNode | ScriptNode | null {
    this.skipNewlines();

    const token = this.peek();

    if (token.type !== TokenType.IDENTIFIER || token.value !== expectedBlockName) {
      return null;
    }

    if (expectedBlockName === "layout" && !token.isPotentialLayoutStart) {
      return null;
    }

    this.consume();

    this.skipNewlines();
    if (!this.match(TokenType.LBRACE)) {
      this.recordError(`Expected LBRACE after ${expectedBlockName}`, this.peek().range.start);
      this.skipUntilRecoveryPoint();
      return null;
    }
    this.consume();
    this.skipNewlines();

    let result = null;

    try {
      switch (expectedBlockName) {
        case "meta": result = this.parseMeta(); break;
        case "style": result = this.parseStyle(); break;
        case "components": result = this.parseComponents(); break;
        case "layout": result = this.parseLayout(); break;
        case "script": result = this.parseScript(); break;
        default:
          this.recordError(`Unknown block type: ${expectedBlockName}`, token.range.start);
          this.skipUntilRecoveryPoint();
          return null;
      }
    } catch (e) {
      this.skipUntilRecoveryPoint();
      return null;
    }

    this.skipNewlines();
    if (!this.match(TokenType.RBRACE)) {
      this.recordError(`Expected RBRACE to close ${expectedBlockName} block`, this.peek().range.start);
      this.skipUntilRecoveryPoint();
    } else {
      this.consume();
    }
    this.skipNewlines();

    return result;
  }

  // 컴포넌트 트리 파싱
  private parseComponentTree(): LayoutElement[] {
    const elements: LayoutElement[] = [];

    while (!this.match(TokenType.RBRACE) && !this.isAtEnd()) {
      this.skipNewlines();

      if (this.match(TokenType.RBRACE)) break;

      const element = this.parseElement();
      if (element) {
        elements.push(element);
      }

      this.skipNewlines();
    }

    return elements;
  }

  private parseElement(): LayoutElement | null {
    const token = this.peek();

    if (this.isTextString(token)) {
      return this.parseText();
    }

    if (token.type === TokenType.TAGNAME) {
      return this.parseComponent();
    }

    this.recordError(`Expected component or text, got ${token.type}`, token.range.start);
    this.skipUntilRecoveryPoint();
    return null;
  }

  private parseComponent(): LayoutComponent | null {
    if (!this.match(TokenType.TAGNAME)) {
      this.recordError("Expected TAGNAME for component", this.peek().range.start);
      return null;
    }

    const tagToken = this.consume();
    const tag = tagToken.value;

    // 속성 파싱
    let attributes: Attribute[] = [];
    if (this.match(TokenType.LPAREN)) {
      this.consume();
      attributes = this.parseAttributes();
      if (!this.match(TokenType.RPAREN)) {
        this.recordError("Expected RPAREN after attributes", this.peek().range.start);
        this.skipUntilRecoveryPoint();
      } else {
        this.consume();
      }
    }

    // 자식 파싱
    let children: LayoutElement[] = [];
    this.skipNewlines();

    if (this.match(TokenType.LBRACE)) {
      this.consume();
      this.skipNewlines();
      children = this.parseComponentTree();
      if (!this.match(TokenType.RBRACE)) {
        this.recordError("Expected RBRACE to close component", this.peek().range.start);
        this.skipUntilRecoveryPoint();
      } else {
        this.consume();
      }
    }

    const location: Range = {
      start: tagToken.range.start,
      end: this.tokens[this.current - 1].range.end,
    };

    return {
      type: "Component",
      tag,
      attributes,
      children,
      location,
    };
  }

  // TEXT_STRING 판별 (컨텍스트 기반)
  private isTextString(token: Token): boolean {
    if (token.type !== TokenType.STRING) return false;

    // 속성 모드에서는 TEXT_STRING이 아님
    if (token.modeAtToken === TokenizerMode.ATTRIBUTES) return false;

    // 이전 토큰이 LBRACE이면 TEXT_STRING
    const prevToken = this.getPreviousNonNewlineToken();
    return prevToken !== null && prevToken.type === TokenType.LBRACE;
  }

  // 에러 기록 (throw 안 함)
  private recordError(message: string, position: { line: number; column: number }): void {
    this.errors.push({
      message,
      line: position.line,
      column: position.column,
    });
  }

  // 복구 지점까지 스킵
  private skipUntilRecoveryPoint(): void {
    while (!this.isAtEnd()) {
      const token = this.peek();
      if (token.type === TokenType.NEWLINE ||
          token.type === TokenType.RBRACE ||
          token.type === TokenType.EOF) {
        break;
      }
      this.consume();
    }
  }
}
```

---

## 3. IR Translator (중간 표현)

### 핵심 설계 원칙

- **플랫폼 독립성**: React/Vue/Svelte에 공통으로 사용
- **정규화**: 속성 정렬, 경로 분할, 결정론적 출력
- **검증**: IR 생성 단계에서 추가 검증 수행

### 주요 코드

```typescript
// compiler/packages/ir/src/translator.ts

export function createIR(ast: ASTRoot | null, parserErrors: ParserError[]): UIHIR {
  const translationErrors: IRError[] = [];

  // 파서 에러를 IR 에러로 변환
  const errors: IRError[] = parserErrors.map((err) => ({
    message: err.message,
    line: err.line,
    column: err.column,
  }));

  // AST가 null이면 최소 IR 반환
  if (ast === null) {
    return {
      meta: {},
      style: { tokens: [] },
      components: [],
      layout: [],
      script: [],
      errors,
    };
  }

  // 각 블록 변환
  const meta = createMetaIR(ast.meta, translationErrors);
  const style = createStyleIR(ast.style, translationErrors);
  const components = createComponentsIR(ast.components);
  const layout = createLayoutIR(ast.layout);
  const script = createScriptIR(ast.script, translationErrors);

  // 모든 에러 결합
  const allErrors = [...errors, ...translationErrors];

  return {
    meta,
    style,
    components,
    layout,
    script,
    errors: allErrors,
  };
}

// Style IR 생성
function createStyleIR(node: StyleNode, errors: IRError[]): { tokens: StyleToken[] } {
  const tokens: StyleToken[] = [];

  for (const prop of node.properties) {
    // Boolean 값 거부
    if (typeof prop.value === "boolean") {
      pushError(
        errors,
        `Style property '${prop.key}' cannot have boolean value`,
        prop.location.start
      );
      continue;
    }

    // 경로 분할
    const path = splitStylePath(prop.key);

    // 경로 검증 (최소 2개 세그먼트)
    if (!isValidStylePath(path)) {
      pushError(
        errors,
        `Style key '${prop.key}' must use dot notation (e.g., 'color.primary')`,
        prop.location.start
      );
      continue;
    }

    tokens.push({
      path,
      value: prop.value,
    });
  }

  // 정렬 (결정론적 출력)
  const sortedTokens = sortStyleTokens(tokens);

  return { tokens: sortedTokens };
}

// Layout IR 생성 (재귀적)
function createLayoutIR(node: LayoutNode): IRNode[] {
  return node.children.map((child) => transformLayoutElement(child));
}

function transformLayoutElement(node: LayoutElement): IRNode {
  if (node.type === "Component") {
    return transformLayoutComponent(node);
  } else {
    return transformLayoutText(node);
  }
}

function transformLayoutComponent(node: LayoutComponent): IRNode {
  // 속성 정규화 및 정렬
  const attrs = normalizeAttributes(node.attributes);

  // 자식 재귀 변환
  const children = node.children.map((child) => transformLayoutElement(child));

  return {
    type: "Component",
    tag: node.tag,
    attrs,
    children,
  };
}
```

### IR 타입 정의

```typescript
// compiler/packages/ir/src/types.ts

export interface UIHIR {
  meta: Record<string, string | number | boolean>;
  style: {
    tokens: StyleToken[];
  };
  components: string[];
  layout: IRNode[];
  script: ScriptEntry[];
  errors: IRError[];
}

export interface StyleToken {
  path: string[];  // ["color", "primary"]
  value: string | number;
}

export interface ScriptEntry {
  event: string;    // "onClick"
  handler: string;  // "handleClick"
}

export type IRNode = IRComponentNode | IRTextNode;

export interface IRComponentNode {
  type: "Component";
  tag: string;
  attrs: Array<{ key: string; value: string }>;
  children: IRNode[];
}

export interface IRTextNode {
  type: "Text";
  value: string;
}
```

---

## 4. Codegen - JSX Generator

### 핵심 설계 원칙

- **HTML 태그 매핑**: UIH 태그 → HTML 태그
- **이스케이프**: JSX 텍스트 및 속성값 안전 처리
- **들여쓰기**: 재귀적으로 2칸 들여쓰기 적용

### 주요 코드

```typescript
// compiler/packages/codegen/react/src/jsx.ts

export function generateJSX(nodes: IRNode[], indent: number = 0): string {
  return nodes.map((node) => generateNode(node, indent)).join("\n");
}

function mapToHTMLTag(uihTag: string): string {
  const htmlTagMap: Record<string, string> = {
    // Layout
    Div: "div",
    Section: "section",
    Header: "header",
    Footer: "footer",
    Nav: "nav",
    Main: "main",
    // Text
    H1: "h1",
    H2: "h2",
    H3: "h3",
    P: "p",
    Span: "span",
    // Form
    Form: "form",
    Input: "input",
    Button: "button",
    // Media
    Img: "img",
    // Other
    A: "a",
    Card: "div",
  };

  return htmlTagMap[uihTag] || "div";
}

function generateNode(node: IRNode, indent: number): string {
  if (node.type === "Text") {
    return generateTextNode(node, indent);
  } else {
    return generateComponentNode(node, indent);
  }
}

function generateTextNode(node: { type: "Text"; value: string }, indent: number): string {
  const indentStr = " ".repeat(indent);
  const escaped = escapeJSXText(node.value);
  return `${indentStr}{"${escaped}"}`;
}

function generateComponentNode(
  node: {
    type: "Component";
    tag: string;
    attrs: Array<{ key: string; value: string }>;
    children: IRNode[];
  },
  indent: number
): string {
  const indentStr = " ".repeat(indent);
  const tag = mapToHTMLTag(node.tag);
  const attrs = generateAttributes(node.attrs);
  const attrsStr = attrs.length > 0 ? " " + attrs : "";

  // 자식 없으면 self-closing
  if (node.children.length === 0) {
    return `${indentStr}<${tag}${attrsStr} />`;
  }

  // 자식 있으면 재귀 생성
  const childrenStr = generateJSX(node.children, indent + 2);
  return `${indentStr}<${tag}${attrsStr}>
${childrenStr}
${indentStr}</${tag}>`;
}

function generateAttributes(attrs: Array<{ key: string; value: string }>): string {
  return attrs.map((attr) => {
    // class → className 변환
    const key = attr.key === "class" ? "className" : attr.key;
    return `${key}="${escapeAttributeValue(attr.value)}"`;
  }).join(" ");
}

function escapeJSXText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

function escapeAttributeValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
```

---

## 5. CLI Pipeline

### 전체 파이프라인 흐름

```typescript
// compiler/packages/cli/src/core/run-pipeline.ts

export interface PipelineResult {
  ast: ASTRoot | null;
  ir: UIHIR | null;
  code: string | null;
  errors: Array<{ message: string; line?: number; column?: number }>;
}

export function runPipeline(
  source: string,
  target: "react" | "vue" | "svelte" = "react"
): PipelineResult {
  const result: PipelineResult = {
    ast: null,
    ir: null,
    code: null,
    errors: [],
  };

  try {
    // Step 1: Tokenize
    const tokens = tokenize(source);

    // Step 2: Parse
    const parseResult = parse(tokens);

    if (parseResult.errors.length > 0) {
      result.errors.push(...parseResult.errors.map((err) => ({
        message: err.message,
        line: err.line,
        column: err.column,
      })));
      return result;
    }

    result.ast = parseResult.ast;

    // Step 3: Translate to IR
    const irResult = createIR(parseResult.ast, parseResult.errors);

    if (irResult.errors.length > 0) {
      result.errors.push(...irResult.errors.map((err) => ({
        message: err.message,
      })));
    }

    result.ir = irResult;

    // Step 4: Code generation
    if (result.errors.length === 0) {
      const codeResult = generateReact(irResult);
      result.code = codeResult.code;
    }
  } catch (err) {
    const error = err as Error;
    result.errors.push({
      message: error.message,
    });
  }

  return result;
}
```

---

## 6. 예시 코드 변환

### Input: UIH DSL

```uih
meta {
  title: "Login Page"
  route: "/login"
}

style {
  color.primary: "#0E5EF7"
  color.background: "#FFFFFF"
  spacing.base: "16px"
}

layout {
  Div(class: "container") {
    Header {
      H1 {
        "Login"
      }
    }
    Form(class: "login-form") {
      Input(type: "email", placeholder: "Email")
      Input(type: "password", placeholder: "Password")
      Button(type: "submit") {
        "Sign In"
      }
    }
  }
}

script {
  onSubmit: "handleLoginSubmit"
  onClick: "handleButtonClick"
}
```

### Output: React JSX

```jsx
// Generated from UIH DSL

import React from 'react';

const LoginPage = () => {
  return (
    <div className="container">
      <header>
        <h1>
          {"Login"}
        </h1>
      </header>
      <form className="login-form">
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">
          {"Sign In"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
```

---

## 7. 핵심 기술적 성과

### 1. 결정론적 토크나이징
- FSM 기반 모드 관리로 컨텍스트 정확 추적
- 금지 문자 즉시 탐지로 에러 조기 발견
- 정규식 중복 없이 단일 패스 검증

### 2. 에러 수집 파서
- throw 대신 에러 배열 수집으로 다중 에러 보고
- NEWLINE/RBRACE/EOF에서 에러 복구
- 부분 AST 생성으로 IDE 지원 가능

### 3. 정규화된 IR
- 플랫폼 독립적 중간 표현
- 속성/스타일 정렬로 결정론적 출력
- 다중 타겟 코드 생성 지원

### 4. 타입 안전성
- 전체 파이프라인 TypeScript로 작성
- 엄격한 타입 정의로 런타임 에러 최소화
- AST/IR 타입으로 코드 생성 안전 보장

---

## 8. 프로젝트 통계

- **총 패키지 수**: 13개
- **핵심 소스 코드**: ~5,000 LOC (TypeScript)
- **지원 타겟**: React, Vue 3, Svelte 5
- **npm 배포**: `@uih-dsl/*` 스코프로 퍼블릭 배포
- **VSCode 확장**: 문법 하이라이팅, 실시간 컴파일 지원

---

## 9. 향후 계획

1. **에러 메시지 개선**: 더 명확한 에러 위치 및 제안
2. **IDE 지원 강화**: LSP 구현, 자동완성
3. **성능 최적화**: 대규모 파일 처리 최적화
4. **테스트 커버리지**: 100% 커버리지 달성
5. **문서화**: 완전한 API 문서 및 튜토리얼

---

## 결론

UIH DSL v2는 LLM이 실수 없이 UI를 선언할 수 있도록 설계된 **결정론적, 타입 안전, 다중 타겟 지원** 컴파일러입니다. 엄격한 문법 제약과 에러 수집 방식으로 **높은 신뢰성**을 보장하며, React/Vue/Svelte 코드 생성을 통해 **실용적인 활용**이 가능합니다.
