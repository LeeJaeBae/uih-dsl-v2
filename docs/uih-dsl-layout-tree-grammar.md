# UIH DSL — Layout Tree Grammar Layer

## Overview

UIH DSL의 핵심 구조인 Layout Tree Grammar Layer입니다. Block Grammar와 Property Grammar 위에서 동작하며, UI 구성 요소의 트리 구조를 정의합니다.

## Rules

### 1. Layout Block Overview

#### LAYOUT_BLOCK
```
layout {
  <layout-node>
}
```

#### NOTES
- DSL에서 유일하게 중첩 구조를 가질 수 있는 블록
- 모든 UI 구성 요소는 layout node로 표현
- 노드는 "구조"만 표현, 스타일/로직은 표현하지 않음

### 2. Layout Node Syntax

#### NODE_SYNTAX
```
<TagName>(<attributes>) {
  <children>
}
```

#### OR (children 없는 경우)
```
<TagName>(<attributes>)
```

#### NOTES
- TagName은 PascalCase 컴포넌트 또는 HTML-like 사용 가능
- attributes는 inline 형태 only
- attributes는 옵션, 없어도 됨
- children 블록은 중첩 가능

#### VALID
```
Div(class:"p-4") {
  "Hello"
}
```

#### INVALID
```
Div {
  class: "p-4"    // 속성은 block 기반이 아니라 inline only
}
```

### 3. TagName Rules

#### TAGNAME
- 반드시 알파벳으로 시작
- PascalCase 또는 UpperCamelCase 권장
- HTML-like 소문자 태그는 사용 가능 (`div`, `span`) 단 내부적으로는 UpperCase 변환됨

#### VALID
```
Div
Section
Image
header   // 허용하지만 변환 시 Header로 취급
```

#### INVALID
```
3Div     // 숫자 시작
_Box     // underscore 시작
-Node    // hyphen 시작
```

### 4. Attribute Syntax

#### ATTRIBUTES
```
<identifier>:"<string>"
```

#### RULES
- value는 무조건 string only
- boolean/number 금지
- `class:"p-4"` 형태처럼 inline만 허용
- 각 attribute는 콤마(`,`)로 구분

#### EXAMPLE
```
Div(class:"p-4", id:"main", ref:"root")
```

#### STRICT_RULES
- 속성 순서는 의미 없음 (LLM 실수 방지로 자유 순서)
- attribute key는 lower-case only
- 속성 개수 0~5 정도 권장

### 5. Children Rules

#### CHILD_TYPES
- string literal
- another layout node
- list of siblings (node 여러 개 배치)

#### STRING_CHILD
```
"Hello world"
```

#### NESTED_NODE
```
Div(class:"mt-4") {
  "content"
}
```

#### SIBLINGS
```
Div(...) { ... }
P(...) { ... }
Image(...)
```

### 6. Text Node Rules

#### TEXT_NODE
- 무조건 double-quote string
- 줄바꿈 포함 금지
- 텍스트 덩어리는 여러 줄로 쪼개면 안 됨

#### VALID
```
"Sign in to continue"
```

#### INVALID
```
"Hello
 World"    // 줄바꿈 포함
```

### 7. Node Termination Rules

#### CLOSING_RULES
- 블록 노드는 반드시 `}` 단독 줄로 닫는다
- inline-only 노드는 종료 블록 없음

#### EXAMPLE
```
Div(class:"px-4") {
  P {
    "Hello"
  }
  Image(src:"/logo.png")
}
```

### 8. Layout Grammar Formal Pattern

#### LAYOUT_NODE_GRAMMAR
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

### 9. Validation Rules

1. layout은 트리 구조만 표현한다
2. inline attributes만 허용
3. 속성은 string-only
4. children은 반드시 정해진 중첩 규칙을 따른다
5. Node 이름은 PascalCase가 기본
6. 문자열 children 외에는 모든 children은 Node여야 한다
7. siblings 허용, 순서 보존

### 10. Example (Valid Layout Tree)

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

## Structure

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

## Examples

### 간단한 레이아웃
```dsl
layout {
  Div(class:"container") {
    H1 {
      "Hello World"
    }
    P {
      "This is a simple layout."
    }
  }
}
```

### 속성 없는 노드
```dsl
layout {
  Div {
    Header {
      "Title"
    }
    Footer {
      "Copyright"
    }
  }
}
```

### 형제 노드들
```dsl
layout {
  Section {
    Article {
      "Content 1"
    }
    Article {
      "Content 2"
    }
    Article {
      "Content 3"
    }
  }
}
```

## Edge Cases

- TagName에 숫자/특수문자 시작 시 토큰화 실패
- 속성에 boolean/number 값 사용 시 파싱 오류
- 텍스트 노드에 줄바꿈 포함 시 validation 실패
- 노드 종료 `}` 누락 시 구문 오류
- 중첩 깊이가 너무 깊을 경우 (권장 5레벨 초과) 경고
- siblings 간 순서가 UI 의미에 영향 줄 경우 재검토

## Version

- Version: 1.0.0
- Last Update: 2025-11-18
- Change Summary: Initial creation of UIH DSL Layout Tree Grammar Layer specification.
