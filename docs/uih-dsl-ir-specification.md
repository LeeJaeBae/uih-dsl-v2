# UIH DSL — IR (Intermediate Representation) Specification

## Overview

AST → IR 변환 규칙을 정의합니다. Codegen 단계 직전의 "정규화된 구조"로, 플랫폼불문의 공통 인터페이스를 제공합니다.

## Rules

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

## Structure

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

## Examples

### 간단한 IR 변환
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

### 복잡한 중첩 레이아웃 IR
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

### 스타일 토큰 변환 예시
```json
{
  "style": {
    "tokens": {
      "color.primary": "#0E5EF7",
      "color.secondary": "#6B7280",
      "color.accent": "#F59E0B",
      "spacing.small": 8,
      "spacing.medium": 16,
      "spacing.large": 24,
      "border.radius": 6,
      "font.family": "Inter",
      "font.size.base": 16,
      "font.size.h1": 32,
      "shadow.default": "0 1px 3px rgba(0,0,0,0.1)"
    }
  }
}
```

## Edge Cases

- AST에 location 정보 누락 시 IR 변환 실패
- route가 "/"로 시작하지 않을 경우 변환 시 강제 추가
- 중복 컴포넌트 등록 시 알파벳 순 정렬로 중복 제거
- 빈 children 배열을 null로 잘못 설정 시 []로 강제 변환
- 텍스트 노드에 줄바꿈 포함 시 변환 중 제거 또는 오류
- 이벤트 키 대소문자 혼재 시 소문자로 통일
- 스타일 토큰 키 순서가 다를 경우 sorted keys로 결정적 출력 보장

## Version

- Version: 1.0.0
- Last Update: 2025-11-18
- Change Summary: Initial creation of UIH DSL IR Specification.
