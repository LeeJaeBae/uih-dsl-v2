# @uih-dsl/cli

UIH DSL Command Line Interface

## Installation

```bash
pnpm add -g @uih-dsl/cli
```

## Usage

```bash
# Compile UIH file to React
uih compile input.uih --target react

# Show AST
uih ast input.uih

# Show IR
uih ir input.uih

# Generate code
uih codegen input.uih --target vue

# Development mode with watch
uih dev input.uih --target svelte
```

## Commands

- `compile` - Compile UIH file to target framework
- `ast` - Display Abstract Syntax Tree
- `ir` - Display Intermediate Representation
- `codegen` - Generate code for target framework
- `dev` - Development mode with file watching

## Options

- `--target, -t` - Target framework (react, vue, svelte)
- `--output, -o` - Output file path
- `--watch, -w` - Watch mode
- `--verbose, -v` - Verbose logging

## License

MIT
