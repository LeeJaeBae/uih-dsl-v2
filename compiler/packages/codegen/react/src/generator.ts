/**
 * UIH DSL Codegen - Main Generator
 *
 * Orchestrates code generation from IR to final output.
 *
 * @module @uih-dsl/codegen-react/generator
 * @version 1.0.0
 */

import type { UIHIR } from "@uih-dsl/ir";
import type { CodegenOutput, CodegenOptions } from "./types.js";
import { generateMeta } from "./meta.js";
import { generateStyle } from "./style.js";
import { generateScript } from "./script.js";
import { generateState } from "./state.js";
import { generateJSX } from "./jsx.js";

const DEFAULT_OPTIONS: CodegenOptions = {
  componentName: "Page",
  includeComments: true,
  indentSize: 2,
};

export function generate(ir: UIHIR, options: CodegenOptions = {}): CodegenOutput {
  const opts: Required<CodegenOptions> = { ...DEFAULT_OPTIONS, ...options } as Required<CodegenOptions>;

  const meta = generateMeta(ir);
  const style = generateStyle(ir);
  const scriptData = generateScript(ir); // script block
  const stateData = generateState(ir);   // state block

  // Merge hooks and handlers
  const mergedScriptData = {
    hooks: [...stateData.hooks, ...scriptData.hooks],
    handlers: [...stateData.handlers, ...scriptData.handlers],
  };

  // Pass mergedScriptData to generateComponent so it can inject code INSIDE the component
  const code = generateFullCode(ir, meta, style, opts, mergedScriptData);

  return {
    code,
    style,
    meta,
    events: mergedScriptData.handlers, // Backwards compatibility
  };
}

function generateFullCode(
  ir: UIHIR,
  meta: string | null,
  style: string | null,
  opts: Required<CodegenOptions>,
  scriptData: { hooks: string[]; handlers: string[] }
): string {
  const sections: string[] = [];

  // Generate imports
  const imports: string[] = ['import React from "react";'];
  
  if (ir.components && ir.components.length > 0) {
    ir.components.forEach((comp) => {
      imports.push(`import { ${comp.name} } from "@/components/${comp.name}";`);
    });
  }
  
  sections.push(imports.join("\n"));

  if (opts.includeComments && ir.errors.length > 0) {
    sections.push(generateErrorComments(ir));
  }

  if (meta) {
    sections.push(meta);
  }

  if (style) {
    sections.push(`const styles = ${JSON.stringify(style)};`);
  }

  const componentCode = generateComponent(ir, opts, scriptData);
  sections.push(componentCode);

  return sections.join("\n\n");
}

function generateErrorComments(ir: UIHIR): string {
  const errors = ir.errors.map(
    (err) => ` * - ${err.message} (line:${err.line}, col:${err.column})`
  );

  return `/* UIH WARNINGS:
${errors.join("\n")}
 */`;
}

function generateComponent(
  ir: UIHIR, 
  opts: Required<CodegenOptions>,
  scriptData: { hooks: string[]; handlers: string[] }
): string {
  const jsx = generateJSX(ir.layout, opts.indentSize);
  const body = [...scriptData.hooks, ...scriptData.handlers].join("\n  ");

  return `export default function ${opts.componentName}() {
  ${body}

  return (
${jsx}
  );
}`;
}