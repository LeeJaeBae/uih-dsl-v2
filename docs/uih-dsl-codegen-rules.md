# UIH DSL — Codegen Rules (React/Next.js 15 기준)

## Overview

IR을 기반으로 안정적인 UI 코드 생성 규칙입니다. React/Next.js 15 (App Router + RSC) 기준으로 IR을 실제 코드로 변환합니다.

## Rules

### 1. Overview

#### GOAL
- IR을 기반으로 안정적인 UI 코드 생성
- React/Next.js 15 (App Router + RSC) 기준
- "디자인 시스템 없는 순수 Layout Tree"를 코드로 변환
- 가능한 한 deterministic 하게 출력
- 로직/상태/이벤트는 최소 수준으로만 개입

#### INPUT
- IRRoot

#### OUTPUT
- React Component Source Code (string)

### 2. Output Structure

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

### 3. Metadata Codegen

#### UIH meta → Next.js metadata
```typescript
IRMeta {
  title: string
  description: string
}
```

#### OUTPUT
```typescript
export const metadata = {
  title: "<title>",
  description: "<description>",
};
```

#### RULES
- description 없으면 필드 제외
- theme는 metadata에 직접 쓰지 않음 (스타일토큰 용)

### 4. Style Token Codegen

#### IRStyle { tokens }
```typescript
export const styleTokens = {
  "color.primary": "#0E5EF7",
  "radius.default": 8,
};
```

#### RULES
- 키는 string 리터럴 그대로
- numeric/string 그대로 출력
- sorted keys for deterministic output

### 5. Component Registry Codegen

#### IRComponents.list → export list
```typescript
export const components = {
  Card,
  Button,
  Input,
};
```

#### RULES
- 자동 import 하지 않음 (상위 시스템이 resolve)
- keys는 PascalCase 유지
- duplicates 제거 후 정렬

### 6. Layout Tree → JSX Codegen

#### IRLayoutTree → React element tree

#### 6.1 Component Node
```typescript
IRComponentNode {
  tag: "Div"
  attributes: { class: "p-4" }
  children: [...]
}
```

#### OUTPUT JSX
```jsx
<Div className="p-4">
  {children...}
</Div>
```

#### RULES
- attribute.key "class" → "className"
- attribute key는 그대로 lower-case 유지
- value는 string literal
- children length 0 이면 self-closing 금지 (always explicit block)
- tag name 그대로 JSX 컴포넌트로 사용

#### 6.2 Text Node
```typescript
IRTextNode { value: "Hello" }
```

#### OUTPUT
```jsx
{"Hello"}
```

#### RULES
- 텍스트는 JSX children 표현
- 특수문자는 자동 escape

### 7. Script Event Codegen

#### IRScript.events → export mapping
```typescript
export const eventHandlers = {
  onClick: "submitForm",
  onLoad: "init",
};
```

#### RULES
- event 이름은 lower-case normalized
- 값은 string (함수명)
- 실제 JS 함수 body는 생성하지 않음
- 나중 시스템이 자동 wire-up 함

### 8. Full Page Generation

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

#### RULES
- 최상위는 항상 `<Div>` 같은 Wrapper로 시작하지 않아도 됨
- layout.root가 배열이면 Fragment로 감싼다
- 코드 스타일은 2-space indent
- 세미콜론 붙이지 않음 (Prettier 옵션 따라감)

### 9. Determinism Rules

1. 속성 순서는 key 알파벳순 정렬
2. children 순서는 DSL 입력 순서 그대로
3. components 목록은 알파벳순 정렬
4. styleTokens도 key 정렬
5. eventHandlers key 정렬
6. output JSX는 항상 multiline

### 10. Full Example (DSL → IR → JSX)

#### DSL
```
layout {
  Div(class:"p-4") {
    "Hello"
  }
}
```

#### JSX OUT
```typescript
export default function Page() {
  return (
    <Div className="p-4">
      {"Hello"}
    </Div>
  );
}
```

### 11. Notes for Engine Integrators

1. Codegen은 "순수 구조"만 책임진다
   - 상태(state), fetch, useEffect 등은 지원하지 않음
2. 이벤트 핸들러는 단순 라벨링 시스템
3. 스타일 토큰은 UI 프레임워크에서 직접 해석
4. React, Vue, Svelte 등 플랫폼별 코드젠 가능
   - 플랫폼별 레이어는 분리

## Structure

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

## Examples

### 전체 페이지 코드 생성 예시
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

### 스타일 토큰 파일 예시
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

### 컴포넌트 레지스트리 예시
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

### 이벤트 핸들러 파일 예시
```typescript
// script-events.ts
export const eventHandlers = {
  onclick: "handleClick",
  onload: "initDashboard",
  onsubmit: "processForm"
};
```

## Edge Cases

- layout.root가 빈 배열일 경우 빈 Fragment 생성
- 컴포넌트 이름이 JavaScript 예약어와 충돌 시 escaping 필요
- 텍스트에 JSX 특수문자 포함 시 자동 escape
- 중첩 깊이가 깊을 경우 코드 포맷팅 유지
- import 경로 resolve 실패 시 상위 시스템에서 처리
- styleTokens에 특수문자 키 포함 시 유효한 JS 객체 키로 변환

## Version

- Version: 1.0.0
- Last Update: 2025-11-18
- Change Summary: Initial creation of UIH DSL Codegen Rules for React/Next.js 15.
