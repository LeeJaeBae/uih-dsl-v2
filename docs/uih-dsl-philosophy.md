# UIH DSL 철학 (정제 버전)

## Overview

UIH DSL은 "AI가 절대 실수하지 않는 UI 선언 언어"를 목표로 하는 도메인 특화 언어입니다. 사람보다 LLM이 더 효과적으로 사용할 수 있도록 설계되었으며, UI 구조의 선언적 표현에 집중합니다.

## Rules

### 1. LLM 친화적 설계 원칙

LLM이 읽고 쓰기 편한 DSL을 지향합니다. 구조는 최대한 명확하고 모호성이 없으며, 선택적 문법을 금지합니다. LLM이 패턴을 쉽게 반복할 수 있는 형태로 자연어 번역 난이도를 낮췄습니다.

### 2. 선언적 UI 설계

UI는 로직 기반보다 구조 기반으로 설계합니다. "무엇을 만든다"에 집중하며 "어떻게 만든다"는 Codegen이 담당합니다. 상태, 이벤트, 애니메이션은 추상화 계층으로 밀어냅니다.

### 3. 한 줄 한 의미 원칙 (One-intent-per-line)

한 라인에 하나의 의미만 허용합니다. 한 줄에 두 개 의미를 섞으면 LLM이 실수할 가능성이 높아집니다.

### 4. 고정 블록 순서

블록 구조는 meta → style → components → layout → script 순서를 유지합니다. 이 순서는 LLM이 외우기 쉽고 Codegen의 예측 가능성과 AST의 결정성을 보장합니다.

### 5. 최소 표현, 최대 의미

DSL은 짧고 규칙적이어야 합니다. CSS-like verbose, YAML 계층 증가, JSX 로직 섞임을 금지합니다. 의미 전달에 집중하는 최소 선언적 DSL입니다.

### 6. 오류 제로 문법

"AI가 틀릴 수 없는 언어"를 목표로 합니다. 쌍따옴표만 허용하고 세미콜론 없이 콜론만 사용합니다. 모든 키는 고정된 string literal이며 optional field를 최소화합니다.

### 7. AST 1:1 매핑

모든 UI 요소가 AST에 직접 매핑됩니다. meta 블록 → MetaNode, style 블록 → StyleNode, layout 블록 → LayoutTree로 변환됩니다.

### 8. 기계 친화적 우선

"사람이 읽으면 조금 불편할 것" 정도가 적정 수준입니다. 사람 UX보다 AI 정확성을 우선합니다.

## Structure

```
meta:
  title: "Home"
  route: "/"

style:
  primary-color: "#111"

components:
  Button:
    variant: primary

layout:
  Container:
    children:
      - Button

script:
  // optional script
```

## Examples

### 좋은 예: 한 줄 한 의미

```dsl
meta:
  title: "Home"

meta:
  route: "/"
```

### 나쁜 예: 한 줄 다중 의미 (금지)

```dsl
meta: title: "Home", route: "/"  # 잘못된 예
```

## Edge Cases

- 모호한 표현 발견 시 문법 규칙 재검토
- LLM 실수 가능성이 발견되면 즉시 문법 수정
- 사람 편의성과 AI 정확성 간 충돌 시 AI 정확성 우선

## Version

- Version: 1.0.0
- Last Update: 2025-11-18
- Change Summary: Initial creation of UIH DSL Philosophy document.
