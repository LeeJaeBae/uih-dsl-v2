# UIH DSL — Tokenizer Specification

## Overview

Foundation Layer + Grammar Layers 기반의 공식 토큰화 규칙입니다. DSL 문자열을 균일한 Token 리스트로 변환하며, 모든 파싱의 기반이 됩니다.

## Rules

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

## Structure

```
meta {
  title: "Dashboard"
  route: "/dashboard"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Container(class:"flex flex-col min-h-screen") {
    Header(class:"p-4 bg-blue-600 text-white") {
      H1 {
        "Dashboard"
      }
    }

    Main(class:"flex-1 p-6") {
      Card(class:"bg-white shadow-lg rounded-lg p-6") {
        P {
          "Welcome to your dashboard"
        }
      }
    }
  }
}
```

## Examples

### 기본 블록 토큰화
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

### 스타일 블록 토큰화
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

### 레이아웃 블록 토큰화 (context switching)
```dsl
layout {
  Div(class:"p-4") {
    "Hello"
  }
}
```

**Tokens:**
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

## Edge Cases

- 허용되지 않은 문자 발견 시 토큰화 중단 및 오류 반환
- CRLF 줄바꿈 발견 시 LF로 변환 또는 오류
- 탭 문자 발견 시 공백 변환 또는 오류
- STRING에서 미닫힘 따옴표 시 오류
- NUMBER에 음수나 단위 포함 시 오류
- layout 외 컨텍스트에서 TEXT_STRING 시도 시 오류
- TAGNAME 규칙 위반 (소문자 시작) 시 IDENTIFIER로 처리

## Version

- Version: 1.0.0
- Last Update: 2025-11-18
- Change Summary: Initial creation of UIH DSL Tokenizer Specification.
