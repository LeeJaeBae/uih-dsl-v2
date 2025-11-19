/**
 * UIH DSL Codegen - Script Generator (Vue)
 *
 * Generates event handler function stubs from IR script block for Vue 3.
 *
 * @module @uih-dsl/codegen-vue/script
 * @version 1.0.0
 */

import type { UIHIR } from "@uih-dsl/ir";

export function generateScript(ir: UIHIR): string[] {
  return ir.script.map((entry) => {
    return `const ${entry.handler} = () => {
  // TODO: Implement ${entry.event} handler
};`;
  });
}

export function generateScriptExports(handlers: string[]): string | null {
  if (handlers.length === 0) {
    return null;
  }

  return handlers.join("\n\n");
}
