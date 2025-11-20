# @uih-dsl/cli

Command-line interface for UIH DSL compiler.

[![npm version](https://img.shields.io/npm/v/@uih-dsl/cli.svg)](https://www.npmjs.com/package/@uih-dsl/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Installation

### Global Installation

```bash
npm install -g @uih-dsl/cli
```

### Project Installation

```bash
npm install --save-dev @uih-dsl/cli
```

### Usage with npx

```bash
npx @uih-dsl/cli compile your-file.uih
```

## Usage

### Basic Commands

#### Compile

Compile a UIH file to target framework:

```bash
uih compile <input> [options]
```

**Examples:**

```bash
# Compile to React
uih compile hello.uih --target react --output ./src/components/Hello.tsx

# Compile to Vue
uih compile hello.uih --target vue --output ./src/components/Hello.vue

# Compile to Svelte
uih compile hello.uih --target svelte --output ./src/components/Hello.svelte

# Watch mode
uih compile hello.uih --target react --output ./src/components/Hello.tsx --watch

# Output JavaScript instead of TypeScript
uih compile hello.uih --target react --output ./src/components/Hello.jsx --format javascript
```

#### Init

Initialize a new UIH project:

```bash
uih init [project-name]
```

This creates:
- Project directory structure
- Sample UIH files
- Configuration file
- Package.json with required dependencies

#### Validate

Validate UIH syntax without compiling:

```bash
uih validate <input>
```

**Example:**

```bash
uih validate hello.uih
```

#### Watch

Watch files for changes and recompile:

```bash
uih watch <input> [options]
```

**Example:**

```bash
uih watch ./src/**/*.uih --target react --output ./src/components/
```

## Options

### Global Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--help` | `-h` | Show help | - |
| `--version` | `-v` | Show version number | - |
| `--verbose` | - | Enable verbose logging | `false` |
| `--silent` | - | Suppress all output | `false` |

### Compile Options

| Option | Alias | Description | Default | Required |
|--------|-------|-------------|---------|----------|
| `--target` | `-t` | Target framework (react\|vue\|svelte) | - | ✅ |
| `--output` | `-o` | Output file path | - | ✅ |
| `--format` | `-f` | Output format (typescript\|javascript) | `typescript` | ❌ |
| `--watch` | `-w` | Watch for file changes | `false` | ❌ |
| `--sourcemap` | - | Generate source maps | `false` | ❌ |
| `--minify` | - | Minify output | `false` | ❌ |
| `--config` | `-c` | Path to config file | `uih.config.js` | ❌ |

### Init Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--template` | `-t` | Project template (react\|vue\|svelte) | `react` |
| `--typescript` | - | Use TypeScript | `true` |
| `--package-manager` | `-pm` | Package manager (npm\|pnpm\|yarn) | `npm` |

## Configuration File

Create `uih.config.js` in your project root:

```javascript
module.exports = {
  // Default target framework
  target: 'react',

  // Default output directory
  outputDir: './src/components',

  // Output format
  format: 'typescript',

  // Generate source maps
  sourcemap: true,

  // Compiler options
  compiler: {
    // Validate syntax strictly
    strict: true,

    // Custom component mappings
    componentMappings: {
      'CustomButton': '@/components/Button'
    }
  },

  // Runtime options
  runtime: {
    // Import runtime from custom path
    importPath: '@uih-dsl/runtime-react'
  }
};
```

## Examples

### Single File Compilation

```bash
uih compile src/pages/home.uih \
  --target react \
  --output src/components/Home.tsx
```

### Batch Compilation

```bash
# Using glob patterns
uih compile "src/**/*.uih" \
  --target react \
  --output src/components/
```

### Watch Mode Development

```bash
uih watch src/app.uih \
  --target react \
  --output src/App.tsx \
  --verbose
```

### CI/CD Integration

```bash
# Validate all UIH files
uih validate "src/**/*.uih"

# Compile for production
uih compile src/app.uih \
  --target react \
  --output dist/App.tsx \
  --minify \
  --silent
```

### Custom Configuration

```bash
uih compile src/app.uih \
  --config ./custom-uih.config.js \
  --target react \
  --output src/App.tsx
```

## Package.json Integration

Add scripts to your `package.json`:

```json
{
  "scripts": {
    "uih:build": "uih compile src/**/*.uih --target react --output src/components/",
    "uih:watch": "uih watch src/**/*.uih --target react --output src/components/",
    "uih:validate": "uih validate src/**/*.uih"
  }
}
```

Then run:

```bash
npm run uih:build
npm run uih:watch
npm run uih:validate
```

## Programmatic API

You can also use the CLI programmatically:

```typescript
import { compile, validate } from '@uih-dsl/cli';

// Compile
const result = await compile({
  input: 'hello.uih',
  target: 'react',
  output: 'Hello.tsx',
  format: 'typescript'
});

console.log(result.code); // Generated code
console.log(result.map);  // Source map (if enabled)

// Validate
const validation = await validate({
  input: 'hello.uih'
});

if (validation.errors.length > 0) {
  console.error('Validation errors:', validation.errors);
}
```

## Error Handling

The CLI provides detailed error messages with line and column information:

```
Error: Unexpected token at line 5, column 3

  3 | style {
  4 |   color.primary: "#0E5EF7"
> 5 |   spacing.md "16px"
    |              ^
  6 | }

Expected: ':'
Found: '"'

Hint: Property declarations must use colon syntax
  spacing.md: "16px"
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Compilation error |
| 2 | Validation error |
| 3 | File not found |
| 4 | Invalid arguments |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `UIH_CONFIG` | Path to config file | `uih.config.js` |
| `UIH_CACHE_DIR` | Cache directory | `.uih-cache` |
| `UIH_LOG_LEVEL` | Log level (error\|warn\|info\|debug) | `info` |

## Troubleshooting

### Command Not Found

If you get `command not found: uih`, ensure the package is installed globally:

```bash
npm install -g @uih-dsl/cli
```

Or use npx:

```bash
npx @uih-dsl/cli compile hello.uih
```

### Permission Errors

On Linux/Mac, you may need to use `sudo`:

```bash
sudo npm install -g @uih-dsl/cli
```

Or use a version manager like `nvm` to avoid permission issues.

### Compilation Errors

Enable verbose mode for detailed logs:

```bash
uih compile hello.uih --target react --output Hello.tsx --verbose
```

## Performance

### Compilation Speed

- Small files (<100 lines): ~10ms
- Medium files (100-500 lines): ~50ms
- Large files (500+ lines): ~200ms

### Optimization Tips

1. **Use watch mode** for development instead of recompiling manually
2. **Enable caching** in config file
3. **Use `--silent`** in CI/CD to reduce I/O overhead
4. **Compile in parallel** for multiple files:

```bash
# Parallel compilation (requires GNU parallel)
find src -name "*.uih" | parallel uih compile {} --target react --output {.}.tsx
```

## Related Packages

- [@uih-dsl/tokenizer](https://www.npmjs.com/package/@uih-dsl/tokenizer) - Lexical analyzer
- [@uih-dsl/parser](https://www.npmjs.com/package/@uih-dsl/parser) - AST parser
- [@uih-dsl/ir](https://www.npmjs.com/package/@uih-dsl/ir) - Intermediate representation
- [@uih-dsl/codegen-react](https://www.npmjs.com/package/@uih-dsl/codegen-react) - React code generator
- [@uih-dsl/codegen-vue](https://www.npmjs.com/package/@uih-dsl/codegen-vue) - Vue code generator
- [@uih-dsl/codegen-svelte](https://www.npmjs.com/package/@uih-dsl/codegen-svelte) - Svelte code generator

## License

MIT

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](../../../CONTRIBUTING.md)

## Support

- [Documentation](https://github.com/yourusername/uih-v2)
- [Issue Tracker](https://github.com/yourusername/uih-v2/issues)
- [Quick Start Guide](../../../docs/QUICK_START.md)
