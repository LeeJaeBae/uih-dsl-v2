/**
 * UIH DSL Validation Layer - Main Validation Function
 *
 * Orchestrates validation rule execution and collects results.
 *
 * @module @parser/validation/validate
 * @version 1.0.0
 */

import type { ASTRoot } from "../ast.js";
import type { ValidationResult, ValidationRuleSet } from "./types.js";
import { allRules } from "./rules.js";

/**
 * Validate an AST against all semantic rules.
 *
 * This is the main entry point for validation. It runs all registered
 * validation rules and collects the results.
 *
 * @param ast - The parsed AST to validate
 * @param customRules - Optional custom rule set (defaults to allRules)
 * @returns Array of validation issues (empty if valid)
 *
 * @example
 * ```typescript
 * const ast = parse(tokens);
 * const errors = validateAST(ast);
 *
 * if (errors.length > 0) {
 *   console.error("Validation failed:");
 *   errors.forEach(err => console.error(err.message));
 * }
 * ```
 */
export function validateAST(
  ast: ASTRoot,
  customRules?: Partial<ValidationRuleSet>
): ValidationResult[] {
  const results: ValidationResult[] = [];
  const rules = customRules || allRules;

  // Run meta rules
  if (rules.meta) {
    for (const rule of rules.meta) {
      results.push(...rule(ast));
    }
  }

  // Run style rules
  if (rules.style) {
    for (const rule of rules.style) {
      results.push(...rule(ast));
    }
  }

  // Run components rules
  if (rules.components) {
    for (const rule of rules.components) {
      results.push(...rule(ast));
    }
  }

  // Run layout rules
  if (rules.layout) {
    for (const rule of rules.layout) {
      results.push(...rule(ast));
    }
  }

  // Run script rules
  if (rules.script) {
    for (const rule of rules.script) {
      results.push(...rule(ast));
    }
  }

  return results;
}

/**
 * Check if validation results contain any errors.
 *
 * @param results - Validation results to check
 * @returns true if any errors exist
 */
export function hasErrors(results: ValidationResult[]): boolean {
  return results.some((r) => r.severity === "error");
}

/**
 * Check if validation results contain any warnings.
 *
 * @param results - Validation results to check
 * @returns true if any warnings exist
 */
export function hasWarnings(results: ValidationResult[]): boolean {
  return results.some((r) => r.severity === "warning");
}

/**
 * Filter validation results by severity.
 *
 * @param results - Validation results to filter
 * @param severity - Severity level to filter by
 * @returns Filtered validation results
 */
export function filterBySeverity(
  results: ValidationResult[],
  severity: "error" | "warning"
): ValidationResult[] {
  return results.filter((r) => r.severity === severity);
}

/**
 * Format validation results as human-readable strings.
 *
 * @param results - Validation results to format
 * @returns Array of formatted error messages
 */
export function formatResults(results: ValidationResult[]): string[] {
  return results.map((r) => {
    const locationStr = r.location
      ? ` at line ${r.location.line}, column ${r.location.column}`
      : "";
    return `[${r.severity.toUpperCase()}] ${r.rule}: ${r.message}${locationStr}`;
  });
}
