/**
 * UIH DSL Codegen - Style Generator
 *
 * Generates CSS variables from IR style tokens.
 *
 * @module @uih-dsl/codegen-react/style
 * @version 1.0.0
 */

import type { UIHIR } from "@uih-dsl/ir";

// ========================================================================
// CSS Variable Generation
// ========================================================================

/**
 * Generate CSS variables from IR style tokens.
 * Converts path arrays to CSS variable names with dash notation.
 *
 * @param ir - UIH IR structure
 * @returns CSS string with :root block, or null if no tokens
 *
 * @example
 * ```typescript
 * // Input: { path: ["color", "primary"], value: "#0E5EF7" }
 * // Output: --color-primary: #0E5EF7;
 * ```
 */
export function generateStyle(ir: UIHIR): string | null {
  if (ir.style.tokens.length === 0) {
    return null;
  }

  const variables = ir.style.tokens.map((token) => {
    const varName = token.path.join("-");
    const value = formatStyleValue(token.value);
    return `  --${varName}: ${value};`;
  });

  return `:root {\n${variables.join("\n")}\n}`;
}

/**
 * Format style value for CSS output.
 * Numbers without units are kept as-is.
 *
 * @param value - Style token value
 * @returns Formatted CSS value
 */
function formatStyleValue(value: string | number): string {
  if (typeof value === "number") {
    return String(value);
  }
  return value;
}

/**
 * Generate inline style tag for React component.
 *
 * @param styleString - CSS string
 * @returns Style tag code
 */
export function generateStyleTag(styleString: string | null): string | null {
  if (!styleString) {
    return null;
  }

  return `<style jsx global>{\`
${styleString}
\`}</style>`;
}
