/**
 * UIH DSL Codegen - Script Generator (React)
 *
 * Generates state hooks and event handlers.
 *
 * @module @uih-dsl/codegen-react/script
 * @version 1.1.0
 */

import type { UIHIR } from "@uih-dsl/ir";



export interface ScriptOutput {
  hooks: string[];
  handlers: string[];
}

export function generateScript(ir: UIHIR): ScriptOutput {
  const hooks: string[] = [];
  const handlers: string[] = [];

  // 1. Identify state variables (simple values like true/false, numbers, strings)
  // If it looks like an event handler (starts with 'handle' or is a function name), treat as handler stub
  
  // In current IR, script is array of { event, handler }.
  // We need to check if the 'handler' is actually a value (state).
  // But IR schema says it maps event->handler.
  // We need to inspect the IR structure.
  // Actually, in IR script entries are normalized to { event: "key", handler: "value" }
  // e.g. onClick: "handleClick" -> event="onClick", handler="handleClick"
  // e.g. isOpen: "false" -> event="isOpen", handler="false" 
  
  ir.script.forEach((entry) => {
    const key = entry.event; // e.g. "isOpen", "onClick"
    const value = entry.handler; // e.g. "false", "handleClick"

    // Heuristic: If value is "true", "false", a number, or a string literal, it's a STATE.
    const isStringLiteral = value.startsWith("'") || value.startsWith('"');
    if (value === "true" || value === "false" || !isNaN(Number(value)) || isStringLiteral) {
      const hookName = `[${key}, set${capitalize(key)}]`;
      // React.useState(false)
      hooks.push(`const ${hookName} = React.useState(${value});`);
    } else {
      // Otherwise, it's a traditional event handler stub
      // Only generate if it looks like a function name (no spaces, etc)
      if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(value)) {
         handlers.push(`const ${value} = () => {
    console.log("${value} triggered");
  };
`);
      }
    }
  });

  return { hooks, handlers };
}

export function generateScriptExports(output: ScriptOutput): string | null {
  const lines = [...output.hooks, ...output.handlers];
  if (lines.length === 0) return null;
  return lines.join("\n");
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}