/**
 * UIH DSL Codegen Types
 *
 * Defines output structure for code generation.
 *
 * @module @uih-dsl/codegen-react/types
 * @version 1.0.0
 */

// ========================================================================
// Codegen Output Structure
// ========================================================================

/**
 * Complete code generation output.
 */
export interface CodegenOutput {
  /**
   * Full generated code (e.g., .tsx file)
   */
  code: string;

  /**
   * Extracted CSS variables or style tokens (optional)
   */
  style: string | null;

  /**
   * Metadata export code (optional)
   */
  meta: string | null;

  /**
   * Event handler function stubs
   */
  events: string[];
}

// ========================================================================
// Codegen Options
// ========================================================================

/**
 * Options for code generation.
 */
export interface CodegenOptions {
  /**
   * Component name (default: "Page")
   */
  componentName?: string;

  /**
   * Include comments in output (default: true)
   */
  includeComments?: boolean;

  /**
   * Indent size in spaces (default: 2)
   */
  indentSize?: number;
}
