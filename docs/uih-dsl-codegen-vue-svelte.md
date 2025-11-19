# UIH DSL — Vue & Svelte Codegen Rules

## Overview

React Codegen과 동일한 IR 기반으로 Vue와 Svelte 코드를 생성하는 규칙입니다. 플랫폼별 렌더링 규칙만 다르게 적용합니다.

## Rules

## SECTION A — Vue Codegen (SFC 기준)

### GOAL
- IR → .vue 파일 형태로 변환
- `<template>` + `<script setup>` + `<style>` 구조 유지
- 모든 로직은 배제하고 구조만 생성

### OUTPUT FILE STRUCTURE
```
MyPage.vue
```

### 1. Top-Level Structure
```vue
<template>
  <!-- layout tree -->
</template>

<script setup>
import components...

const events = {...}
const styleTokens = {...}
</script>

<style scoped>
/* optional if needed */
</style>
```

### 2. Layout Tree → Vue Template 규칙

#### IRComponentNode(tag:"Div", attributes, children)
```vue
<Div class="p-4">
  <!-- children -->
</Div>
```

#### RULES
- `className` → `class`
- attribute values: string only
- children: 그대로 template로 변환
- Fragment는 `<template>` 안에서 그냥 siblings로 출력

#### IRTextNode
```
"Hello" → Hello (그대로 text node)
```

### 3. Event Mapping
```javascript
eventHandlers {
  onClick: "submitForm"
}
```

#### Vue OUTPUT
```vue
@click="submitForm"
```

#### RULES
- `onClick` → `@click`
- `onChange` → `@change`
- `onInput` → `@input`
- `onLoad` → `@load`
- value는 함수 이름 string
- 함수 구현은 생성하지 않음

### 4. Component Registry (imports)
```javascript
import Card from "@/components/Card.vue"
import Button from "@/components/Button.vue"
```

### 5. Determinism Rules
- 속성(sorted)
- imports(sorted)
- children 순서 그대로
- no semicolons
- template 들여쓰기 2 spaces

## SECTION B — Svelte Codegen (.svelte)

### GOAL
- Svelte 컴포넌트 파일 하나로 완성
- `<script>` + markup 구조

### OUTPUT STRUCTURE
```
MyPage.svelte
```

### 1. File Layout
```svelte
<script>
  import components...
  export let events = {...}
  export let styleTokens = {...}
</script>

<!-- layout markup -->
<Div class="p-4">
  Hello
</Div>

<style>
/* optional */
</style>
```

### 2. Layout Tree → Svelte Markup

#### IRComponentNode(tag, attributes, children)
```svelte
<Div class="p-4">
  {#if ... ?} (없음)
  {children}
</Div>
```

#### RULES
- 클래스는 `class`
- 속성 문자열만
- Self-closing 금지
- children 재귀적 삽입

#### IRTextNode
```
"Hello" → Hello
```

### 3. Event Mapping
```javascript
IRScript:
onClick → function name
```

#### Svelte OUTPUT
```svelte
on:click={submitForm}
```

#### Mapping
```
onClick   → on:click
onChange  → on:change
onInput   → on:input
onLoad    → on:load
```

### 4. Components Import
```javascript
import Card from "./Card.svelte";
import Button from "./Button.svelte";
```

### 5. Determinism Rules (필수)

1. import 순서는 알파벳 정렬
2. attributes sorted
3. event names lower-case
4. children 순서 보존
5. markup 들여쓰기 2 spaces

## SECTION C — Cross-Platform Notes

1. React / Vue / Svelte 모두 IR만 참조
2. layout tree는 그대로 세 렌더러에서 재활용
3. event handler는 단순 label → framework alias로 변환
4. styleTokens는 컴파일러 외부 시스템이 처리
5. components는 registry 기반으로 import만 생성

## SECTION D — Example Conversion (Same IR → Vue/Svelte)

### IR
```
Div(class:"p-4") { "Hello" }
```

### Vue Template
```vue
<Div class="p-4">Hello</Div>
```

### Svelte Markup
```svelte
<Div class="p-4">Hello</Div>
```

## Structure

```
Vue Output (.vue)
├── <template>
│   └── layout tree (Vue template syntax)
├── <script setup>
│   ├── component imports
│   ├── events object
│   └── styleTokens object
└── <style scoped>
    └── optional styles

Svelte Output (.svelte)
├── <script>
│   ├── component imports
│   ├── export let events = {...}
│   └── export let styleTokens = {...}
├── layout markup (Svelte syntax)
└── <style>
    └── optional styles
```

## Examples

### Vue SFC 전체 예시
```vue
<template>
  <Div class="min-h-screen flex flex-col">
    <Header class="p-4 bg-blue-600 text-white">
      <H1>
        Dashboard
      </H1>
    </Header>
    <Main class="flex-1 p-6">
      <Card class="bg-white shadow-lg rounded-lg p-6" @click="handleCardClick">
        <P>
          Welcome back!
        </P>
      </Card>
    </Main>
  </Div>
</template>

<script setup>
import Card from "@/components/Card.vue"
import Button from "@/components/Button.vue"

const events = {
  handleCardClick: "handleCardClick"
}

const styleTokens = {
  "color.primary": "#0E5EF7",
  "spacing.medium": 16
}
</script>

<style scoped>
/* Optional custom styles */
</style>
```

### Svelte 컴포넌트 전체 예시
```svelte
<script>
  import Card from "./Card.svelte";
  import Button from "./Button.svelte";

  export let events = {
    handleCardClick: "handleCardClick"
  };

  export let styleTokens = {
    "color.primary": "#0E5EF7",
    "spacing.medium": 16
  };
</script>

<Div class="min-h-screen flex flex-col">
  <Header class="p-4 bg-blue-600 text-white">
    <H1>
      Dashboard
    </H1>
  </Header>
  <Main class="flex-1 p-6">
    <Card class="bg-white shadow-lg rounded-lg p-6" on:click={handleCardClick}>
      <P>
        Welcome back!
      </P>
    </Card>
  </Main>
</Div>

<style>
/* Optional custom styles */
</style>
```

### 이벤트 매핑 비교
```javascript
// 동일한 IR 이벤트
{
  onClick: "handleClick",
  onChange: "handleChange",
  onLoad: "init"
}
```

```vue
<!-- Vue -->
<Button @click="handleClick" @change="handleChange" @load="init">
```

```svelte
<!-- Svelte -->
<Button on:click={handleClick} on:change={handleChange} on:load={init}>
```

```jsx
<!-- React -->
<Button onClick={handleClick} onChange={handleChange} onLoad={init}>
```

## Edge Cases

- Vue에서 컴포넌트 이름이 kebab-case로 변환 필요 시 자동 처리
- Svelte에서 export let 구문이 예약어와 충돌 시 renaming
- 이벤트 핸들러가 정의되지 않은 경우 플랫폼별 기본 동작
- 스타일 토큰에 CSS 변수나 함수 포함 시 escaping
- 중첩 컴포넌트 깊이가 깊을 경우 플랫폼별 최적화 적용
- 텍스트 콘텐츠에 플랫폼별 특수문자 포함 시 자동 escape

## Version

- Version: 1.0.0
- Last Update: 2025-11-18
- Change Summary: Initial creation of UIH DSL Codegen Rules for Vue and Svelte.
