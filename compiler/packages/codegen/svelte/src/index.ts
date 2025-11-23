/**
 * UIH DSL Codegen - Svelte
 *
 * Entry point for Svelte 5 code generation.
 *
 * @module @uih-dsl/codegen-svelte
 * @version 1.0.0
 */

export { generate } from "./generator.js";
export type { CodegenOutput, CodegenOptions } from "./types.js";
export { generateMeta } from "./meta.js";
export { generateStyle } from "./style.js";
export { generateScript, generateScriptExports } from "./script.js";
export { generateState } from "./state.js";
export { generateTemplate } from "./template.js";
