/**
 * UIH DSL Codegen - Script Generator (Vue)
 *
 * Generates event handler function stubs from IR script block for Vue 3.
 *
 * @module @uih-dsl/codegen-vue/script
 * @version 1.0.0
 */

import type { UIHIR } from "@uih-dsl/ir";

export interface ScriptOutput {
  refs: string[];
  handlers: string[];
}

export function generateScript(ir: UIHIR): ScriptOutput {
  const refs: string[] = [];
  const handlers: string[] = [];

  ir.script.forEach((entry) => {
    const key = entry.event;
    const value = entry.handler;

    // Heuristic: If value is "true", "false", a number, or a string literal, it's a STATE.
    const isStringLiteral = value.startsWith("'") || value.startsWith('"');
    if (value === "true" || value === "false" || !isNaN(Number(value)) || isStringLiteral) {
      // Vue ref
      refs.push(`const ${key} = ref(${value});`);
    } else {
      // Otherwise, it's a traditional event handler stub
      if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(value)) {
        handlers.push(`const ${value} = () => {
  // TODO: Implement ${key} handler
};`);
      }
    }
  });

  return { refs, handlers };
}

export function generateScriptExports(output: ScriptOutput): string | null {
  const lines: string[] = [];
  
  // Add import if we have refs
  if (output.refs.length > 0) {
    lines.push(`import { ref } from 'vue';`);
    lines.push(...output.refs);
  }
  
  lines.push(...output.handlers);

  if (lines.length === 0) {
    return null;
  }

  return lines.join("\n\n");
}
