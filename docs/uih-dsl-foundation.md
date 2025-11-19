# UIH DSL — Foundation Layer (Lowest Level Specification)

## Overview

UIH DSL의 가장 낮은 레벨 사양입니다. Character부터 Ordering까지의 기본 규칙을 정의하며, LLM이 실수할 수 없는 엄격한 문법을 제공합니다.

## Rules

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

## Structure

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

## Examples

### Character Layer
```dsl
meta {
  title: "Hello World"  // ✅ 허용 문자만 사용
  count: 123           // ✅ 숫자 허용
}
```

### Indentation Layer
```dsl
meta {           // ❌ 탭 사용 금지
  title: "Home"  // ✅ 정확히 2 space
}
```

### Token Layer
```dsl
meta {
  color.primary: "#fff"    // ✅ dot notation 허용
  label: "Click \"here\""  // ✅ escape 허용
  width: 100.5            // ✅ 소수 허용
}
```

## Edge Cases

- 허용되지 않은 문자 발견 시 토큰화 중단
- 잘못된 들여쓰기 발견 시 구문 오류
- 코멘트 시도 시 즉시 무효 처리
- 블록 순서 위반 시 파싱 실패
- layout 외 중첩 블록 시도 시 오류

## Version

- Version: 1.0.0
- Last Update: 2025-11-18
- Change Summary: Initial creation of UIH DSL Foundation Layer specification.
