# @uih-dsl/tokenizer

UIH DSL (Universal Interface Hierarchy Domain-Specific Language) 토크나이저

## 개요

UIH DSL 소스 코드를 토큰 스트림으로 변환하는 렉서입니다.

**설계 원칙:**
- **Deterministic**: 동일 입력은 항상 동일 출력
- **엄격한 검증**: Identifier/TagName 규칙 엄격 적용
- **의미 해석 배제**: 문맥 판정은 Parser에 위임
- **FSM 기반**: NORMAL, ATTRIBUTES, STRING_LITERAL 모드로 동작

## 설치

```bash
pnpm add @uih-dsl/tokenizer
```

## 사용법

```typescript
import { tokenize } from '@uih-dsl/tokenizer';

const input = `
meta {
  title: "My App"
  route: "/"
}

layout {
  Container {
    H1 {
      "Welcome"
    }
  }
}
`;

const tokens = tokenize(input);
```

## API

### `tokenize(input: string): Token[]`

DSL 문자열을 토큰 배열로 변환합니다.

**입력 조건:**
- LF (`\n`) 줄바꿈만 허용
- 탭 문자 사용 불가
- 금지 문자 포함 시 에러 발생

**반환:**
- `Token[]` - 토큰 배열

### 타입 정의

```typescript
interface Token {
  type: TokenType;
  value: string;
  range: Range;
}

interface Range {
  start: Position;
  end: Position;
}

interface Position {
  line: number;    // 1부터 시작
  column: number;  // 1부터 시작
  index: number;   // 0부터 시작
}
```

## 토큰 타입

| TokenType | 설명 | 예제 |
|-----------|------|------|
| `IDENTIFIER` | 소문자 식별자 (엄격한 검증) | `meta`, `title`, `color.primary` |
| `TAGNAME` | 대문자 시작 컴포넌트명 (underscore 불허) | `Div`, `Container`, `H1` |
| `STRING` | 모든 문자열 리터럴 | `"value"`, `"text"` |
| `NUMBER` | 숫자 | `42`, `3.14` |
| `BOOLEAN` | 불린 | `true`, `false` |
| `LBRACE` | 여는 중괄호 | `{` |
| `RBRACE` | 닫는 중괄호 | `}` |
| `LPAREN` | 여는 괄호 | `(` |
| `RPAREN` | 닫는 괄호 | `)` |
| `COLON` | 콜론 | `:` |
| `COMMA` | 콤마 | `,` |
| `NEWLINE` | 줄바꿈 (공백은 스킵됨) | `\n` |
| `EOF` | 파일 끝 | - |

## 문법 규칙

### Identifier (엄격한 검증)
- **소문자로 시작 필수**
- 소문자, 숫자, 점(`.`)만 사용 가능
- **연속 점(`..`) 금지**
- **점으로 시작/끝 불가**
- **숫자로 시작 불가**
- 예: `meta`, `color.primary`, `font.size`
- 잘못된 예: `.invalid`, `invalid.`, `invalid..name`, `9invalid`

### TagName (엄격한 검증)
- **대문자로 시작 필수**
- 영문자(대소문자)와 숫자만 사용 가능
- **underscore(`_`) 사용 불가**
- 예: `Container`, `Button`, `H1`, `Div2`
- 잘못된 예: `my_component`, `_Component`

### String
- 쌍따옴표(`"`)로 감싸기
- **이스케이프: `\"` 만 허용** (Escape Strategy A)
  - `\"` → `"` (escaped quote)
  - 다른 모든 escape sequence는 에러 (`\n`, `\t`, `\\` 등 불허)
- 여러 줄 불가
- 예: `"Hello"`, `"He said \"Hi\""`
- 잘못된 예: `"Line\nBreak"`, `"Tab\there"`

### Number
- 정수와 소수점 지원
- 음수 미지원
- 단위 미지원

## 금지 문자

다음 문자는 **문자열 외부에서** 사용 시 즉시 에러:

- `;` (세미콜론) - 문장 구분 방지
- `'` (작은따옴표) - 큰따옴표 문자열만 허용
- `` ` `` (백틱) - 템플릿 리터럴 혼동 방지
- `@` (at sign) - 향후 데코레이터용 예약
- `#` (hash) - 향후 지시자용 예약
- `$` (dollar) - 향후 템플릿 구문용 예약
- `%`, `^`, `&`, `*`, `=`, `+`, `|` - 연산자 혼동 방지
- `\` (백슬래시) - **문자열 외부에서 금지, 문자열 내부에서는 `\"` escape만 허용**
- `<`, `>`, `?`, `~` - 비교/조건 연산자 혼동 방지
- `\t` (탭) - 공백만 허용
- `\r\n` (CRLF) - LF만 허용

### Backslash 규칙 (v2.1)

**문자열 외부 (NORMAL/ATTRIBUTES 모드):**
- Backslash(`\`) 사용 시 에러 발생
- 예: `meta { value: \ }` ❌

**문자열 내부 (STRING_LITERAL 모드):**
- `\"` escape만 허용
- 다른 모든 escape는 에러
- 예: `"He said \"Hi\""` ✅
- 예: `"Line\nBreak"` ❌

## 에러 처리

```typescript
try {
  tokenize('meta { title: "Test"; }');  // 세미콜론 금지
} catch (error) {
  console.error(error.message);
  // "Tokenizer Error at line 1, column 21: Forbidden character ';'"
}
```

## 예제

### 컴포넌트 추출

```typescript
const tokens = tokenize(source);
const components = tokens
  .filter(t => t.type === TokenType.TAGNAME)
  .map(t => t.value);
```

### 문자열 토큰화

```typescript
// 모든 문자열은 STRING 타입으로 토큰화됨
// 컨텍스트 구분은 Parser의 책임

// 속성 값
meta { title: "Hello" }  // "Hello"는 STRING

// 레이아웃 자식 요소
layout {
  H1 {
    "Hello"  // "Hello"도 STRING (Parser가 컨텍스트 판정)
  }
}
```

### 위치 정보 활용

```typescript
tokens.forEach(token => {
  const { line, column } = token.range.start;
  console.log(`${token.type} at ${line}:${column}`);
});
```

## 테스트

```bash
# 테스트 실행
pnpm test

# 테스트 파일 직접 실행
npx tsx test-runner.ts
npx tsx test-advanced.ts
```

## 관련 문서

- [UIH DSL Foundation 스펙](../../docs/uih-dsl-foundation.md)
- [UIH DSL Tokenizer 스펙](../../docs/uih-dsl-tokenizer-spec.md)

## 라이선스

MIT