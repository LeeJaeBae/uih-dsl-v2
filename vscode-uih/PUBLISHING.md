# VSCode Extension Publishing Guide

이 가이드는 UIH VSCode 확장을 Visual Studio Code Marketplace에 퍼블리시하는 방법을 설명합니다.

## 사전 준비

### 1. Azure DevOps 계정
- https://dev.azure.com 에서 무료 계정 생성
- Microsoft 계정으로 로그인

### 2. Personal Access Token (PAT) 생성

1. Azure DevOps 로그인
2. User Settings (우측 상단 프로필 아이콘) → Personal Access Tokens
3. `New Token` 클릭
4. 설정:
   - **Name**: VSCode Marketplace
   - **Organization**: All accessible organizations
   - **Expiration**: Custom defined (1년 권장)
   - **Scopes**: `Marketplace` → **Manage** 체크
5. `Create` 클릭
6. **토큰 복사** (다시 볼 수 없으므로 안전한 곳에 저장!)

### 3. Publisher 생성

1. https://marketplace.visualstudio.com/manage 접속
2. Azure 계정으로 로그인
3. `Create publisher` 클릭
4. Publisher 정보 입력:
   - **ID**: `LeeJaeWon` (소문자, 숫자, 하이픈만 가능)
   - **Display name**: LeeJaeWon
   - **Email**: 연락 가능한 이메일

## 퍼블리싱 과정

### 1. vsce CLI 설치

```bash
npm install -g @vscode/vsce
```

### 2. Publisher 로그인

```bash
cd vscode-uih
vsce login LeeJaeWon
# Personal Access Token 입력 (위에서 복사한 토큰)
```

### 3. 확장 패키징 (테스트)

```bash
vsce package
```

생성된 파일: `vscode-uih-1.0.0.vsix`

### 4. 로컬 테스트

VS Code에서 VSIX 파일 설치:
1. Extensions view (`Ctrl+Shift+X`)
2. `...` → `Install from VSIX...`
3. 생성된 `.vsix` 파일 선택
4. 테스트 (TEST.md 참고)

### 5. Marketplace에 퍼블리시

```bash
vsce publish
```

**또는 특정 버전으로 퍼블리시:**

```bash
vsce publish 1.0.0
```

**또는 버전 자동 증가:**

```bash
vsce publish patch  # 1.0.0 → 1.0.1
vsce publish minor  # 1.0.0 → 1.1.0
vsce publish major  # 1.0.0 → 2.0.0
```

### 6. 확인

1. https://marketplace.visualstudio.com/items?itemName=LeeJaeWon.vscode-uih
2. 5-10분 후 마켓플레이스에서 검색 가능

## package.json 필수 필드 확인

퍼블리시 전 확인 사항:

```json
{
  "name": "vscode-uih",              // ✅ 필수
  "displayName": "UIH Language Support", // ✅ 필수
  "version": "1.0.0",                // ✅ 필수
  "publisher": "LeeJaeWon",          // ✅ 필수 (본인의 publisher ID)
  "description": "...",              // ✅ 필수
  "repository": {                    // ✅ 권장
    "type": "git",
    "url": "https://github.com/LeeJaeBae/uih.git"
  },
  "engines": {
    "vscode": "^1.80.0"              // ✅ 필수
  },
  "categories": [...],               // ✅ 필수
  "keywords": [...]                  // 선택
}
```

## 아이콘 추가 (선택사항)

확장 아이콘을 추가하면 마켓플레이스에서 더 눈에 띕니다:

1. 128x128 PNG 이미지 생성 (icon.png)
2. `vscode-uih/` 디렉토리에 저장
3. package.json에 추가:

```json
{
  "icon": "icon.png"
}
```

## 업데이트 퍼블리싱

기존 확장 업데이트:

```bash
# 1. 변경사항 적용
# 2. CHANGELOG.md 업데이트
# 3. package.json 버전 증가

# 퍼블리시
vsce publish minor  # 또는 patch/major
```

## 문제 해결

### "Error: Missing publisher name"
→ package.json에 `"publisher": "LeeJaeWon"` 추가

### "Error: Personal Access Token is invalid"
→ Azure DevOps에서 새 토큰 생성 후 재로그인

### "Error: Extension size exceeds 50MB"
→ `.vsixignore`에 불필요한 파일 추가

### "The extension 'vscode-uih' already exists"
→ 다른 publisher가 이미 사용 중. 이름 변경 필요

## CI/CD 자동 퍼블리싱 (고급)

GitHub Actions로 자동 퍼블리시:

1. GitHub Secrets에 PAT 저장
2. `.github/workflows/publish.yml` 생성
3. 태그 푸시 시 자동 퍼블리시

```yaml
name: Publish Extension
on:
  push:
    tags:
      - 'v*'
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g @vscode/vsce
      - run: vsce publish -p ${{ secrets.VSCE_TOKEN }}
```

## 다음 단계

1. ✅ 확장 테스트 (TEST.md)
2. ✅ Azure DevOps 계정 생성
3. ✅ Personal Access Token 생성
4. ✅ Publisher 생성
5. ✅ vsce publish 실행
6. ✅ Marketplace에서 확인

## 유용한 링크

- [VS Code Extension Publishing Guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Azure DevOps](https://dev.azure.com)
- [VS Code Marketplace](https://marketplace.visualstudio.com)
- [vsce CLI Documentation](https://github.com/microsoft/vscode-vsce)

---

**퍼블리시 후 프로모션**:
- GitHub README에 마켓플레이스 배지 추가
- Twitter/SNS에 공유
- Reddit r/vscode, r/programming 커뮤니티 공유
