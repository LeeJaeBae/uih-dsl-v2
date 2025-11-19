/**
 * UIH DSL Codegen - Meta Generator (Vue)
 *
 * Generates Vue Router meta from IR meta block.
 *
 * @module @uih-dsl/codegen-vue/meta
 * @version 1.0.0
 */

import type { UIHIR } from "@uih-dsl/ir";

export function generateMeta(ir: UIHIR): string | null {
  const keys = Object.keys(ir.meta);

  if (keys.length === 0) {
    return null;
  }

  const entries = keys.map((key) => {
    const value = ir.meta[key];
    const formattedValue = formatMetaValue(value);
    return `  ${key}: ${formattedValue}`;
  });

  return `export const routeMeta = {\n${entries.join(",\n")}\n};`;
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
