/**
 * UIH DSL Codegen - React
 *
 * Entry point for React/Next.js code generation.
 *
 * @module @uih-dsl/codegen-react
 * @version 1.0.0
 */

export { generate } from "./generator.js";
export type { CodegenOutput, CodegenOptions } from "./types.js";
export { generateMeta } from "./meta.js";
export { generateStyle } from "./style.js";
export { generateScript, generateScriptExports } from "./script.js";
export { generateJSX } from "./jsx.js";
