# UIH DSL — Complete Guide (생략 없는 완전판)

## Table of Contents

1. [Overview](#overview)
2. [Philosophy & Design Principles](#philosophy--design-principles)
3. [Foundation Layer](#foundation-layer)
4. [Tokenizer Specification](#tokenizer-specification)
5. [Grammar](#grammar)
   - [Block Grammar](#block-grammar)
   - [Property Grammar](#property-grammar)
   - [Layout Tree Grammar](#layout-tree-grammar)
   - [Parser BNF Grammar](#parser-bnf-grammar)
6. [AST Schema Definition](#ast-schema-definition)
7. [IR (Intermediate Representation) Specification](#ir-intermediate-representation-specification)
8. [Codegen Rules](#codegen-rules)
   - [React/Next.js 15 Codegen](#reactnextjs-15-codegen)
   - [Vue & Svelte Codegen](#vue--svelte-codegen)
9. [Examples](#examples)
10. [Version](#version)

---

## Overview

UIH DSL (Universal Interface Hierarchy Domain Specific Language) v2는 **"AI가 절대 실수하지 않는 UI 선언 언어"**를 목표로 하는 도메인 특화 언어입니다.

### 핵심 목표
- LLM이 UI 구조를 **정확하게** 선언할 수 있도록 설계
- 모호성 제거 및 결정성(determinism) 보장
- 사람보다 AI가 더 효과적으로 사용 가능한 DSL
- UI 구조의 선언적 표현에 집중

### 아키텍처 흐름
```
DSL 문자열 → Tokenizer → Parser → AST → IR → Codegen → React/Vue/Svelte 코드
```

### 주요 특징
- 한 줄에 하나의 의미만 (One-intent-per-line)
- 선택적 문법 금지 - 모든 것이 명시적
- 쌍따옴표만 허용, 세미콜론 없음
- 주석 지원 안 함 (모호성 제거)
- 고정 블록 순서: meta → style → components → layout → script

---

## Philosophy & Design Principles

UIH DSL은 "AI가 절대 실수하지 않는 UI 선언 언어"를 목표로 하는 도메인 특화 언어입니다. 사람보다 LLM이 더 효과적으로 사용할 수 있도록 설계되었으며, UI 구조의 선언적 표현에 집중합니다.

### 1. LLM 친화적 설계 원칙

LLM이 읽고 쓰기 편한 DSL을 지향합니다. 구조는 최대한 명확하고 모호성이 없으며, 선택적 문법을 금지합니다. LLM이 패턴을 쉽게 반복할 수 있는 형태로 자연어 번역 난이도를 낮췄습니다.

### 2. 선언적 UI 설계

UI는 로직 기반보다 구조 기반으로 설계합니다. "무엇을 만든다"에 집중하며 "어떻게 만든다"는 Codegen이 담당합니다. 상태, 이벤트, 애니메이션은 추상화 계층으로 밀어냅니다.

### 3. 한 줄 한 의미 원칙 (One-intent-per-line)

한 라인에 하나의 의미만 허용합니다. 한 줄에 두 개 의미를 섞으면 LLM이 실수할 가능성이 높아집니다.

#### 좋은 예: 한 줄 한 의미
```dsl
meta:
  title: "Home"

meta:
  route: "/"
```

#### 나쁜 예: 한 줄 다중 의미 (금지)
```dsl
meta: title: "Home", route: "/"  # 잘못된 예
```

### 4. 고정 블록 순서

블록 구조는 **meta → style → components → layout → script** 순서를 유지합니다. 이 순서는 LLM이 외우기 쉽고 Codegen의 예측 가능성과 AST의 결정성을 보장합니다.

### 5. 최소 표현, 최대 의미

DSL은 짧고 규칙적이어야 합니다. CSS-like verbose, YAML 계층 증가, JSX 로직 섞임을 금지합니다. 의미 전달에 집중하는 최소 선언적 DSL입니다.

### 6. 오류 제로 문법

"AI가 틀릴 수 없는 언어"를 목표로 합니다. 쌍따옴표만 허용하고 세미콜론 없이 콜론만 사용합니다. 모든 키는 고정된 string literal이며 optional field를 최소화합니다.

### 7. AST 1:1 매핑

모든 UI 요소가 AST에 직접 매핑됩니다. meta 블록 → MetaNode, style 블록 → StyleNode, layout 블록 → LayoutTree로 변환됩니다.

### 8. 기계 친화적 우선

"사람이 읽으면 조금 불편할 것" 정도가 적정 수준입니다. 사람 UX보다 AI 정확성을 우선합니다.

---

## Foundation Layer

UIH DSL의 가장 낮은 레벨 사양입니다. Character부터 Ordering까지의 기본 규칙을 정의하며, LLM이 실수할 수 없는 엄격한 문법을 제공합니다.

### 1. Character Layer (문자 규칙)

#### ALLOWED_CHARACTERS
- a~z (lowercase alphabets)
- 0~9 (digits)
- hyphen (-)
- underscore (_)
- space ( )
- newline (\n)
- braces: { }
- colon (:)
- double-quote (")

#### DISALLOWED_CHARACTERS
- single-quote (')
- semicolon (;)
- parentheses ()
- backtick (`)
- tab (\t)
- CRLF (\r\n)

#### NEWLINE
- always LF (\n)
- CRLF not supported

### 2. Indentation Layer (들여쓰기 규칙)

#### INDENTATION
- exactly 2 spaces ONLY
- tabs NOT allowed
- indentation increases only inside a block
- indentation does not imply hierarchy (not YAML)

#### 예시
```dsl
meta {           // ❌ 탭 사용 금지
  title: "Home"  // ✅ 정확히 2 space
}
```

### 3. Token Layer (토큰 기본 규칙)

#### TOKENS
- IDENTIFIER = `[a-z][a-z0-9.]*`
- STRING = `"[^"\\]*(?:\\.[^"\\]*)*"` (supports `\"` escape)
- NUMBER = `\d+(?:\.\d+)?`
- LBRACE = `{`
- RBRACE = `}`
- COLON = `:`
- NEWLINE = `\n`
- WHITESPACE = single space

#### IDENTIFIER_RULES
- lowercase only
- dot notation allowed (e.g. `color.primary`)
- do NOT mix hyphens inside identifiers (LLM error-prone)

#### STRING_RULES
- must use double quotes only
- escaping uses `\"`

#### 예시
```dsl
meta {
  color.primary: "#fff"    // ✅ dot notation 허용
  label: "Click \"here\""  // ✅ escape 허용
  width: 100.5            // ✅ 소수 허용
}
```

### 4. Comment Layer (코멘트)

#### COMMENTS
- comments NOT supported
- any attempt to use `//` or `#` is invalid
- purpose: reduce ambiguity for LLM

### 5. Statement Layer (기본 문장 구조)

#### STATEMENT_TYPES
- Block Declaration
- Property Declaration

#### BLOCK_DECLARATION
```
<identifier> {
  <property>: <value>
}
```

#### PROPERTY_DECLARATION
```
<identifier>: <value>
```

#### SEMICOLON
- NOT allowed (never used)

### 6. Block Layer (블록 기본 규칙)

#### BLOCK_STRUCTURE
```
blockName {
  property: "value"
  property: 123
  property: true
}
```

#### BLOCK_RULES
- block cannot contain nested blocks
- ONLY layout block may contain nested layout nodes

### 7. Ordering Layer (순서 강제)

#### BLOCK_ORDER
1. meta
2. style
3. components (optional)
4. layout
5. script (optional)

#### RULE
- if a block appears, must follow this order
- missing blocks are allowed except meta/style/layout

### 전체 구조 예시

```
meta {
  title: "Home"
  route: "/"
}

style {
  primary-color: "#111"
}

components {
  Button {
    variant: "primary"
  }
}

layout {
  Container {
    children: "Button"
  }
}

script {
  // optional script
}
```

### Edge Cases

- 허용되지 않은 문자 발견 시 토큰화 중단
- 잘못된 들여쓰기 발견 시 구문 오류
- 코멘트 시도 시 즉시 무효 처리
- 블록 순서 위반 시 파싱 실패
- layout 외 중첩 블록 시도 시 오류

---

## Tokenizer Specification

Foundation Layer + Grammar Layers 기반의 공식 토큰화 규칙입니다. DSL 문자열을 균일한 Token 리스트로 변환하며, 모든 파싱의 기반이 됩니다.

### 1. Tokenizer Overview

#### PURPOSE
- DSL 문자열을 균일한 Token 리스트로 변환
- 모호성 없는 deterministic token stream 생성
- 모든 파싱은 이 토큰 리스트 기반으로 진행

#### INPUT
- LF 기반의 DSL 문자열

#### OUTPUT
- 순차적 Token 배열

### 2. Token Types

#### TOKENS
- `IDENTIFIER` - meta, title, color.primary, class 등
- `STRING` - "Hello"
- `NUMBER` - 0, 12, 0.8
- `BOOLEAN` - true, false
- `LBRACE` - {
- `RBRACE` - }
- `LPAREN` - (
- `RPAREN` - )
- `COLON` - :
- `COMMA` - ,
- `NEWLINE` - \n
- `WHITESPACE` - space (only used between tokens)
- `TEXT_STRING` - layout children string ONLY (disambiguation)
- `EOF` - end of file marker

### 3. Identifier Detection

#### IDENTIFIER_RULES
- regex: `^[a-z][a-z0-9.]*$`
- lowercase only
- dot notation allowed
- hyphens, underscores 금지

#### TAGNAME_RULES
- starts with uppercase letter
- subsequent chars: `[a-zA-Z0-9]`
- TagName (e.g. Div, Header) 구분용

#### TAGNAME_EXAMPLES
```
Div
Section
Image
H1
```

### 4. String Token Rules

#### STRING
- starts with `"`
- ends with `"`
- inside supports `\"`
- no multi-line

#### TEXT_STRING
- STRING과 동일한 문법
- 단, layout children context에서만 등장
- Parser에서 context-aware로 구분

### 5. Number Token Rules

#### NUMBER
- regex: `^[0-9]+(\.[0-9]+)?$`
- no negative numbers
- no units (px, rem 등)

### 6. Boolean Token Rules

#### BOOLEAN
- `true` or `false`
- strictly lowercase

### 7. Brace / Symbol Tokens

#### SYMBOL_TOKENS
- `LBRACE`: `{`
- `RBRACE`: `}`
- `LPAREN`: `(`
- `RPAREN`: `)`
- `COLON`: `:`
- `COMMA`: `,`

#### NOTES
- semicolon NOT allowed
- backtick NOT allowed

### 8. Whitespace / Newline Rules

#### WHITESPACE
- single space `' '`
- no tabs
- no multi-space sequences except indentation (2 spaces)

#### NEWLINE
- LF only
- CRLF invalid

### 9. Layout Context Rules (Critical)

#### LAYOUT_MODE
Tokenizer enters layout-mode when encountering:
```
layout { … }
```

#### CONTEXT_SWITCH
- after TagName(
- before encountering next node or text

#### INSIDE_LAYOUT_BLOCK
- children detection required
- plain strings must become TEXT_STRING token
- siblings separated by NEWLINE

#### EXAMPLE
```
"Welcome" → TEXT_STRING inside layout
```

### 10. Tokenization Algorithm (High-Level)

1. iterate through chars
2. skip whitespace unless meaningful (indent)
3. detect IDENTIFIER or TAGNAME
4. detect STRING (with escape)
5. detect NUMBER
6. detect BOOLEAN
7. detect braces `{ }`
8. detect parentheses `( )`
9. detect colon `:` or comma `,`
10. detect newline `\n`
11. maintain context stack:
    - normal
    - inside layout block
    - inside attributes
12. output final EOF token

### 11. Example Token Stream

#### INPUT
```
layout {
  Div(class:"p-4") {
    "Hello"
  }
}
```

#### OUTPUT_TOKENS
```
IDENTIFIER(layout)
LBRACE
NEWLINE
TAGNAME(Div)
LPAREN
IDENTIFIER(class)
COLON
STRING("p-4")
RPAREN
LBRACE
NEWLINE
TEXT_STRING("Hello")
NEWLINE
RBRACE
NEWLINE
RBRACE
EOF
```

### Token Stream Examples

#### 기본 블록 토큰화
```dsl
meta {
  title: "Home"
}
```

**Tokens:**
```
IDENTIFIER(meta)
LBRACE
NEWLINE
IDENTIFIER(title)
COLON
STRING("Home")
NEWLINE
RBRACE
EOF
```

#### 스타일 블록 토큰화
```dsl
style {
  color.primary: "#fff"
}
```

**Tokens:**
```
IDENTIFIER(style)
LBRACE
NEWLINE
IDENTIFIER(color.primary)
COLON
STRING("#fff")
NEWLINE
RBRACE
EOF
```

### Edge Cases

- 허용되지 않은 문자 발견 시 토큰화 중단 및 오류 반환
- CRLF 줄바꿈 발견 시 LF로 변환 또는 오류
- 탭 문자 발견 시 공백 변환 또는 오류
- STRING에서 미닫힘 따옴표 시 오류
- NUMBER에 음수나 단위 포함 시 오류
- layout 외 컨텍스트에서 TEXT_STRING 시도 시 오류
- TAGNAME 규칙 위반 (소문자 시작) 시 IDENTIFIER로 처리

---

## Grammar

### Block Grammar

UIH DSL의 최상위 구조를 정의하는 Block Grammar Layer입니다. Foundation Layer 바로 위에 위치하며, 5개 블록의 선언, 순서, 내용 규칙을 명시합니다.

#### 1. Block Definitions (5개 블록)

##### BLOCKS
- meta
- style
- components (optional)
- layout
- script (optional)

##### RULES
- 블록은 반드시 이 순서를 따라야 함: meta → style → components → layout → script
- meta, style, layout은 필수
- components, script는 선택
- 각 블록은 정확히 한 번만 등장
- 중복 블록 금지

#### 2. Block Syntax (기본 문법)

##### BLOCK_SYNTAX
```
<blockName> {
  <property>: <value>
  <property>: <value>
}
```

##### EXAMPLES
```
meta {
  title: "Home"
  route: "/"
}
```

##### SYNTAX_COMPONENTS
- 블록 시작: IDENTIFIER + ` {`
- 블록 끝: `}` 단독 줄

#### 3. Block Content Rules

##### 공통 규칙
- 블록 내부에는 property statements만 존재
- block 내부에 block 중첩 금지
- 단, layout 블록만 예외적으로 UI tree 구조 허용

##### PROPERTY_RULE
```
<identifier>: <value>
```

##### VALUE_TYPES
- string
- number
- boolean
- enum-like literals (string 값)
- list (향후 정의)

#### 4. Block-Specific Rules

##### (1) META BLOCK
```
meta {
  title: "Page title"
  route: "/path"
  theme: "light"|"dark"
}
```

**META_RESTRICTIONS:**
- meta는 UI 문서의 metadata만 포함
- layout 정보나 스타일 정보 포함 금지

##### (2) STYLE BLOCK
```
style {
  color.primary: "#0E5EF7"
  font.family: "Inter"
}
```

**STYLE_RESTRICTIONS:**
- key는 dot notation 사용 가능
- 값은 string 또는 number
- layout 관련 속성 금지
- theme override 불가

##### (3) COMPONENTS BLOCK (optional)
```
components {
  Card
  Button
  Input
}
```

**COMPONENTS_RULES:**
- 등록할 컴포넌트 이름만 줄 단위로 나열
- 중첩 구조 없음
- 속성 없음
- 문자열 아님: `"Card"` 금지, `Card`만 허용

##### (4) LAYOUT BLOCK
```
layout {
  Div(class:"p-4") {
    P {
      "Hello"
    }
  }
}
```

**LAYOUT_RULES:**
- 유일하게 중첩 구조 허용
- 노드 문법은 별도 Layer에서 정의
- property는 inline attribute 형태 가능
- block-like structure 유지

##### (5) SCRIPT BLOCK (optional)
```
script {
  onClick: "submitForm"
  onLoad: "init"
}
```

**SCRIPT_RESTRICTIONS:**
- event/behavior mapping만 정의
- JS code 삽입 금지
- inline function 금지

#### 전체 구조 예시

```
meta {
  title: "Dashboard"
  route: "/dashboard"
  theme: "dark"
}

style {
  color.primary: "#0E5EF7"
  font.family: "Inter"
  spacing.unit: 8
}

components {
  Card
  Button
  Input
  Modal
}

layout {
  Div(class:"container mx-auto p-4") {
    Card(class:"bg-white shadow-lg") {
      Button(onClick:"handleSubmit") {
        "Submit"
      }
    }
  }
}

script {
  onLoad: "initDashboard"
  onSubmit: "processForm"
}
```

#### Edge Cases

- 블록 순서 위반 시 파싱 실패
- 필수 블록(meta/style/layout) 누락 시 오류
- 중복 블록 선언 시 마지막 것만 유효 (경고)
- components/script 외 블록에서 중첩 시도 시 오류
- layout 외 블록에서 attribute 사용 시 오류

---

### Property Grammar

UIH DSL 안정성의 핵심인 Property Grammar Layer입니다. Block Grammar 위에 쌓이며, 속성 선언, 값 타입, 범위 규칙을 정의합니다.

#### 1. Property Declaration Syntax

##### PROPERTY_SYNTAX
```
<identifier>: <value>
```

##### EXAMPLES
```
title: "Home"
radius.default: 8
enabled: true
```

##### RULES
- identifier는 반드시 lowercase
- dot notation 허용 (`color.primary` 등)
- colon(:) 뒤에는 반드시 space 1개
- value는 줄 끝까지

#### 2. Identifier Rules

##### IDENTIFIER
- 패턴: `[a-z][a-z0-9.]*`
- 소문자만 허용
- 숫자는 뒤쪽에만 허용
- dot(.)은 중첩 속성 의미로만 사용
- hyphen 금지 (LLM 오류 방지)
- underscore 금지

##### VALID
```
color.primary
font.size
border.width
```

##### INVALID
```
Color.Primary    // 대문자
font-size        // hyphen
font_size        // underscore
primary2.color   // 숫자 앞쪽
```

#### 3. Value Types (5가지)

##### VALUE_TYPES
1. STRING
2. NUMBER
3. BOOLEAN
4. ENUM-LIKE (string 기반)
5. LIST (여러 값 나열, 줄 단위)

#### 4. String Value Rules

##### STRING
- 무조건 double-quote 사용
- 내부에 `"` 포함 시 `\"`로 escape
- single-quote 절대 금지

##### VALID
```
title: "Home"
description: "He said \"ok\""
```

##### INVALID
```
title: 'Home'      // single-quote
name: "Home"       // curly quotes
```

#### 5. Number Value Rules

##### NUMBER
- 정수 또는 소숫점 가능
- 음수는 허용하지 않음
- 단위(px 등) 금지 → unitless 구조

##### VALID
```
radius: 12
opacity: 0.85
```

##### INVALID
```
radius: -4     // 음수
width: 10px    // 단위 포함
```

#### 6. Boolean Value Rules

##### BOOLEAN
- `true` or `false`

##### EXAMPLES
```
enabled: true
visible: false
```

#### 7. Enum-like String Rules

##### ENUM_STRING
- 문자열이지만 값이 고정된 타입처럼 쓰는 케이스
- allowed values는 별도 block schema마다 정의

##### EXAMPLES
```
theme: "light" | "dark"
size: "sm" | "md" | "lg"
```

#### 8. List Value (Block-like list)

##### LIST
- 각 항목은 줄 단위로 입력
- 대괄호 `[]` 문법 없음 (LLM 오류 방지)
- 문자열/식별자 혼용 가능

##### SYNTAX
```
items {
  "one"
  "two"
  "three"
}
```

##### NOTES
- list block 내부에는 property 없음
- indent 2 spaces 유지

##### EXAMPLE
```
tags {
  "news"
  "feature"
  "announcement"
}
```

#### 9. Property Scope Rules (Block별 허용 속성 경계)

##### META_SCOPE
- meta는 UI metadata만 포함
- route, title, theme, description 등

##### STYLE_SCOPE
- 색상, 폰트, radius 등 UI 스타일만
- layout 속성 금지 (width, height 등은 layout block에서만)

##### COMPONENTS_SCOPE
- property 없음 (등록만)

##### LAYOUT_SCOPE
- inline attribute만 (class, id, ref 등)
- 값은 무조건 string
- boolean/number 사용 금지

##### SCRIPT_SCOPE
- event mapping 전용
- 값은 무조건 string

#### 10. Final Validation Rules

1. 모든 property는 블록 내부에서만 존재
2. 같은 identifier 중복 선언 금지
3. meta/style/script는 property-only 구조
4. components는 선언만 (property 없음)
5. layout만 child nodes 보유 가능
6. value의 타입은 block-specific rule을 반드시 준수

#### 전체 구조 예시

```
meta {
  title: "Dashboard"
  route: "/dashboard"
  theme: "dark"
  description: "Main dashboard page"
}

style {
  color.primary: "#0E5EF7"
  color.secondary: "#6B7280"
  font.family: "Inter"
  border.radius: 8
  spacing.unit: 16
}

components {
  Card
  Button
  Input
}

layout {
  class: "container"
  id: "main-content"
}

script {
  onLoad: "initDashboard"
  onSubmit: "handleForm"
  onRefresh: "reloadData"
}
```

#### Edge Cases

- 대문자 identifier 사용 시 토큰화 실패
- hyphen/underscore 사용 시 구문 오류
- single-quote나 curly quotes 사용 시 파싱 실패
- 음수나 단위 포함 숫자 시 값 오류
- 블록별 스코프 위반 시 validation 실패
- 중복 property 선언 시 마지막 값만 유효 (경고)

---

### Layout Tree Grammar

UIH DSL의 핵심 구조인 Layout Tree Grammar Layer입니다. Block Grammar와 Property Grammar 위에서 동작하며, UI 구성 요소의 트리 구조를 정의합니다.

#### 1. Layout Block Overview

##### LAYOUT_BLOCK
```
layout {
  <layout-node>
}
```

##### NOTES
- DSL에서 유일하게 중첩 구조를 가질 수 있는 블록
- 모든 UI 구성 요소는 layout node로 표현
- 노드는 "구조"만 표현, 스타일/로직은 표현하지 않음

#### 2. Layout Node Syntax

##### NODE_SYNTAX
```
<TagName>(<attributes>) {
  <children>
}
```

##### OR (children 없는 경우)
```
<TagName>(<attributes>)
```

##### NOTES
- TagName은 PascalCase 컴포넌트 또는 HTML-like 사용 가능
- attributes는 inline 형태 only
- attributes는 옵션, 없어도 됨
- children 블록은 중첩 가능

##### VALID
```
Div(class:"p-4") {
  "Hello"
}
```

##### INVALID
```
Div {
  class: "p-4"    // 속성은 block 기반이 아니라 inline only
}
```

#### 3. TagName Rules

##### TAGNAME
- 반드시 알파벳으로 시작
- PascalCase 또는 UpperCamelCase 권장
- HTML-like 소문자 태그는 사용 가능 (`div`, `span`) 단 내부적으로는 UpperCase 변환됨

##### VALID
```
Div
Section
Image
header   // 허용하지만 변환 시 Header로 취급
```

##### INVALID
```
3Div     // 숫자 시작
_Box     // underscore 시작
-Node    // hyphen 시작
```

#### 4. Attribute Syntax

##### ATTRIBUTES
```
<identifier>:"<string>"
```

##### RULES
- value는 무조건 string only
- boolean/number 금지
- `class:"p-4"` 형태처럼 inline만 허용
- 각 attribute는 콤마(`,`)로 구분

##### EXAMPLE
```
Div(class:"p-4", id:"main", ref:"root")
```

##### STRICT_RULES
- 속성 순서는 의미 없음 (LLM 실수 방지로 자유 순서)
- attribute key는 lower-case only
- 속성 개수 0~5 정도 권장

#### 5. Children Rules

##### CHILD_TYPES
- string literal
- another layout node
- list of siblings (node 여러 개 배치)

##### STRING_CHILD
```
"Hello world"
```

##### NESTED_NODE
```
Div(class:"mt-4") {
  "content"
}
```

##### SIBLINGS
```
Div(...) { ... }
P(...) { ... }
Image(...)
```

#### 6. Text Node Rules

##### TEXT_NODE
- 무조건 double-quote string
- 줄바꿈 포함 금지
- 텍스트 덩어리는 여러 줄로 쪼개면 안 됨

##### VALID
```
"Sign in to continue"
```

##### INVALID
```
"Hello
 World"    // 줄바꿈 포함
```

#### 7. Node Termination Rules

##### CLOSING_RULES
- 블록 노드는 반드시 `}` 단독 줄로 닫는다
- inline-only 노드는 종료 블록 없음

##### EXAMPLE
```
Div(class:"px-4") {
  P {
    "Hello"
  }
  Image(src:"/logo.png")
}
```

#### 8. Layout Grammar Formal Pattern

##### LAYOUT_NODE_GRAMMAR
```
Node:
  Tag (Attributes?) (ChildrenBlock?)

Tag:
  IDENTIFIER

Attributes:
  "(" AttributeList ")"

AttributeList:
  Attribute ("," Attribute)*

Attribute:
  IDENTIFIER ":" STRING

ChildrenBlock:
  "{" NewLine Indented(NodeOrText)+ "}"

NodeOrText:
  Node | STRING
```

#### 9. Validation Rules

1. layout은 트리 구조만 표현한다
2. inline attributes만 허용
3. 속성은 string-only
4. children은 반드시 정해진 중첩 규칙을 따른다
5. Node 이름은 PascalCase가 기본
6. 문자열 children 외에는 모든 children은 Node여야 한다
7. siblings 허용, 순서 보존

#### 10. Example (Valid Layout Tree)

```
layout {
  Div(class:"min-h-screen flex flex-col") {
    Header(class:"p-4 bg-gray-100") {
      H1 {
        "Dashboard"
      }
    }

    Main(class:"flex-1 p-6") {
      Card(class:"shadow") {
        P {
          "Welcome back!"
        }
      }
    }

    Footer(class:"p-4 text-center") {
      "© 2025 The Bespoke"
    }
  }
}
```

#### 전체 구조 예시

```
layout {
  Container(class:"max-w-7xl mx-auto") {
    Navbar(class:"flex justify-between items-center p-4") {
      Logo(class:"text-xl font-bold") {
        "UIH"
      }
      Nav(class:"space-x-4") {
        Link(href:"/home") {
          "Home"
        }
        Link(href:"/about") {
          "About"
        }
      }
    }

    Content(class:"grid grid-cols-3 gap-6 p-6") {
      Sidebar(class:"col-span-1 bg-gray-50 p-4") {
        Menu {
          "Dashboard"
          "Settings"
          "Profile"
        }
      }

      Main(class:"col-span-2") {
        Article(class:"prose") {
          H2 {
            "Getting Started"
          }
          P {
            "Welcome to UIH DSL documentation."
          }
        }
      }
    }
  }
}
```

#### Edge Cases

- TagName에 숫자/특수문자 시작 시 토큰화 실패
- 속성에 boolean/number 값 사용 시 파싱 오류
- 텍스트 노드에 줄바꿈 포함 시 validation 실패
- 노드 종료 `}` 누락 시 구문 오류
- 중첩 깊이가 너무 깊을 경우 (권장 5레벨 초과) 경고
- siblings 간 순서가 UI 의미에 영향 줄 경우 재검토

---

### Parser BNF Grammar

Tokenizer 위에서 동작하는 공식 문법 엔진 정의입니다. Token Stream을 Abstract Syntax Tree(AST)로 변환합니다.

#### 1. Overview

##### GOAL
- Token Stream → Abstract Syntax Tree(AST)

##### PARSER_MODE
- strict non-ambiguous grammar
- no recovery parsing (에러는 즉시 throw)
- deterministic (LLM-friendly)
- recursive descent parser 기반 구조

#### 2. Entry Point

##### Program
```
Program ::= MetaBlock StyleBlock ComponentsBlock? LayoutBlock ScriptBlock? EOF
```

#### 3. Blocks

##### Block_Definitions
```
MetaBlock       ::= "meta" BlockBody(MetaProperty)
StyleBlock      ::= "style" BlockBody(StyleProperty)
ComponentsBlock ::= "components" BlockBody(ComponentEntry)
LayoutBlock     ::= "layout" LayoutBody
ScriptBlock     ::= "script" BlockBody(ScriptProperty)
```

#### 4. Generic Block Body

##### BlockBody
```
BlockBody(<T>) ::= LBRACE NEWLINE (Indent <T> NEWLINE)* RBRACE
Indent         ::= WHITESPACE WHITESPACE    # 2 spaces only
```

#### 5. META Block Grammar

##### MetaProperty
```
MetaProperty ::= Identifier ":" MetaValue
MetaValue    ::= STRING | NUMBER | BOOLEAN | EnumString
```

##### Allowed_Meta_Keys
- title, route, theme, description

#### 6. STYLE Block Grammar

##### StyleProperty
```
StyleProperty ::= StyleKey ":" StyleValue
StyleKey      ::= Identifier ( "." Identifier )*
StyleValue    ::= STRING | NUMBER | EnumString
```

##### Notes
- no nested blocks
- no boolean
- layout-like attributes 금지

#### 7. COMPONENTS Block Grammar

##### ComponentEntry
```
ComponentEntry ::= ComponentName
ComponentName  ::= TAGNAME | IDENTIFIER
```

##### NOTES
- but no quotes, no values, one per line

##### Examples
```
Card
Button
Input
```

#### 8. LAYOUT Block Grammar (Core)

##### LayoutBody
```
LayoutBody     ::= LBRACE NEWLINE Indent LayoutNodeList RBRACE
LayoutNodeList ::= (LayoutNode NEWLINE)*
LayoutNode     ::= Tag (Attributes)? (ChildrenBlock)?
Tag            ::= TAGNAME | IDENTIFIER
```

#### 9. Attributes Grammar

##### Attributes
```
Attributes    ::= LPAREN AttributeList RPAREN
AttributeList ::= Attribute (COMMA Attribute)*
Attribute     ::= Identifier ":" STRING
```

#### 10. Children Block Grammar

##### ChildrenBlock
```
ChildrenBlock ::= LBRACE NEWLINE Indent ChildrenList RBRACE
ChildrenList  ::= (Child NEWLINE)*
Child         ::= LayoutNode | TEXT_STRING
```

#### 11. SCRIPT Block Grammar

##### ScriptProperty
```
ScriptProperty ::= Identifier ":" STRING
```

##### Allowed_Script_Keys
- onClick, onLoad, onSubmit, onMount, onChange

#### 12. Value Grammars

##### Value_Types
```
STRING     ::= "\"" <chars> "\""
NUMBER     ::= digits ( "." digits )?
BOOLEAN    ::= "true" | "false"
EnumString ::= STRING   # validated in semantic phase
```

#### 13. Identifier Grammars

##### Identifiers
```
Identifier ::= [a-z][a-z0-9.]*
TagName    ::= [A-Z][a-zA-Z0-9]*
```

#### 14. Syntax Constraints (Formal)

1. 모든 블록은 순서 고정
2. 각 블록은 1회만 등장
3. meta/style/layout은 필수
4. components/script는 optional
5. 들여쓰기 2 spaces only
6. 속성(colon)은 반드시 `<id>: <value>`
7. semicolon 금지
8. layout만 nested structure 허용
9. children 안에서는 TEXT_STRING 또는 LayoutNode만 허용
10. parser는 ambiguous branch 금지 (LLM-safe)

#### 15. Complete Example (BNF-valid)

```
meta {
  title: "Home"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
  radius.default: 8
}

components {
  Card
  Button
}

layout {
  Div(class:"p-4") {
    P {
      "Hello world"
    }
  }
}

script {
  onClick: "submitForm"
}
```

#### BNF 구조 트리

```
Program
├── MetaBlock
│   ├── LBRACE
│   ├── MetaProperty (title: "Home")
│   ├── MetaProperty (route: "/")
│   └── RBRACE
├── StyleBlock
│   ├── LBRACE
│   ├── StyleProperty (color.primary: "#0E5EF7")
│   ├── StyleProperty (radius.default: 8)
│   └── RBRACE
├── ComponentsBlock
│   ├── LBRACE
│   ├── ComponentEntry (Card)
│   ├── ComponentEntry (Button)
│   └── RBRACE
├── LayoutBlock
│   ├── LBRACE
│   ├── LayoutNode (Div)
│   │   ├── Attributes (class:"p-4")
│   │   └── ChildrenBlock
│   │       └── LayoutNode (P)
│   │           └── ChildrenBlock
│   │               └── TEXT_STRING ("Hello world")
│   └── RBRACE
└── ScriptBlock
    ├── LBRACE
    ├── ScriptProperty (onClick: "submitForm")
    └── RBRACE
```

#### Edge Cases

- 블록 순서 위반 시 즉시 파싱 중단
- 필수 블록(meta/style/layout) 누락 시 오류
- 중복 블록 선언 시 마지막 것만 유지 (경고)
- 들여쓰기 2 space 위반 시 구문 오류
- layout 외 블록에서 중첩 시도 시 파싱 실패
- 허용되지 않은 키 사용 시 semantic 오류 (parser 단계에서는 허용)
- TEXT_STRING이 layout 외 컨텍스트에서 등장 시 오류

---

## AST Schema Definition

Parser BNF 위에서 생성되는 최종 AST 구조입니다. 모든 UIH DSL 요소가 이 스키마에 따라 구조화됩니다.

### 1. AST Root

#### ASTRoot
```typescript
{
  type: "Program"
  meta: MetaNode
  style: StyleNode
  components: ComponentsNode | null
  layout: LayoutNode
  script: ScriptNode | null
}
```

### 2. Meta Node

#### MetaNode
```typescript
{
  type: "Meta"
  properties: MetaProperty[]
}
```

#### MetaProperty
```typescript
{
  key: string         // e.g. "title"
  value: string|number|boolean
  location: Range     // from tokenizer
}
```

### 3. Style Node

#### StyleNode
```typescript
{
  type: "Style"
  properties: StyleProperty[]
}
```

#### StyleProperty
```typescript
{
  key: string         // e.g. "color.primary"
  value: string|number
  location: Range
}
```

### 4. Components Node

#### ComponentsNode
```typescript
{
  type: "Components"
  components: ComponentEntry[]
}
```

#### ComponentEntry
```typescript
{
  name: string        // e.g. "Card"
  location: Range
}
```

### 5. Layout Node (Core Tree Structure)

#### LayoutNode
```typescript
{
  type: "Layout"
  children: LayoutElement[]     // top-level nodes inside layout block
}
```

#### LayoutElement
```typescript
LayoutElement = LayoutComponent | LayoutText
```

#### 5.1 Layout Component
```typescript
LayoutComponent {
  type: "Component"
  tag: string                   // e.g. "Div", "P", "Header"
  attributes: Attribute[]
  children: LayoutElement[]     // nested structure
  location: Range
}
```

#### Attribute
```typescript
{
  key: string                   // lower-case only
  value: string                 // inline string only
  location: Range
}
```

#### 5.2 Layout Text Node
```typescript
LayoutText {
  type: "Text"
  value: string                 // raw text string
  location: Range
}
```

### 6. Script Node

#### ScriptNode
```typescript
{
  type: "Script"
  events: ScriptProperty[]
}
```

#### ScriptProperty
```typescript
{
  key: string                   // e.g. "onClick"
  value: string                 // e.g. "submitForm"
  location: Range
}
```

### 7. Range Object (Source Location)

#### Range
```typescript
{
  start: Position
  end: Position
}
```

#### Position
```typescript
{
  line: number
  column: number
}
```

### 8. Semantics Rules (Validation Layer)

1. Meta keys must be from allowlist:
   - title, route, theme, description

2. Style keys may use dot notation but MUST be lowercase.

3. Components must be names only, no properties.

4. Layout:
   - tag must be a valid TagName or valid identifier
   - attributes must be string-only
   - children: array of LayoutElement (component or text)

5. Script:
   - keys must be known event names
   - value must be string (function name)

6. No null children arrays. Use `[]` if empty.

7. All nodes must have location data.

### 9. Example: Full AST for a Simple Page

#### Example DSL
```
meta {
  title: "Home"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div(class:"p-4") {
    "Hello"
  }
}
```

#### Generated AST (simplified)
```json
{
  "type": "Program",
  "meta": {
    "type": "Meta",
    "properties": [
      { "key": "title", "value": "Home" },
      { "key": "route", "value": "/" }
    ]
  },
  "style": {
    "type": "Style",
    "properties": [
      { "key": "color.primary", "value": "#0E5EF7" }
    ]
  },
  "components": null,
  "layout": {
    "type": "Layout",
    "children": [
      {
        "type": "Component",
        "tag": "Div",
        "attributes": [
          { "key": "class", "value": "p-4" }
        ],
        "children": [
          { "type": "Text", "value": "Hello" }
        ]
      }
    ]
  },
  "script": null
}
```

### AST 구조 트리

```
ASTRoot (Program)
├── meta (MetaNode)
│   └── properties[] (MetaProperty)
├── style (StyleNode)
│   └── properties[] (StyleProperty)
├── components (ComponentsNode | null)
│   └── components[] (ComponentEntry)
├── layout (LayoutNode)
│   └── children[] (LayoutElement)
│       ├── LayoutComponent
│       │   ├── attributes[] (Attribute)
│       │   └── children[] (LayoutElement)
│       └── LayoutText
└── script (ScriptNode | null)
    └── events[] (ScriptProperty)
```

### AST Examples

#### 최소 AST 구조
```json
{
  "type": "Program",
  "meta": {
    "type": "Meta",
    "properties": [
      {"key": "title", "value": "Minimal"}
    ]
  },
  "style": {
    "type": "Style",
    "properties": []
  },
  "components": null,
  "layout": {
    "type": "Layout",
    "children": [
      {
        "type": "Text",
        "value": "Content"
      }
    ]
  },
  "script": null
}
```

#### 복잡한 레이아웃 AST
```json
{
  "type": "Layout",
  "children": [
    {
      "type": "Component",
      "tag": "Div",
      "attributes": [
        {"key": "class", "value": "container"}
      ],
      "children": [
        {
          "type": "Component",
          "tag": "Header",
          "attributes": [],
          "children": [
            {
              "type": "Component",
              "tag": "H1",
              "attributes": [],
              "children": [
                {"type": "Text", "value": "Title"}
              ]
            }
          ]
        },
        {
          "type": "Component",
          "tag": "Main",
          "attributes": [
            {"key": "class", "value": "content"}
          ],
          "children": [
            {"type": "Text", "value": "Main content"}
          ]
        }
      ]
    }
  ]
}
```

### Edge Cases

- location 정보 누락 시 AST 생성 실패
- 빈 children 배열 대신 null 사용 시 validation 오류
- 허용되지 않은 meta/style/script 키 사용 시 semantic 오류
- LayoutComponent의 tag가 유효하지 않은 경우 오류
- LayoutText에 빈 문자열 사용 시 경고
- 중첩 깊이가 너무 깊을 경우 (10레벨 초과) 경고 또는 오류

---

## IR (Intermediate Representation) Specification

AST → IR 변환 규칙을 정의합니다. Codegen 단계 직전의 "정규화된 구조"로, 플랫폼불문의 공통 인터페이스를 제공합니다.

### 1. Overview

#### IR_GOAL
- AST의 복잡한 구조를 코드 생성하기 좋게 단순화
- UI 컴포넌트 트리와 메타데이터를 정규화
- 플랫폼불문(React/Next/Svelte) 공통 인터페이스로 변환
- 모든 값은 최종적이고 확정된 형태만 유지

#### INPUT
- ASTRoot

#### OUTPUT
- IRRoot

### 2. IR Root

#### IRRoot
```typescript
{
  meta: IRMeta
  style: IRStyle
  components: IRComponents
  layout: IRLayoutTree
  script: IRScript
}
```

### 3. IRMeta (Final Document Metadata)

#### IRMeta
```typescript
{
  title: string
  route: string
  theme: "light" | "dark"
  description: string | null
}
```

#### Rules
- missing values become null
- enforce route starts with "/"

### 4. IRStyle (Flattened Style Tokens)

#### IRStyle
```typescript
{
  tokens: Record<string, string | number>
}
```

#### Examples
```typescript
{
  "color.primary": "#0E5EF7"
  "radius.default": 8
}
```

#### Rules
- dot-notation keys preserved
- all values converted to primitive string/number
- no validation here (semantic pass already done)

### 5. IRComponents (Registered Component Map)

#### IRComponents
```typescript
{
  list: string[]   // e.g. ["Card", "Button"]
}
```

#### Rules
- duplicates removed
- sorted alphabetically for deterministic output

### 6. IRLayoutTree (Normalized UI Tree)

#### IRLayoutTree
```typescript
{
  root: IRNode[]
}
```

#### IRNode
```typescript
IRNode = IRComponentNode | IRTextNode
```

#### 6.1 IRComponentNode
```typescript
{
  type: "component"
  tag: string
  attributes: Record<string, string>   // key:string only
  children: IRNode[]
}
```

#### Rules
- attribute keys lower-case enforced
- children always array
- empty children => []

#### 6.2 IRTextNode
```typescript
{
  type: "text"
  value: string
}
```

#### Rules
- trimmed text preserved exactly
- no newline allowed inside text

### 7. IRScript (Event Map)

#### IRScript
```typescript
{
  events: Record<string, string>   // onClick → "submitForm"
}
```

#### Rules
- all keys normalized to lower-case event names
- event value must be string only
- duplicates override earlier definitions

### 8. AST → IR Mapping Rules

1. **MetaNode → IRMeta**
   - convert property array → object map
   - apply default values if missing
   - route must start with "/"

2. **StyleNode → IRStyle**
   - flatten list into tokens object
   - preserve ordering but output sorted keys for determinism

3. **ComponentsNode → IRComponents**
   - convert component list → array
   - remove duplicates
   - sort alphabetically

4. **LayoutNode → IRLayoutTree**
   - recursively convert LayoutComponent → IRComponentNode
   - convert LayoutText → IRTextNode
   - inline attributes converted to plain object

5. **ScriptNode → IRScript**
   - property list flattened to event map
   - enforce lower-case event names

### 9. Example: Full IR Output

#### DSL
```
meta {
  title: "Home"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div(class:"p-4") {
    "Hello"
  }
}
```

#### IR
```json
{
  "meta": {
    "title": "Home",
    "route": "/",
    "theme": null,
    "description": null
  },

  "style": {
    "tokens": {
      "color.primary": "#0E5EF7"
    }
  },

  "components": {
    "list": []
  },

  "layout": {
    "root": [
      {
        "type": "component",
        "tag": "Div",
        "attributes": { "class": "p-4" },
        "children": [
          { "type": "text", "value": "Hello" }
        ]
      }
    ]
  },

  "script": {
    "events": {}
  }
}
```

### IR 구조 트리

```
IRRoot
├── meta (IRMeta)
│   ├── title: string
│   ├── route: string
│   ├── theme: "light"|"dark"|null
│   └── description: string|null
├── style (IRStyle)
│   └── tokens: Record<string, string|number>
├── components (IRComponents)
│   └── list: string[]
├── layout (IRLayoutTree)
│   └── root: IRNode[]
│       ├── IRComponentNode
│       │   ├── type: "component"
│       │   ├── tag: string
│       │   ├── attributes: Record<string, string>
│       │   └── children: IRNode[]
│       └── IRTextNode
│           ├── type: "text"
│           └── value: string
└── script (IRScript)
    └── events: Record<string, string>
```

### IR Examples

#### 간단한 IR 변환
```json
{
  "meta": {
    "title": "Simple",
    "route": "/",
    "theme": "light",
    "description": null
  },
  "style": {
    "tokens": {
      "color.primary": "#000",
      "font.size": 14
    }
  },
  "components": {
    "list": ["Button"]
  },
  "layout": {
    "root": [
      {
        "type": "component",
        "tag": "Div",
        "attributes": {},
        "children": [
          {"type": "text", "value": "Content"}
        ]
      }
    ]
  },
  "script": {
    "events": {
      "onclick": "handleClick"
    }
  }
}
```

#### 복잡한 중첩 레이아웃 IR
```json
{
  "layout": {
    "root": [
      {
        "type": "component",
        "tag": "Container",
        "attributes": {
          "class": "flex flex-col min-h-screen"
        },
        "children": [
          {
            "type": "component",
            "tag": "Header",
            "attributes": {
              "class": "p-4 bg-blue-600"
            },
            "children": [
              {
                "type": "component",
                "tag": "H1",
                "attributes": {},
                "children": [
                  {"type": "text", "value": "Dashboard"}
                ]
              }
            ]
          },
          {
            "type": "component",
            "tag": "Main",
            "attributes": {
              "class": "flex-1 p-6"
            },
            "children": [
              {
                "type": "component",
                "tag": "Card",
                "attributes": {
                  "class": "bg-white shadow-lg rounded"
                },
                "children": [
                  {"type": "text", "value": "Welcome!"}
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Edge Cases

- AST에 location 정보 누락 시 IR 변환 실패
- route가 "/"로 시작하지 않을 경우 변환 시 강제 추가
- 중복 컴포넌트 등록 시 알파벳 순 정렬로 중복 제거
- 빈 children 배열을 null로 잘못 설정 시 []로 강제 변환
- 텍스트 노드에 줄바꿈 포함 시 변환 중 제거 또는 오류
- 이벤트 키 대소문자 혼재 시 소문자로 통일
- 스타일 토큰 키 순서가 다를 경우 sorted keys로 결정적 출력 보장

---

## Codegen Rules

### React/Next.js 15 Codegen

IR을 기반으로 안정적인 UI 코드 생성 규칙입니다. React/Next.js 15 (App Router + RSC) 기준으로 IR을 실제 코드로 변환합니다.

#### 1. Overview

##### GOAL
- IR을 기반으로 안정적인 UI 코드 생성
- React/Next.js 15 (App Router + RSC) 기준
- "디자인 시스템 없는 순수 Layout Tree"를 코드로 변환
- 가능한 한 deterministic 하게 출력
- 로직/상태/이벤트는 최소 수준으로만 개입

##### INPUT
- IRRoot

##### OUTPUT
- React Component Source Code (string)

#### 2. Output Structure

파일 구조는 다음 형태로 생성합니다:

```
/page.tsx
  - metadata (title, description)
  - default export function Page()
  - return(...) 내부에 layout tree 삽입

/style-tokens.ts
  - style.tokens flatten export

/components/index.ts
  - components registry export

/script-events.ts
  - event name string mapping export
```

#### 3. Metadata Codegen

##### UIH meta → Next.js metadata
```typescript
IRMeta {
  title: string
  description: string
}
```

##### OUTPUT
```typescript
export const metadata = {
  title: "<title>",
  description: "<description>",
};
```

##### RULES
- description 없으면 필드 제외
- theme는 metadata에 직접 쓰지 않음 (스타일토큰 용)

#### 4. Style Token Codegen

##### IRStyle { tokens }
```typescript
export const styleTokens = {
  "color.primary": "#0E5EF7",
  "radius.default": 8,
};
```

##### RULES
- 키는 string 리터럴 그대로
- numeric/string 그대로 출력
- sorted keys for deterministic output

#### 5. Component Registry Codegen

##### IRComponents.list → export list
```typescript
export const components = {
  Card,
  Button,
  Input,
};
```

##### RULES
- 자동 import 하지 않음 (상위 시스템이 resolve)
- keys는 PascalCase 유지
- duplicates 제거 후 정렬

#### 6. Layout Tree → JSX Codegen

##### IRLayoutTree → React element tree

##### 6.1 Component Node
```typescript
IRComponentNode {
  tag: "Div"
  attributes: { class: "p-4" }
  children: [...]
}
```

##### OUTPUT JSX
```jsx
<Div className="p-4">
  {children...}
</Div>
```

##### RULES
- attribute.key "class" → "className"
- attribute key는 그대로 lower-case 유지
- value는 string literal
- children length 0 이면 self-closing 금지 (always explicit block)
- tag name 그대로 JSX 컴포넌트로 사용

##### 6.2 Text Node
```typescript
IRTextNode { value: "Hello" }
```

##### OUTPUT
```jsx
{"Hello"}
```

##### RULES
- 텍스트는 JSX children 표현
- 특수문자는 자동 escape

#### 7. Script Event Codegen

##### IRScript.events → export mapping
```typescript
export const eventHandlers = {
  onClick: "submitForm",
  onLoad: "init",
};
```

##### RULES
- event 이름은 lower-case normalized
- 값은 string (함수명)
- 실제 JS 함수 body는 생성하지 않음
- 나중 시스템이 자동 wire-up 함

#### 8. Full Page Generation

최종 page.tsx는 다음 구조를 따릅니다:

```typescript
export const metadata = { ... };

import { components } from "./components";
import { styleTokens } from "./style-tokens";
import { eventHandlers } from "./script-events";

export default function Page() {
  return (
    <Div className="min-h-screen p-4">
      <P>{"Hello"}</P>
    </Div>
  );
}
```

##### RULES
- 최상위는 항상 `<Div>` 같은 Wrapper로 시작하지 않아도 됨
- layout.root가 배열이면 Fragment로 감싼다
- 코드 스타일은 2-space indent
- 세미콜론 붙이지 않음 (Prettier 옵션 따라감)

#### 9. Determinism Rules

1. 속성 순서는 key 알파벳순 정렬
2. children 순서는 DSL 입력 순서 그대로
3. components 목록은 알파벳순 정렬
4. styleTokens도 key 정렬
5. eventHandlers key 정렬
6. output JSX는 항상 multiline

#### 10. Full Example (DSL → IR → JSX)

##### DSL
```
layout {
  Div(class:"p-4") {
    "Hello"
  }
}
```

##### JSX OUT
```typescript
export default function Page() {
  return (
    <Div className="p-4">
      {"Hello"}
    </Div>
  );
}
```

#### 11. Notes for Engine Integrators

1. Codegen은 "순수 구조"만 책임진다
   - 상태(state), fetch, useEffect 등은 지원하지 않음
2. 이벤트 핸들러는 단순 라벨링 시스템
3. 스타일 토큰은 UI 프레임워크에서 직접 해석
4. React, Vue, Svelte 등 플랫폼별 코드젠 가능
   - 플랫폼별 레이어는 분리

#### Output Files 구조

```
Output Files
├── page.tsx
│   ├── metadata export
│   ├── imports (components, styleTokens, eventHandlers)
│   ├── Page() function
│   └── JSX return (layout tree)
├── style-tokens.ts
│   └── styleTokens export
├── components/index.ts
│   └── components export
└── script-events.ts
    └── eventHandlers export
```

#### Codegen Examples

##### 전체 페이지 코드 생성 예시
```typescript
// page.tsx
export const metadata = {
  title: "Dashboard",
  description: "Main dashboard page"
};

import { components } from "./components";
import { styleTokens } from "./style-tokens";
import { eventHandlers } from "./script-events";

export default function Page() {
  return (
    <Div className="min-h-screen flex flex-col">
      <Header className="p-4 bg-blue-600 text-white">
        <H1>
          {"Dashboard"}
        </H1>
      </Header>
      <Main className="flex-1 p-6">
        <Card className="bg-white shadow-lg rounded-lg p-6">
          <P>
            {"Welcome back!"}
          </P>
        </Card>
      </Main>
    </Div>
  );
}
```

##### 스타일 토큰 파일 예시
```typescript
// style-tokens.ts
export const styleTokens = {
  "color.primary": "#0E5EF7",
  "color.secondary": "#6B7280",
  "color.accent": "#F59E0B",
  "spacing.small": 8,
  "spacing.medium": 16,
  "spacing.large": 24,
  "border.radius": 6,
  "font.family": "Inter",
  "font.size.base": 16,
  "shadow.default": "0 1px 3px rgba(0,0,0,0.1)"
};
```

##### 컴포넌트 레지스트리 예시
```typescript
// components/index.ts
export const components = {
  Button,
  Card,
  Input,
  Modal,
  Sidebar
};
```

##### 이벤트 핸들러 파일 예시
```typescript
// script-events.ts
export const eventHandlers = {
  onclick: "handleClick",
  onload: "initDashboard",
  onsubmit: "processForm"
};
```

#### Edge Cases

- layout.root가 빈 배열일 경우 빈 Fragment 생성
- 컴포넌트 이름이 JavaScript 예약어와 충돌 시 escaping 필요
- 텍스트에 JSX 특수문자 포함 시 자동 escape
- 중첩 깊이가 깊을 경우 코드 포맷팅 유지
- import 경로 resolve 실패 시 상위 시스템에서 처리
- styleTokens에 특수문자 키 포함 시 유효한 JS 객체 키로 변환

---

### Vue & Svelte Codegen

React Codegen과 동일한 IR 기반으로 Vue와 Svelte 코드를 생성하는 규칙입니다. 플랫폼별 렌더링 규칙만 다르게 적용합니다.

## SECTION A — Vue Codegen (SFC 기준)

### GOAL
- IR → .vue 파일 형태로 변환
- `<template>` + `<script setup>` + `<style>` 구조 유지
- 모든 로직은 배제하고 구조만 생성

### OUTPUT FILE STRUCTURE
```
MyPage.vue
```

### 1. Top-Level Structure
```vue
<template>
  <!-- layout tree -->
</template>

<script setup>
import components...

const events = {...}
const styleTokens = {...}
</script>

<style scoped>
/* optional if needed */
</style>
```

### 2. Layout Tree → Vue Template 규칙

#### IRComponentNode(tag:"Div", attributes, children)
```vue
<Div class="p-4">
  <!-- children -->
</Div>
```

#### RULES
- `className` → `class`
- attribute values: string only
- children: 그대로 template로 변환
- Fragment는 `<template>` 안에서 그냥 siblings로 출력

#### IRTextNode
```
"Hello" → Hello (그대로 text node)
```

### 3. Event Mapping
```javascript
eventHandlers {
  onClick: "submitForm"
}
```

#### Vue OUTPUT
```vue
@click="submitForm"
```

#### RULES
- `onClick` → `@click`
- `onChange` → `@change`
- `onInput` → `@input`
- `onLoad` → `@load`
- value는 함수 이름 string
- 함수 구현은 생성하지 않음

### 4. Component Registry (imports)
```javascript
import Card from "@/components/Card.vue"
import Button from "@/components/Button.vue"
```

### 5. Determinism Rules
- 속성(sorted)
- imports(sorted)
- children 순서 그대로
- no semicolons
- template 들여쓰기 2 spaces

## SECTION B — Svelte Codegen (.svelte)

### GOAL
- Svelte 컴포넌트 파일 하나로 완성
- `<script>` + markup 구조

### OUTPUT STRUCTURE
```
MyPage.svelte
```

### 1. File Layout
```svelte
<script>
  import components...
  export let events = {...}
  export let styleTokens = {...}
</script>

<!-- layout markup -->
<Div class="p-4">
  Hello
</Div>

<style>
/* optional */
</style>
```

### 2. Layout Tree → Svelte Markup

#### IRComponentNode(tag, attributes, children)
```svelte
<Div class="p-4">
  {#if ... ?} (없음)
  {children}
</Div>
```

#### RULES
- 클래스는 `class`
- 속성 문자열만
- Self-closing 금지
- children 재귀적 삽입

#### IRTextNode
```
"Hello" → Hello
```

### 3. Event Mapping
```javascript
IRScript:
onClick → function name
```

#### Svelte OUTPUT
```svelte
on:click={submitForm}
```

#### Mapping
```
onClick   → on:click
onChange  → on:change
onInput   → on:input
onLoad    → on:load
```

### 4. Components Import
```javascript
import Card from "./Card.svelte";
import Button from "./Button.svelte";
```

### 5. Determinism Rules (필수)

1. import 순서는 알파벳 정렬
2. attributes sorted
3. event names lower-case
4. children 순서 보존
5. markup 들여쓰기 2 spaces

## SECTION C — Cross-Platform Notes

1. React / Vue / Svelte 모두 IR만 참조
2. layout tree는 그대로 세 렌더러에서 재활용
3. event handler는 단순 label → framework alias로 변환
4. styleTokens는 컴파일러 외부 시스템이 처리
5. components는 registry 기반으로 import만 생성

## SECTION D — Example Conversion (Same IR → Vue/Svelte)

### IR
```
Div(class:"p-4") { "Hello" }
```

### Vue Template
```vue
<Div class="p-4">Hello</Div>
```

### Svelte Markup
```svelte
<Div class="p-4">Hello</Div>
```

### Vue & Svelte 구조

```
Vue Output (.vue)
├── <template>
│   └── layout tree (Vue template syntax)
├── <script setup>
│   ├── component imports
│   ├── events object
│   └── styleTokens object
└── <style scoped>
    └── optional styles

Svelte Output (.svelte)
├── <script>
│   ├── component imports
│   ├── export let events = {...}
│   └── export let styleTokens = {...}
├── layout markup (Svelte syntax)
└── <style>
    └── optional styles
```

### Vue & Svelte Examples

#### Vue SFC 전체 예시
```vue
<template>
  <Div class="min-h-screen flex flex-col">
    <Header class="p-4 bg-blue-600 text-white">
      <H1>
        Dashboard
      </H1>
    </Header>
    <Main class="flex-1 p-6">
      <Card class="bg-white shadow-lg rounded-lg p-6" @click="handleCardClick">
        <P>
          Welcome back!
        </P>
      </Card>
    </Main>
  </Div>
</template>

<script setup>
import Card from "@/components/Card.vue"
import Button from "@/components/Button.vue"

const events = {
  handleCardClick: "handleCardClick"
}

const styleTokens = {
  "color.primary": "#0E5EF7",
  "spacing.medium": 16
}
</script>

<style scoped>
/* Optional custom styles */
</style>
```

#### Svelte 컴포넌트 전체 예시
```svelte
<script>
  import Card from "./Card.svelte";
  import Button from "./Button.svelte";

  export let events = {
    handleCardClick: "handleCardClick"
  };

  export let styleTokens = {
    "color.primary": "#0E5EF7",
    "spacing.medium": 16
  };
</script>

<Div class="min-h-screen flex flex-col">
  <Header class="p-4 bg-blue-600 text-white">
    <H1>
      Dashboard
    </H1>
  </Header>
  <Main class="flex-1 p-6">
    <Card class="bg-white shadow-lg rounded-lg p-6" on:click={handleCardClick}>
      <P>
        Welcome back!
      </P>
    </Card>
  </Main>
</Div>

<style>
/* Optional custom styles */
</style>
```

#### 이벤트 매핑 비교
```javascript
// 동일한 IR 이벤트
{
  onClick: "handleClick",
  onChange: "handleChange",
  onLoad: "init"
}
```

```vue
<!-- Vue -->
<Button @click="handleClick" @change="handleChange" @load="init">
```

```svelte
<!-- Svelte -->
<Button on:click={handleClick} on:change={handleChange} on:load={init}>
```

```jsx
<!-- React -->
<Button onClick={handleClick} onChange={handleChange} onLoad={init}>
```

### Edge Cases

- Vue에서 컴포넌트 이름이 kebab-case로 변환 필요 시 자동 처리
- Svelte에서 export let 구문이 예약어와 충돌 시 renaming
- 이벤트 핸들러가 정의되지 않은 경우 플랫폼별 기본 동작
- 스타일 토큰에 CSS 변수나 함수 포함 시 escaping
- 중첩 컴포넌트 깊이가 깊을 경우 플랫폼별 최적화 적용
- 텍스트 콘텐츠에 플랫폼별 특수문자 포함 시 자동 escape

---

## Examples

### 완전한 UIH DSL 예시

```
meta {
  title: "User Dashboard"
  route: "/dashboard"
  theme: "dark"
  description: "Main user dashboard with analytics"
}

style {
  color.primary: "#0E5EF7"
  color.secondary: "#6B7280"
  color.accent: "#F59E0B"
  font.family: "Inter"
  font.size.base: 16
  font.size.h1: 32
  spacing.small: 8
  spacing.medium: 16
  spacing.large: 24
  border.radius: 6
  shadow.default: "0 1px 3px rgba(0,0,0,0.1)"
}

components {
  Card
  Button
  Input
  Modal
  Sidebar
  Chart
}

layout {
  Container(class:"max-w-7xl mx-auto p-6") {
    Header(class:"mb-8") {
      Div(class:"flex justify-between items-center") {
        H1(class:"text-3xl font-bold") {
          "Dashboard"
        }
        Button(class:"px-4 py-2 bg-blue-600 text-white rounded") {
          "New Report"
        }
      }
    }

    Div(class:"grid grid-cols-3 gap-6") {
      Card(class:"col-span-2") {
        H2(class:"text-xl mb-4") {
          "Analytics Overview"
        }
        Chart(class:"w-full h-64")
      }

      Card(class:"col-span-1") {
        H2(class:"text-xl mb-4") {
          "Quick Stats"
        }
        Div(class:"space-y-4") {
          Div(class:"p-4 bg-gray-50 rounded") {
            P(class:"text-sm text-gray-600") {
              "Total Users"
            }
            P(class:"text-2xl font-bold") {
              "1,234"
            }
          }
          Div(class:"p-4 bg-gray-50 rounded") {
            P(class:"text-sm text-gray-600") {
              "Active Sessions"
            }
            P(class:"text-2xl font-bold") {
              "89"
            }
          }
        }
      }
    }

    Sidebar(class:"mt-8") {
      H3(class:"text-lg mb-4") {
        "Recent Activity"
      }
      Div(class:"space-y-2") {
        P(class:"text-sm") {
          "User john@example.com logged in"
        }
        P(class:"text-sm") {
          "New report generated"
        }
        P(class:"text-sm") {
          "System backup completed"
        }
      }
    }
  }
}

script {
  onLoad: "initDashboard"
  onClick: "handleButtonClick"
  onRefresh: "refreshData"
}
```

---

## Version

- **Version**: 1.0.0
- **Last Update**: 2025-11-18
- **Change Summary**: Complete guide consolidating all UIH DSL specifications

---

## 문서 끝

이 문서는 UIH DSL의 모든 스펙을 "생략 없이" 하나의 파일로 통합한 완전판입니다. Foundation Layer부터 Codegen까지 전 과정을 포함하며, LLM이 UI를 정확하게 선언할 수 있도록 설계된 모든 규칙이 담겨 있습니다.
