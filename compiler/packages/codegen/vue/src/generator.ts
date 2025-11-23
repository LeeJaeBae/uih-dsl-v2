/**
 * UIH DSL Codegen - Main Generator (Vue)
 *
 * Orchestrates Vue 3 SFC generation from IR to final output.
 *
 * @module @uih-dsl/codegen-vue/generator
 * @version 1.0.0
 */

import type { UIHIR } from "@uih-dsl/ir";
import type { CodegenOutput, CodegenOptions } from "./types.js";
import { generateMeta } from "./meta.js";
import { generateStyle } from "./style.js";
import { generateScript, generateScriptExports } from "./script.js";
import { generateState } from "./state.js";
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
  
  // Generate script and state logic
  const scriptOutput = generateScript(ir);
  const stateOutput = generateState(ir);
  
  // Merge script and state outputs
  const mergedScriptOutput = {
    refs: [...stateOutput.refs, ...scriptOutput.refs],
    handlers: [...stateOutput.handlers, ...scriptOutput.handlers],
  };

  const scriptCode = generateScriptExports(mergedScriptOutput);

  const code = generateFullCode(ir, meta, style, scriptCode, opts);

  return {
    code,
    style,
    meta,
    events: mergedScriptOutput.handlers,
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

  // Generate <script setup>
  const scriptSection = generateScriptSection(ir, meta, scriptCode, opts);
  if (scriptSection) {
    sections.push(scriptSection);
  }

  // Generate <template>
  const templateSection = generateTemplateSection(ir, opts);
  sections.push(templateSection);

  // Generate <style scoped>
  if (style) {
    const styleSection = `<style scoped>
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

  // scriptCode contains imports, which must come first
  if (scriptCode) {
    scriptParts.push(scriptCode);
  }

  // meta contains exports, which come after imports
  if (meta) {
    scriptParts.push(meta);
  }

  if (scriptParts.length === 0) {
    return null;
  }

  return `<script setup lang="ts">
${scriptParts.join("\n\n")}
</script>`;
}

function generateTemplateSection(ir: UIHIR, opts: Required<CodegenOptions>): string {
  const template = generateTemplate(ir.layout, opts.indentSize);

  return `<template>
${template}
</template>`;
}

function generateErrorComments(ir: UIHIR): string {
  const errors = ir.errors.map(
    (err) => ` * - ${err.message} (line:${err.line}, col:${err.column})`
  );

  return `/* UIH WARNINGS:
${errors.join("\n")}
 */`;
}
