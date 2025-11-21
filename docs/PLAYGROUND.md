# UIH DSL Playground

Interactive online playground for experimenting with UIH DSL.

## Quick Links

- **Playground URL**: [https://uih.thebespoke.team](https://uih.thebespoke.team)
- **GitHub**: [github.com/yourusername/uih-v2](https://github.com/yourusername/uih-v2)

## Features

### Live Editor

- **Syntax Highlighting** - UIH DSL syntax highlighting
- **Auto-completion** - Smart suggestions for components and properties
- **Error Detection** - Real-time syntax error highlighting
- **Format on Save** - Automatic code formatting

### Live Preview

- **Framework Selection** - Switch between React, Vue, and Svelte
- **Hot Reload** - Instant preview updates
- **Responsive View** - Mobile, tablet, and desktop previews
- **Dark Mode** - Toggle between light and dark themes

### Code Generation

- **View Generated Code** - See the compiled output
- **Copy to Clipboard** - One-click code copying
- **Download** - Save generated files
- **Share** - Generate shareable links

## Getting Started

### 1. Open the Playground

Visit [uih.thebespoke.team](https://uih.thebespoke.team)

### 2. Try the Examples

Click on any example in the sidebar:
- Hello World
- Button Component
- Login Form
- Dashboard
- User Profile

### 3. Edit and Experiment

Modify the UIH code in the left panel:

```uih
meta {
  title: "My Component"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Container {
    H1 {
      color: "color.primary"
      "Hello, Playground!"
    }
  }
}
```

### 4. See Results

The right panel shows:
- Live preview
- Generated code (React/Vue/Svelte)
- Any errors or warnings

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + S` | Format code |
| `Cmd/Ctrl + Enter` | Compile and preview |
| `Cmd/Ctrl + /` | Toggle comment |
| `Cmd/Ctrl + D` | Duplicate line |
| `Cmd/Ctrl + K` | Clear editor |

## URL Parameters

You can share playground links with specific configurations:

```
https://playground.uih-dsl.dev?
  example=hello-world      # Load specific example
  &target=react           # Set default framework
  &theme=dark             # Set theme
```

### Examples

**Load hello-world example with React:**
```
https://playground.uih-dsl.dev?example=hello-world&target=react
```

**Load custom code from URL:**
```
https://playground.uih-dsl.dev?code=<base64-encoded-uih>
```

## Sharing Your Code

### 1. Click "Share" Button

Located in the top-right corner.

### 2. Get Share Link

The playground generates a unique URL like:
```
https://playground.uih-dsl.dev/share/abc123def456
```

### 3. Share

Send the link to anyone - they'll see your exact code and preview.

## Embedding

Embed the playground in your documentation or blog:

```html
<iframe
  src="https://playground.uih-dsl.dev/embed?example=hello-world"
  width="100%"
  height="600px"
  frameborder="0"
></iframe>
```

### Embed Options

```
?example=hello-world     # Load specific example
&target=react           # Default framework
&hideEditor=true        # Show only preview
&hidePreview=true       # Show only code
&theme=dark             # Dark theme
&readonly=true          # Disable editing
```

## API

The playground provides a JavaScript API for integration:

```javascript
const playground = new UIHPlayground('#container', {
  code: 'meta { title: "Example" }',
  target: 'react',
  theme: 'dark',
  onCompile: (result) => {
    console.log('Compiled:', result.code);
  },
  onError: (error) => {
    console.error('Error:', error);
  }
});

// Update code
playground.setCode('layout { Container { "Hello" } }');

// Change target framework
playground.setTarget('vue');

// Get generated code
const generated = playground.getGeneratedCode();
```

## Local Development

Want to run the playground locally?

```bash
# Clone repository
git clone https://github.com/yourusername/uih-v2.git
cd uih-v2/playground

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser
open http://localhost:3000
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Privacy

- No data is stored on our servers
- Share links are stored temporarily (30 days)
- No tracking or analytics

## Feedback

Found a bug or have a suggestion?

- [Report Issue](https://github.com/yourusername/uih-v2/issues)
- [Discussion Forum](https://github.com/yourusername/uih-v2/discussions)

## Tips & Tricks

### Quick Start Templates

Use the template dropdown to start with common patterns:
- Empty Component
- Form Layout
- Card Grid
- Navigation
- Hero Section

### Design Tokens

Define reusable values in the `style` block:

```uih
style {
  color.primary: "#0E5EF7"
  color.secondary: "#6B7280"
  spacing.sm: "8px"
  spacing.md: "16px"
  spacing.lg: "24px"
}
```

Then reference them in `layout`:

```uih
layout {
  Container {
    padding: "spacing.lg"
    H1 {
      color: "color.primary"
      "Title"
    }
  }
}
```

### Component Variants

Configure component behavior in the `components` block:

```uih
components {
  Button {
    variant: "primary"
    size: "medium"
  }
}
```

### Nested Layouts

Create complex hierarchies:

```uih
layout {
  Container {
    Header {
      Nav {
        "Navigation"
      }
    }
    Main {
      Sidebar {
        "Sidebar"
      }
      Content {
        "Main Content"
      }
    }
    Footer {
      "Footer"
    }
  }
}
```

## Coming Soon

- [ ] Real-time collaboration
- [ ] Version history
- [ ] Component library browser
- [ ] Export to CodeSandbox/StackBlitz
- [ ] Import from Figma
- [ ] AI-powered suggestions

## License

The playground is open source under MIT license.
