# UIH DSL — Block Grammar Layer

## Overview

UIH DSL의 최상위 구조를 정의하는 Block Grammar Layer입니다. Foundation Layer 바로 위에 위치하며, 5개 블록의 선언, 순서, 내용 규칙을 명시합니다.

## Rules

### 1. Block Definitions (5개 블록)

#### BLOCKS
- meta
- style
- components (optional)
- layout
- script (optional)

#### RULES
- 블록은 반드시 이 순서를 따라야 함: meta → style → components → layout → script
- meta, style, layout은 필수
- components, script는 선택
- 각 블록은 정확히 한 번만 등장
- 중복 블록 금지

### 2. Block Syntax (기본 문법)

#### BLOCK_SYNTAX
```
<blockName> {
  <property>: <value>
  <property>: <value>
}
```

#### EXAMPLES
```
meta {
  title: "Home"
  route: "/"
}
```

#### SYNTAX_COMPONENTS
- 블록 시작: IDENTIFIER + ` {`
- 블록 끝: `}` 단독 줄

### 3. Block Content Rules

#### 공통 규칙
- 블록 내부에는 property statements만 존재
- block 내부에 block 중첩 금지
- 단, layout 블록만 예외적으로 UI tree 구조 허용

#### PROPERTY_RULE
```
<identifier>: <value>
```

#### VALUE_TYPES
- string
- number
- boolean
- enum-like literals (string 값)
- list (향후 정의)

### 4. Block-Specific Rules

#### (1) META BLOCK
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

#### (2) STYLE BLOCK
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

#### (3) COMPONENTS BLOCK (optional)
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

#### (4) LAYOUT BLOCK
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

#### (5) SCRIPT BLOCK (optional)
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

## Structure

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

## Examples

### 필수 블록만 있는 경우
```dsl
meta {
  title: "Simple Page"
}

style {
  color.primary: "#000"
}

layout {
  Div {
    "Content"
  }
}
```

### 모든 블록이 있는 경우
```dsl
meta {
  title: "Full Example"
  theme: "light"
}

style {
  color.primary: "#0E5EF7"
}

components {
  CustomButton
}

layout {
  CustomButton {
    "Click me"
  }
}

script {
  onClick: "handleClick"
}
```

## Edge Cases

- 블록 순서 위반 시 파싱 실패
- 필수 블록(meta/style/layout) 누락 시 오류
- 중복 블록 선언 시 마지막 것만 유효 (경고)
- components/script 외 블록에서 중첩 시도 시 오류
- layout 외 블록에서 attribute 사용 시 오류

## Version

- Version: 1.0.0
- Last Update: 2025-11-18
- Change Summary: Initial creation of UIH DSL Block Grammar Layer specification.
