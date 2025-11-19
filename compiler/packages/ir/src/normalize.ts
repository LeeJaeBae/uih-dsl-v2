/**
 * UIH DSL IR Normalization Utilities
 *
 * Provides utility functions for normalizing AST nodes into IR format.
 * All functions are pure and deterministic.
 *
 * @module @uih-dsl/ir/normalize
 * @version 1.0.0
 */

import type { Attribute } from "@uih-dsl/parser";
import type { IRError } from "./types.js";

// ========================================================================
// Attribute Normalization
// ========================================================================

/**
 * Normalize AST attributes to IR format.
 * Sorts by key for deterministic output.
 *
 * @param attrs - AST attribute array
 * @returns Normalized and sorted attribute array
 */
export function normalizeAttributes(
  attrs: Attribute[]
): Array<{ key: string; value: string }> {
  return attrs
    .map((attr) => ({
      key: attr.key,
      value: attr.value,
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

// ========================================================================
// Style Path Normalization
// ========================================================================

/**
 * Split dot-notation style key into path array.
 *
 * @param key - Style key with dot notation (e.g., "color.primary")
 * @returns Path array (e.g., ["color", "primary"])
 *
 * @example
 * ```typescript
 * splitStylePath("color.primary") // ["color", "primary"]
 * splitStylePath("font.size") // ["font", "size"]
 * ```
 */
export function splitStylePath(key: string): string[] {
  return key.split(".");
}

/**
 * Validate that style path has at least 2 segments.
 *
 * @param path - Style path array
 * @returns True if valid (length >= 2)
 */
export function isValidStylePath(path: string[]): boolean {
  return path.length >= 2;
}

// ========================================================================
// Object Key Sorting
// ========================================================================

/**
 * Sort object keys alphabetically.
 * Creates a new object with sorted keys for deterministic output.
 *
 * @param obj - Input object
 * @returns New object with sorted keys
 */
export function sortObjectKeys<T extends Record<string, unknown>>(obj: T): T {
  const sorted = {} as T;
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    sorted[key as keyof T] = obj[key as keyof T];
  }

  return sorted;
}

// ========================================================================
// Error Collection
// ========================================================================

/**
 * Push an error to the error array.
 * Helper for error collection during translation.
 *
 * @param errors - Error array to append to
 * @param message - Error message
 * @param location - Source location
 */
export function pushError(
  errors: IRError[],
  message: string,
  location: { line: number; column: number }
): void {
  errors.push({
    message,
    line: location.line,
    column: location.column,
  });
}

// ========================================================================
// Script Key Validation
// ========================================================================

/**
 * Validate that script event key is in camelCase format.
 * Accepts lowercase keys (tokenizer limitation).
 *
 * @param key - Script event key
 * @returns True if valid camelCase or lowercase
 */
export function isValidScriptKey(key: string): boolean {
  // Accept camelCase or all lowercase (tokenizer limitation)
  const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;
  return camelCaseRegex.test(key);
}

/**
 * Check if script value is empty (after trimming).
 *
 * @param value - Script handler value
 * @returns True if empty
 */
export function isEmptyScriptValue(value: string): boolean {
  return value.trim() === "";
}

// ========================================================================
// Array Stability
// ========================================================================

/**
 * Sort string array alphabetically for deterministic output.
 *
 * @param arr - Input string array
 * @returns New sorted array
 */
export function sortStringArray(arr: string[]): string[] {
  return [...arr].sort();
}

/**
 * Sort style tokens by path for deterministic output.
 * Compares path arrays lexicographically.
 *
 * @param tokens - Style token array
 * @returns New sorted token array
 */
export function sortStyleTokens<T extends { path: string[] }>(tokens: T[]): T[] {
  return [...tokens].sort((a, b) => {
    const pathA = a.path.join(".");
    const pathB = b.path.join(".");
    return pathA.localeCompare(pathB);
  });
}

/**
 * Sort script entries by event name for deterministic output.
 *
 * @param entries - Script entry array
 * @returns New sorted entry array
 */
export function sortScriptEntries<T extends { event: string }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => a.event.localeCompare(b.event));
}
