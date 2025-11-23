/**
 * UIH DSL Intermediate Representation (IR)
 *
 * Entry point for IR generation from UIH AST.
 * Exports types, translator, and normalization utilities.
 *
 * @module @uih-dsl/ir
 * @version 1.0.0
 */

// Export IR types
export type {
  UIHIR,
  IRNode,
  IRComponentNode,
  IRTextNode,
  IRError,
  StyleToken,
  ScriptEntry,
  StateDefinition,
  StateTransition,
} from "./types.js";

// Export type guards
export { isIRComponent, isIRText } from "./types.js";

// Export main translator
export { createIR } from "./translator.js";

// Export normalization utilities
export {
  normalizeAttributes,
  splitStylePath,
  isValidStylePath,
  sortObjectKeys,
  pushError,
  isValidScriptKey,
  isEmptyScriptValue,
  sortStringArray,
  sortStyleTokens,
  sortScriptEntries,
} from "./normalize.js";
