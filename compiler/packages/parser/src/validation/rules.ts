/**
 * UIH DSL Validation Layer - Validation Rules
 *
 * Implements semantic validation rules for UIH DSL AST.
 * Each rule is a pure function that returns validation results.
 *
 * @module @parser/validation/rules
 * @version 1.0.0
 */

import type { ASTRoot, LayoutElement } from "../ast.js";
import { isLayoutComponent, isLayoutText } from "../ast.js";
import type { ValidationResult, ValidationRule } from "./types.js";

// ========================================================================
// Meta Block Rules
// ========================================================================

/**
 * Validate that meta.title is a string (not number or boolean).
 *
 * Rule: meta.title.type
 */
export const validateMetaTitleType: ValidationRule = (ast: ASTRoot): ValidationResult[] => {
  const results: ValidationResult[] = [];

  const titleProp = ast.meta.properties.find((p) => p.key === "title");

  if (titleProp && typeof titleProp.value !== "string") {
    results.push({
      severity: "error",
      rule: "meta.title.type",
      message: `Meta property 'title' must be a string, got ${typeof titleProp.value}`,
      location: {
        line: titleProp.location.start.line,
        column: titleProp.location.start.column,
      },
      context: { key: "title", value: titleProp.value },
    });
  }

  return results;
};

// ========================================================================
// Style Block Rules
// ========================================================================

/**
 * Validate that style keys use dot notation (minimum a.b format).
 *
 * Rule: style.key.format
 */
export const validateStyleKeyFormat: ValidationRule = (ast: ASTRoot): ValidationResult[] => {
  const results: ValidationResult[] = [];

  for (const prop of ast.style.properties) {
    // Check if key contains at least one dot
    if (!prop.key.includes(".")) {
      results.push({
        severity: "error",
        rule: "style.key.format",
        message: `Style key '${prop.key}' must use dot notation (e.g., 'color.primary')`,
        location: {
          line: prop.location.start.line,
          column: prop.location.start.column,
        },
        context: { key: prop.key },
      });
    }
  }

  return results;
};

/**
 * Validate that style values are not boolean.
 *
 * Rule: style.value.type
 */
export const validateStyleValueType: ValidationRule = (ast: ASTRoot): ValidationResult[] => {
  const results: ValidationResult[] = [];

  for (const prop of ast.style.properties) {
    if (typeof prop.value === "boolean") {
      results.push({
        severity: "error",
        rule: "style.value.type",
        message: `Style value for '${prop.key}' cannot be boolean`,
        location: {
          line: prop.location.start.line,
          column: prop.location.start.column,
        },
        context: { key: prop.key, value: prop.value },
      });
    }
  }

  return results;
};

// ========================================================================
// Layout Block Rules
// ========================================================================

/**
 * Validate that layout tree starts with a TAGNAME (component).
 *
 * Rule: layout.root.type
 */
export const validateLayoutRootType: ValidationRule = (ast: ASTRoot): ValidationResult[] => {
  const results: ValidationResult[] = [];

  if (ast.layout.children.length === 0) {
    results.push({
      severity: "error",
      rule: "layout.root.empty",
      message: "Layout block cannot be empty",
    });
    return results;
  }

  // Check that first child is a component (not text)
  const firstChild = ast.layout.children[0];
  if (isLayoutText(firstChild)) {
    results.push({
      severity: "error",
      rule: "layout.root.type",
      message: "Layout tree must start with a component (TAGNAME), not text",
      location: {
        line: firstChild.location.start.line,
        column: firstChild.location.start.column,
      },
      context: { textValue: firstChild.value },
    });
  }

  return results;
};

/**
 * Validate that text nodes don't have consecutive empty strings.
 *
 * Rule: layout.text.consecutive-empty
 */
export const validateNoConsecutiveEmptyText: ValidationRule = (
  ast: ASTRoot
): ValidationResult[] => {
  const results: ValidationResult[] = [];

  const checkChildren = (children: LayoutElement[]): void => {
    let lastWasEmptyText = false;

    for (const child of children) {
      if (isLayoutText(child)) {
        const isEmpty = child.value.trim() === "";

        if (isEmpty && lastWasEmptyText) {
          results.push({
            severity: "error",
            rule: "layout.text.consecutive-empty",
            message: "Consecutive empty text nodes are not allowed",
            location: {
              line: child.location.start.line,
              column: child.location.start.column,
            },
          });
        }

        lastWasEmptyText = isEmpty;
      } else if (isLayoutComponent(child)) {
        lastWasEmptyText = false;
        // Recursively check component children
        checkChildren(child.children);
      }
    }
  };

  checkChildren(ast.layout.children);
  return results;
};

// ========================================================================
// Script Block Rules
// ========================================================================

/**
 * Validate that script keys are in camelCase format.
 *
 * Rule: script.key.format
 */
export const validateScriptKeyCamelCase: ValidationRule = (
  ast: ASTRoot
): ValidationResult[] => {
  const results: ValidationResult[] = [];

  if (!ast.script) {
    return results;
  }

  const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;

  for (const event of ast.script.events) {
    if (!camelCaseRegex.test(event.key)) {
      results.push({
        severity: "error",
        rule: "script.key.format",
        message: `Script key '${event.key}' must be in camelCase format`,
        location: {
          line: event.location.start.line,
          column: event.location.start.column,
        },
        context: { key: event.key },
      });
    }
  }

  return results;
};

/**
 * Validate that script values are not empty strings.
 *
 * Rule: script.value.empty
 */
export const validateScriptValueNotEmpty: ValidationRule = (
  ast: ASTRoot
): ValidationResult[] => {
  const results: ValidationResult[] = [];

  if (!ast.script) {
    return results;
  }

  for (const event of ast.script.events) {
    if (event.value.trim() === "") {
      results.push({
        severity: "error",
        rule: "script.value.empty",
        message: `Script value for '${event.key}' cannot be empty`,
        location: {
          line: event.location.start.line,
          column: event.location.start.column,
        },
        context: { key: event.key },
      });
    }
  }

  return results;
};

// ========================================================================
// Export All Rules
// ========================================================================

/**
 * All validation rules organized by category.
 */
export const allRules = {
  meta: [validateMetaTitleType],
  style: [validateStyleKeyFormat, validateStyleValueType],
  components: [],
  layout: [validateLayoutRootType, validateNoConsecutiveEmptyText],
  script: [validateScriptKeyCamelCase, validateScriptValueNotEmpty],
};
