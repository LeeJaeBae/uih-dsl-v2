/**
 * UIH DSL Intermediate Representation (IR) Types
 *
 * Defines the normalized IR structure produced by the AST-to-IR translator.
 * This IR is optimized for deterministic code generation.
 *
 * @module @uih-dsl/ir/types
 * @version 1.0.0
 */

// ========================================================================
// IR Root Structure
// ========================================================================

/**
 * Complete UIH IR structure.
 * Output of the AST-to-IR translation process.
 */
export interface UIHIR {
  /**
   * Meta properties (flattened key-value pairs)
   */
  meta: Record<string, string | number | boolean>;

  /**
   * Style tokens with split path notation
   */
  style: {
    tokens: Array<{
      path: string[]; // e.g., "color.primary" -> ["color", "primary"]
      value: string | number;
    }>;
  };

  /**
   * Declared component names (from components block)
   */
  components: string[];

  /**
   * Normalized layout tree
   */
  layout: IRNode[];

  /**
   * Script event handlers
   */
  script: Array<{
    event: string;
    handler: string;
  }>;

  /**
   * Combined errors from parser and translator
   */
  errors: Array<{
    message: string;
    line: number;
    column: number;
  }>;
}

// ========================================================================
// Layout IR Node Types
// ========================================================================

/**
 * IR node in the layout tree
 */
export type IRNode = IRComponentNode | IRTextNode;

/**
 * Component node in IR
 */
export interface IRComponentNode {
  type: "Component";
  tag: string;
  attrs: Array<{
    key: string;
    value: string;
  }>;
  children: IRNode[];
}

/**
 * Text node in IR
 */
export interface IRTextNode {
  type: "Text";
  value: string;
}

// ========================================================================
// Type Guards
// ========================================================================

/**
 * Check if an IR node is a component
 */
export function isIRComponent(node: IRNode): node is IRComponentNode {
  return node.type === "Component";
}

/**
 * Check if an IR node is text
 */
export function isIRText(node: IRNode): node is IRTextNode {
  return node.type === "Text";
}

// ========================================================================
// Error Types
// ========================================================================

/**
 * IR translation error
 */
export interface IRError {
  message: string;
  line: number;
  column: number;
}

/**
 * Style token (internal representation)
 */
export interface StyleToken {
  path: string[];
  value: string | number;
}

/**
 * Script entry (internal representation)
 */
export interface ScriptEntry {
  event: string;
  handler: string;
}
