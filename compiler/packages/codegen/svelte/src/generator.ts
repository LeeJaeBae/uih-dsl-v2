/**
 * UIH DSL Codegen - Main Generator (Svelte)
 *
 * Orchestrates Svelte 5 component generation from IR to final output.
 *
 * @module @uih-dsl/codegen-svelte/generator
 * @version 1.0.0
 */

import type { UIHIR } from "@uih-dsl/ir";
import type { CodegenOutput, CodegenOptions } from "./types.js";
import { generateMeta } from "./meta.js";
import { generateStyle } from "./style.js";
import { generateScript, generateScriptExports } from "./script.js";
import { generateTemplate } from "./template.js";

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

  // Generate <script lang="ts">
  const scriptSection = generateScriptSection(ir, meta, scriptCode, opts);
  if (scriptSection) {
    sections.push(scriptSection);
  }

  // Generate template (no wrapper tag in Svelte)
  const template = generateTemplate(ir.layout, opts.indentSize);
  sections.push(template);

  // Generate <style>
  if (style) {
    const styleSection = `<style>
${style}
</style>`;
    sections.push(styleSection);
  }

  return sections.join("\n\n");
}

function generateScriptSection(
  ir: UIHIR,
  meta: string | null,
  scriptCode: string | null,
  opts: Required<CodegenOptions>
): string | null {
  const scriptParts: string[] = [];

  if (opts.includeComments && ir.errors.length > 0) {
    scriptParts.push(generateErrorComments(ir));
  }

  if (meta) {
    scriptParts.push(meta);
  }

  if (scriptCode) {
    scriptParts.push(scriptCode);
  }

  if (scriptParts.length === 0) {
    return null;
  }

  return `<script lang="ts">
${scriptParts.join("\n\n")}
</script>`;
}

function generateErrorComments(ir: UIHIR): string {
  const errors = ir.errors.map(
    (err) => ` * - ${err.message} (line:${err.line}, col:${err.column})`
  );

  return `/* UIH WARNINGS:
${errors.join("\n")}
 */`;
}
