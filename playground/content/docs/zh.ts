export const docs = {
  philosophy: {
    title: "哲学",
    content: `# UIH DSL 哲学

> **Universal Interface Hierarchy Domain Specific Language**
> AI 绝不会出错的 UI 声明语言

---

## 核心概念

UIH DSL 是一种以**确定性(Determinism)**和**清晰性(Clarity)**为优先设计的领域特定语言。它消除了 LLM(大型语言模型)生成 UI 结构时可能出现的所有歧义，确保始终准确和可预测的结果。

---

## 为什么选择 UIH DSL？

### 现有语言的问题

通用编程语言(JavaScript、TypeScript等)具有较高的表达自由度。虽然这对人类开发者是优点，但对 AI 来说会导致以下问题：

| 问题 | 说明 | 示例 |
|------|------|------|
| **语法歧义** | 同一含义可以用多种方式表达 | \`var\`, \`let\`, \`const\` |
| **引号混用** | 单引号和双引号混合使用 | \`'text'\` vs \`"text"\` |
| **可选语法** | 分号、括号可以省略 | \`return x\` vs \`return (x)\` |
| **注释误识别** | 可能将注释解释为代码 | \`// TODO: implement\` |

### UIH DSL 的解决方案

UIH DSL 遵循**单一正确答案(Single Source of Truth)**原则：

\`\`\`uih
meta {
  title: "清晰的结构"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
}

layout {
  Div(class:"container") {
    H1 { "只有一种方法" }
    P { "没有歧义的清晰声明" }
  }
}
\`\`\`

---

## 设计原则

### 1. 确定性 (Determinism)

**"没有选择"**

- ✅ 语法**只有一种**
- ✅ 相同输入**始终产生相同输出**
- ❌ 没有替代语法
- ❌ 没有语法糖(Syntactic Sugar)

\`\`\`uih
layout {
  Div {
    H1 { "标题" }
  }
}
\`\`\`

### 2. 明确性 (Explicitness)

**"一行一个含义"**

- ✅ 所有声明都是**明确的**
- ✅ 没有隐式转换
- ✅ **明确的结构**而非类型推断

\`\`\`uih
layout {
  Header {
    Nav {
      A(href:"/") { "首页" }
      A(href:"/about") { "关于" }
    }
  }
  Main {
    Article {
      H1 { "标题" }
      P { "正文" }
    }
  }
}
\`\`\`

### 3. 固定结构 (Fixed Structure)

**"顺序是绝对的"**

块**必须按此顺序**编写：

\`\`\`uih
meta {
  title: "页面标题"
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
    Button { "点击" }
  }
}

script {
  onClick: "handleClick"
}
\`\`\`

### 4. 有限字符集 (Limited Character Set)

**"只能使用允许的"**

#### ✅ 允许的字符
- 小写字母：\`a-z\`
- 数字：\`0-9\`
- 连接符：\`-\`(连字符)、\`_\`(下划线)
- 结构：\`{\` \`}\`(大括号)、\`:\`(冒号)
- 字符串：\`"\`(仅双引号)
- 空白：空格、换行(LF)

#### ❌ 禁止的字符
- \`'\` 单引号
- \`;\` 分号
- \`()\` 括号(属性声明除外)
- \\\` 反引号
- \`\\t\` 制表符
- \`\\r\\n\` CRLF
- \`//\` \`/* */\` 注释

---

## 哲学目标

### 1. Zero Hallucination

AI 无法创造不存在的语法。

\`\`\`uih
layout {
  Div { "内容" }
}
\`\`\`

### 2. Platform Agnostic

一份 UIH 代码可以转换为多个框架。

\`\`\`
UIH DSL
   ↓
   ├─→ React (JSX)
   ├─→ Vue (SFC)
   └─→ Svelte
\`\`\`

### 3. Minimal Cognitive Load

规则少且清晰，几乎没有学习曲线。

**全部语法规则**: 5个
**例外情况**: 0个
**学习时间**: 10分钟内

---

## 对比：JavaScript vs UIH DSL

| 特性 | JavaScript/JSX | UIH DSL |
|------|----------------|---------|
| 引号 | \`'\` \`"\` \\\` 都可 | 仅 \`"\` |
| 分号 | 可选 | 无 |
| 缩进 | 自由(2/4格、制表符) | 固定2格空格 |
| 块顺序 | 自由 | 固定(meta→style→layout) |
| 注释 | \`//\` \`/* */\` | 不可 |
| 语法变体 | 数十种 | 1种 |

---

## 结论

UIH DSL 是**AI 时代的 UI 声明语言**。

它为**AI 生成 UI 的时代**而设计，实现零歧义、零错误、100%可预测性。`,
  },
  foundation: {
    title: "基本语法",
    content: `# UIH DSL 基本语法

> 只需了解 5 条规则即可。

---

## 1. 缩进 (Indentation)

### 规则：精确的 2 个空格

UIH DSL 的**缩进规则非常严格**。为了让解析器准确识别结构，必须使用一致的缩进。

\`\`\`uih
layout {
  Div {
    Header {
      H1 { "标题" }
    }
  }
}
\`\`\`

| 允许 | 禁止 | 原因 |
|------|------|------|
| 2格空格 | 制表符(\\t) | 解析器无法识别制表符 |
| 2格空格 | 4格空格 | 违反规则 |
| 2格空格 | 混用 | 破坏一致性 |

---

## 2. 块顺序 (Block Order)

### 规则：顺序绝对不可变

块**必须按以下顺序**编写。顺序错误会导致解析错误。

\`\`\`uih
meta {
  title: "顺序 1：元信息"
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
    Button { "点击" }
  }
}

script {
  onClick: "handleClick"
}
\`\`\`

### 块详细说明

| 顺序 | 块 | 必需 | 目的 | 示例 |
|------|------|------|------|------|
| **1** | \`meta\` | ✅ 必需 | 页面元数据 | 标题、路径、描述 |
| **2** | \`style\` | ✅ 必需 | CSS 变量定义 | 颜色、间距、字体 |
| **3** | \`components\` | ⚪ 可选 | 组件设置 | 按钮变体、卡片类型 |
| **4** | \`layout\` | ✅ 必需 | UI 树结构 | 实际页面布局 |
| **5** | \`script\` | ⚪ 可选 | 事件处理程序 | 点击、提交等 |

---

## 3. 字符限制 (Character Set)

### 规则：仅使用允许的字符

UIH DSL 仅允许**有限的字符集**。这是为了降低解析器复杂度并防止错误。

#### ✅ 允许的字符

| 分类 | 字符 | 用途 |
|------|------|------|
| 小写字母 | \`a-z\` | 标识符、关键字 |
| 数字 | \`0-9\` | 标识符的一部分(非首字符) |
| 连字符 | \`-\` | 标识符连接(\`font-size\`) |
| 下划线 | \`_\` | 标识符连接(\`my_var\`) |
| 大括号 | \`{\` \`}\` | 块分隔 |
| 冒号 | \`:\` | 属性分隔 |
| 逗号 | \`,\` | 属性列举 |
| 双引号 | \`"\` | 字符串字面量 |
| 括号 | \`(\` \`)\` | 仅用于属性声明 |
| 空白 | 空格、LF | 结构分隔 |

#### ❌ 禁止的字符

| 字符 | 原因 |
|------|------|
| \`'\`(单引号) | 统一字符串表示 |
| \`;\`(分号) | 不必要的语法 |
| \\\`(反引号) | 防止模板字面量 |
| \`\\t\`(制表符) | 缩进一致性 |
| \`\\r\\n\`(CRLF) | 统一换行(仅LF) |
| \`//\` \`/**/\` | 禁止注释 |

---

## 4. 命名约定 (Naming Convention)

### 规则：小写 + 点表示法

标识符**以小写字母开头**，层次结构使用**点表示法**。

\`\`\`uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
  spacing.sm: "4px"
  spacing.md: "8px"
  font.body: "Inter, sans-serif"
}
\`\`\`

**编译结果(CSS 变量):**
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

## 5. 禁止注释 (No Comments)

### 规则：不能写注释

UIH DSL **不支持注释**。这是有意为之的设计。

#### 禁止注释的原因

1. **防止 AI 混淆**：消除将注释误识为代码的风险
2. **清晰性**：代码本身应该足够清晰，无需注释
3. **一致性**：避免注释风格争议

**替代方案**：文档应在单独的文件中编写。

---

## 完整示例

\`\`\`uih
meta {
  title: "UIH DSL 完整指南"
  route: "/guide"
  description: "包含所有基本语法的示例"
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
        "UIH DSL 指南"
      }
    }
    Main(class:"max-w-4xl mx-auto p-8") {
      Section {
        H2(class:"text-2xl font-semibold mb-4") {
          "基本语法"
        }
        P(class:"text-gray-600") {
          "只需了解 5 条规则，就能完美使用 UIH DSL。"
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

此代码将自动转换为**React、Vue、Svelte**！`,
  },
  syntax: {
    title: "组件",
    content: `# 组件参考

> UIH DSL 支持的所有 HTML 组件及用法

---

## 组件分类

UIH DSL 基于**语义化 HTML5**提供组件。所有组件都会转换为 HTML 标签。

| 分类 | 组件数 | 用途 |
|------|--------|------|
| 布局 | 8个 | 页面结构 |
| 文本 | 8个 | 文本显示 |
| 表单 | 6个 | 用户输入 |
| 列表 | 3个 | 列表显示 |
| 媒体 | 3个 | 图片、视频 |
| 其他 | 3个 | 链接、卡片等 |

---

## 1. 布局组件

定义页面的**结构元素**。

### 基本结构

\`\`\`uih
layout {
  Div(class:"container") {
    Header(class:"bg-white shadow") {
      Nav { "导航" }
    }
    Main(class:"py-8") {
      Section {
        Article { "正文内容" }
      }
    }
    Aside(class:"sidebar") {
      "侧边栏"
    }
    Footer(class:"bg-gray-100") {
      "页脚"
    }
  }
}
\`\`\`

### 组件列表

| 组件 | HTML | 用途 | 示例 |
|------|------|------|------|
| \`Div\` | \`<div>\` | 通用容器 | 布局盒子 |
| \`Section\` | \`<section>\` | 语义化分区 | 内容区块 |
| \`Article\` | \`<article>\` | 独立内容 | 博客文章 |
| \`Header\` | \`<header>\` | 头部区域 | 页面顶部 |
| \`Footer\` | \`<footer>\` | 页脚区域 | 页面底部 |
| \`Nav\` | \`<nav>\` | 导航 | 菜单 |
| \`Main\` | \`<main>\` | 主要内容 | 正文区域 |
| \`Aside\` | \`<aside>\` | 附加内容 | 侧边栏 |

---

## 2. 文本组件

**显示**和**强调**文本。

### 标题层次

\`\`\`uih
layout {
  Article {
    H1(class:"text-4xl font-bold") { "主标题" }
    H2(class:"text-3xl font-semibold") { "副标题" }
    H3(class:"text-2xl") { "章节标题" }
    P(class:"text-base text-gray-700") {
      "正文文本。"
    }
  }
}
\`\`\`

### 组件列表

| 组件 | HTML | 用途 | 重要性 |
|------|------|------|--------|
| \`H1\` | \`<h1>\` | 最高级标题 | ⭐⭐⭐⭐⭐ |
| \`H2\` | \`<h2>\` | 二级标题 | ⭐⭐⭐⭐ |
| \`H3\` | \`<h3>\` | 三级标题 | ⭐⭐⭐ |
| \`H4\` | \`<h4>\` | 四级标题 | ⭐⭐ |
| \`H5\` | \`<h5>\` | 五级标题 | ⭐ |
| \`H6\` | \`<h6>\` | 六级标题 | ⭐ |
| \`P\` | \`<p>\` | 段落 | 正文 |
| \`Span\` | \`<span>\` | 行内文本 | 强调 |

---

## 3. 表单组件

接收用户**输入**。

### 表单示例

\`\`\`uih
layout {
  Form(class:"max-w-md mx-auto") {
    Div(class:"mb-4") {
      Label(class:"block mb-2") { "姓名" }
      Input(
        type:"text",
        placeholder:"张三",
        class:"w-full border px-3 py-2"
      )
    }
    Div(class:"mb-4") {
      Label(class:"block mb-2") { "留言" }
      Textarea(
        placeholder:"请输入内容",
        class:"w-full border px-3 py-2"
      )
    }
    Div(class:"mb-4") {
      Label(class:"block mb-2") { "国家" }
      Select(class:"w-full border px-3 py-2") {
        Option { "中国" }
        Option { "美国" }
        Option { "日本" }
      }
    }
    Button(type:"submit", class:"bg-blue-600 text-white px-4 py-2") {
      "提交"
    }
  }
}
\`\`\`

### 组件列表

| 组件 | HTML | 必需属性 | 说明 |
|------|------|----------|------|
| \`Form\` | \`<form>\` | - | 表单容器 |
| \`Input\` | \`<input>\` | \`type\` | 输入字段 |
| \`Textarea\` | \`<textarea>\` | - | 多行输入 |
| \`Button\` | \`<button>\` | - | 按钮 |
| \`Label\` | \`<label>\` | - | 标签 |
| \`Select\` | \`<select>\` | - | 选择框 |

---

## 4. 列表组件

**列举**项目。

\`\`\`uih
layout {
  Div {
    Ul(class:"list-disc pl-6") {
      Li { "第一项" }
      Li { "第二项" }
      Li { "第三项" }
    }
    Ol(class:"list-decimal pl-6 mt-4") {
      Li { "步骤 1" }
      Li { "步骤 2" }
      Li { "步骤 3" }
    }
  }
}
\`\`\`

| 组件 | HTML | 列表类型 |
|------|------|----------|
| \`Ul\` | \`<ul>\` | 无序(•) |
| \`Ol\` | \`<ol>\` | 有序(1,2,3) |
| \`Li\` | \`<li>\` | 列表项 |

---

## 5. 媒体组件

**插入**图片、视频。

\`\`\`uih
layout {
  Div(class:"grid grid-cols-2 gap-4") {
    Img(
      src:"/logo.png",
      alt:"Logo",
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

| 组件 | HTML | 必需属性 |
|------|------|----------|
| \`Img\` | \`<img>\` | \`src\`, \`alt\` |
| \`Video\` | \`<video>\` | \`src\` |
| \`Audio\` | \`<audio>\` | \`src\` |

---

## 属性(Attributes)用法

### 基本语法

\`\`\`uih
Component(属性:值, 属性:值) {
  "内容"
}
\`\`\`

### 主要属性

| 属性 | 用途 | 示例 |
|------|------|------|
| \`class\` | CSS 类 | \`class:"text-xl font-bold"\` |
| \`href\` | 链接 URL | \`href:"/about"\` |
| \`src\` | 图片/媒体路径 | \`src:"/logo.png"\` |
| \`alt\` | 替代文本 | \`alt:"Logo图片"\` |
| \`type\` | 输入类型 | \`type:"text"\` |
| \`placeholder\` | 占位符 | \`placeholder:"请输入"\` |

### 实际示例

\`\`\`uih
A(
  href:"https://example.com",
  class:"text-blue-600 hover:underline",
  target:"_blank"
) {
  "外部链接"
}
\`\`\`

---

## 完整页面示例

\`\`\`uih
meta {
  title: "博客"
  route: "/blog"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div(class:"min-h-screen bg-gray-50") {
    Header(class:"bg-white shadow") {
      Nav(class:"container mx-auto px-4 py-4 flex gap-4") {
        A(href:"/", class:"text-blue-600") { "首页" }
        A(href:"/blog", class:"text-blue-600") { "博客" }
        A(href:"/about", class:"text-blue-600") { "关于" }
      }
    }
    Main(class:"container mx-auto px-4 py-8") {
      Article(class:"bg-white rounded-lg shadow p-6") {
        H1(class:"text-3xl font-bold mb-4") {
          "UIH DSL 介绍"
        }
        P(class:"text-gray-700 mb-4") {
          "AI 绝不会出错的 UI 声明语言。"
        }
        Ul(class:"list-disc pl-6 mb-4") {
          Li { "确保确定性" }
          Li { "清晰的语法" }
          Li { "平台无关" }
        }
        Button(class:"bg-blue-600 text-white px-4 py-2 rounded") {
          "了解更多"
        }
      }
    }
  }
}
\`\`\``,
  },
  codegen: {
    title: "代码转换",
    content: `# 代码生成(Codegen)

> UIH DSL → React、Vue、Svelte 自动转换

---

## 支持的框架

| 框架 | 版本 | 输出格式 | 状态 |
|------|------|----------|------|
| **React** | 19+ | JSX / TSX | ✅ 完全支持 |
| **Vue** | 3+ | SFC(单文件组件) | ✅ 完全支持 |
| **Svelte** | 4/5 | Svelte 文件 | ✅ 完全支持 |

---

## 转换流程

UIH DSL 代码转换为可执行框架代码的过程：

\`\`\`
UIH Source Code
      ↓
   Tokenizer (词法分析)
      ↓
   Parser (语法分析)
      ↓
     AST (抽象语法树)
      ↓
   IR Generator (中间表示)
      ↓
    Codegen (代码生成)
      ↓
  ┌──────┬──────┬──────┐
  ↓      ↓      ↓      ↓
React   Vue  Svelte  ...
\`\`\`

---

## React 代码生成

### UIH 输入

\`\`\`uih
meta {
  title: "React 示例"
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
        "AI 绝不会出错的 UI 声明语言"
      }
      Div(class:"bg-white p-6 rounded-lg shadow-lg") {
        H2(class:"text-2xl font-semibold mb-4") {
          "特点"
        }
        Ul(class:"list-disc pl-6 space-y-2") {
          Li { "确定性语法" }
          Li { "清晰的结构" }
          Li { "平台无关" }
        }
      }
    }
  }
}
\`\`\`

### React 输出(TSX)

\`\`\`tsx
export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          UIH DSL Playground
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          AI 绝不会出错的 UI 声明语言
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            特点
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>确定性语法</li>
            <li>清晰的结构</li>
            <li>平台无关</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
\`\`\`

### 特点

- ✅ 兼容 Next.js 15+ App Router
- ✅ \`class\` → \`className\` 自动转换
- ✅ 支持 TypeScript
- ✅ 默认服务器组件

---

## Vue 代码生成

### Vue 输出(SFC)

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
        AI 绝不会出错的 UI 声明语言
      </p>
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold mb-4">
          特点
        </h2>
        <ul class="list-disc pl-6 space-y-2">
          <li>确定性语法</li>
          <li>清晰的结构</li>
          <li>平台无关</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
\`\`\`

### 特点

- ✅ Vue 3 Composition API
- ✅ \`<script setup>\` 格式
- ✅ 支持 TypeScript
- ✅ Scoped CSS

---

## Svelte 代码生成

### Svelte 输出

\`\`\`svelte
<div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">
      UIH DSL Playground
    </h1>
    <p class="text-lg text-gray-600 mb-8">
      AI 绝不会出错的 UI 声明语言
    </p>
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold mb-4">
        特点
      </h2>
      <ul class="list-disc pl-6 space-y-2">
        <li>确定性语法</li>
        <li>清晰的结构</li>
        <li>平台无关</li>
      </ul>
    </div>
  </div>
</div>

<style>
</style>
\`\`\`

### 特点

- ✅ 兼容 Svelte 4/5
- ✅ 简洁的语法
- ✅ 自动响应性
- ✅ 编译优化

---

## CSS 变量处理

### UIH Style Block

\`\`\`uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
  spacing.sm: "4px"
  spacing.md: "8px"
}
\`\`\`

### 生成的 CSS

\`\`\`css
:root {
  --color-primary: #0E5EF7;
  --color-secondary: #8B5CF6;
  --spacing-sm: 4px;
  --spacing-md: 8px;
}
\`\`\`

所有框架都使用**相同的 CSS 变量**。

---

## 对比表

| 特性 | React | Vue | Svelte |
|------|-------|-----|--------|
| 组件格式 | JSX | SFC | Svelte |
| 样式作用域 | 外部 CSS | Scoped | Scoped |
| 响应性 | useState | ref/reactive | 自动 |
| TypeScript | 默认支持 | 默认支持 | 默认支持 |
| 文件大小 | 中等 | 中等 | 小 |

---

## 在 Playground 中直接体验

1. 前往[Playground](/)
2. 在左侧面板编写 UIH 代码
3. 顶部选择 **React / Vue / Svelte**
4. 在右侧面板查看生成的代码
5. 底部查看**实时预览**

**立即尝试！** → [打开 Playground](/)`,
  },
};
