/**
 * UIH DSL Codegen - Meta Generator (Svelte)
 *
 * Generates Svelte component props from IR meta block.
 *
 * @module @uih-dsl/codegen-svelte/meta
 * @version 1.0.0
 */

import type { UIHIR } from "@uih-dsl/ir";

export function generateMeta(ir: UIHIR): string | null {
  const keys = Object.keys(ir.meta);

  if (keys.length === 0) {
    return null;
  }

  const exports = keys.map((key) => {
    const value = ir.meta[key];
    const formattedValue = formatMetaValue(value);
    return `export const ${key} = ${formattedValue};`;
  });

  return exports.join("\n");
}

function formatMetaValue(value: string | number | boolean): string {
  if (typeof value === "string") {
    return `"${escapeString(value)}"`;
  }
  return String(value);
}

function escapeString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}
