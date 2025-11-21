/**
 * UIH DSL Codegen - Script Generator (Svelte)
 *
 * Generates event handler function stubs from IR script block for Svelte 5.
 *
 * @module @uih-dsl/codegen-svelte/script
 * @version 1.0.0
 */

import type { UIHIR } from "@uih-dsl/ir";

export interface ScriptOutput {
  state: string[];
  handlers: string[];
}

export function generateScript(ir: UIHIR): ScriptOutput {
  const state: string[] = [];
  const handlers: string[] = [];

  ir.script.forEach((entry) => {
    const key = entry.event;
    const value = entry.handler;

    // Heuristic: If value is "true", "false", a number, or a string literal, it's a STATE.
    const isStringLiteral = value.startsWith("'") || value.startsWith('"');
    if (value === "true" || value === "false" || !isNaN(Number(value)) || isStringLiteral) {
      // Svelte 5 state using runes
      state.push(`let ${key} = $state(${value});`);
    } else {
      // Otherwise, it's a traditional event handler stub
      if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(value)) {
        handlers.push(`function ${value}() {
  // TODO: Implement ${key} handler
}`);
      }
    }
  });

  return { state, handlers };
}

export function generateScriptExports(output: ScriptOutput): string | null {
  const lines = [...output.state, ...output.handlers];
  if (lines.length === 0) {
    return null;
  }

  return lines.join("\n\n");
}
