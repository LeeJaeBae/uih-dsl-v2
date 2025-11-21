# Changelog

All notable changes to the UIH DSL project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-11-21

### Added

#### 🤖 Vibe Coding Features
- **VSCode Self-Healing**: AI-powered automatic error correction on save using Claude 3.5 Sonnet
- **Real-time Preview**: WebSocket-based live synchronization between CLI and Playground
- **Context Injection Kit**: `uih gen-context` command for LLM-friendly context generation
- **Self-Healing Compilation**: `smartCompile()` wrapper with automatic retry loop
- **Golden Examples**: Three production-quality example files (dashboard, landing page, settings form)

#### 🛠️ CLI Enhancements
- WebSocket server in `dev` command for real-time broadcasting
- File watching with `chokidar` for instant recompilation
- `--port` option for WebSocket server configuration
- Enhanced error reporting with line/column information

#### 🎨 VSCode Extension
- Status bar feedback for auto-fix operations
- `autoFixOnSave` configuration option
- `onWillSaveTextDocument` event integration
- Improved error messages and user feedback

#### 📦 Playground
- WebSocket client for live preview
- Auto-reconnect functionality (3s interval)
- Connection status indicator (`wsStatus`)
- Graceful degradation when server unavailable

### Changed
- Upgraded compiler pipeline with full Validator integration
- Enhanced `useCompiler` hook with WebSocket support
- Improved error collection across all compilation stages
- Updated TypeScript configurations for better workspace compatibility

### Fixed
- Validator package build issues
- Parser error location reporting
- IR validation consistency

### Documentation
- Comprehensive walkthrough for all Vibe Coding features
- Detailed implementation plan with architecture diagrams
- Usage examples and integration guides
- Golden Examples with extensive inline documentation

---

## [1.0.0] - 2024-XX-XX

### Added
- Initial UIH DSL v2 release
- Tokenizer with deterministic FSM
- Parser with error recovery
- IR (Intermediate Representation) layer
- Multi-framework code generation (React, Vue, Svelte)
- CLI with compile, ast, ir, codegen commands
- VSCode extension with syntax highlighting
- Online Playground with Monaco Editor
- Runtime packages for all frameworks

### Documentation
- Complete BNF grammar specification
- Project evaluation document
- README with quick start guide
- Examples directory

---

## [Unreleased]

### Planned
- Local LLM support (Ollama integration)
- Diff preview before auto-fix
- More Golden Examples (animations, forms, modals)
- Performance optimizations (WebSocket message compression)
- Advanced VSCode features (IntelliSense, code actions)
