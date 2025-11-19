/**
 * UIH DSL Validation Layer - Public API
 *
 * Entry point for AST validation functionality.
 *
 * @module @parser/validation
 * @version 1.0.0
 */

// Export types
export type {
  ValidationSeverity,
  ValidationLocation,
  ValidationResult,
  ValidationRule,
  ValidationRuleSet,
} from "./types.js";

// Export rules
export { allRules } from "./rules.js";

// Export validation functions
export {
  validateAST,
  hasErrors,
  hasWarnings,
  filterBySeverity,
  formatResults,
} from "./validate.js";
