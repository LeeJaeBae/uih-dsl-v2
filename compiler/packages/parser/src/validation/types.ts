/**
 * UIH DSL Validation Layer - Type Definitions
 *
 * Defines validation result types and rule function signatures.
 * Validation layer performs semantic validation on parser-generated AST.
 *
 * @module @parser/validation/types
 * @version 1.0.0
 */

import type { ASTRoot } from "../ast.js";

/**
 * Severity level for validation issues.
 *
 * - error: Must be fixed, prevents code generation
 * - warning: Should be fixed, allows code generation
 */
export type ValidationSeverity = "error" | "warning";

/**
 * Position information for validation errors.
 */
export interface ValidationLocation {
  line: number;
  column: number;
}

/**
 * A single validation result/issue.
 */
export interface ValidationResult {
  /** Severity level */
  severity: ValidationSeverity;

  /** Rule identifier (e.g., "meta.title.type") */
  rule: string;

  /** Human-readable error message */
  message: string;

  /** Location in source where error occurred */
  location?: ValidationLocation;

  /** Additional context for debugging */
  context?: Record<string, unknown>;
}

/**
 * Validation rule function signature.
 *
 * A rule function takes an AST and returns an array of validation results.
 * Empty array means the rule passed.
 *
 * @param ast - The parsed AST to validate
 * @returns Array of validation issues (empty if valid)
 */
export type ValidationRule = (ast: ASTRoot) => ValidationResult[];

/**
 * Collection of validation rules organized by category.
 */
export interface ValidationRuleSet {
  /** Meta block validation rules */
  meta: ValidationRule[];

  /** Style block validation rules */
  style: ValidationRule[];

  /** Components block validation rules */
  components: ValidationRule[];

  /** Layout block validation rules */
  layout: ValidationRule[];

  /** Script block validation rules */
  script: ValidationRule[];
}
