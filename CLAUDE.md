# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIH DSL (Universal Interface Hierarchy Domain Specific Language) v2 - AI가 절대 실수하지 않는 UI 선언 언어.

LLM이 UI 구조를 정확하게 선언할 수 있도록 설계된 도메인 특화 언어로, 모호성을 제거하고 결정성을 보장하는 것이 핵심 목표입니다.

## Architecture

### Core Components

1. **Foundation Layer** ([`docs/uih-dsl-foundation.md`](docs/uih-dsl-foundation.md))
   - Character rules, indentation (정확히 2 spaces), token rules
   - 고정 블록 순서: meta → style → components → layout → script

2. **AST Structure** ([`docs/uih-dsl-ast-schema.md`](docs/uih-dsl-ast-schema.md))
   - TypeScript 기반 AST 정의
   - Program → MetaNode, StyleNode, ComponentsNode, LayoutNode, ScriptNode
   - 모든 노드에 location 정보 필수

3. **Parser & Grammar** ([`docs/uih-dsl-parser-bnf-grammar.md`](docs/uih-dsl-parser-bnf-grammar.md))
   - BNF 문법 정의
   - 토크나이저 스펙 ([`docs/uih-dsl-tokenizer-spec.md`](docs/uih-dsl-tokenizer-spec.md))

4. **IR (Intermediate Representation)** ([`docs/uih-dsl-ir-specification.md`](docs/uih-dsl-ir-specification.md))
   - AST에서 IR로 변환
   - 플랫폼 독립적 중간 표현

5. **Codegen** ([`docs/uih-dsl-codegen-rules.md`](docs/uih-dsl-codegen-rules.md))
   - React/Next.js 15 App Router 타겟
   - Vue/Svelte 코드 생성 지원 ([`docs/uih-dsl-codegen-vue-svelte.md`](docs/uih-dsl-codegen-vue-svelte.md))

## Key Design Principles

### LLM 친화적 설계
- 한 줄에 하나의 의미만 (One-intent-per-line)
- 선택적 문법 금지, 모든 것이 명시적
- 쌍따옴표만 허용, 세미콜론 없음
- 주석 지원 안 함 (모호성 제거)

### 고정 구조
```
meta {
  title: "Page Title"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
}

components {
  Button {
    variant: "primary"
  }
}

layout {
  Container {
    Header {
      H1 {
        "Welcome"
      }
    }
  }
}

script {
  onClick: "handleClick"
}
```

## DSL Grammar Rules

### Allowed Characters
- `a-z`, `0-9`, `-`, `_`, 공백, 개행(LF만), `{}`, `:`, `"`

### Disallowed
- 작은따옴표(`'`), 세미콜론(`;`), 괄호(`()`), 백틱, 탭, CRLF

### Identifiers
- 소문자로 시작
- dot notation 허용 (`color.primary`)
- 하이픈은 identifier 내부에서 사용 금지

### Blocks
- 중첩은 layout 블록 내부에서만 허용
- 다른 블록들은 flat structure

## File Structure & Documentation

```
uih-v2/
├── docs/                # UIH DSL 스펙 문서
│   ├── uih-dsl-foundation.md       # 기본 문법 규칙 (문자, 들여쓰기, 토큰)
│   ├── uih-dsl-philosophy.md       # 설계 철학 (LLM 친화적 원칙)
│   ├── uih-dsl-ast-schema.md       # AST 스키마 정의 (TypeScript 인터페이스)
│   ├── uih-dsl-tokenizer-spec.md   # 토크나이저 스펙 (렉싱 규칙)
│   ├── uih-dsl-parser-bnf-grammar.md  # BNF 문법 (파서 규칙)
│   ├── uih-dsl-block-grammar.md    # 블록별 세부 문법
│   ├── uih-dsl-property-grammar.md # 속성 문법 규칙
│   ├── uih-dsl-layout-tree-grammar.md  # 레이아웃 트리 구조 문법
│   ├── uih-dsl-ir-specification.md # IR 스펙 (중간 표현)
│   ├── uih-dsl-codegen-rules.md    # React/Next.js 코드 생성 규칙
│   └── uih-dsl-codegen-vue-svelte.md  # Vue/Svelte 코드 생성 규칙
└── .specstory/          # AI 대화 기록 (SpecStory)
```

### 문서별 핵심 내용

#### 기초 문서
- **[Philosophy](docs/uih-dsl-philosophy.md)**: UIH DSL의 설계 철학과 원칙
- **[Foundation](docs/uih-dsl-foundation.md)**: 가장 낮은 레벨의 기본 규칙 정의

#### 문법 문서
- **[Parser BNF](docs/uih-dsl-parser-bnf-grammar.md)**: 완전한 BNF 문법 정의
- **[Block Grammar](docs/uih-dsl-block-grammar.md)**: meta, style, components, layout, script 블록별 규칙
- **[Property Grammar](docs/uih-dsl-property-grammar.md)**: 속성 선언 문법
- **[Layout Tree](docs/uih-dsl-layout-tree-grammar.md)**: UI 트리 구조 문법

#### 구현 문서
- **[Tokenizer Spec](docs/uih-dsl-tokenizer-spec.md)**: 토큰화 규칙과 구현 가이드
- **[AST Schema](docs/uih-dsl-ast-schema.md)**: 완전한 AST TypeScript 타입 정의
- **[IR Specification](docs/uih-dsl-ir-specification.md)**: AST → IR 변환 규칙
- **[Codegen Rules](docs/uih-dsl-codegen-rules.md)**: React/Next.js 15 코드 생성
- **[Codegen Vue/Svelte](docs/uih-dsl-codegen-vue-svelte.md)**: Vue 3, Svelte 5 코드 생성

## Development Notes

### Parser Implementation Order
1. Tokenizer (문자열 → 토큰)
2. Parser (토큰 → AST)
3. Validator (AST 검증)
4. IR Generator (AST → IR)
5. Codegen (IR → React/Vue/Svelte)

### Validation Rules
- meta, style, layout 블록은 필수
- components, script 블록은 선택
- 블록 순서 위반 시 파싱 실패
- layout 외 중첩 구조 금지
- 모든 노드에 location 정보 필수

### Error Handling
- 명확한 에러 위치 표시 (line:column)
- LLM이 수정하기 쉬운 에러 메시지
- 가능한 한 빨리 실패 (fail-fast)

## Testing Approach

### Test Categories
1. **Tokenizer Tests**: 각 토큰 타입별 테스트
2. **Parser Tests**: 유효/무효 DSL 파싱
3. **AST Tests**: 구조 검증
4. **IR Tests**: 변환 정확성
5. **Codegen Tests**: 출력 코드 검증

### Edge Cases
- 빈 블록 처리
- 깊은 중첩 구조 (10레벨 이상)
- 특수문자 이스케이프
- 허용되지 않은 문자 감지