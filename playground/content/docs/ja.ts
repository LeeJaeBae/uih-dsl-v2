export const docs = {
  philosophy: {
    title: "哲学",
    content: `# UIH DSL 哲学

> **Universal Interface Hierarchy Domain Specific Language**
> AI が絶対に間違えない UI 宣言言語

---

## 核心概念

UIH DSL は **決定性（Determinism）** と **明確性（Clarity）** を最優先に設計されたドメイン特化言語です。LLM（Large Language Model）が UI 構造を生成する際に発生しうるすべての曖昧性を排除し、常に正確で予測可能な結果を保証します。

---

## なぜ UIH DSL なのか？

### 既存言語の問題点

一般的なプログラミング言語（JavaScript、TypeScript など）は表現の自由度が高いです。これは人間の開発者にとっては利点ですが、AI には次のような問題を引き起こします：

| 問題 | 説明 | 例 |
|------|------|------|
| **文法的曖昧性** | 同じ意味を複数の方法で表現可能 | \`var\`, \`let\`, \`const\` |
| **引用符の混用** | シングルクォートとダブルクォートの混在 | \`'text'\` vs \`"text"\` |
| **オプショナル構文** | セミコロン、括弧の省略可能 | \`return x\` vs \`return (x)\` |
| **コメントの誤認識** | コメントをコードとして解釈するリスク | \`// TODO: implement\` |

### UIH DSL の解決策

UIH DSL は **単一の真実（Single Source of Truth）** 原則に従います：

\`\`\`uih
meta {
  title: "明確な構造"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
}

layout {
  Div(class:"container") {
    H1 { "ただ一つの方法のみ存在" }
    P { "曖昧さのない明確な宣言" }
  }
}
\`\`\`

---

## 設計原則

### 1. 決定性（Determinism）

**「選択肢がない」**

- ✅ 文法は **ただ一つ** のみ存在
- ✅ 同一の入力は **常に同一の出力**
- ❌ 代替構文なし
- ❌ 糖衣構文（Syntactic Sugar）なし

\`\`\`uih
layout {
  Div {
    H1 { "タイトル" }
  }
}
\`\`\`

### 2. 明示性（Explicitness）

**「1 行に 1 つの意味」**

- ✅ すべての宣言は **明示的**
- ✅ 暗黙的な変換なし
- ✅ 型推論の代わりに **明示的な構造**

\`\`\`uih
layout {
  Header {
    Nav {
      A(href:"/") { "ホーム" }
      A(href:"/about") { "概要" }
    }
  }
  Main {
    Article {
      H1 { "タイトル" }
      P { "本文" }
    }
  }
}
\`\`\`

### 3. 固定構造（Fixed Structure）

**「順序は絶対的である」**

ブロックは **必ずこの順序** で記述する必要があります：

\`\`\`uih
meta {
  title: "ページタイトル"
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
    Button { "クリック" }
  }
}

script {
  onClick: "handleClick"
}
\`\`\`

### 4. 制限された文字セット（Limited Character Set）

**「使えるものだけ使う」**

#### ✅ 許可された文字
- 小文字：\`a-z\`
- 数字：\`0-9\`
- 接続：\`-\`（ハイフン）、\`_\`（アンダースコア）
- 構造：\`{\` \`}\`（中括弧）、\`:\`（コロン）
- 文字列：\`"\`（ダブルクォートのみ）
- 空白：スペース、改行（LF）

#### ❌ 禁止された文字
- \`'\` シングルクォート
- \`;\` セミコロン
- \`()\` 括弧（属性宣言を除く）
- \\\` バッククォート
- \`\\t\` タブ
- \`\\r\\n\` CRLF
- \`//\` \`/* */\` コメント

---

## 哲学的目標

### 1. Zero Hallucination

AI が存在しない文法を作り出すことができません。

\`\`\`uih
layout {
  Div { "内容" }
}
\`\`\`

### 2. Platform Agnostic

一つの UIH コードが複数のフレームワークに変換されます。

\`\`\`
UIH DSL
   ↓
   ├─→ React (JSX)
   ├─→ Vue (SFC)
   └─→ Svelte
\`\`\`

### 3. Minimal Cognitive Load

ルールが少なく明確で、学習曲線がほぼありません。

**全文法規則**：5 個
**例外事項**：0 個
**学習時間**：10 分以内

---

## 比較：JavaScript vs UIH DSL

| 特性 | JavaScript/JSX | UIH DSL |
|------|----------------|---------|
| 引用符 | \`'\` \`"\` \\\` すべて可能 | \`"\` のみ可能 |
| セミコロン | オプショナル | なし |
| インデント | 自由（2/4 スペース、タブ） | 2 スペース固定 |
| ブロック順序 | 自由 | 固定（meta→style→layout） |
| コメント | \`//\` \`/* */\` | 不可 |
| 文法変形 | 数十種類 | 1 種類 |

---

## 結論

UIH DSL は **AI 時代の UI 宣言言語** です。

人間ではなく **AI が UI を生成する時代** のために設計され、曖昧さゼロ、ミスゼロ、予測可能性 100% を達成します。`,
  },
  foundation: {
    title: "基本文法",
    content: `# UIH DSL 基本文法

> 5 つのルールを知れば完了です。

---

## 1. インデント（Indentation）

### ルール：正確にスペース 2 個

UIH DSL は **インデントルールが厳格** です。パーサが構造を正確に認識するには、一貫したインデントが必須です。

\`\`\`uih
layout {
  Div {
    Header {
      H1 { "タイトル" }
    }
  }
}
\`\`\`

| 許可 | 禁止 | 理由 |
|------|------|------|
| スペース 2 個 | タブ（\\t） | パーサがタブを認識できない |
| スペース 2 個 | スペース 4 個 | ルール違反 |
| スペース 2 個 | 混用 | 一貫性の破壊 |

---

## 2. ブロック順序（Block Order）

### ルール：順序は絶対に変更不可

ブロックは **必ず下記の順序** で記述する必要があります。順序が間違っているとパースエラーが発生します。

\`\`\`uih
meta {
  title: "順序 1：メタ情報"
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
    Button { "クリック" }
  }
}

script {
  onClick: "handleClick"
}
\`\`\`

### ブロック詳細説明

| 順序 | ブロック | 必須 | 目的 | 例 |
|------|------|------|------|------|
| **1** | \`meta\` | ✅ 必須 | ページメタデータ | タイトル、パス、説明 |
| **2** | \`style\` | ✅ 必須 | CSS 変数定義 | 色、間隔、フォント |
| **3** | \`components\` | ⚪ 任意 | コンポーネント設定 | ボタンバリアント、カードタイプ |
| **4** | \`layout\` | ✅ 必須 | UI ツリー構造 | 実際の画面レイアウト |
| **5** | \`script\` | ⚪ 任意 | イベントハンドラ | クリック、送信など |

---

## 3. 文字制限（Character Set）

### ルール：許可された文字のみ使用

UIH DSL は **制限された文字セット** のみ許可します。これはパーサの複雑度を下げ、エラーを防ぐためです。

#### ✅ 許可された文字

| 分類 | 文字 | 用途 |
|------|------|------|
| 小文字 | \`a-z\` | 識別子、キーワード |
| 数字 | \`0-9\` | 識別子の一部（最初の文字を除く） |
| ハイフン | \`-\` | 識別子接続（\`font-size\`） |
| アンダースコア | \`_\` | 識別子接続（\`my_var\`） |
| 中括弧 | \`{\` \`}\` | ブロック区分 |
| コロン | \`:\` | 属性区分 |
| カンマ | \`,\` | 属性列挙 |
| ダブルクォート | \`"\` | 文字列リテラル |
| 括弧 | \`(\` \`)\` | 属性宣言のみ |
| 空白 | スペース、LF | 構造区分 |

#### ❌ 禁止された文字

| 文字 | 理由 |
|------|------|
| \`'\`（シングルクォート） | 文字列表現の統一 |
| \`;\`（セミコロン） | 不要な構文 |
| \\\`（バッククォート） | テンプレートリテラル防止 |
| \`\\t\`（タブ） | インデント一貫性 |
| \`\\r\\n\`（CRLF） | 改行の統一（LF のみ） |
| \`//\` \`/**/\` | コメント禁止 |

---

## 4. 命名規則（Naming Convention）

### ルール：小文字 + dot notation

識別子は **小文字で始まり**、階層構造は **dot notation** を使用します。

\`\`\`uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
  spacing.sm: "4px"
  spacing.md: "8px"
  font.body: "Inter, sans-serif"
}
\`\`\`

**コンパイル結果（CSS 変数）：**
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

## 5. コメント禁止（No Comments）

### ルール：コメントを書けません

UIH DSL は **コメントをサポートしません**。これは意図的な設計です。

#### コメント禁止の理由

1. **AI 混乱防止**：コメントをコードとして誤認するリスクを排除
2. **明確性**：コード自体が明確なのでコメント不要
3. **一貫性**：コメントスタイルの議論をブロック

**代替案**：ドキュメントは別ファイルで作成してください。

---

## 完全な例

\`\`\`uih
meta {
  title: "UIH DSL 完全ガイド"
  route: "/guide"
  description: "基本文法をすべて含む例"
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
        "UIH DSL ガイド"
      }
    }
    Main(class:"max-w-4xl mx-auto p-8") {
      Section {
        H2(class:"text-2xl font-semibold mb-4") {
          "基本文法"
        }
        P(class:"text-gray-600") {
          "5 つのルールを知れば UIH DSL を完璧に使用できます。"
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

このコードは **React、Vue、Svelte** に自動変換されます！`,
  },
  syntax: {
    title: "コンポーネント",
    content: `# コンポーネントリファレンス

> UIH DSL がサポートするすべての HTML コンポーネントと使用法

---

## コンポーネント分類

UIH DSL は **セマンティック HTML5** をベースにコンポーネントを提供します。すべてのコンポーネントは HTML タグに変換されます。

| 分類 | コンポーネント数 | 用途 |
|------|------------|------|
| レイアウト | 8 個 | ページ構造 |
| テキスト | 8 個 | テキスト表示 |
| フォーム | 6 個 | ユーザー入力 |
| リスト | 3 個 | リスト表示 |
| メディア | 3 個 | 画像、ビデオ |
| その他 | 3 個 | リンク、カードなど |

---

## 1. レイアウトコンポーネント

ページの **構造的要素** を定義します。

### 基本構造

\`\`\`uih
layout {
  Div(class:"container") {
    Header(class:"bg-white shadow") {
      Nav { "ナビゲーション" }
    }
    Main(class:"py-8") {
      Section {
        Article { "本文内容" }
      }
    }
    Aside(class:"sidebar") {
      "サイドバー"
    }
    Footer(class:"bg-gray-100") {
      "フッター"
    }
  }
}
\`\`\`

### コンポーネントリスト

| コンポーネント | HTML | 用途 | 例 |
|----------|------|------|------|
| \`Div\` | \`<div>\` | 一般コンテナ | レイアウトボックス |
| \`Section\` | \`<section>\` | 意味的セクション | コンテンツ区画 |
| \`Article\` | \`<article>\` | 独立的コンテンツ | ブログ記事 |
| \`Header\` | \`<header>\` | ヘッダー領域 | ページ上部 |
| \`Footer\` | \`<footer>\` | フッター領域 | ページ下部 |
| \`Nav\` | \`<nav>\` | ナビゲーション | メニュー |
| \`Main\` | \`<main>\` | 主要コンテンツ | 本文領域 |
| \`Aside\` | \`<aside>\` | 補足コンテンツ | サイドバー |

---

## 2. テキストコンポーネント

テキストを **表示** し **強調** します。

### 見出し階層

\`\`\`uih
layout {
  Article {
    H1(class:"text-4xl font-bold") { "メインタイトル" }
    H2(class:"text-3xl font-semibold") { "サブタイトル" }
    H3(class:"text-2xl") { "セクションタイトル" }
    P(class:"text-base text-gray-700") {
      "本文テキストです。"
    }
  }
}
\`\`\`

### コンポーネントリスト

| コンポーネント | HTML | 用途 | 重要度 |
|----------|------|------|--------|
| \`H1\` | \`<h1>\` | 最上位見出し | ⭐⭐⭐⭐⭐ |
| \`H2\` | \`<h2>\` | 2 段階見出し | ⭐⭐⭐⭐ |
| \`H3\` | \`<h3>\` | 3 段階見出し | ⭐⭐⭐ |
| \`H4\` | \`<h4>\` | 4 段階見出し | ⭐⭐ |
| \`H5\` | \`<h5>\` | 5 段階見出し | ⭐ |
| \`H6\` | \`<h6>\` | 6 段階見出し | ⭐ |
| \`P\` | \`<p>\` | 段落 | 本文 |
| \`Span\` | \`<span>\` | インラインテキスト | 強調 |

---

## 3. フォームコンポーネント

ユーザー **入力** を受け取ります。

### フォーム例

\`\`\`uih
layout {
  Form(class:"max-w-md mx-auto") {
    Div(class:"mb-4") {
      Label(class:"block mb-2") { "名前" }
      Input(
        type:"text",
        placeholder:"山田太郎",
        class:"w-full border px-3 py-2"
      )
    }
    Div(class:"mb-4") {
      Label(class:"block mb-2") { "メッセージ" }
      Textarea(
        placeholder:"内容を入力してください",
        class:"w-full border px-3 py-2"
      )
    }
    Div(class:"mb-4") {
      Label(class:"block mb-2") { "国" }
      Select(class:"w-full border px-3 py-2") {
        Option { "日本" }
        Option { "アメリカ" }
        Option { "韓国" }
      }
    }
    Button(type:"submit", class:"bg-blue-600 text-white px-4 py-2") {
      "送信"
    }
  }
}
\`\`\`

### コンポーネントリスト

| コンポーネント | HTML | 必須属性 | 説明 |
|----------|------|-----------|------|
| \`Form\` | \`<form>\` | - | フォームコンテナ |
| \`Input\` | \`<input>\` | \`type\` | 入力フィールド |
| \`Textarea\` | \`<textarea>\` | - | 複数行入力 |
| \`Button\` | \`<button>\` | - | ボタン |
| \`Label\` | \`<label>\` | - | ラベル |
| \`Select\` | \`<select>\` | - | 選択ボックス |

---

## 4. リストコンポーネント

項目を **列挙** します。

\`\`\`uih
layout {
  Div {
    Ul(class:"list-disc pl-6") {
      Li { "最初の項目" }
      Li { "2 番目の項目" }
      Li { "3 番目の項目" }
    }
    Ol(class:"list-decimal pl-6 mt-4") {
      Li { "ステップ 1" }
      Li { "ステップ 2" }
      Li { "ステップ 3" }
    }
  }
}
\`\`\`

| コンポーネント | HTML | リストタイプ |
|----------|------|------------|
| \`Ul\` | \`<ul>\` | 順序なし（•） |
| \`Ol\` | \`<ol>\` | 順序あり（1,2,3） |
| \`Li\` | \`<li>\` | リスト項目 |

---

## 5. メディアコンポーネント

画像、ビデオを **挿入** します。

\`\`\`uih
layout {
  Div(class:"grid grid-cols-2 gap-4") {
    Img(
      src:"/logo.png",
      alt:"ロゴ",
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

| コンポーネント | HTML | 必須属性 |
|----------|------|-----------|
| \`Img\` | \`<img>\` | \`src\`, \`alt\` |
| \`Video\` | \`<video>\` | \`src\` |
| \`Audio\` | \`<audio>\` | \`src\` |

---

## 属性（Attributes）使用法

### 基本文法

\`\`\`uih
Component(属性:値, 属性:値) {
  "内容"
}
\`\`\`

### 主要属性

| 属性 | 用途 | 例 |
|------|------|------|
| \`class\` | CSS クラス | \`class:"text-xl font-bold"\` |
| \`href\` | リンク URL | \`href:"/about"\` |
| \`src\` | 画像/メディアパス | \`src:"/logo.png"\` |
| \`alt\` | 代替テキスト | \`alt:"ロゴ画像"\` |
| \`type\` | 入力タイプ | \`type:"text"\` |
| \`placeholder\` | プレースホルダー | \`placeholder:"入力してください"\` |

### 実例

\`\`\`uih
A(
  href:"https://example.com",
  class:"text-blue-600 hover:underline",
  target:"_blank"
) {
  "外部リンク"
}
\`\`\`

---

## 完全なページ例

\`\`\`uih
meta {
  title: "ブログ"
  route: "/blog"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div(class:"min-h-screen bg-gray-50") {
    Header(class:"bg-white shadow") {
      Nav(class:"container mx-auto px-4 py-4 flex gap-4") {
        A(href:"/", class:"text-blue-600") { "ホーム" }
        A(href:"/blog", class:"text-blue-600") { "ブログ" }
        A(href:"/about", class:"text-blue-600") { "概要" }
      }
    }
    Main(class:"container mx-auto px-4 py-8") {
      Article(class:"bg-white rounded-lg shadow p-6") {
        H1(class:"text-3xl font-bold mb-4") {
          "UIH DSL 紹介"
        }
        P(class:"text-gray-700 mb-4") {
          "AI が間違えない UI 宣言言語です。"
        }
        Ul(class:"list-disc pl-6 mb-4") {
          Li { "決定性保証" }
          Li { "明確な文法" }
          Li { "プラットフォーム非依存" }
        }
        Button(class:"bg-blue-600 text-white px-4 py-2 rounded") {
          "もっと見る"
        }
      }
    }
  }
}
\`\`\``,
  },
  codegen: {
    title: "コード変換",
    content: `# コード生成（Codegen）

> UIH DSL → React、Vue、Svelte に自動変換

---

## サポートフレームワーク

| フレームワーク | バージョン | 出力形式 | 状態 |
|-----------|------|-----------|------|
| **React** | 19+ | JSX / TSX | ✅ 完全サポート |
| **Vue** | 3+ | SFC（Single File Component） | ✅ 完全サポート |
| **Svelte** | 4/5 | Svelte ファイル | ✅ 完全サポート |

---

## 変換パイプライン

UIH DSL コードが実行可能なフレームワークコードに変換される過程：

\`\`\`
UIH Source Code
      ↓
   Tokenizer（字句解析）
      ↓
   Parser（構文解析）
      ↓
     AST（抽象構文木）
      ↓
   IR Generator（中間表現）
      ↓
    Codegen（コード生成）
      ↓
  ┌──────┬──────┬──────┐
  ↓      ↓      ↓      ↓
React   Vue  Svelte  ...
\`\`\`

---

## React コード生成

### UIH 入力

\`\`\`uih
meta {
  title: "React 例"
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
        "AI が絶対に間違えない UI 宣言言語"
      }
      Div(class:"bg-white p-6 rounded-lg shadow-lg") {
        H2(class:"text-2xl font-semibold mb-4") {
          "特徴"
        }
        Ul(class:"list-disc pl-6 space-y-2") {
          Li { "決定的文法" }
          Li { "明確な構造" }
          Li { "プラットフォーム非依存" }
        }
      }
    }
  }
}
\`\`\`

### React 出力（TSX）

\`\`\`tsx
export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          UIH DSL Playground
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          AI が絶対に間違えない UI 宣言言語
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            特徴
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>決定的文法</li>
            <li>明確な構造</li>
            <li>プラットフォーム非依存</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
\`\`\`

### 特徴

- ✅ Next.js 15+ App Router 互換
- ✅ \`class\` → \`className\` 自動変換
- ✅ TypeScript サポート
- ✅ サーバーコンポーネント標準

---

## Vue コード生成

### Vue 出力（SFC）

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
        AI が絶対に間違えない UI 宣言言語
      </p>
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold mb-4">
          特徴
        </h2>
        <ul class="list-disc pl-6 space-y-2">
          <li>決定的文法</li>
          <li>明確な構造</li>
          <li>プラットフォーム非依存</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
\`\`\`

### 特徴

- ✅ Vue 3 Composition API
- ✅ \`<script setup>\` 形式
- ✅ TypeScript サポート
- ✅ Scoped CSS

---

## Svelte コード生成

### Svelte 出力

\`\`\`svelte
<div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">
      UIH DSL Playground
    </h1>
    <p class="text-lg text-gray-600 mb-8">
      AI が絶対に間違えない UI 宣言言語
    </p>
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold mb-4">
        特徴
      </h2>
      <ul class="list-disc pl-6 space-y-2">
        <li>決定的文法</li>
        <li>明確な構造</li>
        <li>プラットフォーム非依存</li>
      </ul>
    </div>
  </div>
</div>

<style>
</style>
\`\`\`

### 特徴

- ✅ Svelte 4/5 互換
- ✅ 簡潔な文法
- ✅ リアクティビティ自動
- ✅ コンパイル最適化

---

## CSS 変数処理

### UIH Style Block

\`\`\`uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
  spacing.sm: "4px"
  spacing.md: "8px"
}
\`\`\`

### 生成される CSS

\`\`\`css
:root {
  --color-primary: #0E5EF7;
  --color-secondary: #8B5CF6;
  --spacing-sm: 4px;
  --spacing-md: 8px;
}
\`\`\`

すべてのフレームワークで **同一の CSS 変数** を使用します。

---

## 比較表

| 特性 | React | Vue | Svelte |
|------|-------|-----|--------|
| コンポーネント形式 | JSX | SFC | Svelte |
| スタイルスコープ | 外部 CSS | Scoped | Scoped |
| リアクティビティ | useState | ref/reactive | 自動 |
| TypeScript | 標準サポート | 標準サポート | 標準サポート |
| ファイルサイズ | 中 | 中 | 小 |

---

## Playground で直接体験

1. [Playground](/) に移動
2. 左パネルに UIH コードを記述
3. 上部で **React / Vue / Svelte** を選択
4. 右パネルで生成されたコードを確認
5. 下部で **リアルタイムプレビュー** を確認

**今すぐ試してみましょう！** → [Playground を開く](/)`,
  },
};
