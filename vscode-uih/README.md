# UIH Language Support for Visual Studio Code

Official Visual Studio Code extension for **UIH DSL v2** - the LLM-friendly UI language designed for zero ambiguity and deterministic code generation.

## 🚨 v2.0 Breaking Changes

**UIH DSL v2 is a complete rewrite** with breaking syntax changes. If you're upgrading from v1.x:
- ❌ Comments are no longer supported
- ❌ Semicolons are forbidden
- ❌ Only double quotes allowed (no single quotes)
- ✅ New block structure: `meta`, `style`, `components`, `layout`, `script`

See [CHANGELOG.md](CHANGELOG.md) for full migration guide.

## Features

### 🎨 Syntax Highlighting
- Full syntax highlighting for `.uih` files
- Color-coded blocks: `meta`, `style`, `components`, `layout`, `script`
- Component and property highlighting
- Strict v2 grammar enforcement

### ✨ IntelliSense
- **Code Snippets**: Quick templates for all block types
- **Auto-completion**: Component names and patterns
- **Bracket Matching**: Automatic closing of brackets and quotes

### 🚀 Live UI Preview
- **Real-time rendering**: See your UI instantly with Tailwind CSS
- **Interactive preview**: Full viewport with responsive design
- **CSS Variables**: Style tokens → custom properties
- **All elements supported**: Div, H1-H6, Button, Input, and 25+ more

### 🔧 Framework Compilation
- **One-click compile** to React, Vue, or Svelte
- **Full pipeline**: tokenizer → parser → IR → codegen
- **Type-safe output**: Generated code with TypeScript support

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Press `Ctrl+P` / `Cmd+P`
3. Type: `ext install LeeJaeWon.vscode-uih`
4. Press Enter

### From VSIX File
1. Download `.vsix` from [releases](https://github.com/LeeJaeBae/uih/releases)
2. Open VS Code Extensions view (`Ctrl+Shift+X`)
3. Click `...` → `Install from VSIX...`
4. Select the downloaded file

## Quick Start

### Create a UIH File

Create `hello.uih`:

```uih
meta {
  title: "Hello World"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div(class:"p-8 bg-gradient-to-r from-blue-600 to-purple-600") {
    H1(class:"text-4xl font-bold text-white") {
      "Hello UIH v2"
    }
    Button(class:"mt-4 px-6 py-3 bg-white text-blue-600 rounded-lg") {
      "Get Started"
    }
  }
}
```

### Live Preview

1. Right-click in editor → **"UIH: Preview UI"**
2. Or press `Cmd/Ctrl+Shift+P` → **"UIH: Preview UI"**
3. See live rendered UI with Tailwind CSS!

### Compile to Framework

1. Right-click → **"UIH: Compile to Framework"**
2. Choose: React, Vue, or Svelte
3. Get production-ready code instantly

## UIH DSL v2 Syntax

### Block Structure

```uih
meta {
  title: "value"
  route: "value"
}

style {
  color.primary: "#hex"
  font.size: "16px"
}

components {
  Button
  Card
  Input
}

layout {
  Div(class:"styles") {
    H1(class:"styles") { "Text" }
    Button(class:"styles") { "Click" }
  }
}

script {
  // Future: event handlers
}
```

### Rules

✅ **Allowed**
- Lowercase identifiers: `a-z`, `0-9`, `_`, `.`
- Double quotes only: `"text"`
- 2 spaces for indentation
- Characters: `a-z`, `0-9`, `-`, `_`, ` `, `\n`, `{`, `}`, `:`, `"`

❌ **Forbidden**
- Comments: `//`, `#`, `/* */`
- Semicolons: `;`
- Single quotes: `'`
- Parentheses (except in layout attributes)
- Tabs, CRLF

### Available Snippets

Type these prefixes and press `Tab`:

| Prefix | Description |
|--------|-------------|
| `uih` | Complete UIH file template |
| `meta` | Meta block |
| `style` | Style block |
| `components` | Components block |
| `layout` | Layout block |
| `script` | Script block |
| `div` | Div component |
| `button` | Button component |
| `h1`, `h2` | Heading components |
| `p` | Paragraph component |
| `input` | Input component |

## Examples

### Pricing Page

```uih
meta {
  title: "Pricing"
  route: "/pricing"
}

style {
  color.primary: "#0E5EF7"
  color.accent: "#FF6B6B"
}

layout {
  Div(class:"container mx-auto p-8") {
    H1(class:"text-5xl font-bold text-center mb-12") {
      "Simple Pricing"
    }
    Div(class:"grid grid-cols-3 gap-8") {
      Card(class:"p-6 rounded-xl border") {
        H2(class:"text-2xl font-semibold") { "Starter" }
        P(class:"text-4xl font-bold mt-4") { "$9" }
        Button(class:"mt-6 w-full py-3 bg-blue-500 text-white rounded") {
          "Get Started"
        }
      }
    }
  }
}
```

### Login Form

```uih
meta {
  title: "Login"
  route: "/login"
}

layout {
  Div(class:"min-h-screen flex items-center justify-center bg-gray-100") {
    Div(class:"bg-white p-8 rounded-lg shadow-lg w-96") {
      H1(class:"text-2xl font-bold mb-6") { "Welcome Back" }
      Form(class:"space-y-4") {
        Input(placeholder:"Email", class:"w-full px-4 py-2 border rounded")
        Input(placeholder:"Password", class:"w-full px-4 py-2 border rounded")
        Button(class:"w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700") {
          "Sign In"
        }
      }
    }
  }
}
```

## Configuration

Access via VS Code Settings → Search "UIH":

```json
{
  "uih.targetFramework": "react",
  "uih.autoPreview": false
}
```

## Commands

| Command | Shortcut |
|---------|----------|
| UIH: Preview UI | `Cmd/Ctrl+Shift+P` → "UIH: Preview UI" |
| UIH: Compile to Framework | `Cmd/Ctrl+Shift+P` → "UIH: Compile" |

## Resources

- [UIH DSL v2 Specification](https://github.com/LeeJaeBae/uih/blob/main/docs/uih-dsl-foundation.md)
- [GitHub Repository](https://github.com/LeeJaeBae/uih)
- [Issue Tracker](https://github.com/LeeJaeBae/uih/issues)
- [Examples](https://github.com/LeeJaeBae/uih/tree/main/examples)

## Contributing

Found a bug or have a feature request? [File an issue](https://github.com/LeeJaeBae/uih/issues)

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

### 2.0.0 - UIH DSL v2 Rewrite

🚨 **Breaking Changes**
- Complete syntax redesign for LLM-friendliness
- New compiler pipeline: tokenizer → parser → IR → codegen
- Removed: comments, semicolons, single quotes, old block types
- Added: strict grammar, new block structure, enhanced preview

See full migration guide in [CHANGELOG.md](CHANGELOG.md)

## License

MIT © LeeJaeWon

---

**Made with ❤️ for LLM-powered UI development**
