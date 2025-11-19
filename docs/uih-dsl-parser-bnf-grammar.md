# UIH DSL — Parser BNF Grammar

## Overview

Tokenizer 위에서 동작하는 공식 문법 엔진 정의입니다. Token Stream을 Abstract Syntax Tree(AST)로 변환합니다.

## Rules

### 1. Overview

#### GOAL
- Token Stream → Abstract Syntax Tree(AST)

#### PARSER_MODE
- strict non-ambiguous grammar
- no recovery parsing (에러는 즉시 throw)
- deterministic (LLM-friendly)
- recursive descent parser 기반 구조

### 2. Entry Point

#### Program
```
Program ::= MetaBlock StyleBlock ComponentsBlock? LayoutBlock ScriptBlock? EOF
```

### 3. Blocks

#### Block_Definitions
```
MetaBlock       ::= "meta" BlockBody(MetaProperty)
StyleBlock      ::= "style" BlockBody(StyleProperty)
ComponentsBlock ::= "components" BlockBody(ComponentEntry)
LayoutBlock     ::= "layout" LayoutBody
ScriptBlock     ::= "script" BlockBody(ScriptProperty)
```

### 4. Generic Block Body

#### BlockBody
```
BlockBody(<T>) ::= LBRACE NEWLINE (Indent <T> NEWLINE)* RBRACE
Indent         ::= WHITESPACE WHITESPACE    # 2 spaces only
```

### 5. META Block Grammar

#### MetaProperty
```
MetaProperty ::= Identifier ":" MetaValue
MetaValue    ::= STRING | NUMBER | BOOLEAN | EnumString
```

#### Allowed_Meta_Keys
- title, route, theme, description

### 6. STYLE Block Grammar

#### StyleProperty
```
StyleProperty ::= StyleKey ":" StyleValue
StyleKey      ::= Identifier ( "." Identifier )*
StyleValue    ::= STRING | NUMBER | EnumString
```

#### Notes
- no nested blocks
- no boolean
- layout-like attributes 금지

### 7. COMPONENTS Block Grammar

#### ComponentEntry
```
ComponentEntry ::= ComponentName
ComponentName  ::= TAGNAME | IDENTIFIER
```

#### NOTES
- but no quotes, no values, one per line

#### Examples
```
Card
Button
Input
```

### 8. LAYOUT Block Grammar (Core)

#### LayoutBody
```
LayoutBody     ::= LBRACE NEWLINE Indent LayoutNodeList RBRACE
LayoutNodeList ::= (LayoutNode NEWLINE)*
LayoutNode     ::= Tag (Attributes)? (ChildrenBlock)?
Tag            ::= TAGNAME | IDENTIFIER
```

### 9. Attributes Grammar

#### Attributes
```
Attributes    ::= LPAREN AttributeList RPAREN
AttributeList ::= Attribute (COMMA Attribute)*
Attribute     ::= Identifier ":" STRING
```

### 10. Children Block Grammar

#### ChildrenBlock
```
ChildrenBlock ::= LBRACE NEWLINE Indent ChildrenList RBRACE
ChildrenList  ::= (Child NEWLINE)*
Child         ::= LayoutNode | TEXT_STRING
```

### 11. SCRIPT Block Grammar

#### ScriptProperty
```
ScriptProperty ::= Identifier ":" STRING
```

#### Allowed_Script_Keys
- onClick, onLoad, onSubmit, onMount, onChange

### 12. Value Grammars

#### Value_Types
```
STRING     ::= "\"" <chars> "\""
NUMBER     ::= digits ( "." digits )?
BOOLEAN    ::= "true" | "false"
EnumString ::= STRING   # validated in semantic phase
```

### 13. Identifier Grammars

#### Identifiers
```
Identifier ::= [a-z][a-z0-9.]*
TagName    ::= [A-Z][a-zA-Z0-9]*
```

### 14. Syntax Constraints (Formal)

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

### 15. Complete Example (BNF-valid)

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

## Structure

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

## Examples

### 최소 BNF 유효 DSL
```dsl
meta {
  title: "Minimal"
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

### 모든 블록 포함 DSL
```dsl
meta {
  title: "Full"
  theme: "dark"
}

style {
  color.primary: "#0E5EF7"
  font.family: "Inter"
}

components {
  Card
  Button
}

layout {
  Container(class:"flex") {
    Card(class:"shadow") {
      Button(onClick:"action") {
        "Click me"
      }
    }
  }
}

script {
  onLoad: "init"
  onClick: "handleClick"
}
```

### 중첩 레이아웃 DSL
```dsl
layout {
  Div(class:"container") {
    Header(class:"header") {
      H1 {
        "Title"
      }
    }

    Main(class:"main") {
      Section(class:"section") {
        Article {
          H2 {
            "Article Title"
          }
          P {
            "Article content here."
          }
        }
      }
    }

    Footer(class:"footer") {
      "© 2025 Company"
    }
  }
}
```

## Edge Cases

- 블록 순서 위반 시 즉시 파싱 중단
- 필수 블록(meta/style/layout) 누락 시 오류
- 중복 블록 선언 시 마지막 것만 유지 (경고)
- 들여쓰기 2 space 위반 시 구문 오류
- layout 외 블록에서 중첩 시도 시 파싱 실패
- 허용되지 않은 키 사용 시 semantic 오류 (parser 단계에서는 허용)
- TEXT_STRING이 layout 외 컨텍스트에서 등장 시 오류

## Version

- Version: 1.0.0
- Last Update: 2025-11-18
- Change Summary: Initial creation of UIH DSL Parser BNF Grammar specification.
