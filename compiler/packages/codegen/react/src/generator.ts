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
import { generateScript, generateScriptExports } from "./script.js";
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
  const events = generateScript(ir);
  const scriptCode = generateScriptExports(events);

  const code = generateFullCode(ir, meta, style, scriptCode, opts);

  return {
    code,
    style,
    meta,
    events,
  };
}

function generateFullCode(
  ir: UIHIR,
  meta: string | null,
  style: string | null,
  scriptCode: string | null,
  opts: Required<CodegenOptions>
): string {
  const sections: string[] = [];

  // Generate imports
  const imports: string[] = ['import React from "react";'];
  
  if (ir.components && ir.components.length > 0) {
    ir.components.forEach((component) => {
      imports.push(`import { ${component} } from "@/components/${component}";`);
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
    sections.push(`const styles = \`
${style}
\`;`);
  }

  if (scriptCode) {
    sections.push(scriptCode);
  }

  const componentCode = generateComponent(ir, opts);
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

function generateComponent(ir: UIHIR, opts: Required<CodegenOptions>): string {
  const jsx = generateJSX(ir.layout, opts.indentSize);

  return `export default function ${opts.componentName}() {
  return (
${jsx}
  );
}`;
}
