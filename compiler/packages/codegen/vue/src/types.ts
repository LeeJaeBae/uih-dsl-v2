/**
 * UIH DSL Codegen Types - Vue
 *
 * Defines output structure for Vue 3 code generation.
 *
 * @module @uih-dsl/codegen-vue/types
 * @version 1.0.0
 */

// ========================================================================
// Codegen Output Structure
// ========================================================================

/**
 * Complete code generation output for Vue 3 SFC.
 */
export interface CodegenOutput {
  /**
   * Full generated code (.vue file)
   */
  code: string;

  /**
   * Extracted CSS variables or style tokens (optional)
   */
  style: string | null;

  /**
   * Metadata for route meta (optional)
   */
  meta: string | null;

  /**
   * Event handler function names
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
