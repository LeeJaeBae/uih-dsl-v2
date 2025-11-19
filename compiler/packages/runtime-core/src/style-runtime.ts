/**
 * UIH Runtime Core - Style Runtime
 *
 * CSS variable injection and theming following Runtime Specification v1.0 Section 3
 *
 * @module @uih-dsl/runtime-core/style-runtime
 * @version 1.0.0
 */

// ========================================================================
// Style Token Types
// ========================================================================

export interface StyleToken {
  /**
   * Dot-notation path (e.g., ["color", "primary"])
   */
  path: string[];

  /**
   * Token value (e.g., "#0E5EF7" or "8")
   */
  value: string | number;
}

export interface StyleTheme {
  /**
   * Theme name
   */
  name: string;

  /**
   * CSS variable overrides
   */
  tokens: StyleToken[];
}

// ========================================================================
// CSS Variable Conversion (Spec 3.1)
// ========================================================================

/**
 * Convert dot notation to CSS variable name
 *
 * Spec 3.2.1: color.primary → --color-primary
 */
export function pathToCSSVariable(path: string[]): string {
  return `--${path.join("-")}`;
}

/**
 * Convert style token to CSS declaration
 *
 * Example: { path: ["color", "primary"], value: "#0E5EF7" }
 *       → "--color-primary: #0E5EF7;"
 */
export function tokenToCSSDeclaration(token: StyleToken): string {
  const varName = pathToCSSVariable(token.path);
  return `${varName}: ${token.value};`;
}

/**
 * Generate CSS :root block from style tokens (Spec 3.1)
 */
export function generateCSSRoot(tokens: StyleToken[]): string {
  if (tokens.length === 0) {
    return "";
  }

  // Sort tokens by path for determinism (Spec 3.2.3)
  const sortedTokens = [...tokens].sort((a, b) => {
    const aPath = a.path.join("-");
    const bPath = b.path.join("-");
    return aPath.localeCompare(bPath);
  });

  const declarations = sortedTokens.map((token) => `  ${tokenToCSSDeclaration(token)}`);

  return `:root {\n${declarations.join("\n")}\n}`;
}

// ========================================================================
// Style Runtime Manager
// ========================================================================

/**
 * Runtime style token manager
 */
export class StyleRuntime {
  private tokens: Map<string, string | number>;
  private element: HTMLElement;

  constructor() {
    this.tokens = new Map();
    // Default to document root element
    this.element = typeof document !== "undefined" ? document.documentElement : ({} as HTMLElement);
  }

  /**
   * Initialize style runtime (attach to DOM)
   */
  initialize(element?: HTMLElement): void {
    if (element) {
      this.element = element;
    }
  }

  /**
   * Set a CSS variable value (Spec 3.3 Dynamic Theming)
   */
  setVariable(name: string, value: string | number): void {
    // Ensure name starts with --
    const varName = name.startsWith("--") ? name : `--${name}`;

    this.tokens.set(varName, value);

    // Apply to DOM if available
    if (this.element && this.element.style) {
      this.element.style.setProperty(varName, String(value));
    }
  }

  /**
   * Get a CSS variable value
   */
  getVariable(name: string): string | number | undefined {
    const varName = name.startsWith("--") ? name : `--${name}`;
    return this.tokens.get(varName);
  }

  /**
   * Apply a theme (Spec 3.3)
   */
  applyTheme(theme: StyleTheme): void {
    console.log(`[UIH] Applying theme: ${theme.name}`);

    for (const token of theme.tokens) {
      const varName = pathToCSSVariable(token.path);
      this.setVariable(varName, token.value);
    }
  }

  /**
   * Inject style tokens into DOM
   */
  inject(tokens: StyleToken[]): void {
    for (const token of tokens) {
      const varName = pathToCSSVariable(token.path);
      this.setVariable(varName, token.value);
    }
  }

  /**
   * Clear all style tokens
   */
  clear(): void {
    // Remove all CSS variables from DOM
    if (this.element && this.element.style) {
      for (const varName of this.tokens.keys()) {
        this.element.style.removeProperty(varName);
      }
    }

    this.tokens.clear();
  }

  /**
   * Destroy runtime (remove from DOM)
   */
  destroy(): void {
    this.clear();
  }
}
