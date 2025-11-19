# VSCode Extension Testing Guide

이 가이드는 UIH VSCode 확장을 로컬에서 테스트하는 방법을 설명합니다.

## 테스트 방법 1: Extension Development Host

### 1. VS Code에서 열기
```bash
code vscode-uih/
```

### 2. F5 키 누르기
- Extension Development Host 창이 열립니다
- 새 창에서 확장이 활성화됩니다

### 3. 테스트 파일 생성
새 창에서:
1. 파일 생성: `test.uih`
2. 다음 내용 입력:

```uih
meta {
  route: "/test";
  theme: "light";
}

layout {
  Card(id:"test") { "Hello UIH!" }
}
```

### 4. 확인 사항
- ✅ `meta`, `layout` 키워드가 색상 강조되는지
- ✅ `Card` 컴포넌트가 다른 색으로 표시되는지
- ✅ 문자열 `"Hello UIH!"`가 강조되는지
- ✅ `{`를 입력하면 자동으로 `}`가 입력되는지
- ✅ `//` 주석이 회색으로 표시되는지

### 5. 스니펫 테스트
1. `meta` 입력 후 Tab → 메타 블록 자동완성 확인
2. `button` 입력 후 Tab → 버튼 컴포넌트 자동완성 확인
3. `uih` 입력 후 Tab → 전체 템플릿 자동완성 확인

## 테스트 방법 2: VSIX 패키징

### 1. vsce 설치
```bash
npm install -g @vscode/vsce
```

### 2. VSIX 파일 생성
```bash
cd vscode-uih
vsce package
```

생성된 파일: `vscode-uih-1.0.0.vsix`

### 3. VSIX 설치
VS Code에서:
1. Extensions view 열기 (`Ctrl+Shift+X` / `Cmd+Shift+X`)
2. `...` 버튼 클릭
3. `Install from VSIX...` 선택
4. 생성된 `.vsix` 파일 선택

### 4. 확장 활성화 확인
1. `.uih` 파일 열기
2. 언어 모드가 "UIH"로 설정되었는지 확인 (우측 하단)
3. syntax highlighting 동작 확인

## 테스트 체크리스트

### Syntax Highlighting
- [ ] 블록 키워드 강조 (meta, style, layout, motion, logic, i18n, bind)
- [ ] 컴포넌트 이름 강조 (Card, Button, Input 등)
- [ ] Props 강조 (id:"value", variant:"primary" 등)
- [ ] 제어 흐름 키워드 (if, else, for, in)
- [ ] 문자열 (쌍따옴표, 홑따옴표)
- [ ] 주석 (`//`, `/* */`)

### Language Configuration
- [ ] 자동 괄호 닫기 (`{`, `(`, `[`)
- [ ] 자동 따옴표 닫기 (`"`, `'`)
- [ ] 주석 토글 (`Ctrl+/` / `Cmd+/`)
- [ ] 블록 코드 접기/펴기
- [ ] 자동 인덴트

### Snippets
- [ ] `uih` → 전체 파일 템플릿
- [ ] `meta` → 메타 블록
- [ ] `style` → 스타일 블록
- [ ] `layout` → 레이아웃 블록
- [ ] `button` → 버튼 컴포넌트
- [ ] `input` → 인풋 컴포넌트
- [ ] `if` → 조건부 블록
- [ ] `for` → 반복 블록

## 예제 파일 테스트

`examples/` 디렉토리의 `.uih` 파일들을 열어서 syntax highlighting이 제대로 동작하는지 확인:

```bash
# UIH 프로젝트 루트에서
code examples/booking.uih
code examples/nested.uih
code examples/components-showcase.uih
```

## 문제 해결

### Syntax Highlighting이 안 보일 때
1. 언어 모드 확인: 우측 하단 "Plain Text" → "UIH" 선택
2. 확장 재시작: `Developer: Reload Window` (Ctrl+R / Cmd+R)

### 스니펫이 안 나올 때
1. IntelliSense 트리거: `Ctrl+Space` / `Cmd+Space`
2. 설정 확인: `"editor.suggest.snippetsPreventQuickSuggestions": false`

### 확장이 활성화 안 될 때
1. 확장 목록 확인: Extensions view에서 "UIH Language Support" 검색
2. 활성화 버튼 클릭
3. VS Code 재시작

## 성공 기준

모든 체크리스트 항목이 ✅이면 확장이 제대로 동작하는 것입니다!

## 다음 단계

테스트 완료 후:
1. 커밋 생성
2. GitHub에 푸시
3. VS Code Marketplace 퍼블리싱 (선택사항)
