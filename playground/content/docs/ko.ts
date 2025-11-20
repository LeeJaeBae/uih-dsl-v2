export const docs = {
  philosophy: {
    title: "철학",
    content: `# UIH DSL 철학

> **Universal Interface Hierarchy Domain Specific Language**
> AI가 절대 실수하지 않는 UI 선언 언어

---

## 핵심 개념

UIH DSL은 **결정성(Determinism)**과 **명확성(Clarity)**을 최우선으로 설계된 도메인 특화 언어입니다. LLM(Large Language Model)이 UI 구조를 생성할 때 발생할 수 있는 모든 모호성을 제거하여, 항상 정확하고 예측 가능한 결과를 보장합니다.

---

## 왜 UIH DSL인가?

### 기존 언어의 문제점

일반적인 프로그래밍 언어(JavaScript, TypeScript 등)는 표현의 자유도가 높습니다. 이는 인간 개발자에게는 장점이지만, AI에게는 다음과 같은 문제를 야기합니다:

| 문제 | 설명 | 예시 |
|------|------|------|
| **문법적 모호성** | 같은 의미를 여러 방식으로 표현 가능 | \`var\`, \`let\`, \`const\` |
| **따옴표 혼용** | 작은따옴표와 큰따옴표 혼재 | \`'text'\` vs \`"text"\` |
| **선택적 구문** | 세미콜론, 괄호 생략 가능 | \`return x\` vs \`return (x)\` |
| **주석 오인식** | 주석을 코드로 해석할 위험 | \`// TODO: implement\` |

### UIH DSL의 해결책

UIH DSL은 **단일 정답(Single Source of Truth)** 원칙을 따릅니다:

\`\`\`uih
meta {
  title: "명확한 구조"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
}

layout {
  Div(class:"container") {
    H1 { "단 하나의 방법만 존재" }
    P { "모호함이 없는 명확한 선언" }
  }
}
\`\`\`

---

## 설계 원칙

### 1. 결정성 (Determinism)

**"선택지가 없다"**

- ✅ 문법이 **단 하나**만 존재
- ✅ 동일한 입력은 **항상 동일한 출력**
- ❌ 대안 구문 없음
- ❌ 문법적 설탕(Syntactic Sugar) 없음

\`\`\`uih
layout {
  Div {
    H1 { "제목" }
  }
}
\`\`\`

### 2. 명시성 (Explicitness)

**"한 줄에 한 가지 의미"**

- ✅ 모든 선언은 **명시적**
- ✅ 암묵적 변환 없음
- ✅ 타입 추론 대신 **명시적 구조**

\`\`\`uih
layout {
  Header {
    Nav {
      A(href:"/") { "홈" }
      A(href:"/about") { "소개" }
    }
  }
  Main {
    Article {
      H1 { "제목" }
      P { "본문" }
    }
  }
}
\`\`\`

### 3. 고정 구조 (Fixed Structure)

**"순서는 절대적이다"**

블록은 **반드시 이 순서**로 작성되어야 합니다:

\`\`\`uih
meta {
  title: "페이지 제목"
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
  Div {
    Button { "클릭" }
  }
}

script {
  onClick: "handleClick"
}
\`\`\`

### 4. 제한된 문자 집합 (Limited Character Set)

**"쓸 수 있는 것만 쓴다"**

#### ✅ 허용된 문자
- 소문자: \`a-z\`
- 숫자: \`0-9\`
- 연결: \`-\` (하이픈), \`_\` (언더스코어)
- 구조: \`{\` \`}\` (중괄호), \`:\` (콜론)
- 문자열: \`"\` (큰따옴표만)
- 공백: 스페이스, 줄바꿈(LF)

#### ❌ 금지된 문자
- \`'\` 작은따옴표
- \`;\` 세미콜론
- \`()\` 괄호 (속성 선언 제외)
- \\\` 백틱
- \`\\t\` 탭
- \`\\r\\n\` CRLF
- \`//\` \`/* */\` 주석

---

## 철학적 목표

### 1. Zero Hallucination

AI가 존재하지 않는 문법을 만들어낼 수 없습니다.

\`\`\`uih
layout {
  Div { "내용" }
}
\`\`\`

### 2. Platform Agnostic

하나의 UIH 코드가 여러 프레임워크로 변환됩니다.

\`\`\`
UIH DSL
   ↓
   ├─→ React (JSX)
   ├─→ Vue (SFC)
   └─→ Svelte
\`\`\`

### 3. Minimal Cognitive Load

규칙이 적고 명확하여 학습 곡선이 거의 없습니다.

**전체 문법 규칙**: 5개
**예외 사항**: 0개
**학습 시간**: 10분 이내

---

## 비교: JavaScript vs UIH DSL

| 특성 | JavaScript/JSX | UIH DSL |
|------|----------------|---------|
| 따옴표 | \`'\` \`"\` \\\` 모두 가능 | \`"\` 만 가능 |
| 세미콜론 | 선택적 | 없음 |
| 들여쓰기 | 자유 (2/4칸, 탭) | 2칸 스페이스 고정 |
| 블록 순서 | 자유 | 고정 (meta→style→layout) |
| 주석 | \`//\` \`/* */\` | 불가 |
| 문법 변형 | 수십 가지 | 1가지 |

---

## 결론

UIH DSL은 **AI 시대의 UI 선언 언어**입니다.

인간이 아닌 **AI가 UI를 생성하는 시대**를 위해 설계되었으며, 모호함 제로, 실수 제로, 예측 가능성 100%를 달성합니다.`,
  },
  foundation: {
    title: "기본 문법",
    content: `# UIH DSL 기본 문법

> 5가지 규칙만 알면 끝입니다.

---

## 1. 들여쓰기 (Indentation)

### 규칙: 정확히 스페이스 2칸

UIH DSL은 **들여쓰기 규칙이 엄격**합니다. 파서가 구조를 정확히 인식하려면 일관된 들여쓰기가 필수입니다.

\`\`\`uih
layout {
  Div {
    Header {
      H1 { "제목" }
    }
  }
}
\`\`\`

| 허용 | 금지 | 이유 |
|------|------|------|
| 스페이스 2칸 | 탭 (\\t) | 파서가 탭을 인식 못함 |
| 스페이스 2칸 | 스페이스 4칸 | 규칙 위반 |
| 스페이스 2칸 | 혼용 | 일관성 파괴 |

---

## 2. 블록 순서 (Block Order)

### 규칙: 순서 절대 변경 불가

블록은 **반드시 아래 순서**대로 작성해야 합니다. 순서가 틀리면 파싱 에러가 발생합니다.

\`\`\`uih
meta {
  title: "순서 1: 메타 정보"
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
  Div {
    Button { "클릭" }
  }
}

script {
  onClick: "handleClick"
}
\`\`\`

### 블록 상세 설명

| 순서 | 블록 | 필수 | 목적 | 예시 |
|------|------|------|------|------|
| **1** | \`meta\` | ✅ 필수 | 페이지 메타데이터 | 제목, 경로, 설명 |
| **2** | \`style\` | ✅ 필수 | CSS 변수 정의 | 색상, 간격, 폰트 |
| **3** | \`components\` | ⚪ 선택 | 컴포넌트 설정 | 버튼 변형, 카드 타입 |
| **4** | \`layout\` | ✅ 필수 | UI 트리 구조 | 실제 화면 레이아웃 |
| **5** | \`script\` | ⚪ 선택 | 이벤트 핸들러 | 클릭, 제출 등 |

---

## 3. 문자 제한 (Character Set)

### 규칙: 허용된 문자만 사용

UIH DSL은 **제한된 문자 집합**만 허용합니다. 이는 파서의 복잡도를 낮추고 에러를 방지하기 위함입니다.

#### ✅ 허용된 문자

| 분류 | 문자 | 용도 |
|------|------|------|
| 소문자 | \`a-z\` | 식별자, 키워드 |
| 숫자 | \`0-9\` | 식별자 일부 (첫 글자 제외) |
| 하이픈 | \`-\` | 식별자 연결 (\`font-size\`) |
| 언더스코어 | \`_\` | 식별자 연결 (\`my_var\`) |
| 중괄호 | \`{\` \`}\` | 블록 구분 |
| 콜론 | \`:\` | 속성 구분 |
| 쉼표 | \`,\` | 속성 나열 |
| 큰따옴표 | \`"\` | 문자열 리터럴 |
| 괄호 | \`(\` \`)\` | 속성 선언만 |
| 공백 | 스페이스, LF | 구조 구분 |

#### ❌ 금지된 문자

| 문자 | 이유 |
|------|------|
| \`'\` (작은따옴표) | 문자열 표현 통일 |
| \`;\` (세미콜론) | 불필요한 구문 |
| \\\` (백틱) | 템플릿 리터럴 방지 |
| \`\\t\` (탭) | 들여쓰기 일관성 |
| \`\\r\\n\` (CRLF) | 줄바꿈 통일 (LF만) |
| \`//\` \`/**/\` | 주석 금지 |

---

## 4. 명명 규칙 (Naming Convention)

### 규칙: 소문자 + dot notation

식별자는 **소문자로 시작**하며, 계층 구조는 **dot notation**을 사용합니다.

\`\`\`uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
  spacing.sm: "4px"
  spacing.md: "8px"
  font.body: "Inter, sans-serif"
}
\`\`\`

**컴파일 결과 (CSS 변수):**
\`\`\`css
:root {
  --color-primary: #0E5EF7;
  --color-secondary: #8B5CF6;
  --spacing-sm: 4px;
  --spacing-md: 8px;
  --font-body: Inter, sans-serif;
}
\`\`\`

---

## 5. 주석 금지 (No Comments)

### 규칙: 주석을 쓸 수 없습니다

UIH DSL은 **주석을 지원하지 않습니다**. 이는 의도적인 설계입니다.

#### 주석 금지 이유

1. **AI 혼란 방지**: 주석을 코드로 오인할 위험 제거
2. **명확성**: 코드 자체가 명확하므로 주석 불필요
3. **일관성**: 주석 스타일 논쟁 차단

**대안**: 문서는 별도 파일로 작성하세요.

---

## 완전한 예제

\`\`\`uih
meta {
  title: "UIH DSL 완전 가이드"
  route: "/guide"
  description: "기본 문법을 모두 포함한 예제"
}

style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
  color.background: "#F9FAFB"
  spacing.base: "8px"
  font.body: "Inter, sans-serif"
}

layout {
  Div(class:"min-h-screen bg-white") {
    Header(class:"bg-blue-600 text-white p-6") {
      H1(class:"text-3xl font-bold") {
        "UIH DSL 가이드"
      }
    }
    Main(class:"max-w-4xl mx-auto p-8") {
      Section {
        H2(class:"text-2xl font-semibold mb-4") {
          "기본 문법"
        }
        P(class:"text-gray-600") {
          "5가지 규칙만 알면 UIH DSL을 완벽히 사용할 수 있습니다."
        }
      }
    }
    Footer(class:"bg-gray-100 p-4 text-center") {
      P(class:"text-sm text-gray-500") {
        "© 2024 UIH DSL"
      }
    }
  }
}
\`\`\`

이 코드는 **React, Vue, Svelte**로 자동 변환됩니다!`,
  },
  syntax: {
    title: "컴포넌트",
    content: `# 컴포넌트 레퍼런스

> UIH DSL이 지원하는 모든 HTML 컴포넌트와 사용법

---

## 컴포넌트 분류

UIH DSL은 **시맨틱 HTML5**를 기반으로 컴포넌트를 제공합니다. 모든 컴포넌트는 HTML 태그로 변환됩니다.

| 분류 | 컴포넌트 수 | 용도 |
|------|------------|------|
| 레이아웃 | 8개 | 페이지 구조 |
| 텍스트 | 8개 | 텍스트 표시 |
| 폼 | 6개 | 사용자 입력 |
| 리스트 | 3개 | 목록 표시 |
| 미디어 | 3개 | 이미지, 비디오 |
| 기타 | 3개 | 링크, 카드 등 |

---

## 1. 레이아웃 컴포넌트

페이지의 **구조적 요소**를 정의합니다.

### 기본 구조

\`\`\`uih
layout {
  Div(class:"container") {
    Header(class:"bg-white shadow") {
      Nav { "네비게이션" }
    }
    Main(class:"py-8") {
      Section {
        Article { "본문 내용" }
      }
    }
    Aside(class:"sidebar") {
      "사이드바"
    }
    Footer(class:"bg-gray-100") {
      "푸터"
    }
  }
}
\`\`\`

### 컴포넌트 목록

| 컴포넌트 | HTML | 용도 | 예시 |
|----------|------|------|------|
| \`Div\` | \`<div>\` | 일반 컨테이너 | 레이아웃 박스 |
| \`Section\` | \`<section>\` | 의미적 섹션 | 콘텐츠 구획 |
| \`Article\` | \`<article>\` | 독립적 콘텐츠 | 블로그 글 |
| \`Header\` | \`<header>\` | 헤더 영역 | 페이지 상단 |
| \`Footer\` | \`<footer>\` | 푸터 영역 | 페이지 하단 |
| \`Nav\` | \`<nav>\` | 네비게이션 | 메뉴 |
| \`Main\` | \`<main>\` | 주요 콘텐츠 | 본문 영역 |
| \`Aside\` | \`<aside>\` | 부가 콘텐츠 | 사이드바 |

---

## 2. 텍스트 컴포넌트

텍스트를 **표시**하고 **강조**합니다.

### 제목 계층

\`\`\`uih
layout {
  Article {
    H1(class:"text-4xl font-bold") { "메인 제목" }
    H2(class:"text-3xl font-semibold") { "부제목" }
    H3(class:"text-2xl") { "섹션 제목" }
    P(class:"text-base text-gray-700") {
      "본문 텍스트입니다."
    }
  }
}
\`\`\`

### 컴포넌트 목록

| 컴포넌트 | HTML | 용도 | 중요도 |
|----------|------|------|--------|
| \`H1\` | \`<h1>\` | 최상위 제목 | ⭐⭐⭐⭐⭐ |
| \`H2\` | \`<h2>\` | 2단계 제목 | ⭐⭐⭐⭐ |
| \`H3\` | \`<h3>\` | 3단계 제목 | ⭐⭐⭐ |
| \`H4\` | \`<h4>\` | 4단계 제목 | ⭐⭐ |
| \`H5\` | \`<h5>\` | 5단계 제목 | ⭐ |
| \`H6\` | \`<h6>\` | 6단계 제목 | ⭐ |
| \`P\` | \`<p>\` | 문단 | 본문 |
| \`Span\` | \`<span>\` | 인라인 텍스트 | 강조 |

---

## 3. 폼 컴포넌트

사용자 **입력**을 받습니다.

### 폼 예시

\`\`\`uih
layout {
  Form(class:"max-w-md mx-auto") {
    Div(class:"mb-4") {
      Label(class:"block mb-2") { "이름" }
      Input(
        type:"text",
        placeholder:"홍길동",
        class:"w-full border px-3 py-2"
      )
    }
    Div(class:"mb-4") {
      Label(class:"block mb-2") { "메시지" }
      Textarea(
        placeholder:"내용을 입력하세요",
        class:"w-full border px-3 py-2"
      )
    }
    Div(class:"mb-4") {
      Label(class:"block mb-2") { "국가" }
      Select(class:"w-full border px-3 py-2") {
        Option { "한국" }
        Option { "미국" }
        Option { "일본" }
      }
    }
    Button(type:"submit", class:"bg-blue-600 text-white px-4 py-2") {
      "제출"
    }
  }
}
\`\`\`

### 컴포넌트 목록

| 컴포넌트 | HTML | 필수 속성 | 설명 |
|----------|------|-----------|------|
| \`Form\` | \`<form>\` | - | 폼 컨테이너 |
| \`Input\` | \`<input>\` | \`type\` | 입력 필드 |
| \`Textarea\` | \`<textarea>\` | - | 여러 줄 입력 |
| \`Button\` | \`<button>\` | - | 버튼 |
| \`Label\` | \`<label>\` | - | 라벨 |
| \`Select\` | \`<select>\` | - | 선택 박스 |

---

## 4. 리스트 컴포넌트

항목을 **나열**합니다.

\`\`\`uih
layout {
  Div {
    Ul(class:"list-disc pl-6") {
      Li { "첫 번째 항목" }
      Li { "두 번째 항목" }
      Li { "세 번째 항목" }
    }
    Ol(class:"list-decimal pl-6 mt-4") {
      Li { "단계 1" }
      Li { "단계 2" }
      Li { "단계 3" }
    }
  }
}
\`\`\`

| 컴포넌트 | HTML | 리스트 타입 |
|----------|------|------------|
| \`Ul\` | \`<ul>\` | 순서 없음 (•) |
| \`Ol\` | \`<ol>\` | 순서 있음 (1,2,3) |
| \`Li\` | \`<li>\` | 리스트 항목 |

---

## 5. 미디어 컴포넌트

이미지, 비디오를 **삽입**합니다.

\`\`\`uih
layout {
  Div(class:"grid grid-cols-2 gap-4") {
    Img(
      src:"/logo.png",
      alt:"로고",
      class:"w-full"
    )
    Video(
      src:"/video.mp4",
      controls:"true",
      class:"w-full"
    )
  }
}
\`\`\`

| 컴포넌트 | HTML | 필수 속성 |
|----------|------|-----------|
| \`Img\` | \`<img>\` | \`src\`, \`alt\` |
| \`Video\` | \`<video>\` | \`src\` |
| \`Audio\` | \`<audio>\` | \`src\` |

---

## 속성 (Attributes) 사용법

### 기본 문법

\`\`\`uih
Component(속성:값, 속성:값) {
  "내용"
}
\`\`\`

### 주요 속성

| 속성 | 용도 | 예시 |
|------|------|------|
| \`class\` | CSS 클래스 | \`class:"text-xl font-bold"\` |
| \`href\` | 링크 URL | \`href:"/about"\` |
| \`src\` | 이미지/미디어 경로 | \`src:"/logo.png"\` |
| \`alt\` | 대체 텍스트 | \`alt:"로고 이미지"\` |
| \`type\` | 입력 타입 | \`type:"text"\` |
| \`placeholder\` | 플레이스홀더 | \`placeholder:"입력하세요"\` |

### 실전 예시

\`\`\`uih
A(
  href:"https://example.com",
  class:"text-blue-600 hover:underline",
  target:"_blank"
) {
  "외부 링크"
}
\`\`\`

---

## 완전한 페이지 예제

\`\`\`uih
meta {
  title: "블로그"
  route: "/blog"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div(class:"min-h-screen bg-gray-50") {
    Header(class:"bg-white shadow") {
      Nav(class:"container mx-auto px-4 py-4 flex gap-4") {
        A(href:"/", class:"text-blue-600") { "홈" }
        A(href:"/blog", class:"text-blue-600") { "블로그" }
        A(href:"/about", class:"text-blue-600") { "소개" }
      }
    }
    Main(class:"container mx-auto px-4 py-8") {
      Article(class:"bg-white rounded-lg shadow p-6") {
        H1(class:"text-3xl font-bold mb-4") {
          "UIH DSL 소개"
        }
        P(class:"text-gray-700 mb-4") {
          "AI가 실수하지 않는 UI 선언 언어입니다."
        }
        Ul(class:"list-disc pl-6 mb-4") {
          Li { "결정성 보장" }
          Li { "명확한 문법" }
          Li { "플랫폼 독립적" }
        }
        Button(class:"bg-blue-600 text-white px-4 py-2 rounded") {
          "더 알아보기"
        }
      }
    }
  }
}
\`\`\``,
  },
  codegen: {
    title: "코드 변환",
    content: `# 코드 생성 (Codegen)

> UIH DSL → React, Vue, Svelte로 자동 변환

---

## 지원 프레임워크

| 프레임워크 | 버전 | 출력 형식 | 상태 |
|-----------|------|-----------|------|
| **React** | 19+ | JSX / TSX | ✅ 완전 지원 |
| **Vue** | 3+ | SFC (Single File Component) | ✅ 완전 지원 |
| **Svelte** | 4/5 | Svelte 파일 | ✅ 완전 지원 |

---

## 변환 파이프라인

UIH DSL 코드가 실행 가능한 프레임워크 코드로 변환되는 과정:

\`\`\`
UIH Source Code
      ↓
   Tokenizer (렉싱)
      ↓
   Parser (파싱)
      ↓
     AST (추상 구문 트리)
      ↓
   IR Generator (중간 표현)
      ↓
    Codegen (코드 생성)
      ↓
  ┌──────┬──────┬──────┐
  ↓      ↓      ↓      ↓
React   Vue  Svelte  ...
\`\`\`

---

## React 코드 생성

### UIH 입력

\`\`\`uih
meta {
  title: "React 예제"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
}

layout {
  Div(class:"min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8") {
    Div(class:"max-w-4xl mx-auto") {
      H1(class:"text-4xl font-bold text-gray-900 mb-4") {
        "UIH DSL Playground"
      }
      P(class:"text-lg text-gray-600 mb-8") {
        "AI가 절대 실수하지 않는 UI 선언 언어"
      }
      Div(class:"bg-white p-6 rounded-lg shadow-lg") {
        H2(class:"text-2xl font-semibold mb-4") {
          "특징"
        }
        Ul(class:"list-disc pl-6 space-y-2") {
          Li { "결정적 문법" }
          Li { "명확한 구조" }
          Li { "플랫폼 독립적" }
        }
      }
    }
  }
}
\`\`\`

### React 출력 (TSX)

\`\`\`tsx
export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          UIH DSL Playground
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          AI가 절대 실수하지 않는 UI 선언 언어
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            특징
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>결정적 문법</li>
            <li>명확한 구조</li>
            <li>플랫폼 독립적</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
\`\`\`

### 특징

- ✅ Next.js 15+ App Router 호환
- ✅ \`class\` → \`className\` 자동 변환
- ✅ TypeScript 지원
- ✅ 서버 컴포넌트 기본

---

## Vue 코드 생성

### Vue 출력 (SFC)

\`\`\`vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        UIH DSL Playground
      </h1>
      <p class="text-lg text-gray-600 mb-8">
        AI가 절대 실수하지 않는 UI 선언 언어
      </p>
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold mb-4">
          특징
        </h2>
        <ul class="list-disc pl-6 space-y-2">
          <li>결정적 문법</li>
          <li>명확한 구조</li>
          <li>플랫폼 독립적</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
\`\`\`

### 특징

- ✅ Vue 3 Composition API
- ✅ \`<script setup>\` 형식
- ✅ TypeScript 지원
- ✅ Scoped CSS

---

## Svelte 코드 생성

### Svelte 출력

\`\`\`svelte
<div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">
      UIH DSL Playground
    </h1>
    <p class="text-lg text-gray-600 mb-8">
      AI가 절대 실수하지 않는 UI 선언 언어
    </p>
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold mb-4">
        특징
      </h2>
      <ul class="list-disc pl-6 space-y-2">
        <li>결정적 문법</li>
        <li>명확한 구조</li>
        <li>플랫폼 독립적</li>
      </ul>
    </div>
  </div>
</div>

<style>
</style>
\`\`\`

### 특징

- ✅ Svelte 4/5 호환
- ✅ 간결한 문법
- ✅ 반응성 자동
- ✅ 컴파일 최적화

---

## CSS 변수 처리

### UIH Style Block

\`\`\`uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
  spacing.sm: "4px"
  spacing.md: "8px"
}
\`\`\`

### 생성되는 CSS

\`\`\`css
:root {
  --color-primary: #0E5EF7;
  --color-secondary: #8B5CF6;
  --spacing-sm: 4px;
  --spacing-md: 8px;
}
\`\`\`

모든 프레임워크에서 **동일한 CSS 변수**를 사용합니다.

---

## 비교표

| 특성 | React | Vue | Svelte |
|------|-------|-----|--------|
| 컴포넌트 형식 | JSX | SFC | Svelte |
| 스타일 스코프 | 외부 CSS | Scoped | Scoped |
| 반응성 | useState | ref/reactive | 자동 |
| TypeScript | 기본 지원 | 기본 지원 | 기본 지원 |
| 파일 크기 | 중간 | 중간 | 작음 |

---

## Playground에서 직접 체험

1. [Playground](/)로 이동
2. 왼쪽 패널에 UIH 코드 작성
3. 상단에서 **React / Vue / Svelte** 선택
4. 오른쪽 패널에서 생성된 코드 확인
5. 하단에서 **실시간 미리보기** 확인

**지금 바로 시도해보세요!** → [Playground 열기](/)`,
  },
};
