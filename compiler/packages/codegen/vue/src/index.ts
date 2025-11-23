/**
 * UIH DSL Codegen - Vue
 *
 * Entry point for Vue 3 SFC code generation.
 *
 * @module @uih-dsl/codegen-vue
 * @version 1.0.0
 */

export { generate } from "./generator.js";
export type { CodegenOutput, CodegenOptions } from "./types.js";
export { generateMeta } from "./meta.js";
export { generateStyle } from "./style.js";
export { generateScript, generateScriptExports } from "./script.js";
export { generateState } from "./state.js";
export { generateTemplate } from "./template.js";
