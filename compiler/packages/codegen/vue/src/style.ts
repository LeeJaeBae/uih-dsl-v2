/**
 * UIH DSL Codegen - Style Generator (Vue)
 *
 * Generates CSS variables from IR style tokens for Vue 3 SFC.
 *
 * @module @uih-dsl/codegen-vue/style
 * @version 1.0.0
 */

import type { UIHIR } from "@uih-dsl/ir";

/**
 * Generate CSS variables from IR style tokens.
 * Converts path arrays to CSS variable names with dash notation.
 *
 * @param ir - UIH IR structure
 * @returns CSS string with :root block, or null if no tokens
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
 */
function formatStyleValue(value: string | number): string {
  if (typeof value === "number") {
    return String(value);
  }
  return value;
}
