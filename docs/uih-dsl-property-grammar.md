# UIH DSL — Property Grammar Layer

## Overview

UIH DSL 안정성의 핵심인 Property Grammar Layer입니다. Block Grammar 위에 쌓이며, 속성 선언, 값 타입, 범위 규칙을 정의합니다.

## Rules

### 1. Property Declaration Syntax

#### PROPERTY_SYNTAX
```
<identifier>: <value>
```

#### EXAMPLES
```
title: "Home"
radius.default: 8
enabled: true
```

#### RULES
- identifier는 반드시 lowercase
- dot notation 허용 (`color.primary` 등)
- colon(:) 뒤에는 반드시 space 1개
- value는 줄 끝까지

### 2. Identifier Rules

#### IDENTIFIER
- 패턴: `[a-z][a-z0-9.]*`
- 소문자만 허용
- 숫자는 뒤쪽에만 허용
- dot(.)은 중첩 속성 의미로만 사용
- hyphen 금지 (LLM 오류 방지)
- underscore 금지

#### VALID
```
color.primary
font.size
border.width
```

#### INVALID
```
Color.Primary    // 대문자
font-size        // hyphen
font_size        // underscore
primary2.color   // 숫자 앞쪽
```

### 3. Value Types (5가지)

#### VALUE_TYPES
1. STRING
2. NUMBER
3. BOOLEAN
4. ENUM-LIKE (string 기반)
5. LIST (여러 값 나열, 줄 단위)

### 4. String Value Rules

#### STRING
- 무조건 double-quote 사용
- 내부에 `"` 포함 시 `\"`로 escape
- single-quote 절대 금지

#### VALID
```
title: "Home"
description: "He said \"ok\""
```

#### INVALID
```
title: 'Home'      // single-quote
name: "Home"       // curly quotes
```

### 5. Number Value Rules

#### NUMBER
- 정수 또는 소숫점 가능
- 음수는 허용하지 않음
- 단위(px 등) 금지 → unitless 구조

#### VALID
```
radius: 12
opacity: 0.85
```

#### INVALID
```
radius: -4     // 음수
width: 10px    // 단위 포함
```

### 6. Boolean Value Rules

#### BOOLEAN
- `true` or `false`

#### EXAMPLES
```
enabled: true
visible: false
```

### 7. Enum-like String Rules

#### ENUM_STRING
- 문자열이지만 값이 고정된 타입처럼 쓰는 케이스
- allowed values는 별도 block schema마다 정의

#### EXAMPLES
```
theme: "light" | "dark"
size: "sm" | "md" | "lg"
```

### 8. List Value (Block-like list)

#### LIST
- 각 항목은 줄 단위로 입력
- 대괄호 `[]` 문법 없음 (LLM 오류 방지)
- 문자열/식별자 혼용 가능

#### SYNTAX
```
items {
  "one"
  "two"
  "three"
}
```

#### NOTES
- list block 내부에는 property 없음
- indent 2 spaces 유지

#### EXAMPLE
```
tags {
  "news"
  "feature"
  "announcement"
}
```

### 9. Property Scope Rules (Block별 허용 속성 경계)

#### META_SCOPE
- meta는 UI metadata만 포함
- route, title, theme, description 등

#### STYLE_SCOPE
- 색상, 폰트, radius 등 UI 스타일만
- layout 속성 금지 (width, height 등은 layout block에서만)

#### COMPONENTS_SCOPE
- property 없음 (등록만)

#### LAYOUT_SCOPE
- inline attribute만 (class, id, ref 등)
- 값은 무조건 string
- boolean/number 사용 금지

#### SCRIPT_SCOPE
- event mapping 전용
- 값은 무조건 string

### 10. Final Validation Rules

1. 모든 property는 블록 내부에서만 존재
2. 같은 identifier 중복 선언 금지
3. meta/style/script는 property-only 구조
4. components는 선언만 (property 없음)
5. layout만 child nodes 보유 가능
6. value의 타입은 block-specific rule을 반드시 준수

## Structure

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

## Examples

### 다양한 값 타입 사용
```dsl
style {
  color.primary: "#0E5EF7"      // string
  border.radius: 8             // number
  enabled: true                // boolean
  theme: "dark"                // enum-like
}

tags {                         // list
  "frontend"
  "ui"
  "dsl"
}
```

### 블록별 스코프 준수
```dsl
meta {
  title: "Home"        // ✅ metadata only
  route: "/"          // ✅ metadata only
  // width: 100       // ❌ layout 속성 금지
}

layout {
  class: "p-4"        // ✅ string only
  // width: 100       // ❌ number 금지
}
```

## Edge Cases

- 대문자 identifier 사용 시 토큰화 실패
- hyphen/underscore 사용 시 구문 오류
- single-quote나 curly quotes 사용 시 파싱 실패
- 음수나 단위 포함 숫자 시 값 오류
- 블록별 스코프 위반 시 validation 실패
- 중복 property 선언 시 마지막 값만 유효 (경고)

## Version

- Version: 1.0.0
- Last Update: 2025-11-18
- Change Summary: Initial creation of UIH DSL Property Grammar Layer specification.
