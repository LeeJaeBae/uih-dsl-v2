/**
 * UIH DSL IR Translator
 *
 * Transforms UIH AST into normalized IR structure.
 * Uses error collection instead of throwing exceptions.
 *
 * @module @uih-dsl/ir/translator
 * @version 1.0.0
 */

import type {
  ASTRoot,
  MetaNode,
  StyleNode,
  ComponentsNode,
  LayoutNode,
  LayoutElement,
  LayoutComponent,
  LayoutText,
  ScriptNode,
  ParserError,
} from "@uih-dsl/parser";
import type { UIHIR, IRNode, IRError, StyleToken, ScriptEntry } from "./types.js";
import {
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

// ========================================================================
// Main IR Creation
// ========================================================================

/**
 * Create IR from AST.
 * Combines parser errors with translation errors.
 *
 * @param ast - Root AST node (can be null if parser failed completely)
 * @param parserErrors - Errors from parser
 * @returns Complete UIHIR structure
 */
export function createIR(ast: ASTRoot | null, parserErrors: ParserError[]): UIHIR {
  const translationErrors: IRError[] = [];

  // Convert parser errors to IR errors
  const errors: IRError[] = parserErrors.map((err) => ({
    message: err.message,
    line: err.line,
    column: err.column,
  }));

  // If AST is null, return minimal IR with errors
  if (ast === null) {
    return {
      meta: {},
      style: { tokens: [] },
      components: [],
      layout: [],
      script: [],
      errors,
    };
  }

  // Transform each block
  const meta = createMetaIR(ast.meta, translationErrors);
  const style = createStyleIR(ast.style, translationErrors);
  const components = createComponentsIR(ast.components);
  const layout = createLayoutIR(ast.layout);
  const script = createScriptIR(ast.script, translationErrors);

  // Combine all errors
  const allErrors = [...errors, ...translationErrors];

  return {
    meta,
    style,
    components,
    layout,
    script,
    errors: allErrors,
  };
}

// ========================================================================
// Meta Block Translation
// ========================================================================

/**
 * Create meta IR from MetaNode.
 * Flattens properties into a key-value object.
 * Sorts keys alphabetically for deterministic output.
 *
 * @param node - Meta AST node
 * @param errors - Error collection array
 * @returns Meta object with sorted keys
 */
function createMetaIR(
  node: MetaNode,
  errors: IRError[]
): Record<string, string | number | boolean> {
  const meta: Record<string, string | number | boolean> = {};

  for (const prop of node.properties) {
    // Validate value type (should be string, number, or boolean)
    if (
      typeof prop.value === "string" ||
      typeof prop.value === "number" ||
      typeof prop.value === "boolean"
    ) {
      meta[prop.key] = prop.value;
    } else {
      pushError(
        errors,
        `Meta property '${prop.key}' has invalid value type`,
        prop.location.start
      );
    }
  }

  // Sort keys alphabetically for deterministic output
  return sortObjectKeys(meta);
}

// ========================================================================
// Style Block Translation
// ========================================================================

/**
 * Create style IR from StyleNode.
 * Splits dot-notation keys into path arrays.
 * Rejects boolean values.
 * Sorts tokens by path for deterministic output.
 *
 * @param node - Style AST node
 * @param errors - Error collection array
 * @returns Style object with token array
 */
function createStyleIR(node: StyleNode, errors: IRError[]): { tokens: StyleToken[] } {
  const tokens: StyleToken[] = [];

  for (const prop of node.properties) {
    // Validate value type (must be string or number, not boolean)
    if (typeof prop.value === "boolean") {
      pushError(
        errors,
        `Style property '${prop.key}' cannot have boolean value`,
        prop.location.start
      );
      continue;
    }

    // Split path
    const path = splitStylePath(prop.key);

    // Validate path (must have at least 2 segments)
    if (!isValidStylePath(path)) {
      pushError(
        errors,
        `Style key '${prop.key}' must use dot notation (e.g., 'color.primary')`,
        prop.location.start
      );
      continue;
    }

    tokens.push({
      path,
      value: prop.value,
    });
  }

  // Sort tokens for deterministic output
  const sortedTokens = sortStyleTokens(tokens);

  return { tokens: sortedTokens };
}

// ========================================================================
// Components Block Translation
// ========================================================================

/**
 * Create components IR from ComponentsNode.
 * Extracts component names.
 * Sorts alphabetically for deterministic output.
 *
 * @param node - Components AST node (optional)
 * @returns Array of component names
 */
function createComponentsIR(node: ComponentsNode | null): string[] {
  if (!node) {
    return [];
  }

  const names = node.components.map((comp) => comp.name);

  // Sort for deterministic output
  return sortStringArray(names);
}

// ========================================================================
// Layout Block Translation
// ========================================================================

/**
 * Create layout IR from LayoutNode.
 * Recursively transforms layout tree.
 *
 * @param node - Layout AST node
 * @returns Array of IR nodes
 */
function createLayoutIR(node: LayoutNode): IRNode[] {
  return node.children.map((child) => transformLayoutElement(child));
}

/**
 * Transform a layout element (component or text) to IR.
 *
 * @param node - Layout element AST node
 * @returns IR node (component or text)
 */
function transformLayoutElement(node: LayoutElement): IRNode {
  if (node.type === "Component") {
    return transformLayoutComponent(node);
  } else {
    return transformLayoutText(node);
  }
}

/**
 * Transform a layout component to IR.
 * Normalizes attributes and recursively transforms children.
 *
 * @param node - Layout component AST node
 * @returns IR component node
 */
function transformLayoutComponent(node: LayoutComponent): IRNode {
  // Normalize and sort attributes
  const attrs = normalizeAttributes(node.attributes);

  // Recursively transform children
  const children = node.children.map((child) => transformLayoutElement(child));

  return {
    type: "Component",
    tag: node.tag,
    attrs,
    children,
  };
}

/**
 * Transform a layout text node to IR.
 *
 * @param node - Layout text AST node
 * @returns IR text node
 */
function transformLayoutText(node: LayoutText): IRNode {
  return {
    type: "Text",
    value: node.value,
  };
}

// ========================================================================
// Script Block Translation
// ========================================================================

/**
 * Create script IR from ScriptNode.
 * Validates event keys and handler values.
 * Sorts by event name for deterministic output.
 *
 * @param node - Script AST node (optional)
 * @param errors - Error collection array
 * @returns Array of script entries
 */
function createScriptIR(node: ScriptNode | null, errors: IRError[]): ScriptEntry[] {
  if (!node) {
    return [];
  }

  const entries: ScriptEntry[] = [];

  for (const event of node.events) {
    // Validate key format
    if (!isValidScriptKey(event.key)) {
      pushError(
        errors,
        `Script key '${event.key}' must be in camelCase format`,
        event.location.start
      );
      continue;
    }

    // Validate value is not empty
    if (isEmptyScriptValue(event.value)) {
      pushError(
        errors,
        `Script handler for '${event.key}' cannot be empty`,
        event.location.start
      );
      continue;
    }

    entries.push({
      event: event.key,
      handler: event.value,
    });
  }

  // Sort for deterministic output
  return sortScriptEntries(entries);
}
